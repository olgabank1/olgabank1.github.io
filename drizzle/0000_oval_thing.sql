CREATE TYPE "public"."account_types" AS ENUM('Brukskonto', 'Sparekonto', 'BSU', 'Depositumskonto');--> statement-breakpoint
CREATE TYPE "public"."role_types" AS ENUM('Advisor', 'User');--> statement-breakpoint
CREATE TYPE "public"."transaction_types" AS ENUM('Overføring', 'Betaling', 'Innskudd', 'Uttak');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_number" varchar(11) NOT NULL,
	"name" text NOT NULL,
	"owner_id" integer NOT NULL,
	"type" "account_types" NOT NULL,
	CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"amount" numeric NOT NULL,
	"timestamp" timestamp NOT NULL,
	"account_id" integer NOT NULL,
	"type" "transaction_types" NOT NULL,
	"approved" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nnin" text NOT NULL,
	"name" text NOT NULL,
	"role" "role_types" DEFAULT 'User'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."account_balance" AS (select "account_id", sum("amount") as "balance" from "account_transactions" group by "account_transactions"."account_id");