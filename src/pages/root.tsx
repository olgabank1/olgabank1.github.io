import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Outlet } from "react-router-dom";
import { meQuery } from "../queries/me";
import { Header } from "../router/header";

import { Paragraph } from "@sb1/ffe-core-react";
import house from "@sb1/ffe-icons/icons/filled/xl/home.svg?raw";
import { Suspense } from "react";
import { Spinner } from "@sb1/ffe-spinner-react";
const base64house = `data:image/svg+xml;base64,${btoa(house)}`;

const Root = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  return (
    <>
      <Header loggedInUser={me} />
      <main>
        <Suspense fallback={<Spinner />}>
          <Outlet context={me} />
        </Suspense>
      </main>
      <footer className="bg-fargeVann30 text-fargeHvit content-center flex align-middle justify-center pt-1 pb-1">
        <Link to="/nettbank-privat">
          <img src={base64house} alt="Hjem" />
          <Paragraph>Hjem</Paragraph>
        </Link>
      </footer>
    </>
  );
};
export default Root;
