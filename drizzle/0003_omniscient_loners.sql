CREATE TYPE "public"."role_types" AS ENUM('Advisor', 'User');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role_types" NOT NULL;