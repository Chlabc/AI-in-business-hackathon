import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PracticeSession } from "@/components/PracticeSession";
import { getScenario } from "@/data/scenarios";
import { getTalkTrackForObjection } from "@/data/seed";

type Props = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function PracticePage({ searchParams }: Props) {
  const params = await searchParams;
  const scenario = getScenario(params.scenario);
  const track = getTalkTrackForObjection(scenario.objectionType);

  return (
    <AppShell focus={scenario.skill}>
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

      <div>
        <p className="eyebrow">Live practice · {scenario.difficulty}</p>
        <h1 className="display-serif mt-2 text-3xl text-foreground lg:text-4xl">
          {scenario.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          You&apos;re speaking with a {scenario.customerPersona.toLowerCase()}.
        </p>
      </div>

      {/* key forces a clean voice session when switching scenarios */}
      <PracticeSession
        key={scenario.id}
        scenario={scenario}
        doThis={track.anchorPoints}
        avoidThis={track.neverDo}
      />
    </AppShell>
  );
}
