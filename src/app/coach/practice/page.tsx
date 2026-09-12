import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PracticeSession } from "@/components/PracticeSession";
import { DEMO_REP_ID, FIRM, getTalkTrackForObjection } from "@/data/seed";
import { diagnoseRep } from "@/lib/diagnosis";

export default function PracticePage() {
  const diagnosis = diagnoseRep(DEMO_REP_ID);
  const track = getTalkTrackForObjection(diagnosis?.primaryObjection ?? "fee");

  const scenarioLine = `Your ${FIRM.standardPermFeePct}% fee is too high. Another agency already quoted us 15%. Why should I pay more?`;

  return (
    <AppShell focus="Fee concessions">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/coach"
          className="text-sm text-muted transition hover:text-accent"
        >
          ← Back to diagnosis &amp; progress
        </Link>
        <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
          Diagnose → Drill → Feedback → Track
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">Live practice</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            Hold the fee under pressure
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted lg:text-base">
            Speak as Alex. The AI plays a hiring manager pushing your fee down.
            Hold near {FIRM.standardPermFeePct}% using the approved talk-track —
            don&apos;t cave in the first breath. After scoring, use{" "}
            <strong className="font-medium text-foreground">Practice again</strong>{" "}
            to close the loop.
          </p>
        </div>
      </div>

      <PracticeSession
        diagnosisHeadline={
          diagnosis?.headline ??
          "Drill the fee conversation — your seeded weak spot."
        }
        scenarioLine={scenarioLine}
        approvedPlay={track.approvedPlay}
      />
    </AppShell>
  );
}
