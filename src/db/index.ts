import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
// Sett til blank for å bruke en in-memory database
const client = new PGlite(import.meta.env.VITE_DATABASE_URL);
const db = drizzle({ client });
export { db };
