import Link from "next/link";
import { DEMO_REP_ID, getTalkTrackForObjection } from "@/data/seed";
import { diagnoseRep } from "@/lib/diagnosis";

export default function PracticePage() {
  const diagnosis = diagnoseRep(DEMO_REP_ID);
  const track = getTalkTrackForObjection(diagnosis?.primaryObjection ?? "fee");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <Link
        href="/coach"
        className="text-sm text-zinc-500 transition hover:text-amber-400"
      >
        ← Back to diagnosis
      </Link>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
          Drill ready · voice in Phase 2
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
          Fee-objection roleplay
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          {diagnosis?.headline}
        </p>
        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/60 p-4 text-sm text-zinc-300">
          <p className="font-medium text-zinc-100">Scenario preview</p>
          <p className="mt-2">
            You&apos;re on a call with a hiring manager. Your firm&apos;s fee is
            20%. They say:{" "}
            <span className="text-amber-200">
              &ldquo;Your 20% fee is too high. Another agency quoted us
              15%.&rdquo;
            </span>
          </p>
          <p className="mt-3 text-zinc-500">
            Approved play: {track.approvedPlay}
          </p>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          Next stage wires ElevenLabs so the client argues back live. Say{" "}
          <span className="text-zinc-300">go Phase 2</span> when you have an
          ElevenLabs API key (or want the UI shell first).
        </p>
      </div>
    </div>
  );
}
