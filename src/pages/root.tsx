import { ActionButton } from "@sb1/ffe-buttons-react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";
import { deleteDatabase } from "../db";
import { meQuery } from "../queries/me";
import { Header } from "../router/header";

import { Paragraph } from "@sb1/ffe-core-react";
import house from "@sb1/ffe-icons/icons/filled/xl/home.svg?raw";
const base64house = `data:image/svg+xml;base64,${btoa(house)}`;

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
      <footer className="bg-fargeVann30 text-fargeHvit content-center flex align-middle justify-center pt-1 pb-1">
        <a href="#nettbank-privat">
          <img src={base64house} alt="Hjem" />
          <Paragraph>Hjem</Paragraph>
        </a>
      </footer>
    </>
  );
};
export default Root;
