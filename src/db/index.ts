import { PGlite } from "@electric-sql/pglite";
import { migrate } from "./migrate";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";
// Sett til blank for å bruke en in-memory database
const client = new PGlite(import.meta.env.VITE_DATABASE_URL);
const db = drizzle({ client, schema });

export { db };

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Database = typeof db;

export type DatabaseQueryOptions = { scope: Transaction | Database };

export const doMigration = async () => {
  await migrate(db);
};

export const deleteDatabase = () => {
  indexedDB.deleteDatabase("/pglite/olga-data");
  sessionStorage.clear();
};
