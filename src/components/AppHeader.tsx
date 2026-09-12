"use client";

import Link from "next/link";
import { DayIcon, NightIcon } from "@/components/ThemeIcons";
import { useTheme } from "@/components/ThemeProvider";

type AppHeaderProps = {
  repName?: string;
  focus?: string;
};

export function AppHeader({
  repName = "Alex Chen",
  focus = "Fee concessions",
}: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link href="/" className="shrink-0">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Cornerman
            </span>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="hidden min-w-0 items-center gap-3 text-sm sm:flex">
            <span className="truncate text-muted">
              Rep: <span className="font-medium text-foreground">{repName}</span>
            </span>
            <span className="text-border">|</span>
            <span className="truncate text-muted">
              Focus:{" "}
              <span className="font-medium text-accent">{focus}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/coach"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline"
          >
            Diagnosis
          </Link>
          <Link
            href="/coach/training"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline"
          >
            Scenarios
          </Link>
          <Link
            href="/coach/practice"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline"
          >
            Drill
          </Link>
          <Link
            href="/coach/health"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline"
          >
            Health
          </Link>
          <Link
            href="/coach/manager"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground md:inline"
          >
            Manager
          </Link>
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
          <span>
            Rep: <span className="text-foreground">{repName}</span>
          </span>
          <span>·</span>
          <span>
            Focus: <span className="text-accent">{focus}</span>
          </span>
        </div>
        <nav className="flex flex-wrap gap-1">
          {[
            { href: "/coach", label: "Diagnosis" },
            { href: "/coach/training", label: "Scenarios" },
            { href: "/coach/practice", label: "Drill" },
            { href: "/coach/health", label: "Health" },
            { href: "/coach/manager", label: "Manager" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
