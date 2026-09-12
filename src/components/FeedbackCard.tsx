import type { PracticeScore } from "@/lib/rubric";
import { DownloadPdfButton } from "./DownloadPdfButton";

type FeedbackCardProps = {
  score: PracticeScore;
  whatYouSaid?: string[];
  repName?: string;
};

export function FeedbackCard({ score, whatYouSaid = [], repName }: FeedbackCardProps) {
  const said =
    whatYouSaid.length > 0
      ? whatYouSaid.slice(-3)
      : ["(No user transcript captured)"];

  return (
    <section className="surface-card overflow-hidden rounded-xl">
      <div className="border-b border-border bg-ok-soft/50 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-ok!">3 · Feedback</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              Score {score.overall}/100
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded border border-border bg-card px-2 py-1 text-muted">
              {score.method}
            </span>
            <span
              className={`rounded border px-2 py-1 font-medium ${
                score.heldFee
                  ? "border-ok/30 bg-ok-soft text-ok"
                  : "border-accent/30 bg-accent-soft text-accent"
              }`}
            >
              {score.heldFee ? "Fee held" : "Fee softened"}
              {score.feeOfferedPct !== null ? ` · ${score.feeOfferedPct}%` : ""}
            </span>
            <DownloadPdfButton score={score} whatYouSaid={whatYouSaid} repName={repName} />
          </div>
        </div>
      </div>

      <div className="grid border-b border-border md:grid-cols-2">
        <div className="border-b border-border p-5 md:border-b-0 md:border-r md:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            What you said
          </h3>
          <ul className="mt-3 space-y-2">
            {said.map((line) => (
              <li
                key={line}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground"
              >
                “{line}”
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 md:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Approved talk-track
          </h3>
          <p className="mt-3 rounded-md border border-accent/25 bg-accent-soft px-3 py-2 text-sm leading-relaxed text-foreground">
            {score.approvedPlayReminder}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {score.feedback.slice(0, 3).map((line) => (
              <li key={line} className="leading-relaxed">
                · {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-b border-border bg-background px-5 py-4 sm:px-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Suggested response (rehearse this)
        </h3>
        <p className="mt-2 text-sm italic leading-relaxed text-foreground">
          “{score.suggestedResponse}”
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Rubric breakdown
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="pb-2 pr-3 font-medium">Criterion</th>
                <th className="pb-2 pr-3 font-medium">Notes</th>
                <th className="pb-2 text-right font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {score.criteria.map((c) => (
                <tr key={c.id} className="border-b border-border/70 align-top">
                  <td className="py-3 pr-3 font-medium text-foreground">
                    {c.label}
                    <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.round(c.score * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-muted">{c.notes}</td>
                  <td className="py-3 text-right font-mono text-xs text-muted">
                    {Math.round(c.score * c.max)}/{c.max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
