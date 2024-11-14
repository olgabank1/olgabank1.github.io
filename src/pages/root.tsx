import { ActionButton } from "@sb1/ffe-buttons-react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, Outlet } from "react-router-dom";
import { meQuery } from "../queries/me";
import { Header } from "../router/header";
import { deleteDatabase } from "../db";

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
          onClick={async () => {
            deleteDatabase();
            await queryClient.invalidateQueries();
            navigate("/");
            location.reload();
          }}
        >
          Reset
        </ActionButton>
      </footer>
    </>
  );
};
export default Root;
