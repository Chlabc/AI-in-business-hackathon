import type { CallRecord, Firm, Rep, TalkTrack } from "@/lib/types";

/**
 * Demo firm — B2B SaaS (fictional).
 * Numeric fields reuse legacy names: standardPermFeePct / feeFloorPct store
 * list seat $/mo and floor seat $/mo (not recruitment % fees).
 */
export const FIRM: Firm = {
  id: "firm_northline",
  name: "Northline",
  vertical: "B2B SaaS — workflow / ops platform",
  standardPermFeePct: 100, // list $100 / seat / mo
  feeFloorPct: 80, // never go below $80 without approval
  valueAnchors: [
    "time-to-value under 14 days on last 20 accounts",
    "SOC2 Type II + SSO / SCIM included on Team plan",
    "dedicated CSM + 99.9% uptime SLA",
  ],
};

export const REPS: Rep[] = [
  {
    id: "rep_demo_alex",
    name: "Alex Chen",
    title: "Account Executive",
    agency: FIRM.name,
    weeksInRole: 14,
  },
];

export const TALK_TRACKS: TalkTrack[] = [
  {
    id: "tt_price_anchor",
    objectionType: "fee",
    title: "Price pushback — explore, then anchor value",
    approvedPlay:
      "Ask what ‘too expensive’ is measured against, restate time-to-value / security / CSM, then hold near list. Do not discount in the first response.",
    anchorPoints: [
      "Clarify the comparison (competitor seat price vs total cost of switching)",
      "Anchor on time-to-value, SOC2, and CSM / SLA",
      "Offer scope trade (annual prepay / seat minimum) before cutting price",
    ],
    neverDo: [
      "Immediate discount without a question",
      "Invent a price below the firm floor",
      "Apologise for list price as if it were unjustified",
    ],
  },
  {
    id: "tt_competitor",
    objectionType: "other_agency",
    title: "We already use a competitor",
    approvedPlay:
      "Acknowledge the incumbent, ask where they still feel gaps, offer a low-risk pilot on one team or use-case.",
    anchorPoints: [
      "Respect the incumbent relationship",
      "Find the uncovered workflow or team",
      "Propose a time-boxed pilot, not a rip-and-replace",
    ],
    neverDo: ["Badmouth the competitor", "Demand a full rip-out on first call"],
  },
  {
    id: "tt_send_deck",
    objectionType: "just_cvs",
    title: "Just send a deck / free trial",
    approvedPlay:
      "Reframe: better to run a 20-minute scoped demo on their actual workflow than a generic trial dump. Capture must-haves first.",
    anchorPoints: [
      "Quality over spray-and-pray trials",
      "Capture must-haves before enabling access",
      "Promise a tailored walkthrough, not inbox spam",
    ],
    neverDo: ["Agree to open unlimited free seats with no discovery"],
  },
  {
    id: "tt_timing",
    objectionType: "timing",
    title: "Not buying right now",
    approvedPlay:
      "Book a light-touch check-in, ask about roadmap triggers, leave one relevant insight.",
    anchorPoints: ["Stay useful without being pushy", "Diary a follow-up"],
    neverDo: ["Hard-close a dead budget cycle"],
  },
  {
    id: "tt_procurement",
    objectionType: "exclusivity",
    title: "Need procurement / legal first",
    approvedPlay:
      "Offer a mutual NDA + security pack now, and a time-boxed commercial hold while legal reviews — not an open-ended stall.",
    anchorPoints: ["Security pack ready", "Time-boxed next step with a date"],
    neverDo: ["Walk away solely because legal is involved"],
  },
];

/**
 * Seeded call outcomes for Alex — labelled demo data.
 * Ground truth weak spot: pricing stage / price objection (high discount rate).
 * feeAskedPct / feeEndedPct = seat $/mo.
 */
