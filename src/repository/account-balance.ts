import { eq } from "drizzle-orm";
import { db } from "../db";
import { accountBalance, type SelectAccount } from "../db/schema";

const getByAccountId = async (accountId: SelectAccount["id"]) => {
  const [result] = await db
    .select()
    .from(accountBalance)
    .where(eq(accountBalance.accountId, accountId));
  return result;
};

export { getByAccountId };
