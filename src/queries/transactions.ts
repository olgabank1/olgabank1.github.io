import { queryOptions, type QueryFunctionContext } from "@tanstack/react-query";
import { type SelectAccount, type SelectUser } from "../db/schema";
import { getByAccountId, getByUserId } from "../repository/transaction";

export const transactionKeys = {
  all: [{ scope: "transactions" }] as const,
  lists: () => [{ ...transactionKeys.all[0], entity: "list" }] as const,
  byUserId: (
    userId: SelectUser["id"],
    sort: "asc" | "desc" = "desc",
    limit: number = 5
  ) => [{ ...transactionKeys.lists()[0], userId, sort, limit }] as const,
  byAccountId: (accountId: SelectAccount["id"]) =>
    [{ ...transactionKeys.lists()[0], accountId }] as const,
};

const fetchUserTransactions = async ({
  queryKey: [{ userId, sort, limit }],
}: QueryFunctionContext<ReturnType<(typeof transactionKeys)["byUserId"]>>) =>
  getByUserId({ userId, sort, limit });

const fetchAccountTransactions = async ({
  queryKey: [{ accountId }],
}: QueryFunctionContext<ReturnType<(typeof transactionKeys)["byAccountId"]>>) =>
  getByAccountId(accountId);

export const transactionsByUserQuery = (user: SelectUser) =>
  queryOptions({
    queryKey: transactionKeys.byUserId(user.id),
    queryFn: fetchUserTransactions,
  });

export const transactionsByAccountQuery = (account: SelectAccount) =>
  queryOptions({
    queryKey: transactionKeys.byAccountId(account.id),
    queryFn: fetchAccountTransactions,
  });
