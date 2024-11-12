import { eq } from "drizzle-orm";
import { db, type DatabaseQueryOptions } from "../db";
import {
  accounts,
  type InsertAccount,
  type SelectAccount,
  type SelectUser,
} from "../db/schema";

const createOne = async (
  values: InsertAccount,
  { scope }: DatabaseQueryOptions = { scope: db }
): Promise<SelectAccount> => {
  const [account] = await scope.insert(accounts).values(values).returning();
  return account;
};
const createMany = async (
  values: InsertAccount[],
  { scope }: DatabaseQueryOptions = { scope: db }
): Promise<SelectAccount[]> =>
  scope.insert(accounts).values(values).returning();

const getByUserId = (userId: SelectUser["id"]): Promise<SelectAccount[]> =>
  db.select().from(accounts).where(eq(accounts.ownerId, userId));

export { createOne, createMany, getByUserId };
