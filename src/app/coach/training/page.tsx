import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SCENARIOS } from "@/data/scenarios";

export const dynamic = "force-dynamic";

const difficultyClass: Record<string, string> = {
  Easy: "border-ok/30 bg-ok-soft text-ok",
  Medium: "border-warn/30 bg-warn-soft text-warn",
  Hard: "border-danger/30 bg-danger-soft text-danger",
};

export default function TrainingPage() {
  return (
    <AppShell focus="Scenario selection">
      <Link href="/coach" className="text-sm text-muted hover:text-accent">
        ← Back to your diagnosis
      </Link>

      <div>
        <p className="eyebrow">Pick a situation</p>
        <h1 className="display-serif mt-2 text-3xl text-foreground lg:text-4xl">
          What do you want to practise?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted lg:text-base">
          Each one is a real spoken call against an AI client with its own
          personality and its own way of pushing back. The starred one is picked
          from your diagnosis — start there if you&apos;re not sure.
        </p>
      </div>

      <div className="stagger-children grid gap-4 lg:grid-cols-2">
        {SCENARIOS.map((s) => (
          <Link
            key={s.id}
            href={`/coach/practice?scenario=${s.id}`}
            className={`card-interactive surface-card flex flex-col justify-between rounded-xl p-6 ${
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
            <span className="btn-lift mt-5 inline-flex h-10 w-fit items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg">
              Start drill
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
