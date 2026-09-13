import { NextResponse } from "next/server";
import { jsonAuthError, requireRole } from "@/lib/auth";
import { getPlaybook } from "@/lib/playbook";
import { extractPlaybookFromDocument } from "@/lib/playbook-import";

export async function POST(request: Request) {
  try {
    await requireRole("manager");
    let body: { text?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const text = typeof body.text === "string" ? body.text : "";
    if (!text.trim()) {
      return NextResponse.json(
        { error: "Paste or upload document text first" },
        { status: 400 },
      );
    }
    if (text.length > 200_000) {
      return NextResponse.json(
        { error: "Document too large (max ~200k characters)" },
        { status: 400 },
      );
    }

    const current = await getPlaybook();
    const result = extractPlaybookFromDocument(text, current);
    return NextResponse.json(result);
  } catch (e) {
    return (
      jsonAuthError(e) ??
      NextResponse.json({ error: "Import failed" }, { status: 500 })
    );
  }
}
