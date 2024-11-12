import { PrimaryButton } from "@sb1/ffe-buttons-react";
import type { QueryClient } from "@tanstack/react-query";
import {
  Form,
  redirect,
  useActionData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";
import { getByNnin } from "../../repository/user";
import type { z } from "zod";
import { InsertUserSchema } from "../../db/schema";
import { login, meQuery } from "../../queries/me";
import { createAndSeedFakeUser } from "../../db/seeder/fake";

const FieldErrors = ({ errors }: { errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <div className="flex flex-col gap-0.5 text-xs text-fargeBaer">
      {errors.map((err) => (
        <p key={err}>{err}</p>
      ))}
    </div>
  );
};

const Page = () => {
  const actionData = useActionData() as FormattedErrors | null;
  return (
    <div className="place-content-center flex">
      <div className="w-full max-w-xs">
        <Form
          method="post"
          className="bg-white shadow-olga rounded px-8 pt-6 pb-8 flex flex-col gap-2"
        >
          <div className="flex flex-col gap-1">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="nnin"
              >
                Fødselsnummer
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nnin"
                name="nnin"
                type="text"
                autoComplete="off"
                placeholder="Fødselsnummer"
              />
              <FieldErrors errors={actionData?.fieldErrors.nnin} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <PrimaryButton>Logg inn</PrimaryButton>
          </div>
          <FieldErrors errors={actionData?.formErrors} />
        </Form>
      </div>
    </div>
  );
};

const LoginSchema = InsertUserSchema.pick({ nnin: true });
type FormattedErrors = z.inferFlattenedErrors<typeof LoginSchema>;
const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {
    const formData = await request.formData();
    const parseResult = LoginSchema.safeParse(Object.fromEntries(formData));
    if (!parseResult.success) {
      return parseResult.error.flatten();
    }
    const { nnin } = parseResult.data;
    const user = await getByNnin(nnin);
    if (user) {
      await login(queryClient, user);
      return redirect("/nettbank-privat");
    }
    const newUser = await createAndSeedFakeUser(nnin);
    await login(queryClient, newUser);

    return redirect("/nettbank-privat");
  };

const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const me = await queryClient.ensureQueryData(meQuery);
    if (me) {
      return redirect("/nettbank-privat");
    }
    return null;
  };

Page.action = action;
Page.loader = loader;

export default Page;
