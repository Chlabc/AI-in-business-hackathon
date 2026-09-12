import { Fragment } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { KILL_LIST, PHASES, SCOPE_SENTENCE } from "@/lib/phases";
import {
  DiagnosisIcon,
  DrillIcon,
  ManagerIcon,
  ScoreIcon,
} from "@/components/NavIcons";

const HOW_IT_WORKS = [
  {
    n: 1,
    title: "Diagnose",
    body: "We find your weakest pattern from real call outcomes — which stage, which objection, how often it's costing you the deal.",
    Icon: DiagnosisIcon,
  },
  {
    n: 2,
    title: "Drill",
    body: "You have a live spoken conversation with an AI playing that difficult client. It argues back — it won't just let you win.",
    Icon: DrillIcon,
  },
  {
    n: 3,
    title: "Score",
    body: "The moment you finish, you get a score, what you did well, what to fix, and a better line to try next time.",
    Icon: ScoreIcon,
  },
  {
    n: 4,
    title: "Track",
    body: "Every attempt is saved so you can see if you're actually improving — and share a summary with your manager if you choose to.",
    Icon: ManagerIcon,
  },
];

function statusClass(status: (typeof PHASES)[number]["status"]) {
  switch (status) {
    case "done":
      return "border-ok/30 bg-ok-soft text-ok";
    case "active":
      return "border-accent/30 bg-accent-soft text-accent";
    default:
      return "border-border bg-card text-muted";
  }
}

export default function Home() {
  return (
    <AppShell>
      <section>
        <p className="eyebrow">In your corner — not your manager&apos;s dashboard</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Drill the deal you keep losing — out loud, against a client who
          pushes back.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
          {SCOPE_SENTENCE}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/coach"
            className="btn-lift inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
          >
            See my diagnosis
          </Link>
          <Link
            href="/coach/practice"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:border-accent"
          >
            Jump straight to a drill
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 lg:p-8">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Four steps, start to finish
        </h2>
        <div className="stagger-children mt-6 grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {HOW_IT_WORKS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <step.Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-xs text-muted">
                    STEP {step.n}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden items-center justify-center px-2 text-border lg:flex"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <p className="eyebrow">For the team &amp; judges</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Build transparency
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          The honest state of the build — not part of the pitch, kept here so
          nothing is hidden.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Build phases
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PHASES.map((phase) => (
              <li
                key={phase.id}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${statusClass(phase.status)}`}
              >
                <span className="mt-0.5 w-8 shrink-0 font-mono text-xs opacity-80">
                  P{phase.id}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-medium">{phase.title}</span>
                    <span className="text-xs opacity-70">{phase.hours}h</span>
                  </div>
                  <p className="mt-1 text-sm opacity-80">{phase.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Kill list
            </h2>
            <ul className="mt-4 space-y-2">
              {KILL_LIST.map((item) => (
                <li
                  key={item}
                  className="surface-card rounded-lg px-4 py-3 text-sm text-muted"
                >
                  <span className="mr-2 text-accent">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-accent-soft p-5">
            <h2 className="text-sm font-semibold text-accent">Judge honesty</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Demo diagnosis uses{" "}
              <strong className="text-foreground">seeded</strong> call data, not
              a live CRM. The loop is real; the CRM pipe is next.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border pt-6 text-center text-xs text-muted">
        Forward · AI in Business Hackathon · Track 1 + ElevenLabs
      </footer>
    </AppShell>
  );
}
