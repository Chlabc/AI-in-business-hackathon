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
  return (
    <section
      aria-labelledby="progress-heading"
      className="min-w-0 border-t border-border pt-6 lg:pt-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(240px,.7fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="lg:pr-8">
          <p className="text-xs font-semibold text-coach-positive">
            Coaching progress
          </p>
          <h2
            id="progress-heading"
            className="mt-3 text-2xl font-semibold leading-8 text-foreground"
          >
            Build the fee-hold habit
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">{trendLabel}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
          <div className="min-w-0 rounded-lg bg-coach-ai-soft p-4">
            <dt className="text-xs font-medium text-muted">Attempts</dt>
            <dd className="mt-2 text-3xl font-semibold leading-none tabular-nums text-foreground sm:text-4xl">
              {attempts.length}
            </dd>
          </div>
          <div className="min-w-0 rounded-lg bg-coach-action-soft p-4">
            <dt className="text-xs font-medium text-muted">Last score</dt>
            <dd className="mt-2 text-3xl font-semibold leading-none tabular-nums text-foreground sm:text-4xl">
              {attempts[0]?.score.overall ?? "—"}
            </dd>
            <dd className="mt-1 text-xs text-muted">Out of 100</dd>
          </div>
          <div className="min-w-0 rounded-lg bg-coach-positive-soft p-4">
            <dt className="text-xs font-medium text-muted">Fee held</dt>
            <dd className="mt-2 text-3xl font-semibold leading-none tabular-nums text-foreground sm:text-4xl">
              {feeHoldRate === null ? "—" : `${feeHoldRate}%`}
            </dd>
          </div>
        </dl>
      </div>
      {chronological.length === 0 ? (
        <div className="mt-6 rounded-lg bg-coach-positive-soft px-5 py-6 sm:px-6">
          <p className="border-l-2 border-coach-positive py-1 pl-4 text-sm leading-6 text-muted">
            No scored drills yet. Complete the recommended drill to establish
            your baseline.
          </p>
        </div>
      ) : (
        <>
          <figure className="mt-6 rounded-lg bg-card px-5 py-6 shadow-[0_14px_35px_-32px_rgba(15,23,42,0.45)] sm:px-6 lg:py-8">
            <figcaption className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">
                Score over attempts
              </span>
              <span className="text-xs text-muted">
                Score out of 100 · Green: held · Amber: softened
              </span>
            </figcaption>
            <div
              className="mt-6 overflow-x-auto rounded-lg bg-background px-4 pt-5 focus-visible:outline-2 focus-visible:outline-coach-positive sm:px-6"
              role="region"
              aria-label="Practice score chart"
              tabIndex={0}
            >
              <div
                className="flex min-w-full items-end gap-3"
                style={{ width: `${chronological.length * 68}px` }}
              >
                {chronological.map((a, i) => (
                  <div key={a.id} className="min-w-14 flex-1 text-center">
                    <p className="mb-2 text-sm font-semibold tabular-nums text-foreground">
                      {a.score.overall}
                    </p>
                    <div
                      className="flex h-24 items-end justify-center"
                      aria-hidden="true"
                    >
                      <div
                        className={`w-8 rounded-t-sm ${a.score.heldFee ? "bg-coach-positive" : "bg-coach-warning"}`}
                        style={{
                          height: `${Math.min(100, Math.max(0, a.score.overall))}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 font-mono text-xs text-muted">
                      #{i + 1}
                    </p>
                    <p className="my-1 text-xs text-muted">
                      {a.score.heldFee ? "Held" : "Softened"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </figure>
          <details className="mt-3 border-t border-border">
            <summary className="cursor-pointer py-5 text-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coach-positive">
              Practice history{" "}
              <span className="ml-2 font-normal text-muted">
                {attempts.length} attempts
              </span>
            </summary>
            <div
              className="overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-coach-positive"
              role="region"
              aria-label="Practice history table"
              tabIndex={0}
            >
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-border text-xs text-muted">
                  <tr>
                    {["Attempt", "When", "Score / 100", "Fee outcome"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="py-3 pr-4 font-medium"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {attempts.map((a, idx) => (
                    <tr key={a.id}>
                      <th
                        scope="row"
                        className="py-3 pr-4 font-mono text-xs font-normal text-muted"
                      >
                        {attempts.length - idx}
                      </th>
                      <td className="py-3 pr-4 text-muted">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 font-semibold tabular-nums text-foreground">
                        {a.score.overall}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-xs font-medium ${a.score.heldFee ? "border-ok/30 bg-ok-soft text-ok" : "border-warn/30 bg-warn-soft text-warn"}`}
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
          </details>
        </>
      )}
    </section>
  );
}
