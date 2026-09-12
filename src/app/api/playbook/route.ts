import { NextResponse } from "next/server";
import {
  getPlaybook,
  savePlaybook,
  type FirmPlaybook,
} from "@/lib/playbook";

export async function GET() {
  const playbook = await getPlaybook();
  return NextResponse.json(playbook);
}

export async function PUT(request: Request) {
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
