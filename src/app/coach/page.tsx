import Link from "next/link";
import { AppShell } from "@/components/AppShell";
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
    return (
      <div className="px-6 py-12 text-muted">Demo rep not found.</div>
    );
  }

  const { rep, firm, kpis, diagnosis, talkTrack, recentCalls } = dash;
  const attempts = await listAttempts(repId);
  const practice = practiceKpisFromAttempts(attempts);
  kpis.practice = practice;
  const share = await getShareSettings(repId);

  return (
    <AppShell focus="Price concessions">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            {rep.title} · {rep.agency} · {rep.weeksInRole} weeks in role
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            Performance breakdown
          </h1>
        </div>
        <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
          Seeded demo data · not a live CRM
        </span>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Calls analysed", value: String(kpis.callsAnalysed) },
          { label: "Win rate", value: pct(kpis.winRate) },
          {
            label: "Price concession rate",
            value: pct(kpis.feeConcessionRate),
            warn: true,
          },
          {
            label: "Avg fee asked → ended",
            value: `${pct(kpis.avgFeeAskedPct)} → ${pct(kpis.avgFeeEndedPct)}`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`surface-card rounded-xl px-4 py-4 ${
              card.warn ? "border-accent/40 bg-accent-soft" : ""
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-muted">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      {/* Wide two-column: diagnosis + progress */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="surface-card overflow-hidden rounded-xl">
          <div className="border-b border-border px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">1 · Diagnosis</p>
              <span className="rounded border border-border px-2 py-0.5 text-xs text-muted">
                confidence {diagnosis.confidence}
              </span>
            </div>
            <h2 className="mt-3 max-w-4xl text-2xl font-semibold leading-snug tracking-tight text-foreground lg:text-3xl">
              {diagnosis.headline}
            </h2>
            <p className="mt-3 text-sm text-muted">
              Weak spot:{" "}
              <span className="font-medium text-foreground">
                {label(diagnosis.primaryStage)} stage ·{" "}
                {label(diagnosis.primaryObjection)} objection
              </span>
              {" · "}
              firm standard {firm.standardPermFeePct}% (floor {firm.feeFloorPct}
              %)
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Evidence from recent losses
              </h3>
              <ol className="mt-4 space-y-3">
                {diagnosis.evidence.map((line, i) => (
                  <li key={line} className="flex gap-3 text-sm text-foreground">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-accent-soft/60 p-6 lg:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Prescribed drill
              </h3>
              <p className="mt-3 text-sm font-medium text-foreground">
                {talkTrack.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {talkTrack.approvedPlay}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/coach/practice?scenario=price-objection"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
                >
                  Start fee drill
                </Link>
                <Link
                  href="/coach/training"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:border-accent"
                >
                  All scenarios
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <ProgressPanel
            attempts={attempts}
            feeHoldRate={practice.feeHoldRate}
            trendLabel={practice.trendLabel}
          />
          <ShareControls
            initialShared={share.shareProgressWithManager}
            repId={repId}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Approved talk-track
          </h2>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            {talkTrack.title}
          </h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-ok">Do</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                {talkTrack.anchorPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-danger">Never</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                {talkTrack.neverDo.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="surface-card rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Loss rate by stage
          </h2>
          <ul className="mt-4 space-y-2">
            {kpis.byStage.map((s) => (
              <li key={s.stage} className="flex items-center gap-3 text-sm">
                <span className="w-24 capitalize text-foreground">
                  {label(s.stage)}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min(s.lossRate, 100)}%` }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-muted">
                  {pct(s.lossRate)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="surface-card rounded-xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Recent call outcomes
        </h2>
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
      </section>
    </AppShell>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    won: "bg-ok-soft text-ok border-ok/30",
    lost: "bg-danger-soft text-danger border-danger/30",
    conceded: "bg-accent-soft text-accent border-accent/30",
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
