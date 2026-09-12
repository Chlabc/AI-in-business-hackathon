import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { AuthError, requireRole } from "@/lib/auth";
import { saveAttempt } from "@/lib/attempts";
import { scoreTranscript, type TranscriptTurn } from "@/lib/score";

export async function POST(request: Request) {
  let user;
  try {
    user = await requireRole("employee");
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
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

  const repId = user.repId ?? DEMO_REP_ID;
  const score = await scoreTranscript(
    turns,
    body.scenarioId ?? "price-objection",
  );
  const attempt = await saveAttempt({
    repId,
    conversationId: body.conversationId ?? null,
    turns,
    score,
  });

  return NextResponse.json({ attempt, score });
}
