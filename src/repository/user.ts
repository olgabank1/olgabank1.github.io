import { eq } from "drizzle-orm";
import { users, type InsertUser } from "../db/schema";
import { db } from "../db";
import { fakerNB_NO as faker } from "@faker-js/faker";

const _createFakeUser = async (nnin: string) => {
  const insert: InsertUser = {
    nnin,
    name: faker.person.fullName({
      sex: parseInt(nnin.slice(1), 10) % 2 === 0 ? "female" : "male",
    }),
  };
  const [user] = await db.insert(users).values(insert).returning();
  return user;
};

const getByNnin = async (nnin: string) => {
  const [user] = await db.select().from(users).where(eq(users.nnin, nnin));
  if (!user) {
    return _createFakeUser(nnin);
  }
  return user;
};

export default {
  getByNnin,
};