export const CALLS: CallRecord[] = [
  {
    id: "call_01",
    repId: "rep_demo_alex",
    date: "2026-08-04",
    client: "Brightline Soft",
    role: "VP Operations",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 100,
    feeEndedPct: 85,
    transcriptSnippet:
      "Client: $100/seat is too high — CompetitorX is $70. Alex: Okay, we can do $85 if you sign this week.",
    notes: "Conceded in under 30s; no exploration of ‘too expensive’.",
  },
  {
    id: "call_02",
    repId: "rep_demo_alex",
    date: "2026-08-07",
    client: "Harbor Analytics",
    role: "Head of RevOps",
    stage: "needs",
    objectionType: "just_cvs",
    outcome: "won",
    feeAskedPct: 100,
    feeEndedPct: 100,
    transcriptSnippet:
      "Client wanted a free trial today. Alex secured must-haves and booked a scoped demo.",
    notes: "Strong discovery before access.",
  },
  {
    id: "call_03",
    repId: "rep_demo_alex",
    date: "2026-08-11",
    client: "Northwind Health",
    role: "COO",
    stage: "fee",
    objectionType: "fee",
    outcome: "lost",
    feeAskedPct: 100,
    feeEndedPct: 88,
    transcriptSnippet:
      "Alex dropped to $88 after one pushback. Client still stayed on incumbent tool.",
    notes: "Concession without value anchor; still lost.",
  },
  {
    id: "call_04",
    repId: "rep_demo_alex",
    date: "2026-08-14",
    client: "Cascade Fintech",
    role: "CISO office",
    stage: "intro",
    objectionType: "timing",
    outcome: "no_decision",
    feeAskedPct: 100,
    feeEndedPct: null,
    transcriptSnippet:
      "Budget locked until Q4. Alex booked a September check-in and left a security one-pager.",
    notes: "Fine handling of timing.",
  },
  {
    id: "call_05",
    repId: "rep_demo_alex",
    date: "2026-08-18",
    client: "Lumen Robotics",
    role: "VP Engineering",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 100,
    feeEndedPct: 70,
    transcriptSnippet:
      "Client: $100 won’t work. Alex: What’s your budget? … Fine, $70 and we’ll move fast.",
    notes: "Broke firm floor ($80). Critical failure.",
  },
  {
    id: "call_06",
    repId: "rep_demo_alex",
    date: "2026-08-21",
    client: "Orbit Retail",
    role: "Director of Ops",
    stage: "proposal",
    objectionType: "other_agency",
    outcome: "won",
    feeAskedPct: 100,
    feeEndedPct: 100,
    transcriptSnippet:
      "They use CompetitorX for warehouse. Alex proposed a pilot on HQ ops only.",
    notes: "Good competitor handling.",
  },
  {
    id: "call_07",
    repId: "rep_demo_alex",
    date: "2026-08-25",
    client: "Pinnacle Legal",
    role: "Managing Partner / ops",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 100,
    feeEndedPct: 82,
    transcriptSnippet:
      "Price objection. Alex apologised and offered $82 before asking any clarifying question.",
    notes: "Apologetic concession pattern repeats.",
  },
  {
    id: "call_08",
    repId: "rep_demo_alex",
    date: "2026-08-28",
    client: "Silverline Cloud",
    role: "VP Product",
    stage: "close",
    objectionType: "exclusivity",
    outcome: "won",
    feeAskedPct: 100,
    feeEndedPct: 100,
    transcriptSnippet:
      "Sent SOC2 pack + mutual NDA; held list price with a 10-day legal review window.",
    notes: "Procurement trade worked.",
  },
  {
    id: "call_09",
    repId: "rep_demo_alex",
    date: "2026-09-02",
    client: "Beacon Media",
    role: "CRO",
    stage: "fee",
    objectionType: "fee",
    outcome: "lost",
    feeAskedPct: 100,
    feeEndedPct: 90,
    transcriptSnippet:
      "Alex offered $90 immediately. Client said they’d ‘think about it’ and went dark.",
    notes: "Early drop signalled desperation.",
  },
  {
    id: "call_10",
    repId: "rep_demo_alex",
    date: "2026-09-05",
    client: "Quanta Bio",
    role: "Lab Ops Lead",
    stage: "needs",
    objectionType: "just_cvs",
    outcome: "won",
    feeAskedPct: 100,
    feeEndedPct: 100,
    transcriptSnippet:
      "Refused blind trial seats; delivered a 20-min demo on their sample workflow.",
    notes: "Talk-track followed.",
  },
  {
    id: "call_11",
    repId: "rep_demo_alex",
    date: "2026-09-08",
    client: "Atlas Construction Tech",
    role: "VP Sales Ops",
    stage: "fee",
    objectionType: "fee",
    outcome: "conceded",
    feeAskedPct: 100,
    feeEndedPct: 78,
    transcriptSnippet:
      "‘CompetitorX quoted $70.’ Alex matched toward $78 without asking what was included.",
    notes: "No comparison clarification; near floor.",
  },
  {
    id: "call_12",
    repId: "rep_demo_alex",
    date: "2026-09-10",
    client: "Riverbank Payments",
    role: "Head of Support",
    stage: "proposal",
    objectionType: "other_agency",
    outcome: "no_decision",
    feeAskedPct: 100,
    feeEndedPct: null,
    transcriptSnippet:
      "Happy with incumbent for ticket volume. Follow-up set on QA workflow gap.",
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
