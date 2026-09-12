import type { CallRecord, Firm, Rep, TalkTrack } from "@/lib/types";

/** Demo firm — clearly fictional seed data for the hackathon. */
export const FIRM: Firm = {
  id: "firm_northbridge",
  name: "Northbridge Talent",
  vertical: "Professional recruitment / staffing",
  standardPermFeePct: 20,
  feeFloorPct: 17,
  valueAnchors: [
    "time-to-hire under 21 days on last 8 placements",
    "90-day replacement guarantee",
    "shortlists of 3 vetted candidates, not CV dumps",
  ],
};

export const REPS: Rep[] = [
  {
    id: "rep_demo_alex",
    name: "Alex Chen",
    title: "Recruitment Consultant",
    agency: FIRM.name,
    weeksInRole: 14,
  },
];

export const TALK_TRACKS: TalkTrack[] = [
  {
    id: "tt_fee_anchor",
    objectionType: "fee",
    title: "Fee pushback — explore, then anchor value",
    approvedPlay:
      "Ask what ‘too high’ is measured against, restate time-to-hire and guarantee, then hold near standard fee. Do not drop in the first response.",
    anchorPoints: [
      "Clarify the comparison (other agency % vs total cost of vacancy)",
      "Anchor on time-to-hire and replacement guarantee",
      "Offer scope trade (exclusivity / retainer) before percentage cut",
    ],
    neverDo: [
      "Immediate concession without a question",
      "Invent a fee below the firm floor",
      "Apologise for the fee as if it were unjustified",
    ],
  },
  {
    id: "tt_other_agency",
    objectionType: "other_agency",
    title: "We already use another agency",
    approvedPlay:
      "Acknowledge the relationship, ask where they still feel gaps, offer a parallel shortlist on one hard-to-fill role.",
    anchorPoints: [
      "Respect the incumbent relationship",
      "Find the uncovered role or seniority band",
      "Propose a low-risk trial on one req",
    ],
    neverDo: ["Badmouth the other agency", "Demand exclusivity on first call"],
  },
  {
    id: "tt_just_cvs",
    objectionType: "just_cvs",
    title: "Just send CVs",
    approvedPlay:
      "Reframe: we send three vetted fits with interview notes, not a CV flood. Ask for must-haves before sending anything.",
    anchorPoints: [
      "Quality over volume",
      "Capture must-haves first",
      "Promise a shortlist format, not inbox spam",
    ],
    neverDo: ["Agree to spray 20 CVs same day"],
  },
  {
    id: "tt_timing",
    objectionType: "timing",
    title: "Not hiring right now",
    approvedPlay:
      "Book a light-touch check-in, ask about pipeline roles, leave one market insight.",
    anchorPoints: ["Stay useful without being pushy", "Diary a follow-up"],
    neverDo: ["Hard-close a dead req"],
  },
  {
    id: "tt_exclusivity",
    objectionType: "exclusivity",
    title: "We won’t go exclusive",
    approvedPlay:
      "Offer a 14-day exclusive window on one role in exchange for faster feedback SLAs — not a blanket exclusive.",
    anchorPoints: ["Time-boxed exclusive", "Trade for feedback speed"],
    neverDo: ["Walk away solely because they won’t go exclusive forever"],
  },
];

/**
 * Seeded call outcomes for Alex — labelled demo data.
 * Ground truth weak spot: fee stage / fee objection (high concede rate).
 */
