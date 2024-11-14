import { queryOptions, type QueryFunctionContext } from "@tanstack/react-query";
import { type SelectAccount } from "../db/schema";
import { getByAccountId } from "../repository/account-balance";

export const accountBalanceKeys = {
  all: [{ scope: "account-balance" }] as const,
  lists: () => [{ ...accountBalanceKeys.all[0], entity: "list" }] as const,
  list: (accountId: SelectAccount["id"]) =>
    [{ ...accountBalanceKeys.lists()[0], accountId }] as const,
};

export const fetchAccountBalance = async ({
  queryKey: [{ accountId }],
}: QueryFunctionContext<ReturnType<(typeof accountBalanceKeys)["list"]>>) => {
  return getByAccountId(accountId);
};

export const accountBalanceQuery = (account: SelectAccount) =>
  queryOptions({
    queryKey: accountBalanceKeys.list(account.id),
    queryFn: fetchAccountBalance,
  });
