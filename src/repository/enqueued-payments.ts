import { eq } from "drizzle-orm";
import { db } from "../db";
import { paymentQueue, type SelectPaymentQueue } from "../db/schema";
import { createOne } from "./transaction";

const getById = async (enqueuedPaymentId: SelectPaymentQueue["id"]) => {
  const [result] = await db
    .select()
    .from(paymentQueue)
    .where(eq(paymentQueue.id, enqueuedPaymentId));
  return result;
};

const approve = async (enqueuedPaymentId: SelectPaymentQueue["id"]) => {
  return db.transaction(async (trx) => {
    const [deletedEnqueuedPayment] = await trx
      .delete(paymentQueue)
      .where(eq(paymentQueue.id, enqueuedPaymentId))
      .returning();
    await createOne(
      {
        accountId: deletedEnqueuedPayment.fromAccountId,
        amount: deletedEnqueuedPayment.amount,
        description: `Betaling til ${deletedEnqueuedPayment.toAccountNumber} med melding ${deletedEnqueuedPayment.message}`,
        type: "Betaling",
        timestamp: new Date(),
      },
      { scope: trx }
    );
  });
};

export { getById, approve };
