import { queryOptions, type QueryFunctionContext } from "@tanstack/react-query";
import { getByUserId } from "../repository/account";
import { type SelectUser } from "../db/schema";

export const accountKeys = {
  all: [{ scope: "accounts" }] as const,
  lists: () => [{ ...accountKeys.all[0], entity: "list" }] as const,
  list: (userId: SelectUser["id"]) =>
    [{ ...accountKeys.lists()[0], userId }] as const,
};

const fetchAccounts = async ({
  queryKey: [{ userId }],
}: QueryFunctionContext<ReturnType<(typeof accountKeys)["list"]>>) => {
  return getByUserId(userId);
};

export const accountsQuery = (user: SelectUser) =>
  queryOptions({
    queryKey: accountKeys.list(user.id),
    queryFn: fetchAccounts,
  });
