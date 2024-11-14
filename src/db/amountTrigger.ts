import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";

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

  await db.insert(schema.users).values([
    { nnin: "01010101010", name: "Ola Nordmann", role: userRole },
    { nnin: "02020202020", name: "Kari Nordmann", role: userRole },
    { nnin: "03030303030", name: "Knut Nordmann", role: userRole },
    { nnin: "11111111111", name: "Admin Nordmann", role: advisorRole },
    { nnin: "05050505050", name: "Knut Nordmann", role: userRole },
  ]);

  const users = await db.select().from(schema.users);

  users.forEach((user) => {
    db.insert(schema.accounts).values([
      { name: "Brukskonto", ownerId: user.id, type: "Brukskonto" },
      { name: "Sparekonto", ownerId: user.id, type: "Sparekonto" },
      { name: "BSU", ownerId: user.id, type: "BSU" },
      { name: "Depositumskonto", ownerId: user.id, type: "Depositumskonto" },
    ]);
  })
}