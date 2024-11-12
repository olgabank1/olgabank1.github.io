import { asc, desc, eq } from "drizzle-orm";
import { db, type DatabaseQueryOptions } from "../db";
import {
  accountBalance,
  accounts,
  transactions,
  users,
  type InsertTransaction,
  type SelectAccount,
  type SelectTransaction,
  type SelectUser,
} from "../db/schema";

const createOne = async (
  values: InsertTransaction,
  { scope }: DatabaseQueryOptions = { scope: db }
): Promise<SelectTransaction> => {
  const [transaction] = await scope
    .insert(transactions)
    .values(values)
    .returning();
  await scope.refreshMaterializedView(accountBalance);
  return transaction;
};

const createMany = async (
  values: InsertTransaction[],
  { scope }: DatabaseQueryOptions = { scope: db }
): Promise<Pick<SelectTransaction, "id">[]> => {
  const inserted = await scope
    .insert(transactions)
    .values(values)
    .returning({ id: transactions.id });
  await scope.refreshMaterializedView(accountBalance);
  return inserted;
};

const getByAccountId = async (accountId: SelectAccount["id"]) =>
  db.select().from(transactions).where(eq(transactions.accountId, accountId));

const getByUserId = async (
  {
    userId,
    sort,
    limit,
  }: { userId: SelectUser["id"]; sort: "asc" | "desc"; limit: number },
  { scope }: DatabaseQueryOptions = { scope: db }
) =>
  scope
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      amount: transactions.amount,
      description: transactions.description,
      timestamp: transactions.timestamp,
      type: transactions.type,
    })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(users, eq(accounts.ownerId, userId))
    .where(eq(users.id, userId))
    .orderBy(
      sort === "asc"
        ? asc(transactions.timestamp)
        : desc(transactions.timestamp)
    )
    .limit(limit);

export { createOne, createMany, getByAccountId, getByUserId };
