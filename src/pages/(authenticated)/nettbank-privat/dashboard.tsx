// A fancy pants dashboard for a bank customer. The customer is an older person who is not very tech savvy, so we need to keep it simple.
// The dashboard should show the a list of the user's accounts including their balance, a list of the user's latest transactions and a button to transfer money.
const DashBoard = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Din økonomi</h1>
      <div className="flex flex-col shadow-olga rounded">
        <div className="flex flex-col gap-2 p-4 bg-white ">
          <h2 className="text-2xl">Dine kontoer</h2>
          <div className="flex justify-between">
            <span>Sparekonto</span>
            <span>kr 9 342 112</span>
          </div>
          <div className="flex justify-between">
            <span>Brukskonto</span>
            <span>kr 15 230</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col shadow-olga rounded">
        <div className="flex flex-col gap-2 p-4 bg-white">
          <h2 className="text-2xl">Dine siste transaksjoner</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Matbutikk</span>
              <span>- kr 500</span>
            </div>
            <div className="flex justify-between">
              <span>Strømregning</span>
              <span>- kr 1 000</span>
            </div>
            <div className="flex justify-between">
              <span>Pensjon</span>
              <span>+ kr 25 000</span>
            </div>
            <div className="flex justify-between">
              <span>Lege</span>
              <span>- kr 500</span>
            </div>
            <div className="flex justify-between">
              <span>Svindel</span>
              <span>- kr 100</span>
            </div>
          </div>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Overfør penger
      </button>
    </div>
  );
};

export default DashBoard;
