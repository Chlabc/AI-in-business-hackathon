import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ShareControls } from "@/components/ShareControls";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";
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
  const dash = getRepDashboard(DEMO_REP_ID);
  if (!dash) {
    return <div className="px-6 py-12 text-muted">Demo rep not found.</div>;
  }
  const { rep, firm, kpis, diagnosis, talkTrack, recentCalls } = dash;
  const attempts = await listAttempts(DEMO_REP_ID);
  const practice = practiceKpisFromAttempts(attempts);
  kpis.practice = practice;
  const share = await getShareSettings(DEMO_REP_ID);

  return (
    <AppShell repName={rep.name} focus="Fee concessions">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-coach-accent">
            Personal performance coach
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-9 text-foreground">
            Alex&apos;s coaching focus
          </h1>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-foreground">{rep.name}</span>
            {" · "}
            {rep.title} · {rep.agency} · {rep.weeksInRole} weeks
          </p>
        </div>
        <span className="rounded border border-border bg-card px-2 py-1 text-xs font-medium text-muted">
          Seeded demo data · not a live CRM
        </span>
      </div>

      <section aria-labelledby="performance-heading">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-coach-warning">
              Performance signal
            </p>
            <h2
              id="performance-heading"
              className="mt-1 text-xl font-semibold text-foreground"
            >
              One pattern needs attention
            </h2>
          </div>
          <p className="text-xs text-muted">
            Based on {kpis.callsAnalysed} analysed calls
          </p>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
          <div className="col-span-2 flex min-h-48 flex-col justify-between rounded-lg bg-coach-warning-soft p-5 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.4)] sm:p-6 lg:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <dt className="text-sm font-semibold text-foreground">
                Fee concession rate
              </dt>
              <span className="rounded border border-coach-warning/25 bg-card/70 px-2 py-1 text-xs font-semibold text-coach-warning">
                Needs attention
              </span>
            </div>
            <div className="mt-8">
              <dd className="text-5xl font-semibold leading-none tabular-nums text-foreground">
                {pct(kpis.feeConcessionRate)}
              </dd>
              <dd className="mt-3 max-w-md text-sm leading-6 text-muted">
                Fee-objection calls ending in concession. This is the clearest
                coaching priority.
              </dd>
            </div>
          </div>
          <div className="flex min-h-36 flex-col justify-between rounded-lg bg-coach-positive-soft p-4 sm:p-5 lg:col-span-2">
            <dt className="text-xs font-medium text-muted">Win rate</dt>
            <dd className="text-3xl font-semibold tabular-nums text-coach-positive">
              {pct(kpis.winRate)}
            </dd>
            <dd className="text-xs text-muted">All calls</dd>
          </div>
          <div className="col-span-1 flex min-h-36 flex-col justify-between rounded-lg border border-border bg-card p-4 sm:p-5 lg:col-span-3">
            <dt className="text-xs font-medium text-muted">Average fee</dt>
            <dd className="text-2xl font-semibold tabular-nums text-foreground">
              {pct(kpis.avgFeeAskedPct)}{" "}
              <span className="font-normal text-muted">→</span>{" "}
              <span className="text-coach-risk">
                {pct(kpis.avgFeeEndedPct)}
              </span>
            </dd>
            <dd className="text-xs text-muted">Asked → ended</dd>
          </div>
          <div className="col-span-2 flex min-h-28 items-end justify-between gap-4 rounded-lg bg-coach-ai-soft p-4 sm:p-5 lg:col-span-2 lg:min-h-36 lg:flex-col lg:items-start">
            <dt className="text-xs font-medium text-muted">Calls analysed</dt>
            <dd className="text-3xl font-semibold tabular-nums text-coach-ai">
              {kpis.callsAnalysed}
            </dd>
            <dd className="hidden text-xs text-muted lg:block">
              Seeded outcomes
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="diagnosis-heading">
        <div className="mb-5 flex items-center gap-3 text-xs font-medium text-muted">
          <span className="h-px flex-1 bg-border" />
          <span>Performance signal interpreted into a next step</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)] lg:items-stretch">
          <div className="rounded-lg bg-coach-ai-soft p-5 sm:p-8 lg:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-coach-ai text-xs font-semibold text-coach-ai-fg">
                AI
              </span>
              <div>
                <p className="text-xs font-semibold text-coach-ai">
                  AI diagnosis
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Pattern detected across recent calls
                </p>
              </div>
            </div>
            <h2
              id="diagnosis-heading"
              className="mt-6 max-w-3xl text-2xl font-semibold leading-8 text-foreground sm:text-3xl sm:leading-10"
            >
              {diagnosis.headline}
            </h2>
            <dl className="mt-7 grid gap-5 border-y border-coach-ai/15 py-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-muted">Weak stage</dt>
                <dd className="mt-1.5 text-sm font-semibold capitalize text-coach-warning">
                  {label(diagnosis.primaryStage)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">
                  Diagnosed skill
                </dt>
                <dd className="mt-1.5 text-sm font-semibold capitalize text-foreground">
                  {label(diagnosis.primaryObjection)} handling
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Confidence</dt>
                <dd className="mt-1.5 flex items-center gap-2 text-sm font-semibold capitalize text-foreground">
                  <span className="h-2 w-2 rounded-full bg-coach-positive" />
                  {diagnosis.confidence}
                </dd>
              </div>
            </dl>
            <div className="mt-8">
              <p className="text-xs font-semibold text-muted">
                Evidence behind this call
              </p>
              <ol className="mt-3 grid gap-3 sm:grid-cols-2">
                {diagnosis.evidence.slice(0, 2).map((line, index) => (
                  <li
                    key={line}
                    className="border-l-2 border-coach-ai/35 pl-4 text-sm leading-6 text-muted"
                  >
                    <span className="mb-1 block font-mono text-xs text-coach-ai">
                      0{index + 1}
                    </span>
                    {line}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="relative flex flex-col justify-between rounded-lg bg-coach-action-soft p-5 sm:p-8 lg:p-9">
            <span className="absolute -left-6 top-1/2 hidden h-px w-8 bg-coach-action/40 lg:block" />
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-coach-action text-base font-semibold text-coach-action-fg">
                  →
                </span>
                <p className="text-xs font-semibold text-coach-action">
                  Recommended coaching
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold leading-8 text-foreground">
                {talkTrack.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-muted">
                {talkTrack.approvedPlay}
              </p>
              <p className="mt-5 text-sm text-muted">
                Firm standard: {firm.standardPermFeePct}% · Fee floor:{" "}
                {firm.feeFloorPct}%
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <Link
                href="/coach/practice?scenario=price-objection"
                className="inline-flex min-h-12 w-full items-center justify-between rounded-md bg-coach-action px-5 py-3 text-sm font-semibold text-coach-action-fg shadow-[0_10px_22px_-14px_rgba(15,23,42,0.45)] transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coach-action"
              >
                <span>Start recommended drill</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/coach/training"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted transition hover:bg-card/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coach-action"
              >
                Browse all scenarios
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProgressPanel
        attempts={attempts}
        feeHoldRate={practice.feeHoldRate}
        trendLabel={practice.trendLabel}
      />

      <section
        aria-labelledby="evidence-heading"
        className="min-w-0 border-t border-border pt-6 lg:pt-8"
      >
        <p className="text-xs font-semibold text-muted">
          04 · Supporting evidence
        </p>
        <h2
          id="evidence-heading"
          className="mt-2 text-xl font-semibold leading-7 text-foreground"
        >
          What sits behind the diagnosis
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Evidence from recent losses
            </h3>
            <ol className="mt-2 divide-y divide-border">
              {diagnosis.evidence.map((line, i) => (
                <li
                  key={line}
                  className="flex gap-3 py-3 text-sm leading-6 text-muted"
                >
                  <span className="shrink-0 font-mono text-xs leading-6 text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Loss rate by stage
            </h3>
            <p className="mt-2 text-sm text-muted">
              Lost or conceded outcomes · seeded calls
            </p>
            <ul className="mt-4 space-y-4">
              {kpis.byStage.map((s) => (
                <li key={s.stage}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="capitalize text-foreground">
                      {label(s.stage)}
                      {s.stage === diagnosis.primaryStage ? (
                        <span className="ml-2 text-xs font-medium normal-case text-coach-warning">
                          Needs attention
                        </span>
                      ) : null}
                    </span>
                    <span className="font-mono tabular-nums text-foreground">
                      {pct(s.lossRate)}
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-border"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full rounded-full ${s.stage === diagnosis.primaryStage ? "bg-coach-risk" : "bg-coach-ai/45"}`}
                      style={{ width: `${Math.min(s.lossRate, 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-foreground">
            Approved talk-track
          </h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-coach-positive">Do</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                {talkTrack.anchorPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-coach-risk">Avoid</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                {talkTrack.neverDo.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <details className="mt-6 border-t border-border">
          <summary className="cursor-pointer py-4 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            Recent call outcomes{" "}
            <span className="ml-2 font-normal text-muted">
              {recentCalls.length} calls
            </span>
          </summary>
          <div
            className="overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-accent"
            role="region"
            aria-label="Recent call outcomes table"
            tabIndex={0}
          >
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted">
                <tr>
                  {[
                    "Date",
                    "Client",
                    "Stage",
                    "Objection",
                    "Outcome",
                    "Fee asked → ended",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="py-3 pr-4 font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {recentCalls.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 pr-4 font-mono text-xs text-muted">
                      {c.date}
                    </td>
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {c.client}
                    </th>
                    <td className="py-3 pr-4 capitalize">{label(c.stage)}</td>
                    <td className="py-3 pr-4 capitalize">
                      {label(c.objectionType)}
                    </td>
                    <td className="py-3 pr-4">
                      <OutcomePill outcome={c.outcome} />
                    </td>
                    <td className="py-3 font-mono text-xs text-muted">
                      {c.feeEndedPct !== null
                        ? `${c.feeAskedPct}% → ${c.feeEndedPct}%`
                        : `${c.feeAskedPct}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <ShareControls
        initialShared={share.shareProgressWithManager}
        repId={DEMO_REP_ID}
      />
    </AppShell>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    won: "bg-coach-positive-soft text-coach-positive border-coach-positive/30",
    lost: "bg-coach-risk-soft text-coach-risk border-coach-risk/30",
    conceded:
      "bg-coach-warning-soft text-coach-warning border-coach-warning/30",
    no_decision: "bg-background text-muted border-border",
  };
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-xs font-medium capitalize ${styles[outcome] ?? styles.no_decision}`}
    >
      {label(outcome)}
    </span>
  );
}
