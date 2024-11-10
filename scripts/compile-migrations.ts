import config from "../drizzle.config";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "node:path";
import fs from "node:fs/promises";

const migrationsFolder = config.out!;

const migrations = readMigrationFiles({ migrationsFolder });

await fs.writeFile(
  join(migrationsFolder, "./migrations.json"),
  JSON.stringify(migrations)
);

console.log("Migrations compiled!");
