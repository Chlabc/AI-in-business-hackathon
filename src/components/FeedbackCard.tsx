import type { PracticeScore } from "@/lib/rubric";

export function FeedbackCard({ score }: { score: PracticeScore }) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Feedback
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-50">
            Score {score.overall}/100
          </h2>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full border border-zinc-700 px-2 py-1 text-zinc-400">
            {score.method}
          </span>
          <span
            className={`rounded-full border px-2 py-1 ${
              score.heldFee
                ? "border-emerald-500/40 text-emerald-300"
                : "border-amber-500/40 text-amber-200"
            }`}
          >
            {score.heldFee ? "Fee held" : "Fee softened"}
            {score.feeOfferedPct !== null ? ` · ${score.feeOfferedPct}%` : ""}
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {score.feedback.map((line) => (
          <li
            key={line}
            className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300"
          >
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Rubric
        </p>
        <ul className="mt-3 space-y-2">
          {score.criteria.map((c) => (
            <li key={c.id} className="text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-300">{c.label}</span>
                <span className="font-mono text-xs text-zinc-500">
                  {Math.round(c.score * c.max)}/{c.max}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-amber-500/80"
                  style={{ width: `${Math.round(c.score * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">{c.notes}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
