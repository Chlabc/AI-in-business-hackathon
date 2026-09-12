export type PhaseStatus = "done" | "active" | "pending";

export type Phase = {
  id: number;
  title: string;
  hours: string;
  status: PhaseStatus;
  summary: string;
};

/** Update statuses as stages complete. */
export const PHASES: Phase[] = [
  {
    id: 0,
    title: "Scaffold & scope lock",
    hours: "0–2",
    status: "done",
    summary: "Next.js app, README scope, env template, landing page",
  },
  {
    id: 1,
    title: "Seed data & diagnosis",
    hours: "2–6",
    status: "done",
    summary: "Call histories, talk-tracks, diagnosis API + KPI coach UI",
  },
  {
    id: 2,
    title: "Voice client persona",
    hours: "6–12",
    status: "active",
    summary: "ElevenLabs fee-objection roleplay on production URL",
  },
  {
    id: 3,
    title: "Scoring & feedback",
    hours: "12–18",
    status: "pending",
    summary: "Rubric scores grounded in approved talk-tracks",
  },
  {
    id: 4,
    title: "Close the loop",
    hours: "18–24",
    status: "pending",
    summary: "Re-practice, progress view, rep-owned sharing",
  },
  {
    id: 5,
    title: "Eval harness",
    hours: "24–30",
    status: "pending",
    summary: "Diagnosis accuracy + scoring–human agreement",
  },
  {
    id: 6,
    title: "User tests & value",
    hours: "30–36",
    status: "pending",
    summary: "3–5 sessions, before/after, ROI blurb",
  },
  {
    id: 7,
    title: "Harden & document",
    hours: "36–42",
    status: "pending",
    summary: "Stress cases, README, architecture diagram",
  },
  {
    id: 8,
    title: "Demo & submit",
    hours: "42–48",
    status: "pending",
    summary: "Video, Devpost, freeze with spare time",
  },
];

export const SCOPE_SENTENCE =
  "Cornerman diagnoses a recruitment rep’s losing pattern from seeded call outcomes, runs a live ElevenLabs fee-objection roleplay, scores against approved talk-tracks, and shows progress — rep-owned, not surveillance.";

export const KILL_LIST = [
  "Live CRM / ATS / call-recording integration",
  "Multi-vertical generic sales coaching",
  "Manager “who’s failing” leaderboard or raw transcript surveillance",
  "Mobile apps, payments, full enterprise SSO",
  "Invented fees or ungrounded best-practice advice",
] as const;
