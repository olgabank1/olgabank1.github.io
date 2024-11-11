import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { meQuery } from "../queries/me";

const RequiresAuth = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  if (!me) {
    return <Navigate to="/login" />;
  }
  return <Outlet context={me} />;
};

export default RequiresAuth;
