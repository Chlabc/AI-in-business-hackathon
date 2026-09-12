"use client";

import { Conversation } from "@elevenlabs/client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeScenario } from "@/data/scenarios";
import {
  formatUnknownError,
  isBenignElevenLabsError,
} from "@/lib/elevenlabs-errors";
import type { PracticeScore } from "@/lib/rubric";
import {
  buildSessionOverrides,
  formatDisconnectDetails,
} from "@/lib/scenario-session";

export type TranscriptTurn = {
  id: string;
  role: "user" | "agent" | "system";
  text: string;
  at: string;
};

export type SessionStatus = "idle" | "connecting" | "connected" | "error";

type ConversationInstance = Awaited<
  ReturnType<typeof Conversation.startSession>
>;

async function fetchConversationToken(): Promise<string> {
  const res = await fetch("/api/elevenlabs/conversation-token");
  const data = (await res.json()) as {
    token?: string;
    error?: string;
    detail?: string;
  };
  if (!res.ok || !data.token) {
    throw new Error(
      data.error
        ? `${data.error}${data.detail ? ` — ${data.detail}` : ""}`
        : "Could not get conversation token",
    );
  }
  return data.token;
}

async function probeMicrophone(): Promise<void> {
  const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
  probe.getTracks().forEach((t) => t.stop());
}

/**
 * Owns the ElevenLabs voice session for one scenario mount.
 * Parent should remount with key={scenario.id} when the scenario changes.
 */
