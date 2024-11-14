import { useSuspenseQuery } from "@tanstack/react-query";
import { meQuery } from "../queries/me";
import { accountsQuery } from "../queries/accounts";
import { accountBalanceQuery } from "../queries/account-balance";
import type { SelectAccount } from "../db/schema";
import { transactionsByAccountQuery } from "../queries/transactions";

type AccountProps = {
  account: SelectAccount;
};

const Account = ({ account }: AccountProps) => {
  const { data: accountBalance } = useSuspenseQuery(
    accountBalanceQuery(account)
  );
  const { data: transactions } = useSuspenseQuery(
    transactionsByAccountQuery(account)
  );
  return (
    <div className="flex flex-col gap-2 p-1 bg-fargeSand rounded-md border-fargeGraa border-2">
      <span className="capitalize">{account.name}</span>
      <span>{accountBalance.balance}</span>
      <span>{account.type}</span>
      <span>
        Det har vært {transactions?.length} transaksjoner på denne kontoen
      </span>
    </div>
  );
};

const AccountsCard = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  const { data: accounts } = useSuspenseQuery(accountsQuery(me!));
  return (
    <div className="flex flex-col shadow-olga rounded">
      <div className="flex flex-col gap-2 p-4 bg-white ">
        <h2 className="text-2xl">Dine kontoer</h2>
        {accounts?.map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default AccountsCard;
