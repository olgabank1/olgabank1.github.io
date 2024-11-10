import {
  PrimaryButton,
  SecondaryButton,
  ShortcutButton,
} from "@sb1/ffe-buttons-react";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../queries/me";
import { useLocation, useNavigate } from "react-router-dom";
import type { SelectUser } from "../db/schema";

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
      <header className="flex justify-end">
        <ShortcutButton as="a" href="#login">
          Logg inn
        </ShortcutButton>
      </header>
    );
  }

  return (
    <header className="flex justify-between">
      <span>{user.name}</span>
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
