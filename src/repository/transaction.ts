import {  asc, desc, eq, isNull } from "drizzle-orm";
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

export const getbyAccountIdAndApprovalStatus = async () => {
  return db.select().from(transactions).leftJoin(accounts, eq(accounts.id, transactions.accountId)).leftJoin(users, eq(accounts.ownerId, users.id)).where(isNull(transactions.approved_timestamp))
}


export const approveTransaction = async (transactionId: SelectTransaction["id"]) => {
  return db.update(transactions).set({ approved_timestamp: new Date() }).where(eq(transactions.id, transactionId))
}

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
