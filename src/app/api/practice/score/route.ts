import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { getSession } from "@/lib/auth";
import { saveAttempt, type PracticeAttempt } from "@/lib/attempts";
import { scoreTranscript, type TranscriptTurn } from "@/lib/score";

export async function POST(request: Request) {
  // Auth is optional for scoring so Vercel deploys without Task 010 still work.
  // Managers must use an AE account to drill.
  const user = await getSession();
  if (user?.role === "manager") {
    return NextResponse.json(
      {
        error:
          "Managers can’t run scored drills. Sign in as an employee (AE) account.",
      },
      { status: 403 },
    );
  }

  let body: {
    repId?: string;
    conversationId?: string | null;
    scenarioId?: string;
    turns?: TranscriptTurn[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const turns = (body.turns ?? []).filter(
    (t) => t && typeof t.text === "string" && t.role,
  ) as TranscriptTurn[];

  const userTurns = turns.filter((t) => t.role === "user");
  if (userTurns.length === 0) {
    return NextResponse.json(
      { error: "Need at least one user turn to score" },
      { status: 400 },
    );
  }

  const repId = user?.repId ?? body.repId ?? DEMO_REP_ID;
  const score = await scoreTranscript(
    turns,
    body.scenarioId ?? "price-objection",
  );

  let attempt: PracticeAttempt;
  let persisted = true;
  try {
    attempt = await saveAttempt({
      repId,
      conversationId: body.conversationId ?? null,
      turns,
      score,
    });
  } catch (err) {
    // Vercel serverless FS is often read-only — never block the score card.
    console.error(
      "[practice/score] saveAttempt failed; returning score only",
      err,
    );
    persisted = false;
    attempt = {
      id: `ephemeral_${Date.now()}`,
      createdAt: new Date().toISOString(),
      repId,
      conversationId: body.conversationId ?? null,
      turns,
      score,
    };
  }

  return NextResponse.json({ attempt, score, persisted });
}
