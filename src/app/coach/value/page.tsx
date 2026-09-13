import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts } from "@/lib/attempts";
import { getSession } from "@/lib/auth";
import {
  beforeAfterFromAttempts,
  DEFAULT_USER_TEST_SESSIONS,
  USER_TEST_PROTOCOL,
} from "@/lib/value-evidence";

export const dynamic = "force-dynamic";

export default async function ValuePage() {
  const user = await getSession();
  const repId = user?.repId ?? DEMO_REP_ID;
  const attempts = await listAttempts(repId);
  const evidence = beforeAfterFromAttempts(attempts);
  const sessions = DEFAULT_USER_TEST_SESSIONS;

  return (
    <AppShell focus="Value evidence">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Does this actually work?</p>
          <h1 className="display-serif mt-2 text-3xl text-foreground lg:text-4xl">
            The evidence
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted lg:text-base">
            Whether reps get better, measured only from drills they actually
            completed. We report score and price-hold — never a win rate or a
            revenue figure, because we have no way to measure those.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/coach/practice"
            className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg"
          >
            Run a drill
          </Link>
          <Link
            href="/coach"
            className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm text-muted hover:text-foreground"
          >
            Diagnosis
          </Link>
        </div>
      </div>

      <BeforeAfterScore
        attemptCount={evidence.attemptCount}
        firstScore={evidence.firstScore}
        latestScore={evidence.latestScore}
        scoreDelta={evidence.scoreDelta}
      />

      <section className="surface-card rounded-xl p-5 sm:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Price hold — did they stop caving?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Share of drills that ended at or near list price, first half vs second
          half of their attempts.
        </p>
        {evidence.holdRateEarlyPct === null ? (
          <p className="mt-4 text-sm text-muted">
            Not enough scored drills yet.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <HoldBar
              label="Early drills"
              value={evidence.holdRateEarlyPct}
              tone="muted"
            />
            <HoldBar
              label="Later drills"
              value={evidence.holdRateLatePct ?? evidence.holdRateEarlyPct}
              tone="strong"
            />
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface-card rounded-xl p-5 sm:p-6">
          <p className="eyebrow">Protocol</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            How to run 3–5 user tests
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {USER_TEST_PROTOCOL.map((step) => (
              <li key={step}>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card rounded-xl p-5 sm:p-6">
          <p className="eyebrow">User-test log</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Sessions ({sessions.length})
          </h2>
          <p className="mt-2 text-xs text-muted">
            Rows marked <strong className="text-foreground">demo_labeled</strong>{" "}
            are pitch templates — swap in live quotes after real tests.
          </p>
          <div className="mt-4 space-y-3">
            {sessions.map((s) => (
              <article
                key={s.id}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {s.participant}{" "}
                    <span className="font-normal text-muted">· {s.role}</span>
                  </p>
                  <span className="rounded border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                    {s.source} · {s.date}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  <span className="font-semibold text-foreground">Before: </span>
                  {s.beforeNote}
                </p>
                <p className="mt-1 text-xs text-muted">
                  <span className="font-semibold text-foreground">After: </span>
                  {s.afterNote}
                </p>
                <p className="mt-2 text-sm italic text-foreground">
                  “{s.quote}”
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/**
 * The headline claim. Shows the direction of travel in colour and shape, so it
 * reads before the numbers do — and says plainly when there isn't enough data,
 * rather than dressing up a drop as a result.
 */
function BeforeAfterScore({
  attemptCount,
  firstScore,
  latestScore,
  scoreDelta,
}: {
  attemptCount: number;
  firstScore: number | null;
  latestScore: number | null;
  scoreDelta: number | null;
}) {
  const enough = attemptCount >= 3 && firstScore !== null && latestScore !== null;

  if (!enough) {
    return (
      <section className="surface-card rounded-xl border-l-4 border-l-warn p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-warn">
          Not enough data yet
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Run at least 3 full drills to show a before/after
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {attemptCount} scored{" "}
          {attemptCount === 1 ? "attempt" : "attempts"} so far. A drill only
          counts once you actually speak — starting a session and ending it
          without talking scores near zero and would make this chart lie.
        </p>
      </section>
    );
  }

  const delta = scoreDelta ?? 0;
  const improved = delta > 0;
  const flat = delta === 0;
  const tone = improved
    ? { border: "border-l-ok", text: "text-ok", bar: "bg-ok" }
    : flat
      ? { border: "border-l-border", text: "text-muted", bar: "bg-muted" }
      : { border: "border-l-danger", text: "text-danger", bar: "bg-danger" };

  return (
    <section className={`surface-card rounded-xl border-l-4 ${tone.border} p-6`}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
        Score across {attemptCount} drills
      </h2>

      <div className="mt-5 flex flex-wrap items-center gap-6 sm:gap-10">
        <ScoreBlock label="First drill" score={firstScore} />
        <span aria-hidden className="text-3xl text-border">
          →
        </span>
        <ScoreBlock label="Latest drill" score={latestScore} />

        <div className={`flex flex-col ${tone.text}`}>
          <span className="text-5xl font-semibold tabular-nums">
            {improved ? "+" : ""}
            {delta}
          </span>
          <span className="mt-1 text-sm font-medium">
            {improved
              ? "points better"
              : flat
                ? "no change"
                : "points worse"}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <ScoreBar label="First" score={firstScore} barClass="bg-muted" />
        <ScoreBar label="Latest" score={latestScore} barClass={tone.bar} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        {improved
          ? `Scores rose ${delta} points from the first drill to the latest. That improvement is the product working.`
          : flat
            ? "Scores held flat between the first drill and the latest. More reps needed before the trend means anything."
            : `Scores fell ${Math.abs(delta)} points. We report this as-is rather than hiding it — with this few attempts it reflects test sessions more than real practice.`}
      </p>
    </section>
  );
}

function ScoreBlock({ label, score }: { label: string; score: number | null }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-5xl font-semibold tabular-nums text-foreground">
        {score ?? "—"}
      </p>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  barClass,
}: {
  label: string;
  score: number | null;
  barClass: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-14 shrink-0 text-muted">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${Math.min(Math.max(score ?? 0, 0), 100)}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono tabular-nums text-muted">
        {score ?? "—"}
      </span>
    </div>
  );
}

function HoldBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "muted" | "strong";
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 text-foreground">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${tone === "strong" ? "bg-ok" : "bg-muted"}`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right font-mono tabular-nums text-foreground">
        {value}%
      </span>
    </div>
  );
}
