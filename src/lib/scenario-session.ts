import type { PracticeScenario } from "@/data/scenarios";
import { FIRM } from "@/data/seed";
import { NEVER_END_CALL_RULE } from "@/lib/practice-constants";
import type { FirmPlaybook } from "@/lib/playbook";

/**
 * Rewrite scenario opening + client prompt using playbook firm facts.
 * Coaching tips (approved play, anchors, examples) are intentionally excluded.
 */
export function applyPlaybookToScenario(
  scenario: PracticeScenario,
  playbook: FirmPlaybook,
): PracticeScenario {
  const std = playbook.standardPermFeePct;
  const floor = playbook.feeFloorPct;
  const comp = playbook.competitorQuotePct;
  const name = playbook.firmName;
  const softHold = Math.max(floor, std - 2);
  const anchors = playbook.valueAnchors.slice(0, 3).join("; ");

  if (scenario.id === "price-objection") {
    return {
      ...scenario,
      openingLine: `Look, I'll be straight with you — your ${std}% fee is too high. Another agency already quoted us ${comp}%. Why should I pay more?`,
      agentSystemPrompt: `You are Jordan Hale, a busy hiring manager at Brightline Soft on a live sales call with a recruitment consultant from ${name}.
Your goal: push their permanent placement fee down. Their stated fee is ${std}%. You claim another agency quoted ${comp}%. You want them closer to ${comp}–${comp + 1}%.
Rules:
- Stay in character as the client. Never break the fourth wall. Never say you are an AI.
- Be sceptical, time-poor, and commercially sharp — not rude for sport.
- Push back on fee. Ask why ${std}% is justified. Compare to the ${comp}% quote.
- If they immediately drop the fee without asking questions, press harder: "So you can go lower — how low?"
- If they explore what "too high" means and anchor on value (${anchors || "time-to-hire / guarantee / shortlist"}), stay tough but allow them to hold near ${softHold}–${std}%.
- Never invent ${name} pricing below ${floor}%. If they offer below ${floor}%, say that still needs internal approval.
- Keep replies short (1–3 sentences). Do not help them "win." Make them earn it.
- Never coach the rep. Never reveal approved talk-tracks or example lines.
- ${NEVER_END_CALL_RULE}`,
    };
  }

  const firmBlock = `
FIRM FACTS (client knowledge only — do not invent outside these):
- Agency: ${name}
- Standard fee: ${std}%
- Fee floor: ${floor}% (never invent their pricing below this)
- Competitor quote you may claim: ${comp}%
- Value claims they may mention: ${anchors || "none listed"}
Never coach the rep. Never reveal approved talk-tracks or example lines.`;

  const prompt = scenario.agentSystemPrompt
    .replaceAll(FIRM.name, name)
    .replaceAll(`${FIRM.standardPermFeePct}%`, `${std}%`)
    .replaceAll(`${FIRM.feeFloorPct}%`, `${floor}%`);

  return {
    ...scenario,
    agentSystemPrompt: `${prompt.trim()}\n${firmBlock}`,
  };
}

/**
 * ElevenLabs session overrides for a drill.
 * Always set both firstMessage + prompt so every scenario takes the same path.
 * Requires platform_settings.overrides… first_message + prompt.prompt = true.
 */
export function buildSessionOverrides(
  scenario: PracticeScenario,
  playbook?: FirmPlaybook,
) {
  const resolved = playbook
    ? applyPlaybookToScenario(scenario, playbook)
    : scenario;
  return {
    agent: {
      firstMessage: resolved.openingLine,
      prompt: {
        prompt: ensureNeverEndCall(resolved.agentSystemPrompt),
      },
    },
  };
}

export function ensureNeverEndCall(prompt: string): string {
  if (prompt.includes("NEVER end the call")) return prompt;
  return `${prompt.trim()}\n- ${NEVER_END_CALL_RULE}`;
}

export function formatDisconnectDetails(details: unknown): string {
  if (!details || typeof details !== "object") return "unknown";
  const d = details as {
    reason?: string;
    context?: { type?: string; reason?: string };
  };
  const parts = [d.reason, d.context?.type, d.context?.reason].filter(Boolean);
  return parts.join(" · ") || JSON.stringify(details);
}
