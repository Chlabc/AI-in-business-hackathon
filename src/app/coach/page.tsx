import Link from "next/link";
import { DEMO_REP_ID } from "@/data/seed";
import { getRepDashboard } from "@/lib/diagnosis";

function pct(n: number | null | undefined, fallback = "—") {
  if (n === null || n === undefined) return fallback;
  return `${n}%`;
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function CoachPage() {
  const dash = getRepDashboard(DEMO_REP_ID);

  if (!dash) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-zinc-400">
        Demo rep not found. Check seed data.
      </div>
    );
  }

  const { rep, firm, kpis, diagnosis, talkTrack, recentCalls } = dash;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-amber-400"
        >
          ← Cornerman
        </Link>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          Seeded demo data · not a live CRM
        </span>
      </div>

      <header className="flex flex-col gap-2 border-b border-zinc-800 pb-6">
        <p className="text-sm text-zinc-500">
          {rep.title} · {rep.agency} · {rep.weeksInRole} weeks in role
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          {rep.name}&apos;s coach
        </h1>
        <p className="max-w-2xl text-sm text-zinc-400">
          Practice is the product. KPIs show where you&apos;re leaking deals and
          whether drills move the needle — private to you unless you share
          progress.
        </p>
      </header>

      {/* KPI strip */}
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
            className={`rounded-2xl border px-4 py-4 ${
              card.warn
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-50">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      {/* Diagnosis hero */}
      <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-zinc-900/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
            Diagnosis
          </p>
          <span className="rounded-full border border-zinc-600 px-2 py-0.5 text-xs text-zinc-400">
            confidence {diagnosis.confidence}
          </span>
        </div>
        <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-snug text-zinc-50 sm:text-3xl">
          {diagnosis.headline}
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          Weak spot:{" "}
          <span className="text-zinc-200">
            {label(diagnosis.primaryStage)} stage ·{" "}
            {label(diagnosis.primaryObjection)} objection
          </span>{" "}
          · firm standard fee {firm.standardPermFeePct}% (floor{" "}
          {firm.feeFloorPct}%)
        </p>

        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Evidence from your calls
          </h3>
          <ul className="mt-3 space-y-2">
            {diagnosis.evidence.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/coach/practice"
            className="inline-flex h-11 items-center justify-center rounded-full bg-amber-500 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            Start fee-objection drill
          </Link>
          <span className="inline-flex h-11 items-center text-sm text-zinc-500">
            Voice roleplay arrives in Phase 2
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Approved talk-track */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Approved talk-track
          </h2>
          <h3 className="mt-2 text-lg font-semibold text-zinc-100">
            {talkTrack.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {talkTrack.approvedPlay}
          </p>
          <div className="mt-4">
            <p className="text-xs font-semibold text-emerald-400/90">Do</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-400">
              {talkTrack.anchorPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-rose-400/90">Never</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-400">
              {talkTrack.neverDo.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Practice KPIs + stage breakdown */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Practice KPIs
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {kpis.practice.trendLabel}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-zinc-950/60 py-3">
                <dt className="text-xs text-zinc-500">Attempts</dt>
                <dd className="mt-1 text-xl font-semibold">
                  {kpis.practice.attempts}
                </dd>
              </div>
              <div className="rounded-xl bg-zinc-950/60 py-3">
                <dt className="text-xs text-zinc-500">Last score</dt>
                <dd className="mt-1 text-xl font-semibold">
                  {kpis.practice.lastScore ?? "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-zinc-950/60 py-3">
                <dt className="text-xs text-zinc-500">Fee hold</dt>
                <dd className="mt-1 text-xl font-semibold">
                  {pct(kpis.practice.feeHoldRate)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Loss rate by stage
            </h2>
            <ul className="mt-4 space-y-2">
              {kpis.byStage.map((s) => (
                <li key={s.stage} className="flex items-center gap-3 text-sm">
                  <span className="w-24 capitalize text-zinc-300">
                    {label(s.stage)}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-amber-500/80"
                      style={{ width: `${Math.min(s.lossRate, 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-zinc-400">
                    {pct(s.lossRate)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Recent calls */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Recent call outcomes
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-2 pr-3 font-medium">Date</th>
                <th className="pb-2 pr-3 font-medium">Client</th>
                <th className="pb-2 pr-3 font-medium">Stage</th>
                <th className="pb-2 pr-3 font-medium">Objection</th>
                <th className="pb-2 pr-3 font-medium">Outcome</th>
                <th className="pb-2 font-medium">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {recentCalls.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 pr-3 font-mono text-xs text-zinc-500">
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
                  <td className="py-2.5 font-mono text-xs">
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
    </div>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    lost: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    conceded: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    no_decision: "bg-zinc-700/40 text-zinc-300 border-zinc-600",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs capitalize ${styles[outcome] ?? styles.no_decision}`}
    >
      {label(outcome)}
    </span>
  );
}
