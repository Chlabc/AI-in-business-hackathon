import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GuidedDemo } from "@/components/GuidedDemo";
import { SCOPE_SENTENCE } from "@/lib/phases";
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
      <div className="marketing-shell">
        <section className="hero-panel">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
          />

          <div className="hero-grid relative">
            <div className="hero-copy">
              <p className="hero-kicker">
                AI sales coaching for reps and managers
              </p>
              <h1 className="display-serif mt-4 text-4xl leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                Turn the fee objection into a practiced move.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                {SCOPE_SENTENCE}
              </p>
              <div className="hero-cta mt-8">
                <Link
                  href="/login"
                  className="btn-lift inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-gold-fg"
                >
                  Start the demo ›
                </Link>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  See how it works ›
                </a>
              </div>

              <div className="hero-stats mt-8">
                <div className="hero-stat">
                  <strong>12</strong>
                  <span>calls analysed</span>
                </div>
                <div className="hero-stat">
                  <strong>6</strong>
                  <span>rubric checks</span>
                </div>
                <div className="hero-stat">
                  <strong>1</strong>
                  <span>clear next step</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LivePreviewCard />
            </div>
          </div>

          <div className="relative mt-10 border-t border-white/10 pt-6">
            <p className="text-center text-[0.7rem] uppercase tracking-[0.16em] text-white/40">
              Built with
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-white/55">
              {[
                "ElevenLabs",
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
              ].map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* The guided demo teaches the same four steps interactively, so the
            static list that used to sit above it was cut as a duplicate. */}
        <div id="how-it-works" className="scroll-mt-20">
          <GuidedDemo />
        </div>

        <section id="what-you-get" className="scroll-mt-20">
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
          <p className="eyebrow">Why this is useful</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="display-serif text-2xl text-foreground sm:text-3xl">
                Built for the moment reps actually lose confidence.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The hard part is not knowledge. It is the pressure of the real
                conversation. Cornerman gives reps a safe place to rehearse that
                exact spike, then shows them what to do next without exposing
                every transcript to their manager.
              </p>
            </div>
            <div className="space-y-3 text-sm text-muted">
              <div className="rounded-xl border border-border bg-background p-4">
                <span className="font-semibold text-foreground">For reps:</span>{" "}
                practise the objection in a realistic voice call and walk away with
                a score you can actually act on.
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <span className="font-semibold text-foreground">For managers:</span>{" "}
                see progress summaries, not raw call recordings, so the system feels
                like coaching rather than surveillance.
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <span className="font-semibold text-foreground">For the firm:</span>{" "}
                update talk tracks, fee floors, and red lines in one place and let
                the AI client and scorer follow them.
              </div>
            </div>
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
              href="#how-it-works"
              className="text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              See how it works ›
            </a>
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-center text-xs text-muted">
          Forward · AI in Business Hackathon · Track 1 + ElevenLabs
        </footer>
      </div>
    </AppShell>
  );
}
