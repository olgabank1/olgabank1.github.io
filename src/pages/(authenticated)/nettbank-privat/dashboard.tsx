// A fancy pants dashboard for a bank customer. The customer is an older person who is not very tech savvy, so we need to keep it simple.

import AccountsCard from "../../../components/AccountsCard";
import { LatestTransactionsCard } from "../../../components/LatestTransactionsCard";
import { Link } from "react-router-dom";

// The dashboard should show the a list of the user's accounts including their balance, a list of the user's latest transactions and a button to transfer money.
const DashBoard = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Din økonomi</h1>
      <AccountsCard />
      <LatestTransactionsCard />
      <Link
        to={"./transfer"}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Overfør penger
      </Link>
    </div>
  );
};

export default DashBoard;
