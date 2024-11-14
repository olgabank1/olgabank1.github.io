CREATE TABLE IF NOT EXISTS "payment_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_account_id" integer NOT NULL,
	"to_account_number" varchar(11) NOT NULL,
	"amount" numeric NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_queue" ADD CONSTRAINT "payment_queue_from_account_id_accounts_id_fk" FOREIGN KEY ("from_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
