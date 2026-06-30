"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "./Logo";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/find-jobs",
    label: "Find Jobs",
  },
  {
    href: "/profile",
    label: "Profile",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo priority />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/find-jobs"
                ? pathname.startsWith("/find-jobs")
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-accent"
                    : "text-text-dark hover:text-text-primary",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <span className="hidden text-sm text-text-secondary sm:inline">
                {user.email ?? "Signed in"}
              </span>
              <button
                type="button"
                onClick={() => {
                  void signOut().then(() => router.push("/login"));
                }}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="landing-button-primary min-h-10 px-4"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
