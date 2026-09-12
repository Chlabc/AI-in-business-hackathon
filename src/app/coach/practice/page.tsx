import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PracticeSession } from "@/components/PracticeSession";
import { getScenario } from "@/data/scenarios";
import { DEMO_REP_ID, getTalkTrackForObjection } from "@/data/seed";
import { diagnoseRep } from "@/lib/diagnosis";

type Props = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function PracticePage({ searchParams }: Props) {
  const params = await searchParams;
  const scenario = getScenario(params.scenario);
  const diagnosis = diagnoseRep(DEMO_REP_ID);
  const track = getTalkTrackForObjection(scenario.objectionType);

  const headline =
    scenario.id === "price-objection"
      ? (diagnosis?.headline ??
        "Drill the fee conversation — your seeded weak spot.")
      : `${scenario.skill}: ${scenario.description}`;

  return (
    <AppShell focus={scenario.skill}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/coach" className="text-muted transition hover:text-accent">
            ← Diagnosis
          </Link>
          <Link
            href="/coach/training"
            className="text-muted transition hover:text-accent"
          >
            All scenarios
          </Link>
        </div>
        <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
          {scenario.title} · {scenario.difficulty}
        </span>
      </div>

      <div>
        <p className="eyebrow">Live practice</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          {scenario.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted lg:text-base">
          {scenario.description} After scoring, use{" "}
          <strong className="font-medium text-foreground">Practice again</strong>{" "}
          or pick another scenario.
        </p>
      </div>

      <PracticeSession
        scenario={scenario}
        diagnosisHeadline={headline}
        approvedPlay={track.approvedPlay}
      />
    </AppShell>
  );
}