export function usePracticeConversation(scenario: PracticeScenario) {
  const [turns, setTurns] = useState<TranscriptTurn[]>([]);
  const turnsRef = useRef<TranscriptTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [score, setScore] = useState<PracticeScore | null>(null);
  const [lastDisconnect, setLastDisconnect] = useState<string | null>(null);

  const conversationRef = useRef<ConversationInstance | null>(null);
  const endingRef = useRef(false);
  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;

  const pushTurn = useCallback((role: TranscriptTurn["role"], text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    setTurns((prev) => {
      const next = [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          role,
          text: cleaned,
          at: new Date().toISOString(),
        },
      ];
      turnsRef.current = next;
      return next;
    });
  }, []);

  const resetLocal = useCallback(() => {
    setError(null);
    setLastDisconnect(null);
    setScore(null);
    setTurns([]);
    turnsRef.current = [];
    setConversationId(null);
    setIsSpeaking(false);
  }, []);

  const endSessionQuietly = useCallback(async () => {
    endingRef.current = true;
    const conv = conversationRef.current;
    conversationRef.current = null;
    if (conv) {
      try {
        await conv.endSession();
      } catch {
        /* teardown noise */
      }
    }
    setStatus("idle");
    setIsSpeaking(false);
  }, []);

  // Unmount / remount only — parent keys by scenario.id
  useEffect(() => {
    endingRef.current = false;
    return () => {
      void endSessionQuietly();
    };
  }, [endSessionQuietly]);

  const runScore = useCallback(async (cid: string | null) => {
    const snapshot = turnsRef.current.filter((t) => t.role !== "system");
    if (!snapshot.some((t) => t.role === "user")) {
      setError("No spoken turns from you to score — try another drill.");
      return;
    }
    setScoring(true);
    setError(null);
    try {
      const res = await fetch("/api/practice/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: cid,
          scenarioId: scenarioRef.current.id,
          turns: snapshot.map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = (await res.json()) as {
        score?: PracticeScore;
        error?: string;
      };
      if (!res.ok || !data.score) {
        throw new Error(data.error ?? "Scoring failed");
      }
      setScore(data.score);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scoring failed");
    } finally {
      setScoring(false);
    }
  }, []);

  const startingRef = useRef(false);

  const start = useCallback(async () => {
    if (conversationRef.current || startingRef.current) return;

    resetLocal();
    endingRef.current = false;
    startingRef.current = true;
    setStatus("connecting");

    try {
      await probeMicrophone();
    } catch {
      setError(
        "Microphone permission is required for the spoken drill. Allow mic access and try again.",
      );
      startingRef.current = false;
      setStatus("idle");
      return;
    }

    try {
      const sc = scenarioRef.current;
      const token = await fetchConversationToken();

      const conv = await Conversation.startSession({
        conversationToken: token,
        userId: "rep_demo_alex",
        overrides: buildSessionOverrides(sc),
        onConnect: () => {
          if (endingRef.current) return;
          startingRef.current = false;
          setStatus("connected");
          pushTurn(
            "system",
            `Connected · ${sc.title} — speak as the recruitment consultant.`,
          );
        },
        onDisconnect: (details) => {
          conversationRef.current = null;
          startingRef.current = false;
          setIsSpeaking(false);
          setStatus("idle");
          const reason = formatDisconnectDetails(details);
          setLastDisconnect(reason);
          pushTurn("system", `Session ended (${reason}).`);
        },
        onError: (message, context) => {
          if (endingRef.current || isBenignElevenLabsError(message, context)) {
            return;
          }
          const text =
            typeof message === "string" && message.trim()
              ? message
              : formatUnknownError(context) || "Voice session error";
          if (!text) return;
          setError(text);
          pushTurn("system", `Error: ${text}`);
          setStatus("error");
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === "speaking");
        },
        onMessage: (message) => {
          const roleRaw =
            (message as { role?: string; source?: string }).role ??
            (message as { source?: string }).source ??
            "";
          const text =
            (message as { message?: string }).message ??
            (message as { text?: string }).text ??
            "";
          if (!text) return;
          const role: TranscriptTurn["role"] =
            roleRaw === "user" || roleRaw === "human" ? "user" : "agent";
          pushTurn(role, text);
        },
        onAgentToolResponse: (tool) => {
          const name =
            (tool as { tool_name?: string; toolName?: string }).tool_name ??
            (tool as { toolName?: string }).toolName ??
            "tool";
          pushTurn("system", `Agent tool: ${name}`);
        },
      });

      if (endingRef.current) {
        startingRef.current = false;
        await conv.endSession().catch(() => {});
        return;
      }

      conversationRef.current = conv;
      try {
        setConversationId(conv.getId?.() ?? null);
      } catch {
        /* id may not be ready */
      }
    } catch (e) {
      conversationRef.current = null;
      startingRef.current = false;
      const message =
        e instanceof Error
          ? e.message
          : formatUnknownError(e) || "Failed to start session";
      if (!isBenignElevenLabsError(message, e)) setError(message);
      setStatus("idle");
    }
  }, [pushTurn, resetLocal]);

  const end = useCallback(async () => {
    const cid = conversationId;
    endingRef.current = true;
    const conv = conversationRef.current;
    conversationRef.current = null;
    try {
      await conv?.endSession();
    } catch (e) {
      const message = formatUnknownError(e);
      if (message && !isBenignElevenLabsError(message, e)) setError(message);
    } finally {
      setStatus("idle");
      setIsSpeaking(false);
      setTimeout(() => {
        void runScore(cid);
      }, 450);
    }
  }, [conversationId, runScore]);

  const practiceAgain = useCallback(async () => {
    await endSessionQuietly();
    endingRef.current = false;
    startingRef.current = false;
    resetLocal();
    await start();
  }, [endSessionQuietly, resetLocal, start]);

  const getInputLevels = useCallback(
    () => conversationRef.current?.getInputByteFrequencyData?.(),
    [],
  );
  const getOutputLevels = useCallback(
    () => conversationRef.current?.getOutputByteFrequencyData?.(),
    [],
  );

  return {
    turns,
    error,
    status,
    isSpeaking,
    scoring,
    score,
    lastDisconnect,
    conversationId,
    start,
    end,
    practiceAgain,
    getInputLevels,
    getOutputLevels,
    userLines: turns.filter((t) => t.role === "user").map((t) => t.text),
  };
}
