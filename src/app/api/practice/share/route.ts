import { NextResponse } from "next/server";
import {
  jsonAuthError,
  repIdForViewer,
  requireRole,
  requireUser,
} from "@/lib/auth";
import { getShareSettings, setShareSettings } from "@/lib/share";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const repId = repIdForViewer(user, searchParams.get("repId"));
    const settings = await getShareSettings(repId);
    return NextResponse.json(settings);
  } catch (e) {
    return jsonAuthError(e) ?? NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole("employee");
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
      repIdForViewer(user),
      body.shareProgressWithManager,
    );
    return NextResponse.json(settings);
  } catch (e) {
    return jsonAuthError(e) ?? NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
