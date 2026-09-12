/** Demo team KPIs — illustrative, from Huey-style manager dashboard. */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  conversionRate: number;
  weakestSkill: string;
  flagged: boolean;
  sessionsCompleted: number;
  kpiHistory: { month: string; conversionRate: number }[];
};

export const TEAM_AVERAGE_CONVERSION = 27;

export const TEAM: TeamMember[] = [
  {
    id: "alex",
    name: "Alex Chen",
    role: "Recruitment Consultant",
    conversionRate: 22,
    weakestSkill: "Fee objection handling",
    flagged: true,
    sessionsCompleted: 0, // filled live from attempts when rendering
    kpiHistory: [
      { month: "Apr", conversionRate: 18 },
      { month: "May", conversionRate: 17 },
      { month: "Jun", conversionRate: 19 },
      { month: "Jul", conversionRate: 20 },
      { month: "Aug", conversionRate: 22 },
    ],
  },
  {
    id: "priya",
    name: "Priya Nair",
    role: "Recruitment Consultant",
    conversionRate: 29,
    weakestSkill: "Closing and next steps",
    flagged: false,
    sessionsCompleted: 2,
    kpiHistory: [
      { month: "Apr", conversionRate: 26 },
      { month: "May", conversionRate: 27 },
      { month: "Jun", conversionRate: 28 },
      { month: "Jul", conversionRate: 29 },
      { month: "Aug", conversionRate: 29 },
    ],
  },
  {
    id: "marcus",
    name: "Marcus Lee",
    role: "Recruitment Consultant",
    conversionRate: 19,
    weakestSkill: "Competitive positioning",
    flagged: true,
    sessionsCompleted: 1,
    kpiHistory: [
      { month: "Apr", conversionRate: 20 },
      { month: "May", conversionRate: 19 },
      { month: "Jun", conversionRate: 18 },
      { month: "Jul", conversionRate: 19 },
      { month: "Aug", conversionRate: 19 },
    ],
  },
];
