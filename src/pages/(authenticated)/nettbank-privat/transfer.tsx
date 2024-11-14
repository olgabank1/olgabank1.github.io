import { AccountSelector } from "@sb1/ffe-account-selector-react";
import { ErrorFieldMessage, InputGroup } from "@sb1/ffe-form-react";
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
import { accountBalanceKeys } from "../../../queries/account-balance";
import { accountsQuery } from "../../../queries/accounts";
import { meQuery } from "../../../queries/me";
import { transfer } from "../../../repository/account";
import { Input, Label } from "@sb1/ffe-form-react";
import { ActionButton } from "@sb1/ffe-buttons-react";
import { formatAccountNumber, formatNumber } from "@sb1/ffe-formatters";
import amountPattern from "../../../utils/amountPattern";

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
            showBalance={true}
            selectedAccount={
              selectedFromAccount
                ? {
                    accountNumber: formatAccountNumber(
                      selectedFromAccount.number
                    ),
                    name: selectedFromAccount.name,
                    id: selectedFromAccount.id,
                    balance:
                      formatNumber(selectedFromAccount.balance, {
                        locale: "nb",
                        decimals: 2,
                      }) ?? undefined,
                  }
                : undefined
            }
            accounts={accounts.map(({ name, number, id, balance }) => ({
              id,
              accountNumber: formatAccountNumber(number),
              name,
              balance:
                formatNumber(balance, {
                  locale: "nb",
                  decimals: 2,
                }) ?? undefined,
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
            showBalance={true}
            selectedAccount={
              selectedToAccount
                ? {
                    accountNumber: formatAccountNumber(
                      selectedToAccount.number
                    ),
                    name: selectedToAccount.name,
                    id: selectedToAccountId,
                    balance:
                      formatNumber(selectedToAccount.balance, {
                        locale: "nb",
                        decimals: 2,
                      }) ?? undefined,
                  }
                : undefined
            }
            accounts={accounts
              .filter(({ id }) => id != selectedFromAccountId)
              .map(({ name, number, id, balance }) => ({
                id: id,
                accountNumber: formatAccountNumber(number),
                name: name,

                balance:
                  formatNumber(balance, {
                    locale: "nb",
                    decimals: 2,
                  }) ?? undefined,
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

        {actionData?.fieldErrors.amount && (
          <ErrorFieldMessage>
            {actionData?.fieldErrors.amount?.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </ErrorFieldMessage>
        )}
        <ActionButton
          type="submit"
          disabled={isBusy}
          isLoading={isBusy}
          ariaLoadingMessage="Overfører penger..."
        >
          Overfør
        </ActionButton>
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

const TransferSchema = z.object({
  fromAccountId: z
    .string({
      message: "Du må velge hvilken konto du vil overføre pengene fra",
    })
    .regex(
      /^\d+$/,
      "Kontonummeret er ikke gyldig. Sjekk at du har skrevet det riktig."
    )
    .transform(Number),
  toAccountId: z
    .string({
      message: "Du må velge hvilken konto du vil overføre pengene til",
    })
    .regex(
      /^\d+$/,
      "Kontonummeret er ikke gyldig. Sjekk at du har skrevet det riktig."
    )
    .transform(Number),
  amount: z
    .string()
    .regex(new RegExp(amountPattern))
    .transform(Number)
    .pipe(z.number().gt(0, "Beløpet må være større enn 0 kr")),
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
    try {
      await transfer({
        userId: me.id,
        toAccountId: toAccountId,
        fromAccountId: fromAccountId,
        amount: amount,
      });
    } catch (e) {
      return {
        formErrors: [(e as unknown as Error).message],
        fieldErrors: {},
      } satisfies FormattedErrors;
    }
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
