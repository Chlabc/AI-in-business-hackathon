import { AppHeader } from "@/components/AppHeader";

type AppShellProps = {
  children: React.ReactNode;
  repName?: string;
  focus?: string;
  /** Optional right-side header slot (e.g. share status) */
  headerExtra?: React.ReactNode;
  variant?: "app" | "marketing";
};

/**
 * Full-bleed coaching shell — uses the viewport width with comfortable
 * padding instead of a narrow centered column.
 */
export function AppShell({
  children,
  repName,
  focus,
  headerExtra,
  variant,
}: AppShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader repName={repName} focus={focus} variant={variant} />
      {headerExtra}
      <main className="page-enter mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-10 xl:px-12">
        {children}
      </main>
    </div>
  );
}
