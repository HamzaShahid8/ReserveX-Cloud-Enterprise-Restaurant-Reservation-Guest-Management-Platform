import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import { wait } from "../utils/booking";

export interface DemoUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  signIn: (email: string, remember: boolean) => Promise<void>;
  signUp: (name: string, email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SEED_ACCOUNTS: DemoUser[] = [{ name: "Demo Guest", email: "demo@aurelle.com" }];

/**
 * Mock authentication for the demo. Only names and emails are kept in LocalStorage —
 * passwords are validated client-side and never stored or sent anywhere.
 */
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [accounts, setAccounts] = usePersistentState<DemoUser[]>("aurelle.accounts", SEED_ACCOUNTS);
  const [rememberedUser, setRememberedUser] = usePersistentState<DemoUser | null>("aurelle.user", null);
  const [sessionUser, setSessionUser] = useState<DemoUser | null>(null);

  const user = sessionUser ?? rememberedUser;

  const signIn = useCallback(
    async (email: string, remember: boolean) => {
      await wait(900);
      const account = accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
      if (!account) {
        throw new Error("No demo account uses that email. Create one, or try demo@aurelle.com.");
      }
      if (remember) {
        setRememberedUser(account);
        setSessionUser(null);
      } else {
        setSessionUser(account);
        setRememberedUser(null);
      }
    },
    [accounts, setRememberedUser]
  );

  const signUp = useCallback(
    async (name: string, email: string) => {
      await wait(1000);
      const normalized = email.trim().toLowerCase();
      if (accounts.some((item) => item.email.toLowerCase() === normalized)) {
        throw new Error("A demo account with this email already exists. Try signing in instead.");
      }
      const account = { name: name.trim(), email: normalized };
      setAccounts((prev) => [...prev, account]);
      setRememberedUser(account);
    },
    [accounts, setAccounts, setRememberedUser]
  );

  const requestPasswordReset = useCallback(async () => {
    await wait(900);
  }, []);

  const signOut = useCallback(() => {
    setSessionUser(null);
    setRememberedUser(null);
  }, [setRememberedUser]);

  const value = useMemo(
    () => ({ user, signIn, signUp, requestPasswordReset, signOut }),
    [user, signIn, signUp, requestPasswordReset, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}