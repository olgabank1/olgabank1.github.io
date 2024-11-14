import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";



export const createFunctionAndTrigger = async (db: PgliteDatabase<typeof schema>) => {
    const hello = schema.transactionEnum.enumValues.find((v) => v === "Betaling");
    if(hello === undefined) {
      throw new Error("Could not find transaction type 'Betaling'");
    }
    await db.execute(`
      CREATE OR REPLACE FUNCTION approve_transaction() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.type = 'Betaling' AND NEW.amount > 10000 THEN
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