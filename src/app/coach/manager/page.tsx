import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DEMO_REP_ID, getRep } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";
import { getShareSettings } from "@/lib/share";

export const dynamic = "force-dynamic";

export default async function ManagerPage() {
  const rep = getRep(DEMO_REP_ID);
  const share = await getShareSettings(DEMO_REP_ID);
  const attempts = await listAttempts(DEMO_REP_ID);
  const practice = practiceKpisFromAttempts(attempts);

  return (
    <AppShell repName={rep?.name} focus="Team progress">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/coach" className="text-sm text-muted hover:text-accent">
          ← Back to coach
        </Link>
        <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
          Manager view · no raw transcripts
        </span>
      </div>

      <div>
        <p className="eyebrow">Manager</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          {rep?.name ?? "Rep"} — shared progress
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted lg:text-base">
          Development tool, not surveillance. You only see what the rep chose to
          share — aggregate improvement, never practice audio or full
          transcripts.
        </p>
      </div>

      {!share.shareProgressWithManager ? (
        <section className="surface-card rounded-xl border-accent/30 bg-accent-soft p-8">
          <h2 className="text-lg font-semibold text-foreground">
            Access blocked
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {rep?.name ?? "This rep"} has not shared progress. Ask them to
            enable sharing from their coach dashboard — or respect that practice
            stays private.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="surface-card rounded-xl p-6 xl:col-span-1">
            <p className="text-xs uppercase tracking-wider text-muted">
              Attempts shared
            </p>
            <p className="mt-2 text-4xl font-semibold">{practice.attempts}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted">
              Last score
            </p>
            <p className="mt-2 text-4xl font-semibold">
              {practice.lastScore ?? "—"}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted">
              Fee-hold rate
            </p>
            <p className="mt-2 text-4xl font-semibold">
              {practice.feeHoldRate === null
                ? "—"
                : `${practice.feeHoldRate}%`}
            </p>
          </div>

          <div className="surface-card rounded-xl p-6 xl:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Trend (scores only)
            </h2>
            <p className="mt-2 text-sm text-muted">{practice.trendLabel}</p>
            <ul className="mt-6 divide-y divide-border">
              {attempts.length === 0 ? (
                <li className="py-3 text-sm text-muted">No attempts yet.</li>
              ) : (
                attempts.map((a, i) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                  >
                    <span className="text-muted">
                      Attempt {attempts.length - i} ·{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-foreground">
                      Score {a.score.overall}
                      <span
                        className={`ml-3 rounded border px-2 py-0.5 text-xs ${
                          a.score.heldFee
                            ? "border-ok/30 bg-ok-soft text-ok"
                            : "border-accent/30 bg-accent-soft text-accent"
                        }`}
                      >
                        {a.score.heldFee ? "Held" : "Softened"}
                      </span>
                    </span>
                  </li>
                ))
              )}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Shared at {new Date(share.updatedAt).toLocaleString()}. Transcripts
              intentionally omitted.
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
