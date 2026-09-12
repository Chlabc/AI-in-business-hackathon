"use client";

import {
  ConversationProvider,
  useConversation,
} from "@elevenlabs/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { FeedbackCard } from "@/components/FeedbackCard";
import type { PracticeScore } from "@/lib/rubric";

type Turn = {
  id: string;
  role: "user" | "agent" | "system";
  text: string;
  at: string;
};

type PracticeSessionProps = {
  scenarioLine: string;
  approvedPlay: string;
  diagnosisHeadline: string;
};

function PracticeControls({
  scenarioLine,
  approvedPlay,
  diagnosisHeadline,
}: PracticeSessionProps) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const turnsRef = useRef<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [score, setScore] = useState<PracticeScore | null>(null);

  const pushTurn = useCallback((role: Turn["role"], text: string) => {
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

  const runScore = useCallback(async (cid: string | null) => {
    const snapshot = turnsRef.current.filter((t) => t.role !== "system");
    const hasUser = snapshot.some((t) => t.role === "user");
    if (!hasUser) {
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

  const conversation = useConversation({
    onConnect: () => {
      setError(null);
      pushTurn("system", "Connected — speak as the recruitment consultant.");
    },
    onDisconnect: () => {
      pushTurn("system", "Session ended.");
      setStarting(false);
    },
    onError: (err) => {
      const message =
        typeof err === "string"
          ? err
          : err &&
              typeof err === "object" &&
              "message" in err &&
              typeof (err as { message: unknown }).message === "string"
            ? (err as { message: string }).message
            : "Voice session error";
      setError(message);
      pushTurn("system", `Error: ${message}`);
      setStarting(false);
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
      const role: Turn["role"] =
        roleRaw === "user" || roleRaw === "human" ? "user" : "agent";
      pushTurn(role, text);
    },
  });

  const status = conversation.status;
  const connected = status === "connected";
  const connecting = status === "connecting" || starting;

  const start = async () => {
    setError(null);
    setStarting(true);
    setScore(null);
    setTurns([]);
    turnsRef.current = [];
    setConversationId(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        "Microphone permission is required for the spoken drill. Allow mic access and try again.",
      );
      setStarting(false);
      return;
    }

    try {
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

      const id = await conversation.startSession({
        conversationToken: data.token,
        userId: "rep_demo_alex",
      });
      setConversationId(id ?? null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to start session";
      setError(message);
      setStarting(false);
    }
  };

  const end = async () => {
    const cid = conversationId;
    try {
      await conversation.endSession();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to end session";
      setError(message);
    } finally {
      setStarting(false);
      // Small delay so final transcripts can land
      setTimeout(() => {
        void runScore(cid);
      }, 400);
    }
  };

  const statusLabel = useMemo(() => {
    if (scoring) return "scoring";
    if (error) return "error";
    if (connecting && !connected) return "connecting";
    if (connected && conversation.isSpeaking) return "client speaking";
    if (connected && conversation.isListening) return "listening to you";
    if (connected) return "connected";
    return "idle";
  }, [
    connected,
    connecting,
    conversation.isListening,
    conversation.isSpeaking,
    error,
    scoring,
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Live drill
        </p>
        <p className="mt-2 text-sm text-zinc-300">{diagnosisHeadline}</p>
        <p className="mt-3 text-sm text-zinc-400">
          Client will open with:{" "}
          <span className="text-amber-100">{scenarioLine}</span>
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Approved play (for you): {approvedPlay}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!connected ? (
          <button
            type="button"
            onClick={start}
            disabled={connecting || scoring}
            className="inline-flex h-11 items-center justify-center rounded-full bg-amber-500 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connecting ? "Connecting…" : "Start fee-objection drill"}
          </button>
        ) : (
          <button
            type="button"
            onClick={end}
            disabled={scoring}
            className="inline-flex h-11 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 px-6 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-60"
          >
            End &amp; score
          </button>
        )}

        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs capitalize text-zinc-400">
          {statusLabel}
        </span>
        {conversationId ? (
          <span className="font-mono text-[10px] text-zinc-600">
            {conversationId}
          </span>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {score ? <FeedbackCard score={score} /> : null}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Transcript
          </h2>
          <span className="text-xs text-zinc-600">{turns.length} turns</span>
        </div>
        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {turns.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Start the drill to see spoken turns here.
            </p>
          ) : (
            turns.map((t) => (
              <div
                key={t.id}
                className={`rounded-xl px-3 py-2 text-sm ${
                  t.role === "user"
                    ? "border border-zinc-700 bg-zinc-950/70 text-zinc-200"
                    : t.role === "agent"
                      ? "border border-amber-500/20 bg-amber-500/10 text-amber-50"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-500"
                }`}
              >
                <span className="mr-2 text-[10px] uppercase tracking-wider opacity-70">
                  {t.role === "user"
                    ? "You"
                    : t.role === "agent"
                      ? "Client"
                      : "System"}
                </span>
                {t.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function PracticeSession(props: PracticeSessionProps) {
  return (
    <ConversationProvider>
      <PracticeControls {...props} />
    </ConversationProvider>
  );
}
