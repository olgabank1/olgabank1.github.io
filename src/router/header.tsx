import {
  PrimaryButton,
  SecondaryButton,
  ShortcutButton,
} from "@sb1/ffe-buttons-react";
import { Heading2 } from "@sb1/ffe-core-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import type { SelectUser } from "../db/schema";
import { logout } from "../queries/me";

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
        <Heading2 className="mb-0 text-fargeHvit px-2 py-1 pt-8">
          SeniorBank 1
        </Heading2>
        <ShortcutButton as="a" href="#login">
          Logg inn
        </ShortcutButton>
      </header>
    );
  }

  return (
    <header className="flex justify-between bg-fargeVann">
      <div>
        <a href="#nettbank-privat">
          <Heading2 className="mb-0 text-fargeHvit px-2 py-1 pt-8">
            SeniorBank 1
          </Heading2>
        </a>
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
