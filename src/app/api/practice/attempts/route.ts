import { NextResponse } from "next/server";
import {
  getSession,
  jsonAuthError,
  repIdForViewer,
  requireUser,
} from "@/lib/auth";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const repId = repIdForViewer(user, searchParams.get("repId"));
    const attempts = await listAttempts(repId);
    const practice = practiceKpisFromAttempts(attempts);
    return NextResponse.json({ attempts, practice });
  } catch (e) {
    return jsonAuthError(e) ?? NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
