import { IconCard } from "@sb1/ffe-cards-react";
import { DividerLine, Heading2 } from "@sb1/ffe-core-react";
import { Icon } from "@sb1/ffe-icons-react";
import AccountsCard from "../../../components/AccountsCard";

import abw from "@sb1/ffe-icons/icons/open/400/xl/account_balance_wallet.svg?raw";
const b64abw = `data:image/svg+xml;base64,${btoa(abw)}`;

import { TertiaryButton } from "@sb1/ffe-buttons-react";
import sh from "@sb1/ffe-icons/icons/open/400/xl/swap_horiz.svg?raw";
import { useNavigate } from "react-router-dom";
const b64sh = `data:image/svg+xml;base64,${btoa(sh)}`;

const Accounts = () => {
  const navigate = useNavigate();
  return (
    <>
      <TertiaryButton onClick={() => navigate("../")}>
        &lt; Tilbake
      </TertiaryButton>

      <DividerLine className="mt-2 mb-5" />

      <section>
        <Heading2>Kontoer og saldo</Heading2>
        <AccountsCard />
      </section>

      <section className="mt-6">
        <Heading2>Handlinger</Heading2>
        <div className="flex gap-2">
          <IconCard icon={<Icon fileUrl={b64abw} size="xl" />}>
            {({ CardAction, Title }) => (
              <>
                <Title>
                  <CardAction href="#">Betal</CardAction>
                </Title>
              </>
            )}
          </IconCard>
          <IconCard icon={<Icon fileUrl={b64sh} size="xl" />}>
            {({ CardAction, Title }) => (
              <>
                <Title>
                  <CardAction onClick={() => navigate("../overfore")}>
                    Overfør
                  </CardAction>
                </Title>
              </>
            )}
          </IconCard>
        </div>
      </section>
    </>
  );
};

export default Accounts;
