import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PracticeSession } from "@/components/PracticeSession";
import { DEMO_REP_ID, FIRM, getTalkTrackForObjection } from "@/data/seed";
import { diagnoseRep } from "@/lib/diagnosis";

export default function PracticePage() {
  const diagnosis = diagnoseRep(DEMO_REP_ID);
  const track = getTalkTrackForObjection(diagnosis?.primaryObjection ?? "fee");

  const scenarioLine = `Your ${FIRM.standardPermFeePct}% fee is too high. Another agency already quoted us 15%. Why should I pay more?`;

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader focus="Fee concessions" />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/coach"
            className="text-sm text-muted transition hover:text-accent"
          >
            ← Back to diagnosis
          </Link>
          <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
            Diagnose → Drill → Feedback
          </span>
        </div>

        <div>
          <p className="eyebrow">Live practice</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Hold the fee under pressure
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
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
      </main>
    </div>
  );
}
