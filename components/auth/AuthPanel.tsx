"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, ShieldCheck } from "lucide-react";

export function AuthPanel() {
  const router = useRouter();
  const {
    user,
    loading,
    authProviders,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
  } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-up") {
        await signUpWithPassword(email, password, name);
      } else {
        await signInWithPassword(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign in could not be started.",
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-360 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-text-secondary">Loading account details…</p>
      </section>
    );
  }

  if (user) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-360 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <p className="text-sm font-semibold text-text-primary">
            You are signed in
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            {user.email ?? "Your account is ready."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-4 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Open dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-360 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-card lg:grid-cols-[1.05fr_0.95fr]">
        <div className="landing-hero-glow flex min-h-110 flex-col justify-between border-b border-border p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
              <ShieldCheck aria-hidden className="h-4 w-4 text-accent" />
              Secured by InsForge
            </div>
            <h1 className="mt-8 max-w-xl text-[clamp(2.35rem,5vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-text-slate">
              Sign in and let the agent prep your next application.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-text-secondary sm:text-lg">
              Create an account or sign in to start building your profile,
              matching jobs, and creating tailored application materials.
            </p>
          </div>

          <p className="mt-10 text-sm font-medium text-text-secondary">
            New users are routed to profile setup after sign-in.
          </p>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Welcome to
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-9 text-text-primary">
              JobPilot
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {mode === "sign-in"
                ? "Sign in to your account to continue."
                : "Create a new account to get started."}
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-md border border-error bg-error/10 px-4 py-3 text-sm font-medium text-error">
              {error}
            </div>
          ) : null}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" ? (
              <label className="block text-sm font-medium text-text-primary">
                <span className="mb-1 block">Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Alex Morgan"
                />
              </label>
            ) : null}

            <label className="block text-sm font-medium text-text-primary">
              <span className="mb-1 block">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="block text-sm font-medium text-text-primary">
              <span className="mb-1 block">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Minimum 8 characters"
                required
                autoComplete={
                  mode === "sign-up" ? "new-password" : "current-password"
                }
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Please wait…"
                : mode === "sign-up"
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          {authProviders.email ? (
            <button
              type="button"
              onClick={() =>
                setMode(mode === "sign-in" ? "sign-up" : "sign-in")
              }
              className="mt-4 text-sm font-medium text-accent hover:text-accent-dark"
            >
              {mode === "sign-in"
                ? "Need an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          ) : null}

          <div className="mt-6 border-t border-border pt-6">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Mail aria-hidden className="h-5 w-5 text-accent" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
