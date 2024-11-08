import { ActionButton, ButtonGroup } from "@sb1/ffe-buttons-react";
import { Heading2, Paragraph } from "@sb1/ffe-core-react";
import { Modal, ModalBlock, ModalHandle } from "@sb1/ffe-modals-react";
import { useEffect, useId, useRef } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Index } from "./pages";
import { Side2 } from "./pages/side2";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "side2",
    element: <Side2 />,
  },
]);

function App() {
  const modalRef = useRef<ModalHandle>(null);
  const headingId = useId();

  const consent = localStorage.getItem("consent");

  useEffect(() => {
    if (!consent) {
      modalRef.current?.open();
    }
  });

  return (
    <>
      <RouterProvider router={router} />;
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
    </>
  );
}

export default App;
