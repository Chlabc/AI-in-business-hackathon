import Link from "next/link";
import { KILL_LIST, PHASES, SCOPE_SENTENCE } from "@/lib/phases";

function statusStyles(status: (typeof PHASES)[number]["status"]) {
  switch (status) {
    case "done":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
    case "active":
      return "border-amber-500/50 bg-amber-500/15 text-amber-200";
    default:
      return "border-zinc-700 bg-zinc-900/60 text-zinc-400";
  }
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold tracking-tight text-amber-400">
              Cornerman
            </span>
            <span className="hidden text-sm text-zinc-500 sm:inline">
              AI sales coach · recruitment
            </span>
          </div>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            Phase 0 done · ready for Phase 1
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
        <section className="flex flex-col gap-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
            In your corner — not your manager&apos;s dashboard
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl">
            Drill the deal you keep losing — out loud, against a client who
            pushes back.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            {SCOPE_SENTENCE}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/coach"
              className="inline-flex h-11 items-center justify-center rounded-full bg-amber-500 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
            >
              Open coach (demo)
            </Link>
            <a
              href="https://github.com/Chlabc/AI-in-business-hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-700 px-6 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              Public repo
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Diagnose",
              body: "Find the losing stage from your call outcomes — not a generic scenario picker.",
            },
            {
              title: "Drill",
              body: "Live spoken roleplay. Fee objection. Client argues back in real time.",
            },
            {
              title: "Improve",
              body: "Grounded feedback from approved talk-tracks. Track whether you get better.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <h2 className="text-base font-semibold text-amber-300">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {card.body}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Build phases
            </h2>
            <ul className="mt-4 space-y-2">
              {PHASES.map((phase) => (
                <li
                  key={phase.id}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${statusStyles(phase.status)}`}
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

          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Kill list (out of scope)
              </h2>
              <ul className="mt-4 space-y-2">
                {KILL_LIST.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-400"
                  >
                    <span className="mr-2 text-zinc-600">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h2 className="text-sm font-semibold text-amber-300">
                Judge honesty
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Demo diagnosis uses <strong className="text-zinc-200">seeded</strong>{" "}
                call data, not a live CRM. The loop is real; the CRM pipe is the
                obvious next step after the hackathon.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
        Forward · AI in Business Hackathon · Track 1 + ElevenLabs
      </footer>
    </div>
  );
}
