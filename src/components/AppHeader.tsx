"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayIcon, NightIcon } from "@/components/ThemeIcons";
import { useTheme } from "@/components/ThemeProvider";
import type { SessionUser } from "@/lib/auth-types";
import { navForRole } from "@/lib/auth-nav";

type AppHeaderProps = {
  user?: SessionUser | null;
  focus?: string;
};

export function AppHeader({ user = null, focus }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const nav = navForRole(user?.role ?? null);

  const identityLabel = user
    ? user.role === "manager"
      ? `Manager: ${user.name}`
      : `Rep: ${user.name}`
    : "Not signed in";

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link href={user ? (user.role === "manager" ? "/coach/manager" : "/coach") : "/"} className="shrink-0">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Cornerman
            </span>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="hidden min-w-0 items-center gap-3 text-sm sm:flex">
            <span className="truncate text-muted">
              <span className="font-medium text-foreground">{identityLabel}</span>
            </span>
            {focus ? (
              <>
                <span className="text-border">|</span>
                <span className="truncate text-muted">
                  Focus:{" "}
                  <span className="font-medium text-accent">{focus}</span>
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={signingOut}
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline disabled:opacity-50"
            >
              {signingOut ? "…" : "Sign out"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:border-accent"
            aria-label={
              theme === "light" ? "Switch to night mode" : "Switch to day mode"
            }
            title={theme === "light" ? "Night mode" : "Day mode"}
          >
            {theme === "light" ? (
              <NightIcon className="h-[18px] w-[18px]" />
            ) : (
              <DayIcon className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-2 px-4 pb-3 text-xs text-muted sm:hidden">
        <div className="flex gap-3">
          <span className="text-foreground">{identityLabel}</span>
          {focus ? (
            <>
              <span>·</span>
              <span>
                Focus: <span className="text-accent">{focus}</span>
              </span>
            </>
          ) : null}
        </div>
        <nav className="flex flex-wrap gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-md px-2 py-1 text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              Sign out
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
