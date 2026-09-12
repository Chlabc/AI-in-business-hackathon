import { promises as fs } from "fs";
import path from "path";
import { FIRM, TALK_TRACKS } from "@/data/seed";
import type { ObjectionType, TalkTrack } from "@/lib/types";

/** Editable firm knowledge — source of truth for coach UI + client overrides. */
export type PlaybookTalkTrack = {
  id: string;
  objectionType: ObjectionType;
  title: string;
  approvedPlay: string;
  anchorPoints: string[];
  neverDo: string[];
  /** Optional speakable example for Full hints */
  exampleLine: string;
};

export type FirmPlaybook = {
  firmId: string;
  firmName: string;
  vertical: string;
  standardPermFeePct: number;
  feeFloorPct: number;
  /** What the AI client claims a competitor quoted */
  competitorQuotePct: number;
  valueAnchors: string[];
  talkTracks: PlaybookTalkTrack[];
  /** Freeform dump — FAQ, policies, notes (not injected wholesale into ElevenLabs) */
  faqNotes: string;
  updatedAt: string;
};

const STORE = path.join(process.cwd(), "data", "playbook.json");

const DEFAULT_EXAMPLES: Partial<Record<ObjectionType, string>> = {
  fee: "Before we talk discount — what does a failed rollout cost you in the next quarter? That’s what our time-to-value and CSM cover. Happy to trade annual prepay before we touch list price.",
  other_agency:
    "I respect that CompetitorX relationship — where are they still leaving gaps? Happy to run a 30-day pilot on one team so you can compare without ripping anything out.",
  just_cvs:
    "We don’t open unlimited trial seats cold — better a 20-minute demo on your actual workflow. What are the must-haves before I enable access?",
  timing:
    "Totally fair. I’ll leave one relevant insight and book a 10-minute check-in next month — no pitch deck.",
  exclusivity:
    "How about I send the SOC2 pack + mutual NDA today, and we lock 20 minutes Thursday while legal reviews — not an open-ended stall?",
  other:
    "Help me understand what success looks like on this rollout before we talk commercials.",
};

export function defaultPlaybook(): FirmPlaybook {
  return {
    firmId: FIRM.id,
    firmName: FIRM.name,
    vertical: FIRM.vertical,
    standardPermFeePct: FIRM.standardPermFeePct,
    feeFloorPct: FIRM.feeFloorPct,
    competitorQuotePct: 70, // competitor seat $/mo quote
    valueAnchors: [...FIRM.valueAnchors],
    talkTracks: TALK_TRACKS.map((t) => talkTrackToPlaybook(t)),
    faqNotes:
      "Paste long FAQ / security / pricing policy notes here. Cornerman uses structured fields above for coaching and scoring; this dump is for humans and future retrieval — not pasted wholesale into the voice client.",
    updatedAt: new Date(0).toISOString(),
  };
}

function talkTrackToPlaybook(t: TalkTrack): PlaybookTalkTrack {
  return {
    id: t.id,
    objectionType: t.objectionType,
    title: t.title,
    approvedPlay: t.approvedPlay,
    anchorPoints: [...t.anchorPoints],
    neverDo: [...t.neverDo],
    exampleLine: DEFAULT_EXAMPLES[t.objectionType] ?? "",
  };
}

function normalize(raw: Partial<FirmPlaybook> | null | undefined): FirmPlaybook {
  const base = defaultPlaybook();
  if (!raw || typeof raw !== "object") return base;

  const standard =
    typeof raw.standardPermFeePct === "number"
      ? raw.standardPermFeePct
      : base.standardPermFeePct;
  const floor =
    typeof raw.feeFloorPct === "number" ? raw.feeFloorPct : base.feeFloorPct;

  const tracks =
    Array.isArray(raw.talkTracks) && raw.talkTracks.length > 0
      ? raw.talkTracks.map((t, i) => {
          const fallback = base.talkTracks[i] ?? base.talkTracks[0];
          return {
            id: typeof t.id === "string" ? t.id : fallback.id,
            objectionType: (t.objectionType ??
              fallback.objectionType) as ObjectionType,
            title: typeof t.title === "string" ? t.title : fallback.title,
            approvedPlay:
              typeof t.approvedPlay === "string"
                ? t.approvedPlay
                : fallback.approvedPlay,
            anchorPoints: Array.isArray(t.anchorPoints)
              ? t.anchorPoints.map(String)
              : fallback.anchorPoints,
            neverDo: Array.isArray(t.neverDo)
              ? t.neverDo.map(String)
              : fallback.neverDo,
            exampleLine:
              typeof t.exampleLine === "string"
                ? t.exampleLine
                : (DEFAULT_EXAMPLES[
                    (t.objectionType ?? fallback.objectionType) as ObjectionType
                  ] ?? ""),
          };
        })
      : base.talkTracks;

  return {
    firmId: typeof raw.firmId === "string" ? raw.firmId : base.firmId,
    firmName: typeof raw.firmName === "string" ? raw.firmName : base.firmName,
    vertical: typeof raw.vertical === "string" ? raw.vertical : base.vertical,
    standardPermFeePct: standard,
    feeFloorPct: Math.min(floor, standard),
    competitorQuotePct:
      typeof raw.competitorQuotePct === "number"
        ? raw.competitorQuotePct
        : base.competitorQuotePct,
    valueAnchors: Array.isArray(raw.valueAnchors)
      ? raw.valueAnchors.map(String).filter(Boolean)
      : base.valueAnchors,
    talkTracks: tracks,
    faqNotes: typeof raw.faqNotes === "string" ? raw.faqNotes : base.faqNotes,
    updatedAt:
      typeof raw.updatedAt === "string" ? raw.updatedAt : base.updatedAt,
  };
}

export async function getPlaybook(): Promise<FirmPlaybook> {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    return normalize(JSON.parse(raw) as Partial<FirmPlaybook>);
  } catch {
    return defaultPlaybook();
  }
}

export async function savePlaybook(
  input: Partial<FirmPlaybook>,
): Promise<FirmPlaybook> {
  const next = normalize({
    ...input,
    updatedAt: new Date().toISOString(),
  });
  if (next.feeFloorPct > next.standardPermFeePct) {
    throw new Error("Fee floor cannot be above standard fee");
  }
  if (next.standardPermFeePct < 1 || next.standardPermFeePct > 500) {
    throw new Error("List seat price must be between $1 and $500");
  }
  await fs.mkdir(path.dirname(STORE), { recursive: true });
  await fs.writeFile(STORE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export function getPlaybookTalkTrack(
  playbook: FirmPlaybook,
  objectionType: ObjectionType,
): PlaybookTalkTrack {
  return (
    playbook.talkTracks.find((t) => t.objectionType === objectionType) ??
    playbook.talkTracks[0] ??
    defaultPlaybook().talkTracks[0]
  );
}

/** Map playbook track into the legacy TalkTrack shape used by seed helpers. */
export function asTalkTrack(track: PlaybookTalkTrack): TalkTrack {
  return {
    id: track.id,
    objectionType: track.objectionType,
    title: track.title,
    approvedPlay: track.approvedPlay,
    anchorPoints: track.anchorPoints,
    neverDo: track.neverDo,
  };
}
