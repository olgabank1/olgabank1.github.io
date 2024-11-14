ALTER TABLE "public"."accounts" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."account_types";--> statement-breakpoint
CREATE TYPE "public"."account_types" AS ENUM('Brukskonto', 'Sparekonto', 'Depositumskonto');--> statement-breakpoint
ALTER TABLE "public"."accounts" ALTER COLUMN "type" SET DATA TYPE "public"."account_types" USING "type"::"public"."account_types";