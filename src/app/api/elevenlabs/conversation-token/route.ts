import { NextResponse } from "next/server";
import { AuthError, requireRole } from "@/lib/auth";

/**
 * Issues a short-lived conversation token for WebRTC sessions.
 * Keeps ELEVENLABS_API_KEY on the server. Employee-only (managers don't drill).
 */
export async function GET() {
  try {
    await requireRole("employee");
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json(
      {
        error:
          "Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in server env",
      },
      { status: 500 },
    );
  }

  const url = new URL(
    "https://api.elevenlabs.io/v1/convai/conversation/token",
  );
  url.searchParams.set("agent_id", agentId);

  const response = await fetch(url, {
    headers: { "xi-api-key": apiKey },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json(
      {
        error: "Failed to create conversation token",
        detail: detail.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const body = (await response.json()) as { token?: string };
  if (!body.token) {
    return NextResponse.json(
      { error: "ElevenLabs response missing token" },
      { status: 502 },
    );
  }

  return NextResponse.json({ token: body.token, agentId });
}
