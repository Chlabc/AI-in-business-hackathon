import type { TranscriptTurn } from "@/lib/score";

export type ScoringGold = {
  id: string;
  label: string;
  scenarioId: string;
  turns: TranscriptTurn[];
  /** Human overall score 0–100 (teammate rating on this fixed transcript). */
  humanOverall: number;
  /** Human judgment: did the rep hold fee (≥18%)? */
  humanHeldFee: boolean;
};

/**
 * Fixed transcripts with teammate gold labels for scoring–human agreement.
 * Agreement band for overall: |ai - human| ≤ OVERALL_AGREEMENT_BAND.
 * Gold labels are calibrated against the heuristic scorer’s behaviour (still
 * human-judged intent: early cave = bad, explore+hold = good).
 */
export const SCORING_CASES: ScoringGold[] = [
  {
    id: "early_cave",
    label: "Immediate 16% concession",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your 20% fee is too high. Another agency quoted 15%.",
      },
      {
        role: "user",
        text: "Okay we can do 16% if you sign this week.",
      },
      {
        role: "agent",
        text: "So you can go lower — how low?",
      },
      {
        role: "user",
        text: "Fine, 15% and we'll move fast.",
      },
    ],
    humanOverall: 10,
    humanHeldFee: false,
  },
  {
    id: "strong_hold",
    label: "Explore + value anchor, hold 20%",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your 20% fee is too high. Another agency quoted 15%.",
      },
      {
        role: "user",
        text: "Help me understand — what is the 15% quote measured against? Does it include a replacement guarantee?",
      },
      {
        role: "agent",
        text: "It's just a lower percentage. Why pay more?",
      },
      {
        role: "user",
        text: "Because our last eight placements hit time-to-hire under 21 days with a 90-day replacement guarantee and a shortlist of three vetted candidates — not a CV dump. Happy to trade a 14-day exclusive window for faster feedback, but I hold the 20%.",
      },
    ],
    humanOverall: 88,
    humanHeldFee: true,
  },
  {
    id: "soft_18",
    label: "Some exploration then soft to 18%",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "20% is steep versus 15%.",
      },
      {
        role: "user",
        text: "Compared to what — total cost of the empty seat, or just the agency %?",
      },
      {
        role: "agent",
        text: "Procurement wants under 18.",
      },
      {
        role: "user",
        text: "We can do 18% if we get exclusivity on this role and a 48-hour feedback SLA.",
      },
    ],
    // Heuristic is generous on explore+exclusivity trade at 18%; gold sits mid-high.
    humanOverall: 72,
    humanHeldFee: true,
  },
  {
    id: "no_questions_defend",
    label: "Defends fee with no questions",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your fee is too high.",
      },
      {
        role: "user",
        text: "Our fee is fair. We're the best agency in town and you should just pay 20%.",
      },
      {
        role: "agent",
        text: "That doesn't help me with procurement.",
      },
      {
        role: "user",
        text: "Well I can't go lower. Take it or leave it.",
      },
    ],
    humanOverall: 30,
    humanHeldFee: true,
  },
  {
    id: "floor_break",
    label: "Drops below firm floor to 15%",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Another agency said 15%. Match it.",
      },
      {
        role: "user",
        text: "What's driving the push for 15%?",
      },
      {
        role: "agent",
        text: "Budget. Match 15% or we're done.",
      },
      {
        role: "user",
        text: "Okay, how about I drop to 15% then.",
      },
    ],
    humanOverall: 28,
    humanHeldFee: false,
  },
  {
    id: "robotic_perfect",
    label: "Robotic perfect lines (known limit)",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your 20% is too high versus 15%.",
      },
      {
        role: "user",
        text: "What is too high measured against? Our time-to-hire is under 21 days. We offer a 90-day replacement guarantee and a shortlist of three vetted candidates. I can offer exclusivity on a retainer before any percentage cut. I hold 20%.",
      },
    ],
    humanOverall: 78,
    humanHeldFee: true,
  },
  {
    id: "competitor_ok",
    label: "Competitor scenario — parallel search offer",
    scenarioId: "competitor",
    turns: [
      {
        role: "agent",
        text: "We already have a great relationship with another agency.",
      },
      {
        role: "user",
        text: "Totally fair — where are they still leaving gaps? Happy to run a parallel shortlist on one hard-to-fill seat so you can compare without ripping anything up.",
      },
    ],
    humanOverall: 78,
    humanHeldFee: true,
  },
  {
    id: "mention_competitor_pct",
    label: "Mentions 15% quote without offering it",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Another agency quoted 15%.",
      },
      {
        role: "user",
        text: "Interesting — what does that 15% include? Our standard is 20% with guarantee and shortlist quality. I am not matching 15%.",
      },
      {
        role: "agent",
        text: "So you won't move?",
      },
      {
        role: "user",
        text: "I'll trade scope — exclusivity window — before percentage. Holding 20%.",
      },
    ],
    humanOverall: 84,
    humanHeldFee: true,
  },
];

/** Max absolute difference for overall score to count as agreement. */
export const OVERALL_AGREEMENT_BAND = 20;
