import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { meQuery } from "../queries/me";

export const Root = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  return (
    <main>
      <Outlet context={me} />
    </main>
  );
};

export default Root;
