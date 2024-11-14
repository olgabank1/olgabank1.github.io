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
import { Input, Label } from "@sb1/ffe-form-react";
import { ActionButton } from "@sb1/ffe-buttons-react";
import { formatAccountNumber } from "@sb1/ffe-formatters";

const amountPattern = "^\\d+([.]\\d{2})?$";

const TransferPage = () => {
  const actionData = useActionData() as FormattedErrors | null;
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: accounts } = useSuspenseQuery(accountsQuery(me!));
  const [selectedFromAccountId, setSelectedFromAccountId] = useState<
    number | null
  >(accounts?.at(0)!.id);
  const [selectedToAccountId, setSelectedToAccountId] = useState<number | null>(
    accounts?.at(1)!.id
  );
  const { state } = useNavigation();
  if (!accounts) {
    return <div>Du har ingen kontoer</div>;
  }
  const selectedFromAccount = accounts.find(
    (account) => account.id === selectedFromAccountId
  );
  const selectedToAccount = accounts.find(
    (account) => account.id === selectedToAccountId
  );
  const isBusy = state !== "idle";
  return (
    <div>
      <Form method="post">
        <InputGroup
          label="Velg fra-konto"
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
                  }
                : undefined
            }
            accounts={accounts.map(({ name, number, id }) => ({
              id: id,
              accountNumber: formatAccountNumber(number),
              name: name,
            }))}
            id="fromAccountId"
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
          label="Velg til-konto"
          extraMargin={false}
          fieldMessage={actionData?.fieldErrors.toAccountId?.join("\n")}
        >
          <AccountSelector
            selectedAccount={
              selectedToAccount
                ? {
                    accountNumber: formatAccountNumber(
                      selectedToAccount.number
                    ),
                    name: selectedToAccount.name,
                    id: selectedToAccountId,
                  }
                : undefined
            }
            accounts={accounts
              .filter(({ id }) => id != selectedFromAccountId)
              .map(({ name, number, id }) => ({
                id: id,
                accountNumber: formatAccountNumber(number),
                name: name,
              }))}
            onAccountSelected={(account) => {
              setSelectedToAccountId(account.id);
            }}
            id="toAccountId"
            onReset={() => {
              setSelectedToAccountId(null);
            }}
          />
        </InputGroup>
        {selectedToAccountId && (
          <input type="hidden" name="toAccountId" value={selectedToAccountId} />
        )}
        <Label htmlFor="amount">Beløp</Label>
        <Input
          id="amount"
          name="amount"
          type="string"
          pattern={amountPattern}
          required
        />
        <FieldErrors errors={actionData?.fieldErrors.amount} />
        <ActionButton
          type="submit"
          disabled={isBusy}
          isLoading={isBusy}
          ariaLoadingMessage="Overfører penger..."
        >
          Overfør
        </ActionButton>
      </Form>
      <FieldErrors errors={actionData?.formErrors} />
    </div>
  );
};

const TransferSchema = z.object({
  fromAccountId: z
    .string({
      message: "Du må velge en fra-konto",
    })
    .regex(/^\d+$/, "Et kontonummer består kun av tall")
    .transform(Number),
  toAccountId: z
    .string({
      message: "Du må velge en til-konto",
    })
    .regex(/^\d+$/, "Et kontonummer består kun av tall")
    .transform(Number),
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
