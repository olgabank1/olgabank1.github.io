import type { MigrationConfig } from "drizzle-orm/migrator";
import { type Database } from "./";
import migrations from "../../drizzle/migrations.json";
import { createFunctionAndTrigger, insertUsers } from "./amountTrigger";

export async function migrate(db: Database) {
  // @ts-expect-error: Ignore TypeScript error for dialect and session properties
  // dialect and session will appear to not exist...but they do
  // https://github.com/drizzle-team/drizzle-orm/discussions/2532
  await db.dialect.migrate(migrations, db.session, {
    migrationsTable: "drizzle_migrations",
  } satisfies Omit<MigrationConfig, "migrationsFolder">);
  await insertUsers(db)
  return await createFunctionAndTrigger(db);
}
