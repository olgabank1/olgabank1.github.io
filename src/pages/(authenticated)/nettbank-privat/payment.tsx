import { useSuspenseQuery, type QueryClient } from "@tanstack/react-query";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  type ActionFunction,
} from "react-router-dom";
import { accountsQuery } from "../../../queries/accounts";
import { meQuery } from "../../../queries/me";
import { z } from "zod";
import amountPattern from "../../../utils/amountPattern";
import { ErrorFieldMessage, Input, InputGroup } from "@sb1/ffe-form-react";
import { AccountSelector } from "@sb1/ffe-account-selector-react";
import { useState } from "react";
import { formatAccountNumber, formatNumber } from "@sb1/ffe-formatters";
import type { Account } from "@sb1/ffe-account-selector-react/types/types";
import { PrimaryButton, SecondaryButton } from "@sb1/ffe-buttons-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const actionData = useActionData() as FormattedErrors | null;
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: accounts } = useSuspenseQuery(accountsQuery(me!));
  const [selectedFromAccountId, setSelectedFromAccountId] = useState<
    number | null
  >(accounts?.at(0)!.id);
  const [selectedToAccountNumber, setSelectedToAccountNumber] = useState<
    string | null
  >(null);

  const selectedFromAccount = accounts.find(
    (account) => account.id === selectedFromAccountId
  );
  const { state } = useNavigation();
  const isBusy = state !== "idle";

  console.log(actionData);
  return (
    <div>
      <Form method="post">
        <InputGroup
          label="Betale fra konto:"
          extraMargin={false}
          fieldMessage={actionData?.fieldErrors.fromAccountId?.join("\n")}
        >
          <AccountSelector
            selectedAccount={
              selectedFromAccount
                ? {
                    accountNumber: formatAccountNumber(
                      selectedFromAccount.number
                    ),
                    name: selectedFromAccount.name,
                    id: selectedFromAccountId,
                    balance:
                      formatNumber(selectedFromAccount.balance, {
                        locale: "nb",
                        decimals: 2,
                      }) ?? undefined,
                  }
                : undefined
            }
            accounts={accounts.map(({ name, number, id, balance }) => ({
              id: id,
              accountNumber: formatAccountNumber(number),
              name: name,
              balance:
                formatNumber(balance, {
                  locale: "nb",
                  decimals: 2,
                }) ?? undefined,
            }))}
            id="fromAccountId"
            showBalance={true}
            onAccountSelected={(account) => {
              setSelectedFromAccountId(account.id);
            }}
            onReset={() => {
              setSelectedFromAccountId(null);
            }}
          />
        </InputGroup>
        {selectedFromAccountId && (
          <input
            type="hidden"
            name="fromAccountId"
            value={selectedFromAccountId}
          />
        )}
        <InputGroup
          label="Til mottaker:"
          extraMargin={false}
          fieldMessage={actionData?.fieldErrors.toAccountNumber?.join("\n")}
        >
          <AccountSelector
            accounts={[] as Account[]}
            id="toAccountNumber"
            showBalance={true}
            selectedAccount={
              selectedToAccountNumber
                ? {
                    accountNumber: selectedToAccountNumber,
                    name: selectedToAccountNumber,
                  }
                : undefined
            }
            onAccountSelected={({ accountNumber }) => {
              setSelectedToAccountNumber(accountNumber);
            }}
            onReset={() => {
              setSelectedToAccountNumber(null);
            }}
            allowCustomAccount={true}
          />
        </InputGroup>
        {selectedToAccountNumber && (
          <input
            type="hidden"
            name="toAccountNumber"
            value={selectedToAccountNumber.replace(/\s/g, "")}
          />
        )}
        <InputGroup
          label="Melding"
          extraMargin={false}
          fieldMessage={actionData?.fieldErrors.message?.join("\n")}
        >
          <Input type="text" name="message" required />
        </InputGroup>
        <InputGroup
          label="Beløp"
          extraMargin={false}
          fieldMessage={actionData?.fieldErrors.amount?.join("\n")}
        >
          <Input type="text" name="amount" required />
        </InputGroup>
        <SecondaryButton
          type="button"
          onClick={() => {
            navigate(-1);
          }}
          disabled={isBusy}
        >
          Avbryt betaling
        </SecondaryButton>
        <PrimaryButton
          type="submit"
          onClick={() => {}}
          disabled={isBusy}
          isLoading={isBusy}
        >
          Godkjenn betaling
        </PrimaryButton>
      </Form>
      {(actionData?.formErrors.length ?? 0) > 0 && (
        <ErrorFieldMessage>
          {actionData?.formErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </ErrorFieldMessage>
      )}
    </div>
  );
};

const PaymentSchema = z.object({
  fromAccountId: z
    .string({
      message: "Du må velge en fra-konto",
    })
    .regex(/^\d+$/, "Et kontonummer består kun av tall")
    .transform(Number),
  toAccountNumber: z
    .string({
      message: "Du må velge en til-konto",
    })
    .regex(/^\d+$/, "Et kontonummer består kun av tall")
    .transform(Number),
  amount: z
    .string()
    .regex(new RegExp(amountPattern))
    .transform(Number)
    .pipe(z.number().gt(0, "Beløpet må være større enn 0 kr")),
  message: z
    .string()
    .max(140, "Meldingen kan maks være 140 tegn")
    .min(1, "Du må skrive en melding"),
});
type FormattedErrors = z.inferFlattenedErrors<typeof PaymentSchema>;
const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {
    const formData = await request.formData();
    const parseResult = PaymentSchema.safeParse(Object.fromEntries(formData));
    if (!parseResult.success) {
      return parseResult.error.flatten();
    }

    return null;
  };

PaymentPage.action = action;
export default PaymentPage;
