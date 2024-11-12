import { eq } from "drizzle-orm";
import { users, type InsertUser, type SelectUser } from "../db/schema";
import { db, type DatabaseQueryOptions } from "../db";

const createOne = async (
  values: InsertUser,
  { scope }: DatabaseQueryOptions = { scope: db }
): Promise<SelectUser> => {
  const [newUser] = await scope.insert(users).values(values).returning();
  return newUser;
};

const getByNnin = async (
  nnin: string,
  { scope }: DatabaseQueryOptions = { scope: db }
): Promise<SelectUser> => {
  const [user] = await scope.select().from(users).where(eq(users.nnin, nnin));
  return user;
};

export { getByNnin, createOne };
