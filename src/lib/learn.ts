import type { FirmPlaybook } from "@/lib/playbook";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  tag: string;
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  /** Correct option id */
  correctId: string;
  explain: string;
};

function money(n: number): string {
  return `$${n}/seat/mo`;
}

/** Study cards derived from the current firm playbook. */
export function buildFlashcards(playbook: FirmPlaybook): Flashcard[] {
  const cards: Flashcard[] = [
    {
      id: "list",
      front: "What is our list seat price?",
      back: money(playbook.standardPermFeePct),
      tag: "Pricing",
    },
    {
      id: "floor",
      front: "What is the approval floor (never go below without approval)?",
      back: money(playbook.feeFloorPct),
      tag: "Pricing",
    },
    {
      id: "competitor",
      front: "What competitor seat price might the buyer quote?",
      back: money(playbook.competitorQuotePct),
      tag: "Competitive",
    },
  ];

  playbook.valueAnchors.slice(0, 3).forEach((anchor, i) => {
    cards.push({
      id: `anchor_${i}`,
      front: `Name value anchor ${i + 1} — what do you point to instead of cutting price?`,
      back: anchor,
      tag: "Value",
    });
  });

  const feeTrack =
    playbook.talkTracks.find((t) => t.objectionType === "fee") ??
    playbook.talkTracks[0];
  if (feeTrack) {
    cards.push({
      id: "fee_play",
      front: `What is the approved way to handle "${feeTrack.title}"?`,
      back: feeTrack.approvedPlay,
      tag: "Talk-track",
    });
    if (feeTrack.neverDo[0]) {
      cards.push({
        id: "fee_never",
        front:
          "A client pushes back on price. What is the one thing you must never do?",
        back: feeTrack.neverDo[0],
        tag: "Guardrail",
      });
    }
  }

  const faqLine = playbook.faqNotes
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 20);
  if (faqLine) {
    cards.push({
      id: "faq",
      front: "What does the firm's playbook FAQ tell you here?",
      back: faqLine.replace(/^[-*•]\s*/, ""),
      tag: "FAQ",
    });
  }

  return cards;
}

/**
 * Five multiple-choice questions grounded in playbook facts.
 * Deterministic option order (no Math.random) so demos stay stable.
 */
export function buildQuiz(playbook: FirmPlaybook): QuizQuestion[] {
  const list = playbook.standardPermFeePct;
  const floor = playbook.feeFloorPct;
  const competitor = playbook.competitorQuotePct;
  const anchor = playbook.valueAnchors[0] ?? "time-to-value";
  const feeTrack =
    playbook.talkTracks.find((t) => t.objectionType === "fee") ??
    playbook.talkTracks[0];
  const neverDo =
    feeTrack?.neverDo[0] ?? "Immediate discount without a question";

  const wrongNever =
    feeTrack?.anchorPoints[0] ?? "Clarify the comparison before discounting";

  return [
    {
      id: "q_list",
      prompt: `What is ${playbook.firmName}’s list seat price in the playbook?`,
      options: [
        { id: "a", label: money(list) },
        { id: "b", label: money(Math.max(10, list - 20)) },
        { id: "c", label: money(competitor) },
        { id: "d", label: money(floor) },
      ],
      correctId: "a",
      explain: `List is ${money(list)}. Floor is ${money(floor)} — different number.`,
    },
    {
      id: "q_floor",
      prompt: "What is the fee floor you must not break without approval?",
      options: [
        { id: "a", label: money(list) },
        { id: "b", label: money(floor) },
        { id: "c", label: money(competitor) },
        { id: "d", label: money(Math.max(5, floor - 10)) },
      ],
      correctId: "b",
      explain: `Floor is ${money(floor)}. Going below invents pricing the firm didn’t approve.`,
    },
    {
      id: "q_competitor",
      prompt: "If the buyer cites a competitor seat price, which figure is in our playbook?",
      options: [
        { id: "a", label: money(list) },
        { id: "b", label: money(floor) },
        { id: "c", label: money(competitor) },
        { id: "d", label: money(competitor + 15) },
      ],
      correctId: "c",
      explain: `Playbook competitor quote is ${money(competitor)} — explore before matching.`,
    },
    {
      id: "q_anchor",
      prompt: "Which of these is a firm value anchor?",
      options: [
        { id: "a", label: anchor },
        { id: "b", label: "We always discount 30% to close this week" },
        { id: "c", label: "Apologise for list price as unjustified" },
        {
          id: "d",
          label: "Ignore security / SLA and only talk price",
        },
      ],
      correctId: "a",
      explain: `Stand on approved anchors like “${anchor}”.`,
    },
    {
      id: "q_never",
      prompt: "On price pushback, which move is on the never-do list?",
      options: [
        { id: "a", label: wrongNever },
        { id: "b", label: neverDo },
        {
          id: "c",
          label: "Clarify what ‘too expensive’ is measured against",
        },
        {
          id: "d",
          label: "Trade annual prepay before cutting list price",
        },
      ],
      correctId: "b",
      explain: `Never: ${neverDo}`,
    },
  ];
}
