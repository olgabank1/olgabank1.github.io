import { and, eq } from "drizzle-orm";
import { db, type DatabaseQueryOptions } from "../db";
import {
  accountBalance,
  accounts,
  type InsertAccount,
  type SelectAccount,
  type SelectUser,
} from "../db/schema";
import { createOne as createTransaction } from "./transaction";
import { z } from "zod";

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

const getById = async (
  accountId: SelectAccount["id"]
): Promise<SelectAccount> => {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId));
  return account;
};

const transfer = async ({
  userId,
  toAccountId,
  fromAccountId,
  amount,
}: {
  userId: SelectUser["id"];
  toAccountId: SelectAccount["id"];
  fromAccountId: SelectAccount["id"];
  amount: number;
}) => {
  await db.transaction(async (trx) => {
    const [destinationAccount] = await trx
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(and(eq(accounts.id, toAccountId), eq(accounts.ownerId, userId)));

    const [sourceAccount] = await trx
      .select({
        id: accounts.id,
        name: accounts.name,
        balance: accountBalance.balance,
      })
      .from(accounts)
      .innerJoin(accountBalance, eq(accountBalance.accountId, accounts.id))
      .where(and(eq(accounts.id, fromAccountId), eq(accounts.ownerId, userId)));

    if (sourceAccount == null || destinationAccount == null) {
      throw new Error("One or both accounts not found for the user");
    }

    const { balance: sourceBalance } = sourceAccount;
    const sourceBalanceNumber = z
      .number({ coerce: true })
      .parse(sourceBalance ?? "0");
    // Check if the source account has sufficient funds
    if (sourceBalanceNumber - amount < 0) {
      throw new Error(
        `Insufficient funds in the source account: ${sourceBalance}\n Subtracted amount: ${amount}`
      );
    }

    // Deduct amount from source account
    await createTransaction(
      {
        accountId: fromAccountId,
        amount: (-amount).toString(),
        description: `Transfer to account ${destinationAccount.name}`,
        timestamp: new Date(),
        type: "Overføring",
      },
      { scope: trx }
    );

    // Add amount to destination account
    await createTransaction(
      {
        accountId: toAccountId,
        amount: amount.toString(),
        description: `Transfer from account ${sourceAccount.name}`,
        timestamp: new Date(),
        type: "Overføring",
      },
      { scope: trx }
    );
  });
};

export { createOne, createMany, getByUserId, getById, transfer };
