import { NextResponse } from "next/server";
import {
  jsonAuthError,
  repIdForViewer,
  requireRole,
  requireUser,
} from "@/lib/auth";
import {
  listAttempts,
  practiceKpisFromAttempts,
  updateAttemptReflection,
} from "@/lib/attempts";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const repId = repIdForViewer(user, searchParams.get("repId"));
    const attempts = await listAttempts(repId);
    const practice = practiceKpisFromAttempts(attempts);
    return NextResponse.json({ attempts, practice });
  } catch (e) {
    return (
      jsonAuthError(e) ??
      NextResponse.json({ error: "Error" }, { status: 500 })
    );
  }
}

/** Save self-reflection onto an attempt the employee owns. */
export async function PATCH(request: Request) {
  try {
    const user = await requireRole("employee");
    const repId = repIdForViewer(user);

    let body: {
      attemptId?: string;
      whatWentWrong?: string;
      nextTime?: string;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const attemptId = body.attemptId?.trim();
    if (!attemptId) {
      return NextResponse.json(
        { error: "attemptId required" },
        { status: 400 },
      );
    }

    const whatWentWrong =
      typeof body.whatWentWrong === "string" ? body.whatWentWrong : "";
    const nextTime = typeof body.nextTime === "string" ? body.nextTime : "";
    if (!whatWentWrong.trim() && !nextTime.trim()) {
      return NextResponse.json(
        { error: "Write at least one reflection field" },
        { status: 400 },
      );
    }

    try {
      const attempt = await updateAttemptReflection(attemptId, repId, {
        whatWentWrong,
        nextTime,
      });
      if (!attempt) {
        return NextResponse.json(
          { error: "Attempt not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ attempt, persisted: true });
    } catch (err) {
      console.error("[practice/attempts] reflection persist failed", err);
      return NextResponse.json({
        attempt: {
          id: attemptId,
          reflection: {
            whatWentWrong: whatWentWrong.trim(),
            nextTime: nextTime.trim(),
            savedAt: new Date().toISOString(),
          },
        },
        persisted: false,
      });
    }
  } catch (e) {
    return (
      jsonAuthError(e) ??
      NextResponse.json({ error: "Error" }, { status: 500 })
    );
  }
}
