import { AppHeader } from "@/components/AppHeader";
import { getSession } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth-types";

type AppShellProps = {
  children: React.ReactNode;
  /** Override display name focus line (optional). */
  focus?: string;
  /** Optional right-side header slot (e.g. share status) */
  headerExtra?: React.ReactNode;
  /** Force a user (tests); otherwise reads session cookie. */
  user?: SessionUser | null;
  variant?: "app" | "marketing";
};

/**
 * Full-bleed coaching shell — uses the viewport width with comfortable
 * padding instead of a narrow centered column.
 */
export async function AppShell({
  children,
  focus,
  headerExtra,
  user: userProp,
  variant,
}: AppShellProps) {
  const user = userProp === undefined ? await getSession() : userProp;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader user={user} focus={focus} variant={variant} />
      {headerExtra}
      <main className="page-enter mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-10 xl:px-12">
        {children}
      </main>
    </div>
  );
}
