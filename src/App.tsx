import { Heading1 } from "@sb1/ffe-core-react";
import "./App.css";
import {
  ActionButton,
  ButtonGroup,
  PrimaryButton,
} from "@sb1/ffe-buttons-react";

function App() {
  return (
    <>
      <Heading1>OlgaBank1</Heading1>
      <ButtonGroup ariaLabel={""}>
        <ActionButton>Test</ActionButton>
        <PrimaryButton>Test 2</PrimaryButton>
      </ButtonGroup>
    </>
  );
}

export default App;
