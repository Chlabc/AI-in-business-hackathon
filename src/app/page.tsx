import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { KILL_LIST, PHASES, SCOPE_SENTENCE } from "@/lib/phases";

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
      <section className="grid gap-10 xl:grid-cols-[1.4fr_1fr] xl:items-end">
        <div>
          <p className="eyebrow">
            In your corner — not your manager&apos;s dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
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
              Open coach
            </Link>
            <Link
              href="/coach/practice"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:border-accent"
            >
              Start a drill
            </Link>
          </div>
        </div>

        <div className="stagger-children grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {[
            {
              n: "01",
              title: "Diagnose",
              body: "Find the losing stage from your call outcomes.",
            },
            {
              n: "02",
              title: "Drill",
              body: "Live spoken fee objection. Client argues back.",
            },
            {
              n: "03",
              title: "Track",
              body: "Score, re-practice, share progress — not transcripts.",
            },
          ].map((card) => (
            <div key={card.title} className="surface-card rounded-xl p-5">
              <p className="font-mono text-xs text-muted">{card.n}</p>
              <h2 className="mt-2 text-base font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.body}
              </p>
            </div>
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
