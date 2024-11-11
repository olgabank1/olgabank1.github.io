import { ActionButton, ButtonGroup } from "@sb1/ffe-buttons-react";
import { Heading2, Paragraph } from "@sb1/ffe-core-react";
import { Modal, ModalBlock, ModalHandle } from "@sb1/ffe-modals-react";
import { useEffect, useId, useRef, useState } from "react";
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
type Props = {
  update: { forceUpdate: () => void };
  resetState: () => void;
};
function App({ update, resetState }: Props) {
  const modalRef = useRef<ModalHandle>(null);
  const headingId = useId();
  const [state, setState] = useState(1);
  update.forceUpdate = () => setState(state + 1);

  const consent = localStorage.getItem("consent");

  useEffect(() => {
    console.log("consent", consent);
    if (!consent) {
      modalRef.current?.open();
    }
  });

  return (
    <div key={state}>
      <RouterProvider router={router} />
      <ActionButton onClick={resetState}>Tilbakestill</ActionButton>
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
    </div>
  );
}

export default App;
