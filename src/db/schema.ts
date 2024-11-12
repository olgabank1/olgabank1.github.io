import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { string } from "zod";

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
