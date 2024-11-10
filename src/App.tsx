import { ActionButton, ButtonGroup } from "@sb1/ffe-buttons-react";
import { Heading2, Paragraph } from "@sb1/ffe-core-react";
import { Modal, ModalBlock, ModalHandle } from "@sb1/ffe-modals-react";
import { StrictMode, useEffect, useId, useRef } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Index } from "./pages/(unauthenticated)";
import { Side2 } from "./pages/(unauthenticated)/side2";
import { queryClient } from "./query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/(unauthenticated)/login";
import RequiresAuth from "./router/requires-auth";
import Dashboard from "./pages/(authenticated)/nettbank-privat/dashboard";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Unauthenticated from "./router/unauthenticated";
import Root from "./pages/root";

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
            path: "login",
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
        loader: RequiresAuth.loader(queryClient),
        children: [
          {
            index: true,
            element: <Dashboard />,
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
