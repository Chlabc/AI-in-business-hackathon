import { NextResponse } from "next/server";
import { DEMO_REP_ID } from "@/data/seed";
import { AuthError, getSession, requireRole } from "@/lib/auth";
import { getShareSettings, setShareSettings } from "@/lib/share";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  // Employees only see/edit their own; managers may read Alex's settings for the dashboard
  const repId =
    user.role === "employee"
      ? (user.repId ?? DEMO_REP_ID)
      : (searchParams.get("repId") ?? DEMO_REP_ID);
  const settings = await getShareSettings(repId);
  return NextResponse.json(settings);
}

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
    user.repId ?? DEMO_REP_ID,
    body.shareProgressWithManager,
  );
  return NextResponse.json(settings);
}
