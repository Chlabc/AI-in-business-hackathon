"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DayIcon, NightIcon } from "@/components/ThemeIcons";
import {
  DiagnosisIcon,
  DrillIcon,
  ManagerIcon,
  ScenariosIcon,
} from "@/components/NavIcons";
import { useTheme } from "@/components/ThemeProvider";

type AppHeaderProps = {
  repName?: string;
  focus?: string;
  /** "marketing" is the public landing page — simpler nav, no rep context, one clear CTA. */
  variant?: "app" | "marketing";
};

const NAV_LINKS = [
  { href: "/coach", label: "Diagnosis", Icon: DiagnosisIcon },
  { href: "/coach/training", label: "Scenarios", Icon: ScenariosIcon },
  { href: "/coach/practice", label: "Drill", Icon: DrillIcon },
  { href: "/coach/manager", label: "Manager", Icon: ManagerIcon },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:border-accent"
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
  );
}

export function AppHeader({
  repName = "Alex Chen",
  focus = "Fee concessions",
  variant = "app",
}: AppHeaderProps) {
  const pathname = usePathname();

  if (variant === "marketing") {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 xl:px-12">
          <span className="text-base font-semibold tracking-tight text-foreground">
            Cornerman
          </span>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#how-it-works"
              className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-accent-soft hover:text-foreground sm:inline-flex"
            >
              How it works
            </a>
            <a
              href="#build-phases"
              className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-accent-soft hover:text-foreground sm:inline-flex"
            >
              Build phases
            </a>
            <div className="mx-1 hidden h-4 w-px bg-border sm:block" />
            <ThemeToggle />
            <Link
              href="/coach"
              className="btn-lift inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg transition hover:opacity-90"
            >
              Open coach
            </Link>
          </nav>
        </div>
      </header>
    );
  }

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

        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 sm:inline-flex ${
                  i === 3 ? "md:inline-flex" : ""
                } ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-accent-soft hover:text-foreground"
                }`}
              >
                <link.Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="mx-1 hidden h-4 w-px bg-border sm:block" />
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1800px] gap-3 px-4 pb-3 text-xs text-muted sm:hidden sm:px-6 lg:px-10 xl:px-12">
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
