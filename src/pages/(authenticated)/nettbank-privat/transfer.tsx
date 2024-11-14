import { AccountSelector } from "@sb1/ffe-account-selector-react";
import { InputGroup } from "@sb1/ffe-form-react";
import { useSuspenseQuery, type QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunction,
} from "react-router-dom";
import { z } from "zod";
import { FieldErrors } from "../../../components/FieldErrors";
import { accountBalanceKeys } from "../../../queries/account-balance";
import { accountsQuery } from "../../../queries/accounts";
import { meQuery } from "../../../queries/me";
import { transfer } from "../../../repository/account";

const amountPattern = "^\\d+([.]\\d{2})?$";

const TransferPage = () => {
  const actionData = useActionData() as FormattedErrors | null;
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: accounts } = useSuspenseQuery(accountsQuery(me!));
  const [selectedFromAccountId, setSelectedFromAccount] = useState(
    accounts?.at(0)!.id
  );
  const { state } = useNavigation();
  if (!accounts) {
    return <div>Du har ingen kontoer</div>;
  }
  const isBusy = state !== "idle";
  const doSomething = () => {};
  return (
    <div>
      <Form method="post">
        <label htmlFor="fromAccountId">Fra konto:</label>
        <select
          id="fromAccountId"
          name="fromAccountId"
          value={selectedFromAccountId}
          onChange={(e) => setSelectedFromAccount(parseInt(e.target.value, 10))}
          required
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        <label htmlFor="toAccountId">Til konto:</label>
        <select id="toAccountId" name="toAccountId" required>
          {accounts
            .filter(({ id }) => id != selectedFromAccountId)
            .map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
        </select>
        <InputGroup label="Velg fra konto" extraMargin={false}>
          <AccountSelector
            accounts={accounts.map((it) => ({
              accountNumber: it.id.toString(),
              name: it.name,
            }))}
            id={""}
            onAccountSelected={doSomething}
            onReset={doSomething}
          />
        </InputGroup>
        <label htmlFor="amount">Beløp:</label>
        <input
          id="amount"
          name="amount"
          type="string"
          pattern={amountPattern}
          required
        />
        <FieldErrors errors={actionData?.fieldErrors.amount} />
        <button type="submit" disabled={isBusy}>
          Overfør
        </button>
      </Form>
      <FieldErrors errors={actionData?.formErrors} />
    </div>
  );
};

const TransferSchema = z.object({
  fromAccountId: z.string().regex(/^\d+$/).transform(Number),
  toAccountId: z.string().regex(/^\d+$/).transform(Number),
  amount: z.string().regex(new RegExp(amountPattern)).transform(Number),
});
type FormattedErrors = z.inferFlattenedErrors<typeof TransferSchema>;
const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {
    const formData = await request.formData();
    const parseResult = TransferSchema.safeParse(Object.fromEntries(formData));
    if (!parseResult.success) {
      return parseResult.error.flatten();
    }
    const me = await queryClient.ensureQueryData(meQuery);
    if (!me) {
      return redirect("/innlogging");
    }
    const {
      data: { fromAccountId, toAccountId, amount },
    } = parseResult;
    await transfer({
      userId: me.id,
      toAccountId: toAccountId,
      fromAccountId: fromAccountId,
      amount: amount,
    });
    await queryClient.invalidateQueries({
      queryKey: accountBalanceKeys.list(fromAccountId),
    });
    await queryClient.invalidateQueries({
      queryKey: accountBalanceKeys.list(toAccountId),
    });
    await queryClient.invalidateQueries(accountsQuery(me));
    return redirect("/nettbank-privat");
  };

TransferPage.action = action;
export default TransferPage;
