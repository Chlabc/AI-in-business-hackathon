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
        <p className="eyebrow">4 · Track</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Progress over attempts
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
          <p className="text-xs uppercase tracking-wider text-muted">Fee hold</p>
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Score trend
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
            <p className="mt-2 text-[11px] text-muted">
              Green bar = fee held · Amber = softened
            </p>
          </div>

          <div className="flex-1 overflow-x-auto p-5">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="pb-2 pr-3 font-medium">#</th>
                  <th className="pb-2 pr-3 font-medium">When</th>
                  <th className="pb-2 pr-3 font-medium">Score</th>
                  <th className="pb-2 font-medium">Fee</th>
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
