import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PracticeSession } from "@/components/PracticeSession";
import { getScenario } from "@/data/scenarios";
import { DEMO_REP_ID } from "@/data/seed";
import { requireRole } from "@/lib/auth";
import { diagnoseRep } from "@/lib/diagnosis";
import { getPlaybook, getPlaybookTalkTrack } from "@/lib/playbook";
import { applyPlaybookToScenario } from "@/lib/scenario-session";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function PracticePage({ searchParams }: Props) {
  const user = await requireRole("employee");
  const repId = user.repId ?? DEMO_REP_ID;
  const params = await searchParams;
  const baseScenario = getScenario(params.scenario);
  const playbook = await getPlaybook();
  const scenario = applyPlaybookToScenario(baseScenario, playbook);
  const track = getPlaybookTalkTrack(playbook, scenario.objectionType);
  const diagnosis = diagnoseRep(repId);

  const headline =
    scenario.id === "price-objection"
      ? (diagnosis?.headline ??
        "Drill the fee conversation — your seeded weak spot.")
      : `${scenario.skill}: ${scenario.description}`;

  return (
    <AppShell focus={scenario.skill}>
      {/* Manager-only pages are omitted here — middleware would bounce an employee. */}
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
        <p className="eyebrow">Step 2 of 3 · Practise</p>
        {/* The title is repeated inside PracticeSession's step header, so it is stated once here. */}
        <h1 className="display-serif mt-2 text-3xl text-foreground lg:text-4xl">
          {scenario.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted lg:text-base">
          {scenario.description}
        </p>
      </div>

      {/* A three-line guide, because "what am I meant to do here" was the most
          common reaction to this page. */}
      <ol className="grid gap-3 sm:grid-cols-3">
        {[
          [
            "Press the button",
            "Your browser will ask for the microphone. Say yes.",
          ],
          [
            "Talk to the client",
            "They'll push back on price. Answer out loud, like a real call.",
          ],
          [
            "Press done",
            "You get a score out of 100 and a better line for next time.",
          ],
        ].map(([title, body], i) => (
          <li
            key={title}
            className="surface-card flex gap-3 rounded-xl p-4 text-sm"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-fg">
              {i + 1}
            </span>
            <span>
              <span className="font-medium text-foreground">{title}</span>
              <span className="mt-1 block leading-relaxed text-muted">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ol>

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
