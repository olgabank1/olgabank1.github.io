import type { z } from "zod";
import { InsertPaymentQueueSchema } from "../../../db/schema";
import type { QueryClient } from "@tanstack/react-query";
import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";
import { meQuery } from "../../../queries/me";

const ApprovePaymentPage = () => {
  return (
    <div>
      <h1>ApprovePaymentPage</h1>
    </div>
  );
};

type FormattedErrors = z.inferFlattenedErrors<typeof InsertPaymentQueueSchema>;
const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {
    const formData = await request.formData();
    const parseResult = InsertPaymentQueueSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!parseResult.success) {
      return parseResult.error.flatten();
    }
    return redirect("/nettbank-privat");
  };

const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const me = await queryClient.ensureQueryData(meQuery);
    if (!me) {
      return redirect("/nettbank-privat");
    }
    return null;
  };

ApprovePaymentPage.action = action;
ApprovePaymentPage.loader = loader;
export default ApprovePaymentPage;
