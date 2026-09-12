"use client";

import { useRole } from "@/components/RoleProvider";

/**
 * Shown when you're viewing a side of the product your current demo role
 * wouldn't normally see — so the rep/manager split is legible, not implied.
 */
export function RoleNotice({ side }: { side: "rep" | "manager" }) {
  const { role, setRole } = useRole();
  if (role === side) return null;

  const copy =
    side === "manager"
      ? {
          title: "You're a rep, looking at the manager's side",
          body: "This is everything your manager can see — a progress summary, and only if you've turned sharing on. Never your transcripts.",
          action: "Switch to manager",
        }
      : {
          title: "You're a manager, looking at the rep's side",
          body: "A manager wouldn't normally see this. Reps own their practice; you only get the summary they choose to share.",
          action: "Switch back to rep",
        };

  return (
    <div className="rounded-xl border border-warn/40 bg-warn-soft p-4">
      <p className="text-sm font-semibold text-warn">{copy.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{copy.body}</p>
      <button
        type="button"
        onClick={() => setRole(side)}
        className="mt-3 rounded-md border border-warn/40 bg-card px-3 py-1.5 text-xs font-medium text-warn transition hover:bg-warn-soft"
      >
        {copy.action}
      </button>
    </div>
  );
}
