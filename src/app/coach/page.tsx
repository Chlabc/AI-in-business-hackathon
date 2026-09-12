import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";
import { getRepDashboard } from "@/lib/diagnosis";

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
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-muted">
        Demo rep not found. Check seed data.
      </div>
    );
  }

  const { rep, firm, kpis, diagnosis, talkTrack, recentCalls } = dash;
  const practice = practiceKpisFromAttempts(await listAttempts(DEMO_REP_ID));
  kpis.practice = practice;

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader repName={rep.name} focus="Fee concessions" />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted">
              {rep.title} · {rep.agency} · {rep.weeksInRole} weeks in role
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Performance breakdown
            </h1>
          </div>
          <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
            Seeded demo data · not a live CRM
          </span>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Calls analysed", value: String(kpis.callsAnalysed) },
            { label: "Win rate", value: pct(kpis.winRate) },
            {
              label: "Fee concession rate",
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

        {/* Editorial diagnosis */}
        <section className="surface-card overflow-hidden rounded-xl">
          <div className="border-b border-border px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">1 · Diagnosis</p>
              <span className="rounded border border-border px-2 py-0.5 text-xs text-muted">
                confidence {diagnosis.confidence}
              </span>
            </div>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
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

          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
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
            <div className="bg-accent-soft/60 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Prescribed drill
              </h3>
              <p className="mt-3 text-sm font-medium text-foreground">
                {talkTrack.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {talkTrack.approvedPlay}
              </p>
              <Link
                href="/coach/practice"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
              >
                Start fee-objection drill
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="surface-card rounded-xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Approved talk-track
            </h2>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              {talkTrack.title}
            </h3>
            <div className="mt-4">
              <p className="text-xs font-semibold text-ok">Do</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                {talkTrack.anchorPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-danger">Never</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                {talkTrack.neverDo.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="surface-card rounded-xl p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Practice KPIs
              </h2>
              <p className="mt-2 text-sm text-muted">{kpis.practice.trendLabel}</p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border bg-background py-3">
                  <dt className="text-xs text-muted">Attempts</dt>
                  <dd className="mt-1 text-xl font-semibold">
                    {kpis.practice.attempts}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-background py-3">
                  <dt className="text-xs text-muted">Last score</dt>
                  <dd className="mt-1 text-xl font-semibold">
                    {kpis.practice.lastScore ?? "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-background py-3">
                  <dt className="text-xs text-muted">Fee hold</dt>
                  <dd className="mt-1 text-xl font-semibold">
                    {pct(kpis.practice.feeHoldRate)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="surface-card rounded-xl p-6">
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
            </div>
          </section>
        </div>

        <section className="surface-card rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Recent call outcomes
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
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
      </main>
    </div>
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
