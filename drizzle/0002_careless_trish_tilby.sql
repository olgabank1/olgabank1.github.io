ALTER TABLE "accounts" ADD COLUMN "account_number" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number");