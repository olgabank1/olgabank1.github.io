import { ActionButton, ButtonGroup } from "@sb1/ffe-buttons-react";
import { Heading2, Paragraph } from "@sb1/ffe-core-react";
import { Modal, ModalBlock, ModalHandle } from "@sb1/ffe-modals-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode, useEffect, useId, useRef } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Accounts from "./pages/(authenticated)/nettbank-privat/accounts";
import Dashboard from "./pages/(authenticated)/nettbank-privat/dashboard";
import PaymentPage from "./pages/(authenticated)/nettbank-privat/payment";
import Transactions from "./pages/(authenticated)/nettbank-privat/transactions";
import TransferPage from "./pages/(authenticated)/nettbank-privat/transfer";
import { Index } from "./pages/(unauthenticated)";
import Login from "./pages/(unauthenticated)/login";
import { Side2 } from "./pages/(unauthenticated)/side2";
import Root from "./pages/root";
import { queryClient } from "./queries/client";
import RequiresAuth from "./router/requires-auth";
import Unauthenticated from "./router/unauthenticated";
import AdminPage from "./pages/(authenticated)/admin/admin";
import ApprovePaymentPage from "./pages/(authenticated)/nettbank-privat/approve-payment";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <Unauthenticated />,
        children: [
          {
            index: true,
            element: <Index />,
          },
          {
            path: "innlogging",
            element: <Login />,
            loader: Login.loader(queryClient),
            action: Login.action(queryClient),
          },
          {
            path: "side2",
            element: <Side2 />,
          },
        ],
      },
      {
        path: "nettbank-privat",
        element: <RequiresAuth />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "overfore",
            element: <TransferPage />,
            action: TransferPage.action(queryClient),
          },
          {
            path: "betaling",
            element: <PaymentPage />,
            action: PaymentPage.action(queryClient),
          },
          {
            path: "betaling/:id",
            element: <ApprovePaymentPage />,
            action: ApprovePaymentPage.action(queryClient),
          },
          {
            path: "kontoer",
            element: <Accounts />,
            action: TransferPage.action(queryClient),
          },
          {
            path: "kontobevegelser",
            element: <Transactions />,
            action: TransferPage.action(queryClient),
          },
          {
            path: "admin",
            element: <AdminPage />,
            loader: AdminPage.loader(queryClient),
          },
        ],
      },
    ],
  },
]);

function App() {
  const modalRef = useRef<ModalHandle>(null);
  const headingId = useId();

  const consent = localStorage.getItem("consent");

  useEffect(() => {
    console.log("consent", consent);
    if (!consent) {
      setTimeout(() => modalRef.current?.open(), 200);
    }
  });
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
        <Modal ref={modalRef} ariaLabelledby={headingId}>
          <ModalBlock>
            <Heading2 id={headingId}>Konsept side</Heading2>
            <Paragraph>
              Dette er en konseptside og skal kun brukes for å utforske
              muligheter. Fyll ikke inn personlig informasjon på denne siden.
            </Paragraph>
            <ButtonGroup thin={true} ariaLabel="Knappegruppe">
              <ActionButton
                onClick={() => {
                  modalRef?.current?.close();
                  localStorage.setItem("consent", "true");
                }}
                autoFocus={true}
                type="button"
              >
                Godta
              </ActionButton>
            </ButtonGroup>
          </ModalBlock>
        </Modal>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
