import type { PracticeAttempt } from "@/lib/attempts";

type ProgressPanelProps = {
  attempts: PracticeAttempt[];
  feeHoldRate: number | null;
  trendLabel: string;
};

export function ProgressPanel({
  attempts,
  feeHoldRate,
  trendLabel,
}: ProgressPanelProps) {
  const chronological = [...attempts].reverse();
  const maxScore = Math.max(100, ...chronological.map((a) => a.score.overall));

  return (
    <section className="surface-card flex h-full flex-col rounded-xl">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Your practice so far
        </h2>
        <p className="mt-1 text-sm text-muted">{trendLabel}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Attempts</p>
          <p className="mt-1 text-2xl font-semibold">{attempts.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            Last score
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {attempts[0]?.score.overall ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Price hold</p>
          <p className="mt-1 text-2xl font-semibold">
            {feeHoldRate === null ? "—" : `${feeHoldRate}%`}
          </p>
        </div>
      </div>

      {chronological.length === 0 ? (
        <p className="p-5 text-sm text-muted">
          No scored drills yet. Finish a fee-objection session to start the
          trend line.
        </p>
      ) : (
        <>
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Score trend
            </p>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-muted">
              One bar per drill, oldest on the left. Taller is a better score.
            </p>
            <div className="flex h-28 items-end gap-1.5">
              {chronological.map((a, i) => {
                const h = Math.max(8, (a.score.overall / maxScore) * 100);
                return (
                  <div
                    key={a.id}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end"
                    title={`#${i + 1}: ${a.score.overall}`}
                  >
                    <div
                      className={`w-full max-w-8 rounded-t ${
                        a.score.heldFee ? "bg-ok" : "bg-warn"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-ok" />
                you held the price
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-warn" />
                you discounted
              </span>
            </p>
          </div>

          <div className="flex-1 overflow-x-auto p-5">
            {/* Holding the price is one of six scored criteria, so "Held" next to
                a low score is correct and needs saying — people read it as a bug. */}
            <p className="mb-3 text-xs leading-relaxed text-muted">
              <strong className="font-medium text-foreground">Score</strong> is
              out of 100 across six things — did you explore the objection, ask
              questions, anchor on value, hold the price, use the approved play,
              and avoid caving early.{" "}
              <strong className="font-medium text-foreground">Held</strong> is
              only the fourth of those. You can hold the price and still score
              low by skipping the other five.
            </p>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="pb-2 pr-3 font-medium">#</th>
                  <th className="pb-2 pr-3 font-medium">When</th>
                  <th className="pb-2 pr-3 font-medium">Score /100</th>
                  <th className="pb-2 font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attempts.map((a, idx) => (
                  <tr key={a.id}>
                    <td className="py-2 pr-3 font-mono text-xs text-muted">
                      {attempts.length - idx}
                    </td>
                    <td className="py-2 pr-3 text-muted">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 font-semibold text-foreground">
                      {a.score.overall}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-xs ${
                          a.score.heldFee
                            ? "border-ok/30 bg-ok-soft text-ok"
                            : "border-warn/30 bg-warn-soft text-warn"
                        }`}
                      >
                        {a.score.heldFee ? "Held" : "Softened"}
                        {a.score.feeOfferedPct !== null
                          ? ` · ${a.score.feeOfferedPct}%`
                          : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
