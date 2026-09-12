import { NextResponse } from "next/server";
import {
  getPlaybook,
  savePlaybook,
  type FirmPlaybook,
} from "@/lib/playbook";
import { AuthError, getSession, requireRole } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const playbook = await getPlaybook();
  return NextResponse.json(playbook);
}

export async function PUT(request: Request) {
  try {
    await requireRole("manager");
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }

  let body: Partial<FirmPlaybook>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const playbook = await savePlaybook(body);
    return NextResponse.json(playbook);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save playbook" },
      { status: 400 },
    );
  }
}
