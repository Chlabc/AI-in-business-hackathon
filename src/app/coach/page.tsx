import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoPremise } from "@/components/DemoPremise";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ShareControls } from "@/components/ShareControls";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";
import { requireRole } from "@/lib/auth";
import { getRepDashboard } from "@/lib/diagnosis";
import { seatPrice, seatPriceFull } from "@/lib/money";
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

  const { firm, kpis, diagnosis, talkTrack, recentCalls } = dash;
  const attempts = await listAttempts(repId);
  const practice = practiceKpisFromAttempts(attempts);
  kpis.practice = practice;
  const share = await getShareSettings(repId);

  const discount =
    kpis.avgFeeAskedPct !== null && kpis.avgFeeEndedPct !== null
      ? Math.round((kpis.avgFeeAskedPct - kpis.avgFeeEndedPct) * 100) / 100
      : null;

  return (
    <AppShell focus="Price concessions">
      {/* ── Step 1: what am I looking at ─────────────────────────────── */}
      <div>
        <p className="eyebrow">Step 1 of 3 · Your diagnosis</p>
        <h1 className="display-serif mt-2 text-3xl text-foreground lg:text-4xl">
          Where you&apos;re losing deals
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted lg:text-base">
          We read your last {kpis.callsAnalysed} sales calls and looked for the
          one habit that costs you the most. Here it is.
        </p>
      </div>

      <DemoPremise name={user.name} />

      {/* ── Step 2: the verdict, and the single thing to do ──────────── */}
      <section className="surface-card rounded-xl border-l-4 border-l-danger p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-danger">
          The habit costing you deals
        </p>
        <h2 className="display-serif mt-3 max-w-4xl text-2xl leading-snug text-foreground lg:text-3xl">
          {diagnosis.headline}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          On average you ask for{" "}
          <strong className="font-medium text-foreground">
            {seatPriceFull(kpis.avgFeeAskedPct)}
          </strong>{" "}
          and settle at{" "}
          <strong className="font-medium text-foreground">
            {seatPrice(kpis.avgFeeEndedPct)}
          </strong>{" "}
          — about{" "}
          <strong className="font-medium text-warn">{seatPrice(discount)}</strong>{" "}
          given away per seat, every time.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href="/coach/practice?scenario=price-objection"
            className="btn-lift inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-accent-fg transition hover:opacity-90"
          >
            Practise this now →
          </Link>
          <Link
            href="/coach/training"
            className="text-sm font-medium text-muted transition hover:text-accent"
          >
            Or pick a different situation
          </Link>
        </div>
      </section>

      {/* ── The proof ────────────────────────────────────────────────── */}
      <section className="surface-card rounded-xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          The {diagnosis.evidence.length} calls that show it
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

      {/* ── What good looks like ─────────────────────────────────────── */}
      <section className="surface-card rounded-xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          What {firm.name} says to do instead
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

      {/* ── Practice so far ──────────────────────────────────────────── */}
      {attempts.length > 0 ? (
        <ProgressPanel
          attempts={attempts}
          feeHoldRate={practice.feeHoldRate}
          trendLabel={practice.trendLabel}
        />
      ) : null}

      {/* ── Everything else, folded away. The page used to open with ten
             sections of numbers; these are the ones you can look up later. ── */}
      <details className="surface-card rounded-xl p-6">
        <summary className="cursor-pointer text-sm font-medium text-muted transition hover:text-foreground">
          Show the full numbers behind this
        </summary>

        <div className="mt-8 space-y-10">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Your headline figures
            </h3>
            <dl className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-3xl font-semibold text-warn">
                  {pct(kpis.feeConcessionRate)}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                  of the times a client pushed back on price, you lowered it
                </dd>
              </div>
              <div>
                <dt className="text-3xl font-semibold text-foreground">
                  {pct(kpis.winRate)}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                  of all your calls ended in a win
                </dd>
              </div>
              <div>
                <dt className="text-3xl font-semibold text-foreground">
                  {seatPrice(discount)}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                  average discount per seat, against an{" "}
                  {seatPrice(firm.feeFloorPct)} floor
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Which part of the call goes wrong
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              A sales call has five stages. A longer red bar means more of those
              calls ended badly.
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
            <p className="mt-4 text-sm leading-relaxed text-muted">
              It all goes wrong in one place:{" "}
              <strong className="font-medium text-foreground">
                {label(diagnosis.primaryStage)}
              </strong>
              . The other four stages are fine — which is why there&apos;s only
              one thing to practise.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              All {recentCalls.length} calls we read
            </h3>
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
                      <td className="py-2.5 pr-3 capitalize">
                        {label(c.stage)}
                      </td>
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
          </section>

          <ShareControls
            initialShared={share.shareProgressWithManager}
            repId={repId}
          />
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
