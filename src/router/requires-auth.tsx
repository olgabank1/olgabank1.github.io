import type { QueryClient } from "@tanstack/react-query";
import { Outlet, redirect, type LoaderFunction } from "react-router-dom";
import { meQuery } from "../queries/me";

const RequiresAuth = () => {
  return <Outlet />;
};

const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const me = await queryClient.ensureQueryData(meQuery);
    if (!me) {
      return redirect("/login");
    }
    return null;
  };

RequiresAuth.loader = loader;

export default RequiresAuth;
