import { ActionButton } from "@sb1/ffe-buttons-react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, Outlet } from "react-router-dom";
import { meQuery } from "../queries/me";
import { Header } from "../router/header";

const Root = () => {
  const { data: me } = useSuspenseQuery(meQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return (
    <>
      <Header loggedInUser={me} />
      <main>
        <Outlet context={me} />
      </main>
      <footer>
        <ActionButton
          onClick={() => {
            window.indexedDB.deleteDatabase("/pglite/olga-data");
            window.sessionStorage.clear();
            queryClient.invalidateQueries();
            navigate("/");
            window.location.reload();
          }}
        >
          Reset
        </ActionButton>
      </footer>
    </>
  );
};
export default Root;
