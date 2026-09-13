import type { TranscriptTurn } from "@/lib/score";

export type ScoringGold = {
  id: string;
  label: string;
  scenarioId: string;
  turns: TranscriptTurn[];
  /** Human overall score 0–100 (teammate rating on this fixed transcript). */
  humanOverall: number;
  /** Human judgment: did the rep hold near list (soft-hold bar)? */
  humanHeldFee: boolean;
};

/**
 * Fixed transcripts with teammate gold labels for scoring–human agreement.
 * B2B SaaS seat-price framing (list $100, floor $80).
 */
export const SCORING_CASES: ScoringGold[] = [
  {
    id: "early_cave",
    label: "Immediate $85 concession",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your $100/seat is too high. CompetitorX quoted $70.",
      },
      {
        role: "user",
        text: "Okay we can do $85 if you sign this week.",
      },
      {
        role: "agent",
        text: "So you can go lower — how low?",
      },
      {
        role: "user",
        text: "Fine, we can do $70 and we'll move fast.",
      },
    ],
    humanOverall: 10,
    humanHeldFee: false,
  },
  {
    id: "strong_hold",
    label: "Explore + value anchor, hold $100",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your $100/seat is too high. CompetitorX quoted $70.",
      },
      {
        role: "user",
        text: "Help me understand — what is the $70 quote measured against? Does it include SOC2, SSO, and a CSM?",
      },
      {
        role: "agent",
        text: "It's just a lower price. Why pay more?",
      },
      {
        role: "user",
        text: "Because our last twenty accounts hit time-to-value under 14 days with SOC2 Type II and a dedicated CSM plus 99.9% uptime SLA — not a self-serve dump. Happy to trade annual prepay for a small concession later, but I hold the $100 list.",
      },
    ],
    humanOverall: 88,
    humanHeldFee: true,
  },
  {
    id: "soft_18",
    label: "Some exploration then soft to $90",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "$100 is steep versus $70.",
      },
      {
        role: "user",
        text: "Compared to what — total cost of switching and downtime, or just seat sticker?",
      },
      {
        role: "agent",
        text: "Procurement wants under $90.",
      },
      {
        role: "user",
        text: "We can do $90 if we get annual prepay and a named CSM for the first quarter.",
      },
    ],
    humanOverall: 72,
    humanHeldFee: true,
  },
  {
    id: "no_questions_defend",
    label: "Defends price with no questions",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "Your price is too high.",
      },
      {
        role: "user",
        text: "Our price is fair. We're the best platform in the category and you should just pay $100.",
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
    label: "Drops below firm floor to $70",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "CompetitorX said $70. Match it.",
      },
      {
        role: "user",
        text: "What's driving the push for $70?",
      },
      {
        role: "agent",
        text: "Budget. Match $70 or we're done.",
      },
      {
        role: "user",
        text: "Okay, how about I drop to $70 then.",
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
        text: "Your $100 is too high versus $70.",
      },
      {
        role: "user",
        text: "What is too expensive measured against? Our time-to-value is under 14 days. We offer SOC2 Type II and a dedicated CSM. I can offer annual prepay before any discount. I hold $100.",
      },
    ],
    humanOverall: 78,
    humanHeldFee: true,
  },
  {
    id: "competitor_ok",
    label: "Competitor scenario — pilot offer",
    scenarioId: "competitor",
    turns: [
      {
        role: "agent",
        text: "We already have a great relationship with CompetitorX.",
      },
      {
        role: "user",
        text: "Totally fair — where are they still leaving gaps? Happy to run a 30-day pilot on one team so you can compare without ripping anything out.",
      },
    ],
    humanOverall: 78,
    humanHeldFee: true,
  },
  {
    id: "mention_competitor_pct",
    label: "Mentions $70 quote without offering it",
    scenarioId: "price-objection",
    turns: [
      {
        role: "agent",
        text: "CompetitorX quoted $70.",
      },
      {
        role: "user",
        text: "Interesting — what does that $70 include? Our list is $100 with SOC2 and CSM. I am not matching $70.",
      },
      {
        role: "agent",
        text: "So you won't move?",
      },
      {
        role: "user",
        text: "I'll trade scope — annual prepay — before discount. Holding $100.",
      },
    ],
    humanOverall: 84,
    humanHeldFee: true,
  },
];

/** |aiOverall - humanOverall| ≤ this counts as agreement. */
export const OVERALL_AGREEMENT_BAND = 20;
