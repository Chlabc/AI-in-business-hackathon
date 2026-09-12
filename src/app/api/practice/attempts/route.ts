import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { getSession } from "@/lib/auth";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const repId =
    user.role === "employee"
      ? (user.repId ?? DEMO_REP_ID)
      : (searchParams.get("repId") ?? DEMO_REP_ID);
  const attempts = await listAttempts(repId);
  const practice = practiceKpisFromAttempts(attempts);
  return NextResponse.json({ attempts, practice });
}
