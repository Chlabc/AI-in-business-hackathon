import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { getShareSettings, setShareSettings } from "@/lib/share";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repId = searchParams.get("repId") ?? DEMO_REP_ID;
  const settings = await getShareSettings(repId);
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  let body: { repId?: string; shareProgressWithManager?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.shareProgressWithManager !== "boolean") {
    return NextResponse.json(
      { error: "shareProgressWithManager boolean required" },
      { status: 400 },
    );
  }

  const settings = await setShareSettings(
    body.repId ?? DEMO_REP_ID,
    body.shareProgressWithManager,
  );
  return NextResponse.json(settings);
}
