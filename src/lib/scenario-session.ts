import type { PracticeScenario } from "@/data/scenarios";
import { NEVER_END_CALL_RULE } from "@/lib/practice-constants";

/**
 * ElevenLabs session overrides for a drill.
 * Always set both firstMessage + prompt so every scenario takes the same path
 * (no special-case for fee vs others). Prompt override only accepts `prompt` /
 * `llm` — it does not touch built_in_tools on the platform agent.
 *
 * Requires platform_settings.overrides.conversation_config_override.agent
 * first_message + prompt.prompt = true on the Cornerman agent. If those flags
 * are false, non-fee scenarios sit in "listening" with no client opening line.
 */
export function buildSessionOverrides(scenario: PracticeScenario) {
  return {
    agent: {
      firstMessage: scenario.openingLine,
      prompt: {
        prompt: ensureNeverEndCall(scenario.agentSystemPrompt),
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
