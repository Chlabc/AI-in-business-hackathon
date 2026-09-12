import Link from "next/link";
import { DEMO_REP_ID, FIRM, getTalkTrackForObjection } from "@/data/seed";
import { diagnoseRep } from "@/lib/diagnosis";
import { PracticeSession } from "@/components/PracticeSession";

export default function PracticePage() {
  const diagnosis = diagnoseRep(DEMO_REP_ID);
  const track = getTalkTrackForObjection(diagnosis?.primaryObjection ?? "fee");

  const scenarioLine = `Your ${FIRM.standardPermFeePct}% fee is too high. Another agency already quoted us 15%. Why should I pay more?`;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/coach"
          className="text-sm text-zinc-500 transition hover:text-amber-400"
        >
          ← Back to diagnosis
        </Link>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          Phase 2 · ElevenLabs voice
        </span>
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
          Fee-objection roleplay
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
          Practice against the client
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Speak as Alex. The AI plays a hiring manager pushing your fee down.
          Hold near {FIRM.standardPermFeePct}% using the approved talk-track —
          don&apos;t cave in the first breath.
        </p>
      </div>

      <PracticeSession
        diagnosisHeadline={
          diagnosis?.headline ??
          "Drill the fee conversation — your seeded weak spot."
        }
        scenarioLine={scenarioLine}
        approvedPlay={track.approvedPlay}
      />
    </div>
  );
}
