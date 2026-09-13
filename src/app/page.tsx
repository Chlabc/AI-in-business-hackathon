import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GuidedDemo } from "@/components/GuidedDemo";
import { KILL_LIST, PHASES, SCOPE_SENTENCE } from "@/lib/phases";
import { SCENARIOS } from "@/data/scenarios";
import {
  DrillIcon,
  LightbulbIcon,
  LockIcon,
  ScoreIcon,
} from "@/components/NavIcons";

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
      <section className="relative overflow-hidden rounded-2xl bg-brand-navy px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.07] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
        />

        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
              In your corner — not your manager&apos;s dashboard
            </p>
            <h1 className="display-serif mt-4 text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Stop losing deals on the fee objection.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {SCOPE_SENTENCE}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/login"
                className="btn-lift inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-gold-fg"
              >
                Try the coach ›
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                See how it works ›
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LivePreviewCard />
          </div>
        </div>

        <div className="relative mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-[0.7rem] uppercase tracking-[0.16em] text-white/40">
            Built with
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-white/55">
            {["ElevenLabs", "Next.js", "React", "TypeScript", "Tailwind CSS"].map(
              (tech) => (
                <li key={tech}>{tech}</li>
              ),
            )}
          </ul>
        </div>
      </section>

      <div id="how-it-works" className="scroll-mt-20">
        <GuidedDemo />
      </div>

      <section>
        <p className="eyebrow">What you get</p>
        <h2 className="display-serif mt-1 text-2xl tracking-tight text-foreground sm:text-3xl">
          Not a course. A practice partner that talks back.
        </h2>
        <div className="stagger-children mt-6 grid gap-4 sm:grid-cols-2">
          {WHAT_YOU_GET.map((item) => (
            <div key={item.title} className="surface-card rounded-xl p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
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

      <section className="surface-card rounded-2xl p-6 lg:p-8">
        <p className="eyebrow">Where things honestly stand</p>
        <h2 className="display-serif mt-1 text-xl text-foreground sm:text-2xl">
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

      <section className="rounded-2xl bg-brand-navy px-6 py-12 text-center text-white lg:py-16">
        <h2 className="display-serif text-2xl sm:text-4xl">
          Ready to stop losing on fees?
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="btn-lift inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-gold-fg"
          >
            Sign in to the coach ›
          </Link>
          <a
            href="#build-phases"
            className="text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            See the build phases ›
          </a>
        </div>
      </section>

      <details id="build-phases" className="scroll-mt-20 border-t border-border pt-8">
        <summary className="cursor-pointer list-none">
          <span className="eyebrow">For the team &amp; judges</span>
          <span className="display-serif mt-1 block text-xl text-foreground sm:text-2xl">
            Build transparency ▾
          </span>
          <span className="mt-1 block max-w-2xl text-sm text-muted">
            Phases, the kill list, and what&apos;s still seeded — expand it,
            nothing is hidden.
          </span>
        </summary>

        <section className="mt-6 grid gap-8 lg:grid-cols-2">
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
      </details>

      <footer className="border-t border-border pt-6 text-center text-xs text-muted">
        Forward · AI in Business Hackathon · Track 1 + ElevenLabs
      </footer>
    </AppShell>
  );
}
