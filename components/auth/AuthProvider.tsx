"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getInsforgeClient } from "@/lib/insforge";

type AuthUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  authProviders: { email: boolean; google: boolean; github: boolean };
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [authProviders, setAuthProviders] = useState({
    email: true,
    google: true,
    github: true,
  });

  const insforge = useMemo(() => getInsforgeClient(), []);

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error) {
        setUser(null);
        return;
      }
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    }
  }, [insforge]);

  const loadAuthProviders = useCallback(async () => {
    try {
      const { data } = await insforge.auth.getPublicAuthConfig();
      if (data) {
        const providerNames = ((data as { oAuthProviders?: string[] } | null)
          ?.oAuthProviders ?? []) as string[];
        setAuthProviders({
          email: true,
          google: providerNames.includes("google"),
          github: providerNames.includes("github"),
        });
      }
    } catch {
      setAuthProviders({ email: true, google: true, github: true });
    }
  }, [insforge]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([refreshUser(), loadAuthProviders()]);
      setLoading(false);
    };

    void initialize();
  }, [loadAuthProviders, refreshUser]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message ?? "Unable to sign in right now.");
      }
      await refreshUser();
    },
    [insforge, refreshUser],
  );

  const signUpWithPassword = useCallback(
    async (email: string, password: string, name: string) => {
      const { error } = await insforge.auth.signUp({
        email,
        password,
        name,
      });
      if (error) {
        throw new Error(
          error.message ?? "Unable to create your account right now.",
        );
      }
      await refreshUser();
    },
    [insforge, refreshUser],
  );

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await insforge.auth.signInWithOAuth("google", {
      redirectTo: `${window.location.origin}/dashboard`,
      skipBrowserRedirect: true,
    });

    if (error) {
      throw new Error(error.message ?? "Google sign in could not be started.");
    }

    if (data?.url) {
      window.location.assign(data.url);
    }
  }, [insforge]);

  const signOut = useCallback(async () => {
    const { error } = await insforge.auth.signOut();
    if (error) {
      throw new Error(error.message ?? "Unable to sign out right now.");
    }
    setUser(null);
  }, [insforge]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authProviders,
      signInWithPassword,
      signUpWithPassword,
      signInWithGoogle,
      signOut,
      refreshUser,
    }),
    [
      authProviders,
      loading,
      refreshUser,
      signInWithGoogle,
      signInWithPassword,
      signOut,
      signUpWithPassword,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
