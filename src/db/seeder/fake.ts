import { fakerNB_NO as faker } from "@faker-js/faker";
import { db, type DatabaseQueryOptions } from "..";
import { createOne as createUser } from "../../repository/user";
import { createMany as createAccounts } from "../../repository/account";
import { createMany as createTransactions } from "../../repository/transaction";
import {
  accountEnum,
  InsertTransaction,
  type AccountType,
  type SelectAccount,
  type SelectUser,
} from "../schema";

const oldPeopleNames: Record<"male" | "female", string[]> = {
  female: [
    "Anna",
    "Anne",
    "Aslaug",
    "Astrid",
    "Borghild",
    "Else",
    "Gerd",
    "Gudrun",
    "Hanna",
    "Helga",
    "Inga",
    "Ingeborg",
    "Inger",
    "Ingrid",
    "Ingerid",
    "Jenny",
    "Johanne",
    "Karen",
    "Karoline",
    "Kristine",
    "Margit",
    "Marie",
    "Marta",
    "Mary",
    "Olga",
    "Ragna",
    "Randi",
    "Ruth",
    "Sigrid",
    "Sofie",
    "Solveig",
    "Åse",
  ],
  male: [
    "Anders",
    "Andreas",
    "Arne",
    "Arnfinn",
    "Einar",
    "Erling",
    "Gunnar",
    "Hans",
    "Harald",
    "Håkon",
    "Johan",
    "Johannes",
    "Karl",
    "Knut",
    "Kristian",
    "Kåre",
    "Lars",
    "Leif",
    "Nils",
    "Martin",
    "Odd",
    "Olaf",
    "Olav",
    "Ole",
    "Oskar",
    "Peder",
    "Per",
    "Rolf",
    "Sigurd",
    "Sverre",
  ],
};

const createFakeUser = async (
  nnin: string,
  { scope }: DatabaseQueryOptions = { scope: db }
) => {
  const gender = parseInt(nnin.slice(1), 10) % 2 === 0 ? "female" : "male";
  const fakeName = `${faker.helpers.arrayElement(
    oldPeopleNames[gender]
  )} ${faker.person.lastName()}`;
  return createUser({ nnin, name: fakeName }, { scope });
};

const range = (stop: number) => {
  return [...Array(stop).keys()];
};

const createFakeAccounts = async (
  user: SelectUser,
  { scope }: DatabaseQueryOptions = { scope: db }
) => {
  const accounts = accountEnum.enumValues.map((v) => {
    return {
      name: `${faker.food.adjective()} ${v}`,
      ownerId: user.id,
      number: faker.finance.accountNumber(11),
      type: v,
    };
  });

  return createAccounts(accounts, { scope });
};

const configForAccountType = (type: AccountType) => {
  switch (type) {
    case "Brukskonto":
      return {
        recencyInDays: 365,
        transactionsAmount: { min: -5_000, max: 5_000 },
        numTransactions: { min: 1, max: 3_650 },
        weightedDescriptions: [
          { weight: 10, value: "varekjøp" },
          { weight: 2, value: "uttak" },
          { weight: 1, value: "innskudd" },
          { weight: 1, value: "betaling" },
          { weight: 0.6, value: "renteinntekt" },
          { weight: 0.6, value: "renteutgift" },
          { weight: 0.6, value: "gebyr" },
          { weight: 0.3, value: "overføring" },
          { weight: 0.03, value: "lønn" },
          { weight: 5, value: "refusjon" },
          { weight: 0.9, value: "abonnement" },
          { weight: 0.03, value: "mobilregning" },
          { weight: 0.03, value: "strømregning" },
          { weight: 0.03, value: "leie" },
        ],
      };
    case "Sparekonto":
      return {
        recencyInDays: 365,
        transactionsAmount: { min: -10_000, max: 50_000 },
        numTransactions: { min: 1, max: 365 * 2 },
        weightedDescriptions: [
          { weight: 10, value: "innskudd" },
          { weight: 1, value: "uttak" },
          { weight: 1, value: "overføring" },
          { weight: 0.6, value: "renteinntekt" },
          { weight: 0.6, value: "renteutgift" },
          { weight: 0.6, value: "gebyr" },
        ],
      };
    case "Depositumskonto":
      return {
        recencyInDays: 365,
        transactionsAmount: { min: 50_000, max: 50_000 },
        numTransactions: { min: 1, max: 1 },
        weightedDescriptions: [
          { weight: 10, value: "innskudd" },
          { weight: 10, value: "uttak" },
          { weight: 0.6, value: "renteinntekt" },
        ],
      };
    case "BSU":
      return {
        recencyInDays: 365,
        transactionsAmount: { min: 25_000, max: 25_000 },
        numTransactions: { min: 1, max: 1 },
        weightedDescriptions: [{ weight: 10, value: "innskudd" }],
      };
    default:
      return {
        recencyInDays: 0,
        transactionsAmount: { min: 0, max: 0 },
        numTransactions: { min: 0, max: 0 },
        weightedDescriptions: [],
      };
  }
};

const createFakeTransactions = async (
  account: SelectAccount,
  { scope }: DatabaseQueryOptions = { scope: db }
) => {
  const {
    numTransactions,
    transactionsAmount,
    weightedDescriptions,
    recencyInDays,
  } = configForAccountType(account.type);
  const transactionsRange = range(
    faker.helpers.rangeToNumber({
      min: numTransactions.min,
      max: numTransactions.max,
    })
  );
  const transactions = transactionsRange.map<InsertTransaction>(() => {
    const type = faker.helpers.weightedArrayElement([
      { value: "Overføring", weight: 10 },
      { value: "Betaling", weight: 100 },
      { value: "Innskudd", weight: 5 },
      { value: "Uttak", weight: 5 },
    ]);
    return {
      description: faker.helpers.weightedArrayElement(weightedDescriptions),
      amount: faker.finance.amount({
        min: transactionsAmount.min,
        max: transactionsAmount.max,
      }),
      accountId: account.id,
      timestamp: faker.date.recent({ days: recencyInDays }),
      type,
    };
  });
  return createTransactions(transactions, { scope });
};

const createAndSeedFakeUser = async (
  nnin: string,
  { scope }: DatabaseQueryOptions = { scope: db }
) => {
  return scope.transaction(async (trx) => {
    const user = await createFakeUser(nnin, { scope: trx });
    const fakeAccounts = await createFakeAccounts(user, { scope: trx });
    await Promise.all(
      fakeAccounts.map((account) => {
        return createFakeTransactions(account, { scope: trx });
      })
    );
    return user;
  });
};

export { createAndSeedFakeUser, createFakeUser, createFakeAccounts, createFakeTransactions };
