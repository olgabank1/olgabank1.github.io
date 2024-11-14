import { IconCard } from "@sb1/ffe-cards-react";
import { formatCurrency } from "@sb1/ffe-formatters";
import { Icon } from "@sb1/ffe-icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { accountsQuery } from "../queries/accounts";
import { meQuery } from "../queries/me";

import sh from "@sb1/ffe-icons/icons/open/400/xl/account_balance.svg?raw";
const b64sh = `data:image/svg+xml;base64,${btoa(sh)}`;

const AccountsCard = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: accounts } = useSuspenseQuery(accountsQuery(me!));
  return (
    <>
      {accounts?.map((account) => (
        // <Account key={account.id} account={account} />
        <IconCard icon={<Icon fileUrl={b64sh} size="xl" />}>
          {({ Title, Subtext, Text }) => (
            <>
              <Title>{account.name}</Title>
              <Subtext>{account.number}</Subtext>
              <Text>{formatCurrency(account.balance, { locale: "nb" })}</Text>
            </>
          )}
        </IconCard>
      ))}
    </>
  );
};

export default AccountsCard;
