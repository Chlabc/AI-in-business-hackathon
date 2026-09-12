import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SCENARIOS } from "@/data/scenarios";

export const dynamic = "force-dynamic";

const difficultyClass: Record<string, string> = {
  Easy: "border-ok/30 bg-ok-soft text-ok",
  Medium: "border-accent/30 bg-accent-soft text-accent",
  Hard: "border-danger/30 bg-danger-soft text-danger",
};

export default function TrainingPage() {
  return (
    <AppShell focus="Scenario selection">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/coach" className="text-sm text-muted hover:text-accent">
          ← Back to diagnosis
        </Link>
        <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
          Lifted from Huey · live voice on our stack
        </span>
      </div>

      <div>
        <p className="eyebrow">Training</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          Choose a practice scenario
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted lg:text-base">
          Price / fee objection is recommended from Alex&apos;s diagnosis. Other
          scenarios come from the Huey prototype — same live ElevenLabs drill,
          different client pushback.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            className={`surface-card flex flex-col justify-between rounded-xl p-6 ${
              s.recommended ? "border-accent/40" : ""
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {s.title}
                </h2>
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${difficultyClass[s.difficulty]}`}
                >
                  {s.difficulty}
                </span>
                {s.recommended ? (
                  <span className="rounded border border-accent/40 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                    Recommended
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
              <p className="mt-2 text-xs text-muted">
                Skill: {s.skill} · Persona: {s.customerPersona}
              </p>
              <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-sm italic text-foreground">
                “{s.openingLine}”
              </p>
            </div>
            <Link
              href={`/coach/practice?scenario=${s.id}`}
              className="mt-5 inline-flex h-10 w-fit items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg transition hover:opacity-90"
            >
              Start drill
            </Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
