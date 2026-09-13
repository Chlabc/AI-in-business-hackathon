import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ShareControls } from "@/components/ShareControls";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";
import { requireRole } from "@/lib/auth";
import { getRepDashboard } from "@/lib/diagnosis";
import { getShareSettings } from "@/lib/share";

export const dynamic = "force-dynamic";

function pct(n: number | null | undefined, fallback = "—") {
  if (n === null || n === undefined) return fallback;
  return `${n}%`;
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default async function CoachPage() {
  const user = await requireRole("employee");
  const repId = user.repId ?? DEMO_REP_ID;
  const dash = getRepDashboard(repId);

  if (!dash) {
    return <div className="px-6 py-12 text-muted">Demo rep not found.</div>;
  }

  const { rep, firm, kpis, diagnosis, talkTrack, recentCalls } = dash;
  const attempts = await listAttempts(repId);
  const practice = practiceKpisFromAttempts(attempts);
  kpis.practice = practice;
  const share = await getShareSettings(repId);

  /** Every number gets a sentence saying what it actually means. */
  const numbers = [
    {
      value: pct(kpis.feeConcessionRate),
      meaning: "of your price conversations ended with you dropping the price",
      isProblem: true,
    },
    {
      value: pct(kpis.winRate),
      meaning: "of all your calls ended in a win",
      isProblem: false,
    },
    {
      value: `${pct(kpis.avgFeeAskedPct)} → ${pct(kpis.avgFeeEndedPct)}`,
      meaning: `you open at ${pct(kpis.avgFeeAskedPct)} and settle at ${pct(kpis.avgFeeEndedPct)} on average (firm floor is ${firm.feeFloorPct}%)`,
      isProblem: false,
    },
  ];

  return (
    <AppShell focus="Price concessions">
      <OnboardingBanner />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Your diagnosis</p>
          <h1 className="display-serif mt-2 text-3xl text-foreground lg:text-4xl">
            Where you&apos;re losing deals
          </h1>
          <p className="mt-2 text-sm text-muted">
            {user.name} · {rep.title} at {rep.agency} · {rep.weeksInRole} weeks in
            role
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/coach/value"
            className="rounded border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent transition hover:opacity-90"
          >
            Value / evidence →
          </Link>
          <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
            Seeded demo data · not a live CRM
          </span>
        </div>
      </div>

      {/* ── The verdict, and the one thing to do about it ───────────── */}
      <section className="surface-card rounded-xl border-l-4 border-l-danger p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-danger">
          The pattern costing you deals
        </p>
        <h2 className="display-serif mt-3 max-w-4xl text-2xl leading-snug text-foreground lg:text-3xl">
          {diagnosis.headline}
        </h2>
        <p className="mt-3 text-sm text-muted">
          Found across{" "}
          <strong className="font-medium text-foreground">
            {kpis.callsAnalysed} calls
          </strong>
          , with {diagnosis.confidence} confidence. It shows up most in the{" "}
          <strong className="font-medium text-foreground">
            {label(diagnosis.primaryStage)}
          </strong>{" "}
          part of the conversation.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/coach/practice?scenario=price-objection"
            className="btn-lift inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-accent-fg transition hover:opacity-90"
          >
            Practice this now
          </Link>
          <Link
            href="/coach/training"
            className="text-sm font-medium text-muted transition hover:text-accent"
          >
            Or pick a different scenario →
          </Link>
        </div>
      </section>

      {/* ── Why we think that ───────────────────────────────────────── */}
      <section className="surface-card rounded-xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Why we think that — {diagnosis.evidence.length} recent losses
        </h2>
        <ol className="mt-4 space-y-3">
          {diagnosis.evidence.map((line, i) => (
            <li key={line} className="flex gap-3 text-sm text-foreground">
              <span className="mt-0.5 font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The numbers, each with a plain-English meaning ───────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Your numbers
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {numbers.map((n) => (
            <div
              key={n.meaning}
              className={`surface-card rounded-xl p-5 ${n.isProblem ? "border-warn/40 bg-warn-soft" : ""
                }`}
            >
              <p
                className={`text-3xl font-semibold ${n.isProblem ? "text-warn" : "text-foreground"
                  }`}
              >
                {n.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {n.meaning}
              </p>
              {n.isProblem ? (
                <p className="mt-2 text-xs font-medium text-warn">
                  ← this is the one to fix
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ── What good looks like, straight from the firm's playbook ──── */}
      <section className="surface-card rounded-xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          What your firm says to do here
        </h2>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          {talkTrack.title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          {talkTrack.approvedPlay}
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ok">
              Do this
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground">
              {talkTrack.anchorPoints.map((p) => (
                <li key={p} className="flex gap-2 leading-relaxed">
                  <span aria-hidden className="text-ok">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-danger">
              Never do this
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground">
              {talkTrack.neverDo.map((p) => (
                <li key={p} className="flex gap-2 leading-relaxed">
                  <span aria-hidden className="text-danger">
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Where it breaks down + your practice so far ──────────────── */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="surface-card rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Where the conversation breaks down
          </h2>
          <p className="mt-1 text-sm text-muted">
            Share of calls at each stage that ended lost or conceded.
          </p>
          <ul className="mt-4 space-y-2.5">
            {kpis.byStage.map((s) => (
              <li key={s.stage} className="flex items-center gap-3 text-sm">
                <span className="w-24 capitalize text-foreground">
                  {label(s.stage)}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-danger"
                    style={{ width: `${Math.min(s.lossRate, 100)}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-muted">
                  {pct(s.lossRate)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <ProgressPanel
          attempts={attempts}
          feeHoldRate={practice.feeHoldRate}
          trendLabel={practice.trendLabel}
        />
      </div>

      <ShareControls
        initialShared={share.shareProgressWithManager}
        repId={repId}
      />

      {/* ── The raw data, available but not shouting ─────────────────── */}
      <details className="surface-card rounded-xl p-6">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted transition hover:text-foreground">
          See all {recentCalls.length} calls we analysed
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="pb-2 pr-3 font-medium">Date</th>
                <th className="pb-2 pr-3 font-medium">Client</th>
                <th className="pb-2 pr-3 font-medium">Stage</th>
                <th className="pb-2 pr-3 font-medium">Objection</th>
                <th className="pb-2 pr-3 font-medium">Outcome</th>
                <th className="pb-2 font-medium">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {recentCalls.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted">
                    {c.date}
                  </td>
                  <td className="py-2.5 pr-3">{c.client}</td>
                  <td className="py-2.5 pr-3 capitalize">{label(c.stage)}</td>
                  <td className="py-2.5 pr-3 capitalize">
                    {label(c.objectionType)}
                  </td>
                  <td className="py-2.5 pr-3">
                    <OutcomePill outcome={c.outcome} />
                  </td>
                  <td className="py-2.5 font-mono text-xs text-muted">
                    {c.feeEndedPct !== null
                      ? `${c.feeAskedPct}→${c.feeEndedPct}%`
                      : `${c.feeAskedPct}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </AppShell>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    won: "bg-ok-soft text-ok border-ok/30",
    lost: "bg-danger-soft text-danger border-danger/30",
    conceded: "bg-warn-soft text-warn border-warn/30",
    no_decision: "bg-background text-muted border-border",
  };
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-xs capitalize ${styles[outcome] ?? styles.no_decision}`}
    >
      {label(outcome)}
    </span>
  );
}
