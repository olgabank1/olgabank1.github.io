import {
  ActionButton,
  ButtonGroup,
  PrimaryButton,
  ShortcutButton,
} from "@sb1/ffe-buttons-react";
import { Heading1 } from "@sb1/ffe-core-react";

export function Index() {
  return (
    <>
      <Heading1>OlgaBank1</Heading1>
      <ButtonGroup ariaLabel={""}>
        <ActionButton>Test</ActionButton>
        <PrimaryButton>Test 2</PrimaryButton>
        <ShortcutButton as="a" href="/side2">
          Side 2
        </ShortcutButton>
      </ButtonGroup>
    </>
  );
}
