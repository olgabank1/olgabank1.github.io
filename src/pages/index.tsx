import { Accordion, AccordionItem } from "@sb1/ffe-accordion-react";
import {
  ActionButton,
  ButtonGroup,
  PrimaryButton,
  ShortcutButton,
} from "@sb1/ffe-buttons-react";
import { IconCard } from "@sb1/ffe-cards-react";
import { Heading1, Wave } from "@sb1/ffe-core-react";
import { Datepicker } from "@sb1/ffe-datepicker-react";
import { Icon } from "@sb1/ffe-icons-react";

import house from "@sb1/ffe-icons/icons/filled/md/60fps.svg";
import { SearchableDropdown } from "@sb1/ffe-searchable-dropdown-react";
import { Spinner } from "@sb1/ffe-spinner-react";

export function Index() {
  return (
    <>
      <Wave color="syrin-30">
        <Heading1>OlgaBank1</Heading1>
      </Wave>
      <ButtonGroup ariaLabel={""}>
        <ActionButton>Test</ActionButton>
        <PrimaryButton>Test 2</PrimaryButton>
        <ShortcutButton as="a" href="#side2">
          Side 2
        </ShortcutButton>
      </ButtonGroup>
      <Accordion headingLevel={2}>
        <AccordionItem heading="Tittel">Skjult innhold</AccordionItem>
        <AccordionItem heading={<span>Enda en tittel</span>}>
          Mer skjult innhold
        </AccordionItem>
        <AccordionItem heading="En siste tittel">
          Enda mer innhold
        </AccordionItem>
      </Accordion>
      <IconCard icon={<Icon size="xl" fileUrl={house} />}>
        {({ CardAction, CardName, Title, Subtext, Text }) => (
          <>
            <CardName>Kortnavn</CardName>
            <Title>
              <CardAction href="https://design.sparebank1.no">
                Lenke men hele kortet er klikkbart
              </CardAction>
            </Title>
            <Subtext>En liten undertekst</Subtext>
            <Text>Her kan man ha tekst</Text>
          </>
        )}
      </IconCard>
      <Datepicker
        onChange={function (date: string): void {
          throw new Error("Function not implemented." + date);
        }}
        value={""}
      />
      <Spinner />
      <SearchableDropdown
        id={""}
        dropdownList={[]}
        dropdownAttributes={[]}
        searchAttributes={[]}
      />
    </>
  );
}
