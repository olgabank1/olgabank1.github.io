import { queryOptions, type QueryFunctionContext } from "@tanstack/react-query";
import { type SelectPaymentQueue } from "../db/schema";
import { getById } from "../repository/enqueued-payments";

export const enqueuedPaymentsKeys = {
  all: [{ scope: "enqueued-payments" }] as const,
  getById: (id: number) => [{ ...enqueuedPaymentsKeys.all[0], id }] as const,
};

const fetchEnqueuedPaymentById = async ({
  queryKey: [{ id }],
}: QueryFunctionContext<
  ReturnType<(typeof enqueuedPaymentsKeys)["getById"]>
>) => getById(id);

export const enqueuedPaymenByIdQuery = (id: SelectPaymentQueue["id"]) =>
  queryOptions({
    queryKey: enqueuedPaymentsKeys.getById(id),
    queryFn: fetchEnqueuedPaymentById,
  });
