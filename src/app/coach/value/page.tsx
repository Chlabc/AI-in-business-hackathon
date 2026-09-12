import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts } from "@/lib/attempts";
import { getSession } from "@/lib/auth";
import {
  beforeAfterFromAttempts,
  DEFAULT_USER_TEST_SESSIONS,
  USER_TEST_PROTOCOL,
} from "@/lib/value-evidence";

export const dynamic = "force-dynamic";

export default async function ValuePage() {
  const user = await getSession();
  const repId = user?.repId ?? DEMO_REP_ID;
  const attempts = await listAttempts(repId);
  const evidence = beforeAfterFromAttempts(attempts);
  const sessions = DEFAULT_USER_TEST_SESSIONS;

  return (
    <AppShell focus="Value evidence">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Phase 6 · User tests &amp; value</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            Evidence for judges
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted lg:text-base">
            Before/after on the drilled behaviour, a semi-quantified ROI blurb
            grounded in practice scores (never invented pipeline conversion),
            and a labeled user-test log you can replace with live quotes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/coach/practice"
            className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg"
          >
            Run a drill
          </Link>
          <Link
            href="/coach"
            className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm text-muted hover:text-foreground"
          >
            Diagnosis
          </Link>
        </div>
      </div>

      <section className="surface-card rounded-xl p-5 sm:p-6">
        <p className="eyebrow">ROI blurb (practice-grounded)</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          What we can claim
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {evidence.roiBlurb}
        </p>
        <p className="mt-3 text-xs text-muted">
          Rule: no invented win-rate or revenue %. Only hold rate, score delta,
          and quotes.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Scored attempts",
            value: String(evidence.attemptCount),
          },
          {
            label: "First → latest score",
            value:
              evidence.firstScore === null
                ? "—"
                : `${evidence.firstScore} → ${evidence.latestScore}`,
          },
          {
            label: "Early → late hold %",
            value:
              evidence.holdRateEarlyPct === null
                ? "—"
                : `${evidence.holdRateEarlyPct}% → ${evidence.holdRateLatePct}%`,
          },
          {
            label: "First → latest hold",
            value:
              evidence.firstHeld === null
                ? "—"
                : `${evidence.firstHeld ? "Held" : "Softened"} → ${
                    evidence.latestHeld ? "Held" : "Softened"
                  }`,
          },
        ].map((c) => (
          <div key={c.label} className="surface-card rounded-xl px-4 py-4">
            <p className="text-xs uppercase tracking-wider text-muted">
              {c.label}
            </p>
            <p className="mt-2 text-xl font-semibold text-foreground">
              {c.value}
            </p>
          </div>
        ))}
      </section>

      <p className="text-sm text-muted">{evidence.summaryLine}</p>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface-card rounded-xl p-5 sm:p-6">
          <p className="eyebrow">Protocol</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            How to run 3–5 user tests
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {USER_TEST_PROTOCOL.map((step) => (
              <li key={step}>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card rounded-xl p-5 sm:p-6">
          <p className="eyebrow">User-test log</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Sessions ({sessions.length})
          </h2>
          <p className="mt-2 text-xs text-muted">
            Rows marked <strong className="text-foreground">demo_labeled</strong>{" "}
            are pitch templates — swap in live quotes after real tests.
          </p>
          <div className="mt-4 space-y-3">
            {sessions.map((s) => (
              <article
                key={s.id}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {s.participant}{" "}
                    <span className="font-normal text-muted">· {s.role}</span>
                  </p>
                  <span className="rounded border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                    {s.source} · {s.date}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  <span className="font-semibold text-foreground">Before: </span>
                  {s.beforeNote}
                </p>
                <p className="mt-1 text-xs text-muted">
                  <span className="font-semibold text-foreground">After: </span>
                  {s.afterNote}
                </p>
                <p className="mt-2 text-sm italic text-foreground">
                  “{s.quote}”
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
