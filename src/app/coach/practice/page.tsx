import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PracticeSession } from "@/components/PracticeSession";
import { getScenario } from "@/data/scenarios";
import { DEMO_REP_ID } from "@/data/seed";
import { diagnoseRep } from "@/lib/diagnosis";
import { getPlaybook, getPlaybookTalkTrack } from "@/lib/playbook";
import { applyPlaybookToScenario } from "@/lib/scenario-session";

type Props = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function PracticePage({ searchParams }: Props) {
  const params = await searchParams;
  const baseScenario = getScenario(params.scenario);
  const playbook = await getPlaybook();
  const scenario = applyPlaybookToScenario(baseScenario, playbook);
  const track = getPlaybookTalkTrack(playbook, scenario.objectionType);
  const diagnosis = diagnoseRep(DEMO_REP_ID);

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
          <Link
            href="/coach/playbook"
            className="text-muted transition hover:text-accent"
          >
            Playbook (Manager)
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
          {scenario.description} Use cue mode Off / Soft / Full for reactive
          coach cards. After scoring, use{" "}
          <strong className="font-medium text-foreground">Practice again</strong>{" "}
          or pick another scenario.
        </p>
      </div>

      <PracticeSession
        key={scenario.id}
        scenario={scenario}
        track={track}
        standardFeePct={playbook.standardPermFeePct}
        feeFloorPct={playbook.feeFloorPct}
        diagnosisHeadline={headline}
      />
    </AppShell>
  );
}
