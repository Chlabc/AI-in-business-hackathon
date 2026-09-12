import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { listAttempts, practiceKpisFromAttempts } from "@/lib/attempts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repId = searchParams.get("repId") ?? DEMO_REP_ID;
  const attempts = await listAttempts(repId);
  const practice = practiceKpisFromAttempts(attempts);
  return NextResponse.json({ attempts, practice });
}
