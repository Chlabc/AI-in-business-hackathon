export type CueMode = "off" | "soft" | "full";

export const CUE_MODE_STORAGE_KEY = "cornerman.cueMode";

export function parseCueMode(raw: string | null | undefined): CueMode {
  if (raw === "off" || raw === "soft" || raw === "full") return raw;
  return "soft";
}

/**
 * Pick which talk-track anchor to spotlight from the latest client (agent) turn.
 * Heuristic only — coaching stays in our UI, never in ElevenLabs.
 */
export function pickSpotlightIndex(
  agentText: string,
  anchorPoints: string[],
): number {
  if (!anchorPoints.length) return 0;
  const t = agentText.toLowerCase();

  const find = (re: RegExp) =>
    anchorPoints.findIndex((a) => re.test(a.toLowerCase()));

  if (
    /too high|%\s*|percent|fee|price|cost|cheaper|quoted|expensive|discount/.test(
      t,
    )
  ) {
    const i = find(/compar|clarif|too high|against|vacancy|anchor|value|fee/);
    if (i >= 0) return i;
  }
  if (
    /another agency|already (have|use)|relationship|switch|incumbent|competitor/.test(
      t,
    )
  ) {
    const i = find(/relationship|gap|incumbent|parallel|trial|respect/);
    if (i >= 0) return i;
  }
  if (/think|get back|later|not sure|co-founder|need to/.test(t)) {
    const i = find(/next|follow|check-in|diary|date|step|sla|exclusive/);
    if (i >= 0) return i;
  }
  if (/not (looking|hiring|interested)|no thanks|brush/.test(t)) {
    const i = find(/pushy|insight|check-in|useful|market/);
    if (i >= 0) return i;
  }
  if (/just send|cvs?|resume|candidates/.test(t)) {
    const i = find(/quality|must-have|shortlist|volume|vetted/);
    if (i >= 0) return i;
  }

  return 0;
}