export const CALLS: CallRecord[] = [
  {
    id: "call_01",
    repId: "rep_demo_alex",
    date: "2026-08-04",
    client: "Brightline Soft",
    role: "Senior Backend Engineer",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 20,
    feeEndedPct: 16,
    transcriptSnippet:
      "Client: Your 20% is too high — another firm said 15%. Alex: Okay, we can do 16% if you sign this week.",
    notes: "Conceded in under 30s; no exploration of ‘too high’.",
  },
  {
    id: "call_02",
    repId: "rep_demo_alex",
    date: "2026-08-07",
    client: "Harbor Analytics",
    role: "Data Engineer",
    stage: "needs",
    objectionType: "just_cvs",
    outcome: "won",
    feeAskedPct: 20,
    feeEndedPct: 20,
    transcriptSnippet:
      "Client wanted CVs today. Alex secured must-haves and sent a 3-person shortlist.",
    notes: "Strong needs discovery.",
  },
  {
    id: "call_03",
    repId: "rep_demo_alex",
    date: "2026-08-11",
    client: "Northwind Health",
    role: "Product Manager",
    stage: "fee",
    objectionType: "fee",
    outcome: "lost",
    feeAskedPct: 20,
    feeEndedPct: 17,
    transcriptSnippet:
      "Alex dropped to 17% after one pushback. Client still went with incumbent agency.",
    notes: "Concession without value anchor; still lost.",
  },
  {
    id: "call_04",
    repId: "rep_demo_alex",
    date: "2026-08-14",
    client: "Cascade Fintech",
    role: "Compliance Lead",
    stage: "intro",
    objectionType: "timing",
    outcome: "no_decision",
    feeAskedPct: 20,
    feeEndedPct: null,
    transcriptSnippet:
      "Not hiring until Q4. Alex booked a September check-in and left a market note.",
    notes: "Fine handling of timing.",
  },
  {
    id: "call_05",
    repId: "rep_demo_alex",
    date: "2026-08-18",
    client: "Lumen Robotics",
    role: "ML Engineer",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 20,
    feeEndedPct: 15,
    transcriptSnippet:
      "Client: 20% won’t work. Alex: What’s your budget for fee? … Fine, 15% and we’ll move fast.",
    notes: "Broke firm floor (17%). Critical failure.",
  },
  {
    id: "call_06",
    repId: "rep_demo_alex",
    date: "2026-08-21",
    client: "Orbit Retail",
    role: "Engineering Manager",
    stage: "proposal",
    objectionType: "other_agency",
    outcome: "won",
    feeAskedPct: 20,
    feeEndedPct: 20,
    transcriptSnippet:
      "They use another agency for juniors. Alex proposed a parallel search on EM only.",
    notes: "Good other-agency handling.",
  },
  {
    id: "call_07",
    repId: "rep_demo_alex",
    date: "2026-08-25",
    client: "Pinnacle Legal",
    role: "Corporate Associate",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 20,
    feeEndedPct: 17,
    transcriptSnippet:
      "Fee objection. Alex apologised and offered 17% before asking any clarifying question.",
    notes: "Apologetic concession pattern repeats.",
  },
  {
    id: "call_08",
    repId: "rep_demo_alex",
    date: "2026-08-28",
    client: "Silverline Cloud",
    role: "DevOps Engineer",
    stage: "close",
    objectionType: "exclusivity",
    outcome: "won",
    feeAskedPct: 20,
    feeEndedPct: 20,
    transcriptSnippet:
      "Agreed 14-day exclusive window for faster feedback — fee held at 20%.",
    notes: "Exclusivity trade worked.",
  },
  {
    id: "call_09",
    repId: "rep_demo_alex",
    date: "2026-09-02",
    client: "Beacon Media",
    role: "Full-Stack Engineer",
    stage: "fee",
    objectionType: "fee",
    outcome: "lost",
    feeAskedPct: 20,
    feeEndedPct: 18,
    transcriptSnippet:
      "Alex offered 18% immediately. Client said they’d ‘think about it’ and went dark.",
    notes: "Early drop signalled desperation.",
  },
  {
    id: "call_10",
    repId: "rep_demo_alex",
    date: "2026-09-05",
    client: "Quanta Bio",
    role: "Research Scientist",
    stage: "needs",
    objectionType: "just_cvs",
    outcome: "won",
    feeAskedPct: 20,
    feeEndedPct: 20,
    transcriptSnippet:
      "Refused CV spray; delivered three scored profiles with interview notes.",
    notes: "Talk-track followed.",
  },
  {
    id: "call_11",
    repId: "rep_demo_alex",
    date: "2026-09-08",
    client: "Atlas Construction Tech",
    role: "Solutions Architect",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 20,
    feeEndedPct: 16,
    transcriptSnippet:
      "‘Another agency quoted 15%.’ Alex matched toward 16% without asking what was included in that quote.",
    notes: "No comparison clarification.",
  },
  {
    id: "call_12",
    repId: "rep_demo_alex",
    date: "2026-09-10",
    client: "Riverbank Payments",
    role: "Fraud Analyst",
    stage: "proposal",
    objectionType: "other_agency",
    outcome: "no_decision",
    feeAskedPct: 20,
    feeEndedPct: null,
    transcriptSnippet:
      "Happy with incumbent for volume roles. Follow-up set on specialist fraud seat.",
    notes: "Acceptable hold pattern.",
  },
];

/** Gold label for eval harness (Phase 5). */
export const GOLD_DIAGNOSIS = {
  repId: "rep_demo_alex",
  primaryStage: "fee" as const,
  primaryObjection: "fee" as const,
};

export function getRep(repId: string): Rep | undefined {
  return REPS.find((r) => r.id === repId);
}

export function getCallsForRep(repId: string): CallRecord[] {
  return CALLS.filter((c) => c.repId === repId).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function getTalkTrackForObjection(
  objectionType: TalkTrack["objectionType"],
): TalkTrack {
  return (
    TALK_TRACKS.find((t) => t.objectionType === objectionType) ?? TALK_TRACKS[0]
  );
}

export const DEMO_REP_ID = "rep_demo_alex";
