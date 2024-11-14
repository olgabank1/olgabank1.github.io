import {
  PrimaryButton,
  SecondaryButton,
  ShortcutButton,
} from "@sb1/ffe-buttons-react";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../queries/me";
import { useLocation, useNavigate } from "react-router-dom";
import type { SelectUser } from "../db/schema";
import { Heading2 } from "@sb1/ffe-core-react";

type Props = {
  loggedInUser: SelectUser | null;
};
export const Header = ({ loggedInUser: user }: Props) => {
  const location = useLocation();
  const isAuthenticatedPages = location.pathname.startsWith("/nettbank-privat");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (!user) {
    return (
      <header className="flex justify-between bg-fargeVann">
        <h1>OlgaBank 1</h1>
        <ShortcutButton as="a" href="#innlogging">
          Logg inn
        </ShortcutButton>
      </header>
    );
  }

  return (
    <header className="flex justify-between bg-fargeVann">
      <div>
        <Heading2 className="mb-0 text-fargeHvit px-2 py-1">
          OlgaBank 1
        </Heading2>
      </div>
      <div>
        {!isAuthenticatedPages && (
          <PrimaryButton as="a" href="#nettbank-privat">
            Til nettbanken
          </PrimaryButton>
        )}
        <SecondaryButton
          onClick={async () => {
            await logout(queryClient);
            navigate("/");
          }}
        >
          Logg ut
        </SecondaryButton>
      </div>
    </header>
  );
};
