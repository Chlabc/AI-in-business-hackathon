import { Fragment } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { KILL_LIST, PHASES, SCOPE_SENTENCE } from "@/lib/phases";
import { SCENARIOS } from "@/data/scenarios";
import {
  DiagnosisIcon,
  DrillIcon,
  LightbulbIcon,
  LockIcon,
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

const WHAT_YOU_GET = [
  {
    title: "A live voice roleplay",
    body: "An actual spoken conversation with an AI client — not a script you read, not a chatbot you type at.",
    Icon: DrillIcon,
  },
  {
    title: "Scoring against a real rubric",
    body: "Six specific things a good response should do, checked against what you actually said, every single drill.",
    Icon: ScoreIcon,
  },
  {
    title: "Practice that's yours, privately",
    body: "Nothing goes to your manager unless you choose to share it — and even then, they see a summary, never the transcript.",
    Icon: LockIcon,
  },
  {
    title: "A better line for next time",
    body: "Not just 'do better' — an actual suggested response you could have used, grounded in your firm's approved talk-track.",
    Icon: LightbulbIcon,
  },
];

const scenario = SCENARIOS.find((s) => s.recommended) ?? SCENARIOS[0];

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

/** A small, honest preview of the real drill — actual scenario copy, not a stock photo. */
function LivePreviewCard() {
  return (
    <div className="surface-card w-full max-w-sm rounded-xl p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-audio-soft px-2 py-0.5 text-xs font-medium text-audio">
          ● Live drill
        </span>
        <span className="text-xs text-muted">{scenario.title}</span>
      </div>
      <div className="mt-4 flex justify-start">
        <div className="max-w-[85%] rounded-2xl bg-background px-3 py-2 text-sm text-foreground">
          <p className="mb-0.5 text-[10px] uppercase tracking-wide text-muted">
            Client
          </p>
          &ldquo;{scenario.openingLine}&rdquo;
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-accent px-3 py-2 text-sm text-accent-fg">
          <p className="mb-0.5 text-[10px] uppercase tracking-wide opacity-75">
            You
          </p>
          &ldquo;Fair question — what does their quote actually include?&rdquo;
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <span className="text-2xl font-semibold text-ok">76</span>
        <div>
          <p className="text-xs font-medium text-foreground">Explored the objection</p>
          <p className="text-xs text-muted">Before defending the price — nice.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppShell variant="marketing">
      <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">In your corner — not your manager&apos;s dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Stop losing deals on the fee objection.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {SCOPE_SENTENCE}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/coach/practice"
              className="btn-lift inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
            >
              Try the coach
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:border-accent"
            >
              See how it works
            </a>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LivePreviewCard />
        </div>
      </section>

      <ScrollReveal>
      <section
        id="how-it-works"
        className="scroll-mt-20 rounded-2xl border border-border bg-card p-6 lg:p-8"
      >
        <p className="eyebrow">How it works</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Four steps, start to finish
        </h2>
        <div className="stagger-children mt-6 grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {HOW_IT_WORKS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="group flex flex-col gap-3 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="icon-pop flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
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
      </ScrollReveal>

      <ScrollReveal>
      <section>
        <p className="eyebrow">What you get</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Not a course. A practice partner that talks back.
        </h2>
        <div className="stagger-children mt-6 grid gap-4 sm:grid-cols-2">
          {WHAT_YOU_GET.map((item) => (
            <div key={item.title} className="surface-card group rounded-xl p-5">
              <span className="icon-pop flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                <item.Icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="surface-card rounded-2xl p-6 lg:p-8">
        <p className="eyebrow">Where things honestly stand</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">
          Built for the AI in Business Hackathon — Track 1 + ElevenLabs
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-2xl font-semibold text-foreground">4</p>
            <p className="mt-1 text-sm text-muted">
              live objection scenarios, each with its own AI persona
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-2xl font-semibold text-foreground">6</p>
            <p className="mt-1 text-sm text-muted">
              rubric criteria checked on every scored drill
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-2xl font-semibold text-foreground">0</p>
            <p className="mt-1 text-sm text-muted">
              real user tests run so far — that&apos;s our next milestone, not
              a finished result
            </p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            What this isn&apos;t
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {KILL_LIST.slice(0, 3).map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted"
              >
                <span className="mr-1.5 text-accent">×</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="rounded-2xl bg-accent px-6 py-10 text-center text-accent-fg lg:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Ready to stop losing on fees?
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/coach"
            className="btn-lift inline-flex h-11 items-center justify-center rounded-md bg-card px-5 text-sm font-semibold text-foreground transition hover:opacity-90"
          >
            Open the coach
          </Link>
          <a
            href="#build-phases"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            See the build phases
          </a>
        </div>
      </section>
      </ScrollReveal>

      <section id="build-phases" className="scroll-mt-20 border-t border-border pt-8">
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
