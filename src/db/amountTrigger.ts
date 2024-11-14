import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { createFakeAccounts, createFakeTransactions } from "./seeder/fake";

export const createFunctionAndTrigger = async (db: PgliteDatabase<typeof schema>) => {
    const paymentEnum = schema.transactionEnum.enumValues.find((v) => v === "Betaling");
    const maxAmount = 10000;
    if(paymentEnum === undefined) {
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
  const roles = schema.roleEnum.enumValues;
  const advisorRole = roles[0]
  const userRole = roles[1]

  await db.transaction(async (trx) => {

    await trx.insert(schema.users).values([
      { nnin: "11111111111", name: "Admin Nordmann", role: advisorRole },
      { nnin: "05050505050", name: "Knut Nordmann", role: userRole },
    ]);
    const users = await trx.select().from(schema.users).limit(1);

    users.forEach(async (user) => {
      await trx.insert(schema.accounts).values([
        { number: "12345678901", name: "Brukskonto", ownerId: user.id, type: "Brukskonto" },
      ])
    })

    const accoount = await trx.select().from(schema.accounts).limit(1);

    if(accoount.length > 0) {
      await createFakeTransactions(accoount[0], { scope: trx });
    }
  })

}