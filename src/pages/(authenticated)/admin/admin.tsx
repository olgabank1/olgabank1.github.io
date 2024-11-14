import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRowExpandable,
} from "@sb1/ffe-tables-react";
import { LoaderFunction, redirect } from "react-router-dom";
import { meQuery } from "../../../queries/me";
import { transactionsThatneedApprovalPlzQuery } from "../../../queries/transactions";
import { ContextMessage, MessageHeader } from "@sb1/ffe-messages-react";
import { Heading6 } from "@sb1/ffe-core-react";
import {
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
} from "@sb1/ffe-buttons-react";
import { formatDate } from "@sb1/ffe-formatters";
import { approveTransaction } from "../../../repository/transaction";

const AdminPage = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: data } = useSuspenseQuery(
    transactionsThatneedApprovalPlzQuery(me!)
  );

  const navnHeader = "Navn";
  const epostHeader = "Epost";
  const hvaGjelederHeader = "Hva gjelder det?";

  return (
    <div>
      <h1>Admin Page</h1>
      <Table>
        <TableCaption>Tabel utvidbare rader</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col">{navnHeader}</TableHeaderCell>
            <TableHeaderCell scope="col">{epostHeader}</TableHeaderCell>
            <TableHeaderCell scope="col">{hvaGjelederHeader}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((it, index) => (
            <TableRowExpandable
              isDefaultOpen={index === 1}
              key={it.users?.name}
              expandContent={
                <BetalingsDetaljer
                  account_transactions={it.account_transactions}
                  account={it.accounts!}
                  users={it.users!}
                />
              }
            >
              <TableDataCell columnHeader={navnHeader}>
                {it.users?.name}
              </TableDataCell>
              <TableDataCell columnHeader={epostHeader}>
                {it.users?.nnin}
              </TableDataCell>
              <TableDataCell columnHeader={hvaGjelederHeader}>
                {"Godkjenning av transaksjon"}
              </TableDataCell>
              <TableDataCell columnHeader={epostHeader}>
                {it.account_transactions.timestamp.setFullYear(
                  it.account_transactions.timestamp.getFullYear() + 1
                )}
              </TableDataCell>
            </TableRowExpandable>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

AdminPage.loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const me = await queryClient.ensureQueryData(meQuery);

    if (me?.role === "Advisor") {
      return null;
    }
    if (me) {
      return redirect("/nettbank-privat");
    }
    return null;
  };

type Prop = {
  account_transactions: {
    id: number;
    type: string;
    amount: string;
    description: string;
    timestamp: Date;
  };
  users: {
    name: string;
    nnin: string;
  };
  account: {
    number: string;
    name: string;
    ownerId: number;
    type: string;
  };
};

const BetalingsDetaljer = ({ account_transactions, account, users }: Prop) => {
  const time = formatDate(account_transactions.timestamp);

  return (
    <div className="flex justify-between">
      <div className="flex-1 flex gap-4">
        <div>
          <h3>Betalingsdetaljer</h3>
          <div>
            <Heading6>Betaling fra:</Heading6>
            <p>{users.name}</p>
            <Heading6>Kontonavn:</Heading6>
            <p>{account.name}</p>
            <Heading6>Kontonummer:</Heading6>
            <p>{account.number} </p>
          </div>
        </div>
        <div>
          <>
            <Heading6>Beløp:</Heading6>
            <p>{account_transactions.amount} NOK</p>
          </>
          <>
            <Heading6>Opprettet:</Heading6>
            <p>{time}</p>
          </>

          <>
            <Heading6>Betalingen kjøres:</Heading6>
            <p>{time}</p>
          </>
          <>
            <Heading6>Olgas telefonnummer:</Heading6>
            <p> 99999999 </p>
          </>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between justify-items-end">
        <ContextMessage
          type="info"
          header={<MessageHeader>Betaling med stor sum</MessageHeader>}
        >
          Kunden har initiert en betaling på over 9 800 NOK. Se over betalingen
          og vurder risiko for svindel Evt ring kunden for bekreftelse
        </ContextMessage>
        <ButtonGroup thin={true} ariaLabel="Knappegruppe">
          <SecondaryButton onClick={() => {}}>Stans betaling</SecondaryButton>
          <PrimaryButton
            onClick={() => approveTransaction(account_transactions.id)}
          >
            Godkjenn betaling
          </PrimaryButton>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default AdminPage;
