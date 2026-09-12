export type EvalCaseRow = {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
};

/** Written by `npm run eval`; read by `/coach/health`. */
export type EvalSnapshot = {
  generatedAt: string;
  overallAgreementBand: number;
  headlines: {
    diagnosisPassed: number;
    diagnosisTotal: number;
    diagnosisPct: string;
    scoringOverallAgree: number;
    scoringHeldAgree: number;
    scoringFullPass: number;
    scoringTotal: number;
    scoringOverallPct: string;
    scoringHeldPct: string;
    personaPassed: number;
    personaTotal: number;
    personaPct: string;
  };
  diagnosis: EvalCaseRow[];
  scoring: EvalCaseRow[];
  persona: EvalCaseRow[];
  method: string[];
  knownLimits: string[];
  reproduce: string;
};
