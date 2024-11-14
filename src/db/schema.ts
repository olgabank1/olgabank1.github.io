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
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { string } from "zod";

export const roleEnum = pgEnum("role_types", ["Advisor", "User"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nnin: text("nnin").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role").default("User"),
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
  "Depositumskonto",
]);
export type AccountType = (typeof accountEnum.enumValues)[number];

// Accounts table
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  number: varchar("account_number", { length: 11 }).unique().notNull(),
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
  approved_timestamp: timestamp("approved"),
});

export const triggers = pgTable("triggers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
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

// When we make payments, we need to put the payment in a queue so that the user can approve it
export const paymentQueue = pgTable("payment_queue", {
  id: serial("id").primaryKey(),
  fromAccountId: integer("from_account_id")
    .notNull()
    .references(() => accounts.id),
  toAccountNumber: varchar("to_account_number", { length: 11 }).notNull(),
  amount: numeric("amount").notNull(),
  message: text("message").notNull(),
});

export type SelectPaymentQueue = InferSelectModel<typeof paymentQueue>;
export type InsertPaymentQueue = InferInsertModel<typeof paymentQueue>;
export const InsertPaymentQueueSchema = createInsertSchema(paymentQueue);
