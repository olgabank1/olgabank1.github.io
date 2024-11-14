// A fancy pants dashboard for a bank customer. The customer is an older person who is not very tech savvy, so we need to keep it simple.

import { IconCard } from "@sb1/ffe-cards-react";
import { DividerLine, Heading1, Heading2 } from "@sb1/ffe-core-react";
import { Icon } from "@sb1/ffe-icons-react";
import { ContextMessage, MessageHeader } from "@sb1/ffe-messages-react";

import accountBallance from "@sb1/ffe-icons/icons/open/400/xl/account_balance.svg?raw";
const b64accountBallance = `data:image/svg+xml;base64,${btoa(accountBallance)}`;

import creditCard from "@sb1/ffe-icons/icons/open/400/xl/credit_card.svg?raw";
const b64creditCard = `data:image/svg+xml;base64,${btoa(creditCard)}`;

import list from "@sb1/ffe-icons/icons/open/400/xl/list.svg?raw";
const b64list = `data:image/svg+xml;base64,${btoa(list)}`;

import abw from "@sb1/ffe-icons/icons/open/400/xl/account_balance_wallet.svg?raw";
const b64abw = `data:image/svg+xml;base64,${btoa(abw)}`;

import sh from "@sb1/ffe-icons/icons/open/400/xl/swap_horiz.svg?raw";
const b64sh = `data:image/svg+xml;base64,${btoa(sh)}`;

import ring from "@sb1/ffe-icons/icons/open/400/xl/call.svg?raw";
import person from "@sb1/ffe-icons/icons/open/400/xl/person.svg?raw";
import { useNavigate } from "react-router-dom";
const b64person = `data:image/svg+xml;base64,${btoa(person)}`;
const b64ring = `data:image/svg+xml;base64,${btoa(ring)}`;
// The dashboard should show the a list of the user's accounts including their balance, a list of the user's latest transactions and a button to transfer money.
const DashBoard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <Heading1>Velkommen til Seniorbank 1, Olga!</Heading1>

      <DividerLine className="" />

      <section>
        <Heading2>Min lommebok</Heading2>

        <IconCard icon={<Icon fileUrl={b64accountBallance} size="xl" />}>
          {({ CardAction, Title }) => (
            <>
              <Title>
                <CardAction
                  onClick={() => {
                    navigate("./kontoer");
                  }}
                >
                  Mine kontoer og saldo
                </CardAction>
              </Title>
            </>
          )}
        </IconCard>

        <IconCard icon={<Icon fileUrl={b64creditCard} size="xl" />}>
          {({ CardAction, Title }) => (
            <>
              <Title>
                <CardAction
                  onClick={() => {
                    navigate("./kort");
                  }}
                >
                  Mine kort
                </CardAction>
              </Title>
            </>
          )}
        </IconCard>

        <IconCard icon={<Icon fileUrl={b64list} size="xl" />}>
          {({ CardAction, Title }) => (
            <>
              <Title>
                <CardAction
                  onClick={() => {
                    navigate("./kontobevegelser");
                  }}
                >
                  Kontobevegelser
                </CardAction>
              </Title>
            </>
          )}
        </IconCard>
      </section>
      <section>
        <Heading2>Handlinger</Heading2>
        <div className="flex gap-2">
          <IconCard icon={<Icon fileUrl={b64abw} size="xl" />}>
            {({ CardAction, Title }) => (
              <>
                <Title>
                  <CardAction
                    onClick={() => {
                      navigate("./betale");
                    }}
                  >
                    Betal
                  </CardAction>
                </Title>
              </>
            )}
          </IconCard>
          <IconCard icon={<Icon fileUrl={b64sh} size="xl" />}>
            {({ CardAction, Title }) => (
              <>
                <Title>
                  <CardAction
                    onClick={() => {
                      navigate("./overfore");
                    }}
                  >
                    Overfør
                  </CardAction>
                </Title>
              </>
            )}
          </IconCard>
        </div>
      </section>
      <section>
        <Heading2>Informasjon fra banken</Heading2>
        <ContextMessage
          type="info"
          header={<MessageHeader>Viktig informasjon om Bank-id</MessageHeader>}
        >
          Banken vil aldri spørre deg om informasjon knyttet til din bank-id i
          en tekstmelding eller over talefonsamtale.
        </ContextMessage>
      </section>
      <section>
        <Heading2>Trenger du hjelp?</Heading2>
        <IconCard icon={<Icon fileUrl={b64person} size="xl" />}>
          {({ CardAction, Title }) => (
            <>
              <Title>
                <CardAction href="tel:11111111">
                  Min rådgiver: Kamilla
                </CardAction>
              </Title>
            </>
          )}
        </IconCard>
        <IconCard icon={<Icon fileUrl={b64ring} size="xl" />}>
          {({ CardAction, Title }) => (
            <>
              <Title>
                <CardAction href="tel:12345678">
                  Ring oss gjerne på telefon 123 45 678
                </CardAction>
              </Title>
            </>
          )}
        </IconCard>
      </section>
    </div>
  );
};

export default DashBoard;
