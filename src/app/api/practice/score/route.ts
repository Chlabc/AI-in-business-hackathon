import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { saveAttempt } from "@/lib/attempts";
import { scoreTranscript, type TranscriptTurn } from "@/lib/score";

export async function POST(request: Request) {
  let body: {
    repId?: string;
    conversationId?: string | null;
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

  const score = await scoreTranscript(turns);
  const attempt = await saveAttempt({
    repId: body.repId ?? DEMO_REP_ID,
    conversationId: body.conversationId ?? null,
    turns,
    score,
  });

  return NextResponse.json({ attempt, score });
}
