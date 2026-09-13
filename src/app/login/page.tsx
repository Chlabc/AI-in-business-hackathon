"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { DEMO_ACCOUNTS } from "@/data/users";
import type { Role } from "@/lib/auth-types";

const SIDES: { role: Role; title: string; body: string }[] = [
  {
    role: "employee",
    title: "I'm a rep",
    body: "See what you keep losing, then practise it out loud against an AI client.",
  },
  {
    role: "manager",
    title: "I'm a manager",
    body: "See team progress and edit the playbook. You never see anyone's transcripts.",
  },
];

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(payload: { email?: string; name?: string; role?: Role }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not sign you in.");
        return;
      }
      const next = search.get("next");
      router.replace(next && next.startsWith("/") ? next : (data.redirectTo ?? "/coach"));
      router.refresh();
    } catch {
      setError("Could not reach the server. Is the app still running?");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submit({ name: name.trim(), role });
  }

  return (
    <div className="w-full max-w-lg">
      <div className="surface-card rounded-2xl p-7 sm:p-9">
        <p className="eyebrow">Welcome to Cornerman</p>
        <h1 className="display-serif mt-2 text-3xl text-foreground">
          Who&apos;s practising?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No password — this is a demo. Type a name and pick a side.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Your name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Huey"
              maxLength={40}
              autoComplete="name"
              className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-foreground">
              Which side are you on?
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {SIDES.map((s) => {
                const active = role === s.role;
                return (
                  <button
                    key={s.role}
                    type="button"
                    onClick={() => setRole(s.role)}
                    aria-pressed={active}
                    className={`rounded-lg border p-4 text-left transition ${
                      active
                        ? "border-accent bg-accent-soft ring-2 ring-accent/25"
                        : "border-border bg-background hover:border-accent/50"
                    }`}
                  >
                    <span
                      className={`block text-sm font-semibold ${active ? "text-accent" : "text-foreground"}`}
                    >
                      {s.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {s.body}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-lift inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-accent-fg transition hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Signing you in…"
              : name.trim()
                ? `Start practising as ${name.trim()} ›`
                : "Start practising ›"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted">
            or use a demo account
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              disabled={loading}
              onClick={() => void submit({ email: a.email })}
              className="rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition hover:border-accent disabled:opacity-60"
            >
              <span className="block font-medium text-foreground">
                {a.fillLabel}
              </span>
              <span className="mt-0.5 block font-mono text-xs text-muted">
                {a.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="transition hover:text-accent">
          ← Back to the home page
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4 py-12">
      <Suspense
        fallback={<div className="text-sm text-muted">Loading…</div>}
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
