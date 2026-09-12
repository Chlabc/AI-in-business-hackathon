/**
 * ElevenLabs WebRTC / Agents SDK often emits empty or hangup-related errors
 * that look scary in the Next overlay but are not actionable for the user.
 */
export function formatUnknownError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const o = err as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    try {
      const s = JSON.stringify(err);
      if (s && s !== "{}") return s;
    } catch {
      /* ignore */
    }
  }
  return "";
}

export function isBenignElevenLabsError(...parts: unknown[]): boolean {
  const text = parts
    .map((a) => {
      if (typeof a === "string") return a;
      return formatUnknownError(a) || String(a);
    })
    .join(" ")
    .toLowerCase()
    .trim();

  if (!text || text === "{}" || text === "[object object]") return true;

  return (
    text.includes("signal stream") ||
    text.includes("reading from signal") ||
    text.includes("unknown error") ||
    text.includes("server error: unknown") ||
    // empty payload after a label, e.g. "Server error: {}"
    /server error:\s*(\{\}|unknown)?\s*$/i.test(text) ||
    text === "error" ||
    text === "unknown"
  );
}
