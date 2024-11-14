import { queryOptions, type QueryFunctionContext } from "@tanstack/react-query";
import { getByUserId } from "../repository/account";
import { type SelectUser } from "../db/schema";
import { accountBalanceKeys, fetchAccountBalance } from "./account-balance";

export const accountKeys = {
  all: [{ scope: "accounts" }] as const,
  lists: () => [{ ...accountKeys.all[0], entity: "list" }] as const,
  list: (userId: SelectUser["id"]) =>
    [{ ...accountKeys.lists()[0], userId }] as const,
};

const fetchAccounts = async ({
  queryKey: [{ userId }],
}: QueryFunctionContext<ReturnType<(typeof accountKeys)["list"]>>) => {
  const accounts = await getByUserId(userId);
  const balances = await Promise.all(
    accounts.map((account) =>
      fetchAccountBalance({
        queryKey: accountBalanceKeys.list(account.id),
        signal: new AbortController().signal,
        meta: undefined,
      })
    )
  );
  return accounts.map((account) => {
    const balance = balances.find((b) => b.accountId === account.id);
    return {
      ...account,
      balance: balance?.balance ?? "0",
    };
  });
};

export const accountsQuery = (user: SelectUser) =>
  queryOptions({
    queryKey: accountKeys.list(user.id),
    queryFn: fetchAccounts,
  });
