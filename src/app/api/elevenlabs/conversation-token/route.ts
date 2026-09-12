import { NextResponse } from "next/server";

/**
 * Issues a short-lived conversation token for WebRTC sessions.
 * Keeps ELEVENLABS_API_KEY on the server. Works with or without agent auth.
 */
export async function GET() {
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
