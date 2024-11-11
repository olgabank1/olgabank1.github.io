import { queryOptions, type QueryClient } from "@tanstack/react-query";
import type { SelectUser } from "../db/schema";

const meKeys = {
  get: ["me"] as const,
};

const fetchMe = async () => {
  return JSON.parse(
    sessionStorage.getItem("current-user") ?? "null"
  ) as SelectUser | null;
};

export const meQuery = queryOptions({
  queryKey: meKeys.get,
  queryFn: fetchMe,
  staleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
  retry: false,
});

export const logout = async (queryClient: QueryClient) => {
  sessionStorage.removeItem("current-user");
  await queryClient.invalidateQueries(meQuery);
};

export const login = async (queryClient: QueryClient, user: SelectUser) => {
  sessionStorage.setItem("current-user", JSON.stringify(user));
  await queryClient.invalidateQueries(meQuery);
};
