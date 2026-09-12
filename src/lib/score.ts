import { getScenario } from "@/data/scenarios";
import {
  FEE_RUBRIC,
  type CriterionScore,
  type PracticeScore,
  type RubricCriterionId,
} from "@/lib/rubric";
import {
  defaultPlaybook,
  getPlaybook,
  getPlaybookTalkTrack,
  type FirmPlaybook,
} from "@/lib/playbook";

export type TranscriptTurn = {
  role: "user" | "agent" | "system";
  text: string;
};

function suggestedForScenario(
  scenarioId: string,
  talkTrackPlay: string,
  playbook: FirmPlaybook,
  exampleLine?: string,
): string {
  if (exampleLine?.trim()) return exampleLine.trim();
  switch (scenarioId) {
    case "competitor":
      return "I respect that relationship — where are they still leaving gaps? Happy to run a parallel shortlist on one hard-to-fill seat so you can compare without ripping anything up.";
    case "not-interested":
      return "Totally fair. If helpful I’ll leave one market note and book a 10-minute check-in next month — no pitch deck, just signal on roles like yours.";
    case "need-to-think":
      return "Makes sense. Shall I send a one-pager and we lock 15 minutes Thursday to decide go / no-go with your co-founder on the call?";
    case "price-objection":
    default: {
      const guarantee =
        playbook.valueAnchors.find((a) => /guarantee/i.test(a)) ??
        playbook.valueAnchors[0] ??
        "our guarantee";
      return `Before we talk numbers — what would a bad hire in month two cost your team? That’s what ${guarantee} protects. ${talkTrackPlay}`;
    }
  }
}

function userText(turns: TranscriptTurn[]): string {
  return turns
    .filter((t) => t.role === "user")
    .map((t) => t.text)
    .join("\n")
    .toLowerCase();
}

function firstUserText(turns: TranscriptTurn[]): string {
  const first = turns.find((t) => t.role === "user");
  return (first?.text ?? "").toLowerCase();
}

