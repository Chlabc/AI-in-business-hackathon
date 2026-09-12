import type { Role } from "@/lib/auth-types";

/** Nav links allowed for a role (desktop + mobile). Safe for client components. */
export function navForRole(
  role: Role | null,
): { href: string; label: string }[] {
  if (role === "employee") {
    return [
      { href: "/coach", label: "Diagnosis" },
      { href: "/coach/learn", label: "Learn" },
      { href: "/coach/training", label: "Scenarios" },
      { href: "/coach/practice", label: "Drill" },
      { href: "/coach/value", label: "Value" },
    ];
  }
  if (role === "manager") {
    return [
      { href: "/coach/manager", label: "Manager" },
      { href: "/coach/playbook", label: "Playbook" },
      { href: "/coach/health", label: "Health" },
      { href: "/coach/value", label: "Value" },
    ];
  }
  return [{ href: "/login", label: "Sign in" }];
}
