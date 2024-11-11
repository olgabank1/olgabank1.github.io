import { Heading1, Heading3, Paragraph } from "@sb1/ffe-core-react";
import { localRESTDelete, localRESTGet, localRESTPost } from "../localREST";
import { ActionButton } from "@sb1/ffe-buttons-react";

type Account = {
  name: string;
  number: string;
  amount: number;
};

export function Side2() {
  const accounts = localRESTGet<Account>("accounts");

  function addAccount() {
    localRESTPost("accounts", [
      {
        name: "Sønn Lars",
        amount: 3200,
        number: "987827272",
      },
    ]);
  }

  function deleteAccount(id: number) {
    localRESTDelete("accounts", id);
  }
  return (
    <>
      <Heading1>Side 2</Heading1>

      {accounts.map((account) => (
        <div key={account.id}>
          <Heading3>{account.name}</Heading3>
          <Paragraph>{account.number}</Paragraph>
          <Paragraph>{account.amount}</Paragraph>
          <ActionButton onClick={() => deleteAccount(account.id)}>
            Slett
          </ActionButton>
        </div>
      ))}
      <ActionButton onClick={addAccount}>Legg til</ActionButton>
    </>
  );
}