/** Detect fee % the rep actually offers/concedes — not competitor quotes they mention. */
function extractOfferedFees(text: string): number[] {
  const found: number[] = [];
  const offerPatterns = [
    /(?:we can do|i can do|how about|let'?s say|drop(?:ping)?(?: it)? to|come down to|meet you at|offer(?:ing)?)\s*(\d{1,2}(?:\.\d+)?)\s*%/g,
    /(?:we can do|i can do|how about|let'?s say|drop(?:ping)?(?: it)? to|come down to|meet you at|offer(?:ing)?)\s*(\d{1,2}(?:\.\d+)?)\s*percent/g,
  ];
  for (const re of offerPatterns) {
    for (const m of text.matchAll(re)) {
      const n = Number(m[1]);
      if (n >= 10 && n <= 30) found.push(n);
    }
  }
  return found;
}

function softHoldBar(playbook: FirmPlaybook): number {
  return Math.max(playbook.feeFloorPct, playbook.standardPermFeePct - 2);
}

function scoreCriterion(
  id: RubricCriterionId,
  turns: TranscriptTurn[],
  playbook: FirmPlaybook,
): Omit<CriterionScore, "label" | "max"> {
  const all = userText(turns);
  const first = firstUserText(turns);
  const offered = extractOfferedFees(all);
  const firstOffered = extractOfferedFees(first);
  const minOffered = offered.length ? Math.min(...offered) : null;
  const std = playbook.standardPermFeePct;
  const floor = playbook.feeFloorPct;
  const soft = softHoldBar(playbook);

  switch (id) {
    case "explored_objection": {
      const hits =
        /what.*(too high|mean|against|compar)|compar|other agency|quoted|based on|relative to|include/.test(
          all,
        );
      return {
        id,
        score: hits ? 1 : /why|how come|help me understand/.test(all) ? 0.5 : 0,
        notes: hits
          ? "You probed what ‘too high’ referred to."
          : "Little exploration of the competing quote before defending.",
      };
    }
    case "asked_clarifying_q": {
      const qs = (all.match(/\?/g) ?? []).length;
      return {
        id,
        score: qs >= 2 ? 1 : qs === 1 ? 0.6 : 0,
        notes:
          qs >= 1
            ? `Asked ${qs} clarifying question(s).`
            : "No clear clarifying questions detected.",
      };
    }
    case "anchored_value": {
      const hits =
        /time[- ]to[- ]hire|guarantee|shortlist|vetted|replacement|21 days|quality|speed|sla/.test(
          all,
        );
      return {
        id,
        score: hits ? 1 : /value|worth|invest/.test(all) ? 0.4 : 0,
        notes: hits
          ? "Anchored on approved value themes."
          : "Missed firm anchors (time-to-hire / guarantee / shortlist).",
      };
    }
    case "held_fee": {
      if (minOffered === null) {
        const cave =
          /we can do|i can do|how about|let.?s say|drop|discount|lower/.test(
            all,
          );
        return {
          id,
          score: cave ? 0.3 : 0.85,
          notes: cave
            ? "Sounded open to dropping fee without a clear held number."
            : "No explicit fee drop detected — treated as holding the ask.",
        };
      }
      if (minOffered < floor) {
        return {
          id,
          score: 0,
          notes: `Offered ${minOffered}% — below firm floor (${floor}%).`,
        };
      }
      if (minOffered < soft) {
        return {
          id,
          score: 0.35,
          notes: `Moved to ${minOffered}% — above floor but soft vs ${std}% standard.`,
        };
      }
      if (minOffered < std) {
        return {
          id,
          score: 0.7,
          notes: `Held near standard at ${minOffered}%.`,
        };
      }
      return {
        id,
        score: 1,
        notes: `Held the ${std}% ask.`,
      };
    }
    case "used_approved_play": {
      const hits =
        /exclusiv|retainer|scope|trial|parallel|must-have|feedback sla|anchor/.test(
          all,
        ) || /time[- ]to[- ]hire|guarantee|shortlist/.test(all);
      return {
        id,
        score: hits ? 1 : 0.2,
        notes: hits
          ? "Language overlaps the approved fee play."
          : "Little overlap with approved play structure.",
      };
    }
    case "no_early_cave": {
      const early =
        firstOffered.some((n) => n < std) ||
        /we can do \d+|i can do \d+|how about \d+/.test(first);
      return {
        id,
        score: early ? 0 : 1,
        notes: early
          ? "Conceded (or offered lower) in the first turn."
          : "Did not cave in the opening turn.",
      };
    }
  }
}

export function scoreTranscriptHeuristic(
  turns: TranscriptTurn[],
  scenarioId = "price-objection",
  playbook: FirmPlaybook = defaultPlaybook(),
): PracticeScore {
  const scenario = getScenario(scenarioId);
  const talkTrack = getPlaybookTalkTrack(playbook, scenario.objectionType);
  const criteria: CriterionScore[] = FEE_RUBRIC.map((c) => {
    const raw = scoreCriterion(c.id, turns, playbook);
    return {
      id: c.id,
      label: c.label,
      score: raw.score,
      max: c.weight,
      notes: raw.notes,
    };
  });

  const earned = criteria.reduce((sum, c) => sum + c.score * c.max, 0);
  const max = criteria.reduce((sum, c) => sum + c.max, 0);
  const overall = Math.round((earned / max) * 100);

  const all = userText(turns);
  const offered = extractOfferedFees(all);
  const feeOfferedPct = offered.length ? Math.min(...offered) : null;
  const holdBar = softHoldBar(playbook);
  const heldFee =
    feeOfferedPct === null
      ? !/we can do|drop to|discount to/.test(all)
      : feeOfferedPct >= holdBar;

  const feedback: string[] = [];
  const weak = [...criteria].sort((a, b) => a.score - b.score).slice(0, 3);
  for (const w of weak) {
    if (w.score < 0.75) feedback.push(`${w.label}: ${w.notes}`);
  }
  const strong = criteria.filter((c) => c.score >= 0.8);
  if (strong[0]) {
    feedback.unshift(`Strength — ${strong[0].label}: ${strong[0].notes}`);
  }
  feedback.push(`Approved play: ${talkTrack.approvedPlay}`);
  feedback.push(
    `Firm pricing (approved): standard ${playbook.standardPermFeePct}%, floor ${playbook.feeFloorPct}%.`,
  );

  return {
    overall,
    heldFee,
    feeOfferedPct,
    criteria,
    feedback: feedback.slice(0, 5),
    approvedPlayReminder: talkTrack.approvedPlay,
    suggestedResponse: suggestedForScenario(
      scenario.id,
      talkTrack.approvedPlay,
      playbook,
      talkTrack.exampleLine,
    ),
    method: "heuristic",
    talkTrackId: talkTrack.id,
    scenarioId: scenario.id,
  };
}

/**
 * Optional SpaceXAI refinement. Falls back to heuristic if no key / failure.
 */
export async function scoreTranscript(
  turns: TranscriptTurn[],
  scenarioId = "price-objection",
): Promise<PracticeScore> {
  const playbook = await getPlaybook();
  const base = scoreTranscriptHeuristic(turns, scenarioId, playbook);
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return base;

  try {
    const talkTrack = getPlaybookTalkTrack(playbook, "fee");
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `You score a recruitment fee-objection roleplay. Return ONLY JSON:
{"overall":0-100,"feedback":["bullet1","bullet2","bullet3"],"heldFee":true|false}
Rules: feedback must be behavioural and grounded in the approved talk-track. Never invent fees below ${playbook.feeFloorPct}%. Never invent policies.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              approvedPlay: talkTrack.approvedPlay,
              firm: {
                standard: playbook.standardPermFeePct,
                floor: playbook.feeFloorPct,
              },
              heuristic: base,
              transcript: turns.filter((t) => t.role !== "system"),
            }),
          },
        ],
      }),
    });
    if (!res.ok) return base;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return base;
    const parsed = JSON.parse(match[0]) as {
      overall?: number;
      feedback?: string[];
      heldFee?: boolean;
    };
    return {
      ...base,
      overall:
        typeof parsed.overall === "number"
          ? Math.max(0, Math.min(100, Math.round(parsed.overall)))
          : base.overall,
      heldFee:
        typeof parsed.heldFee === "boolean" ? parsed.heldFee : base.heldFee,
      feedback: Array.isArray(parsed.feedback)
        ? parsed.feedback.slice(0, 5)
        : base.feedback,
      method: "llm+heuristic",
    };
  } catch {
    return base;
  }
}
