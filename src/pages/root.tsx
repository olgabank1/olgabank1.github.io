import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { meQuery } from "../queries/me";
import { Header } from "../router/header";

const Root = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  return (
    <>
      <Header loggedInUser={me} />
      <main>
        <Outlet context={me} />
      </main>
    </>
  );
};
export default Root;
