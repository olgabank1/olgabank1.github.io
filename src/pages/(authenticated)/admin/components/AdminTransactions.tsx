import { useSuspenseQuery } from "@tanstack/react-query";
import { transactionsByUserQuery } from "../../../../queries/transactions";
import { meQuery } from "../../../../queries/me";

// taken from  LatestTransactionsCard 
export const AdminTransactions = () => {

    const { data: me } = useSuspenseQuery(meQuery);
    const { data: transsactions } = useSuspenseQuery(
      transactionsByUserQuery(me!)
    );

    return (
      <div className="flex flex-col shadow-olga rounded">
        <div className="flex flex-col gap-2 p-4 bg-white">
          <h2 className="text-2xl">Dine siste transaksjoner</h2>
          <div className="flex flex-col gap-2">
            {transsactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between">
                <span className="basis-1/4">
                  {transaction.timestamp.toLocaleDateString()}
                </span>
                <span className="basis-1/4">{transaction.type}</span>
                <span className="basis-1/4">{transaction.description}</span>
                <span className="basis-1/4">{transaction.amount}</span>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Godkjenn
                </button>
                <button>
                    Avslå
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  