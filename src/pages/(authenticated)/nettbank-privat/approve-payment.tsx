import { useSuspenseQuery, type QueryClient } from "@tanstack/react-query";
import {
  Form,
  redirect,
  useNavigate,
  useNavigation,
  useParams,
  type ActionFunction,
} from "react-router-dom";
import { Heading3, Heading6 } from "@sb1/ffe-core-react";
import { enqueuedPaymenByIdQuery } from "../../../queries/enqueued-payments";
import { accountByIdQuery } from "../../../queries/accounts";
import { formatAccountNumber, formatNumber } from "@sb1/ffe-formatters";
import { PrimaryButton, SecondaryButton } from "@sb1/ffe-buttons-react";
import { approve } from "../../../repository/enqueued-payments";
import { z } from "zod";

const ApprovePaymentPage = () => {
  const { state } = useNavigation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: enqueuedPayment } = useSuspenseQuery(
    enqueuedPaymenByIdQuery(parseInt(id!, 10))
  );
  const { data: fromAccount } = useSuspenseQuery(
    accountByIdQuery(enqueuedPayment.fromAccountId)
  );
  const isBusy = state !== "idle";
  return (
    <div className="flex flex-col gap-2">
      <Heading3 className="m-0">
        Les gjennom før du godkjenner betalingen
      </Heading3>
      <div>
        <Heading6 className="m-0">Fra konto:</Heading6>
        <p>{fromAccount?.name}</p>
      </div>
      <div>
        <Heading6 className="m-0">Til mottaker:</Heading6>
        <p>{formatAccountNumber(enqueuedPayment.toAccountNumber)}</p>
      </div>
      <div>
        <Heading6 className="m-0">Melding:</Heading6>
        <p>{enqueuedPayment.message}</p>
      </div>
      <div>
        <Heading6 className="m-0">Beløp:</Heading6>
        <p>
          {formatNumber(enqueuedPayment.amount, { locale: "nb", decimals: 2 })}
        </p>
      </div>
      <SecondaryButton
        type="button"
        onClick={() => {
          navigate(-1);
        }}
        disabled={isBusy}
      >
        Avbryt betaling
      </SecondaryButton>
      <Form method="post" className="flex flex-col">
        <input type="hidden" name="id" value={id} />
        <PrimaryButton type="submit" disabled={isBusy} isLoading={isBusy}>
          Gå videre
        </PrimaryButton>
      </Form>
    </div>
  );
};

const ApprovePaymentSchema = z.object({
  id: z.string().transform(Number),
});
const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {
    const formData = await request.formData();
    const parseResult = ApprovePaymentSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      return parseResult.error.flatten();
    }
    await approve(parseResult.data.id!);
    return redirect("/nettbank-privat");
  };

ApprovePaymentPage.action = action;
export default ApprovePaymentPage;
