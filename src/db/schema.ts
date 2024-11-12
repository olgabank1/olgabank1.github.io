import { type InferInsertModel, type InferSelectModel, sum } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgMaterializedView,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { string } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nnin: text("nnin").notNull(),
  name: text("name").notNull(),
});
export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
export const InsertUserSchema = createInsertSchema(users, {
  nnin: string()
    .length(11, "Fødselsnummer må være 11 siffer")
    .regex(/^\d+$/, "Fødselsnummer må bestå av kun tall"),
});

// Typer konto: Brukskonto, Sparekonto, BSU, Depositumskonto
export const accountEnum = pgEnum("account_types", [
  "Brukskonto",
  "Sparekonto",
  "BSU",
  "Depositumskonto",
]);
export type AccountType = (typeof accountEnum.enumValues)[number];

// Accounts table
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  type: accountEnum("type").notNull(),
});
export type SelectAccount = InferSelectModel<typeof accounts>;
export type InsertAccount = InferInsertModel<typeof accounts>;

// Typer transaksjon: Overføring, Betaling, Innskudd, Uttak
export const transactionEnum = pgEnum("transaction_types", [
  "Overføring",
  "Betaling",
  "Innskudd",
  "Uttak",
]);
export type TransactionType = (typeof transactionEnum.enumValues)[number];
// Transaction table
export const transactions = pgTable("account_transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id),
  type: transactionEnum("type").notNull(),
});
export type SelectTransaction = InferSelectModel<typeof transactions>;
export type InsertTransaction = InferInsertModel<typeof transactions>;

export const accountBalance = pgMaterializedView("account_balance").as((qb) =>
  qb
    .select({
      accountId: transactions.accountId,
      balance: sum(transactions.amount).as("balance"),
    })
    .from(transactions)
    .groupBy(transactions.accountId)
);
