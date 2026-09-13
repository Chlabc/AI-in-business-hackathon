import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ShareControls } from "@/components/ShareControls";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";
import { requireRole } from "@/lib/auth";
import { getRepDashboard } from "@/lib/diagnosis";
import { seatPrice, seatPriceFull } from "@/lib/money";
import { getShareSettings } from "@/lib/share";
import colors from "./coach.module.css";
import { EmployeeCredential } from "./EmployeeCredential";

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

  const discount =
    kpis.avgFeeAskedPct !== null && kpis.avgFeeEndedPct !== null
      ? Math.round((kpis.avgFeeAskedPct - kpis.avgFeeEndedPct) * 10) / 10
      : null;

  /** Every number gets a sentence saying what it actually means, in plain words. */
  const numbers = [
    {
      value: pct(kpis.feeConcessionRate),
      title: "Price concessions",
      meaning:
        "of the times a client pushed back on price, you lowered it rather than defending it",
      isProblem: true,
    },
    {
      value: seatPrice(discount),
      title: "Average seat discount",
      meaning: `the average amount you knock off each seat — you ask ${seatPriceFull(kpis.avgFeeAskedPct)} and settle at ${seatPrice(kpis.avgFeeEndedPct)}`,
      isProblem: true,
    },
    {
      value: pct(kpis.winRate),
      title: "Win rate",
      meaning: "of all your calls ended in a win",
      isProblem: false,
    },
  ];

  return (
    <AppShell focus="Price concessions">
      <OnboardingBanner className={colors.onboarding} />

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
      <section className={`surface-card rounded-xl border-l-4 border-l-danger p-6 lg:p-8 ${colors.verdict}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-danger">
          The pattern costing you deals
        </p>
        <h2 className="display-serif mt-3 max-w-4xl text-3xl leading-snug text-foreground lg:text-4xl">
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
            className="btn-lift inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-lg font-semibold text-accent-fg transition hover:opacity-90"
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

      {/* ── Rep context and performance, with unchanged KPI data ─────── */}
      <section className={colors.profilePerformance}>
        <EmployeeCredential
          agency={rep.agency}
          name={rep.name}
          role={rep.title}
          weeksInRole={rep.weeksInRole}
          weakestStage={label(diagnosis.primaryStage)}
          attemptCount={attempts.length}
        />
        <div className={colors.performancePanel}>
          <h2 className="text-xl font-semibold text-foreground">
            Your performance snapshot
          </h2>
          <div className={colors.performanceMetrics}>
            {numbers.map((n) => (
              <div key={n.meaning} className={`${colors.metricBlock} ${n.isProblem ? colors.metricProblem : ""}`}>
                <p className="text-xs font-medium text-muted">{n.title}</p>
                <p className={`mt-2 text-3xl font-semibold ${n.isProblem ? "text-warn" : "text-foreground"}`}>
                  {n.value}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted">{n.meaning}</p>
                {n.isProblem ? (
                  <p className="mt-2 text-xs font-medium text-warn">← this is the one to fix</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What good looks like, straight from the firm's playbook ──── */}
      <section className={colors.guidance}>
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">What to do next</h2>
        <p className="mt-2 text-sm text-muted">What your firm says to do here</p>
        <h3 className="display-serif mt-6 max-w-3xl text-2xl leading-snug text-accent sm:text-3xl">
          {talkTrack.title}
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground">
          {talkTrack.approvedPlay}
        </p>
        <dl className={colors.pricing}>
          <div>
            <dt className="text-sm text-muted">List price</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {seatPriceFull(firm.standardPermFeePct)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Approval floor</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {seatPriceFull(firm.feeFloorPct)}
            </dd>
            <p className="mt-1 text-xs text-muted">You must not go below this without approval.</p>
          </div>
        </dl>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className={colors.approved}>
            <p className="text-base font-semibold text-ok">
              Do this
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
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
          <div className={colors.avoid}>
            <p className="text-base font-semibold text-danger">
              Never do this
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
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
      <div className="mt-3 grid items-start gap-8 lg:grid-cols-2">
        <section className="surface-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground">Where you struggle</h2>
          <p className="mt-1 text-sm text-muted">Which part of the call goes wrong</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            A sales call has five stages. This is how often each one ends badly
            for you — a longer red bar is a worse stage.
          </p>
          <ul className="mt-4 space-y-2.5">
            {kpis.byStage.map((s) => (
              <li key={s.stage} className={`flex items-center gap-3 text-sm ${s.stage === diagnosis.primaryStage ? colors.weakestStage : colors.otherStage}`}>
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
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Everything goes wrong in one place:{" "}
            <strong className="font-medium text-foreground">
              {label(diagnosis.primaryStage)}
            </strong>
            . The other four stages are fine — that&apos;s why there&apos;s only
            one thing to practise.
          </p>
        </section>

        <ProgressPanel
          className={colors.progress}
          heading="Are you improving?"
          attempts={attempts}
          feeHoldRate={practice.feeHoldRate}
          trendLabel={practice.trendLabel}
        />
      </div>

      <section className={colors.secondary}>
        <h2 className="text-base font-medium text-muted">Secondary information</h2>
        <ShareControls
          className={colors.sharing}
          initialShared={share.shareProgressWithManager}
          repId={repId}
        />

        {/* ── The raw data, available but not shouting ─────────────────── */}
        <details className={`surface-card rounded-xl p-6 ${colors.rawCalls}`}>
          <summary className="cursor-pointer text-sm font-medium text-muted transition hover:text-foreground">
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
                  <th className="pb-2 font-medium">Price per seat</th>
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
                        ? `${seatPrice(c.feeAskedPct)} → ${seatPrice(c.feeEndedPct)}`
                        : seatPrice(c.feeAskedPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
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
