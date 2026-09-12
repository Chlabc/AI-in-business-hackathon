"use client";

import Link from "next/link";
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
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
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
            href="/coach/practice"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline"
          >
            Drill
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent"
            aria-label="Toggle day and night mode"
          >
            {theme === "light" ? "Night" : "Day"}
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-5xl gap-3 px-6 pb-3 text-xs text-muted sm:hidden">
        <span>
          Rep: <span className="text-foreground">{repName}</span>
        </span>
        <span>·</span>
        <span>
          Focus: <span className="text-accent">{focus}</span>
        </span>
      </div>
    </header>
  );
}
