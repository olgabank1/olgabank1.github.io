import type { MigrationConfig } from "drizzle-orm/migrator";
import { type Database } from "./";
import migrations from "../../drizzle/migrations.json";

export async function migrate(db: Database) {
  // @ts-expect-error: Ignore TypeScript error for dialect and session properties
  // dialect and session will appear to not exist...but they do
  // https://github.com/drizzle-team/drizzle-orm/discussions/2532
  return db.dialect.migrate(migrations, db.session, {
    migrationsTable: "drizzle_migrations",
  } satisfies Omit<MigrationConfig, "migrationsFolder">);
}
