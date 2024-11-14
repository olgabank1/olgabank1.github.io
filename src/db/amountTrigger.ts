import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { createFakeTransactions } from "./seeder/fake";
import { eq } from "drizzle-orm";

export const createFunctionAndTrigger = async (
  db: PgliteDatabase<typeof schema>
) => {
  const paymentEnum = schema.transactionEnum.enumValues.find(
    (v) => v === "Betaling"
  );
  const maxAmount = 3000;
  if (paymentEnum === undefined) {
    throw new Error("Could not find transaction type 'Betaling'");
  }
  await db.execute(`
      CREATE OR REPLACE FUNCTION approve_transaction() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.type = '${paymentEnum}' AND NEW.amount > ${maxAmount} THEN
          NEW.approved := NULL;
        ELSE
          NEW.approved := CURRENT_TIMESTAMP;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

  await db.execute(`
      CREATE OR REPLACE TRIGGER approve_transaction_trigger
      BEFORE INSERT OR UPDATE ON account_transactions
      FOR EACH ROW
      EXECUTE FUNCTION approve_transaction();
    `);
};

export const insertUsers = async (db: PgliteDatabase<typeof schema>) => {
  const [advisorUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.nnin, "11111111111"))
    .limit(1);
  const [userUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.nnin, "05050505050"))
    .limit(1);
  if (advisorUser && userUser) {
    return;
  }
  const roles = schema.roleEnum.enumValues;
  const advisorRole = roles[0];
  const userRole = roles[1];

  await db.transaction(async (trx) => {
    await trx.insert(schema.users).values([
      { nnin: "11111111111", name: "Admin Nordmann", role: advisorRole },
      { nnin: "05050505050", name: "Knut Nordmann", role: userRole },
    ]);
    const users = await trx.select().from(schema.users).limit(1);

    const accounts = users.map<schema.InsertAccount>(({ id }, index) => {
      return {
        number: `123456${index}8901`,
        name: "Brukskonto",
        ownerId: id,
        type: "Brukskonto",
      };
    });
    await trx.insert(schema.accounts).values(accounts);

    const accoount = await trx.select().from(schema.accounts).limit(1);

    if (accoount.length > 0) {
      await createFakeTransactions(accoount[0], { scope: trx });
    }
  });
};
