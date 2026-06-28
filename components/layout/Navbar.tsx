"use client";

import { Logo } from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
        {/* TODO: isAuthenticated layout */}
      </div>
    </header>
  );
}
