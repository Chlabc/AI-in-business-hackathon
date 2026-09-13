import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { LearnModule } from "@/components/LearnModule";
import { requireRole } from "@/lib/auth";
import { buildFlashcards, buildQuiz } from "@/lib/learn";
import { getPlaybook } from "@/lib/playbook";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  await requireRole("employee");
  const playbook = await getPlaybook();
  const cards = buildFlashcards(playbook);
  const questions = buildQuiz(playbook);

  return (
    <AppShell focus="Firm facts">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/coach" className="text-sm text-muted hover:text-accent">
          ← Diagnosis
        </Link>
        <span className="rounded border border-border bg-card px-3 py-1 text-xs text-muted">
          From live playbook · not a generic sales course
        </span>
      </div>

      <div>
        <p className="eyebrow">Learn</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          Know the facts before you defend them
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted lg:text-base">
          Flashcards and a five-question quiz pulled from{" "}
          <strong className="text-foreground">{playbook.firmName}</strong>
          &apos;s playbook — list price, floor, anchors, and never-dos. Then
          drill.
        </p>
      </div>

      <LearnModule
        firmName={playbook.firmName}
        cards={cards}
        questions={questions}
      />
    </AppShell>
  );
}
