import type { QueryClient } from "@tanstack/react-query";
import type { ActionFunction } from "react-router-dom";

const PaymentPage = () => {
  return (
    <div>
      <h1>Payment</h1>
    </div>
  );
};

const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {};

PaymentPage.action = action;
export default PaymentPage;
