"use client";

import {
  ConversationProvider,
  useConversation,
} from "@elevenlabs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioWaveform } from "@/components/AudioWaveform";
import { FeedbackCard } from "@/components/FeedbackCard";
import { SignalStreamGuard } from "@/components/SignalStreamGuard";
import type { PracticeScenario } from "@/data/scenarios";
import {
  formatUnknownError,
  isBenignElevenLabsError,
} from "@/lib/elevenlabs-errors";
import type { PracticeScore } from "@/lib/rubric";

type Turn = {
  id: string;
  role: "user" | "agent" | "system";
  text: string;
  at: string;
};

type PracticeSessionProps = {
  scenario: PracticeScenario;
  approvedPlay: string;
  diagnosisHeadline: string;
};

function PracticeControls({
  scenario,
  approvedPlay,
  diagnosisHeadline,
}: PracticeSessionProps) {
  const scenarioLine = scenario.openingLine;
  const [turns, setTurns] = useState<Turn[]>([]);
  const turnsRef = useRef<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const [score, setScore] = useState<PracticeScore | null>(null);
  const endingRef = useRef(false);
  const scenarioIdRef = useRef(scenario.id);

  useEffect(() => {
    scenarioIdRef.current = scenario.id;
  }, [scenario.id]);

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
          scenarioId: scenarioIdRef.current,
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

  // Stable overrides — new object only when scenario content changes
  const overrides = useMemo(
    () => ({
      agent: {
        firstMessage: scenario.openingLine,
        prompt: {
          prompt: scenario.agentSystemPrompt,
        },
      },
    }),
    [scenario.openingLine, scenario.agentSystemPrompt],
  );

  // Keep handlers in refs so useConversation options stay referentially stable.
  // Previously, pushTurn → setState → new onMessage/onConnect → SDK tore down
  // the WebRTC session right after the agent's first line.
  const handlersRef = useRef({
    onConnect: () => {},
    onDisconnect: () => {},
    onError: (_err: unknown) => {},
    onMessage: (_message: unknown) => {},
  });

  handlersRef.current.onConnect = () => {
    setError(null);
    endingRef.current = false;
    pushTurn("system", "Connected — speak as the recruitment consultant.");
  };

  handlersRef.current.onDisconnect = () => {
    pushTurn("system", "Session ended.");
    setStarting(false);
  };

  handlersRef.current.onError = (err: unknown) => {
    const message = formatUnknownError(err);
    if (
      endingRef.current ||
      isBenignElevenLabsError(message, err) ||
      !message
    ) {
      return;
    }
    setError(message);
    pushTurn("system", `Error: ${message}`);
    setStarting(false);
  };

  handlersRef.current.onMessage = (message: unknown) => {
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
  };

  const conversation = useConversation({
    overrides,
    onConnect: useCallback(() => handlersRef.current.onConnect(), []),
    onDisconnect: useCallback(() => handlersRef.current.onDisconnect(), []),
    onError: useCallback(
      (err: unknown) => handlersRef.current.onError(err),
      [],
    ),
    onMessage: useCallback(
      (message: unknown) => handlersRef.current.onMessage(message),
      [],
    ),
  });

  const status = conversation.status;
  const connected = status === "connected";
  const connecting = status === "connecting" || starting;

  const waveMode = useMemo(() => {
    if (connecting && !connected) return "connecting" as const;
    if (connected && conversation.isSpeaking) return "speaking" as const;
    if (connected && conversation.isListening) return "listening" as const;
    if (connected) return "listening" as const;
    return "idle" as const;
  }, [
    connected,
    connecting,
    conversation.isListening,
    conversation.isSpeaking,
  ]);

  const start = async () => {
    setError(null);
    setStarting(true);
    setScore(null);
    setTurns([]);
    turnsRef.current = [];
    setConversationId(null);
    conversationIdRef.current = null;
    endingRef.current = false;

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
        // Pass overrides at session start so a later parent re-render cannot
        // replace the live session config mid-call.
        overrides,
      } as Parameters<typeof conversation.startSession>[0]);
      conversationIdRef.current = id ?? null;
      setConversationId(id ?? null);
      setStarting(false);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : formatUnknownError(e) || "Failed to start session";
      if (!isBenignElevenLabsError(message, e)) setError(message);
      setStarting(false);
    }
  };

  const end = async () => {
    const cid = conversationIdRef.current;
    endingRef.current = true;
    try {
      await conversation.endSession();
    } catch (e) {
      const message = formatUnknownError(e);
      if (message && !isBenignElevenLabsError(message, e)) setError(message);
    } finally {
      setStarting(false);
      setTimeout(() => {
        void runScore(cid);
      }, 450);
    }
  };

  const userLines = turns.filter((t) => t.role === "user").map((t) => t.text);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="surface-card rounded-xl p-5 sm:p-6 lg:p-8">
          <p className="eyebrow">2 · Live drill · {scenario.title}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {scenario.customerPersona}
          </h2>
          <p className="mt-2 text-sm text-muted">{diagnosisHeadline}</p>

          <div className="mt-5 rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Client opens with
            </p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
              “{scenarioLine}”
            </p>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted">
            Approved play (for you): {approvedPlay}
          </p>

          <div className="mt-5">
            <AudioWaveform
              active={connected || connecting}
              mode={waveMode}
              getInputLevels={() => conversation.getInputByteFrequencyData?.()}
              getOutputLevels={() =>
                conversation.getOutputByteFrequencyData?.()
              }
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!connected ? (
              <button
                type="button"
                onClick={() => void start()}
                disabled={connecting || scoring}
                className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {connecting ? "Connecting…" : "Start drill"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void end()}
                disabled={scoring}
                className="inline-flex h-11 items-center justify-center rounded-md border border-danger/40 bg-danger-soft px-5 text-sm font-semibold text-danger transition hover:opacity-90 disabled:opacity-60"
              >
                End &amp; score
              </button>
            )}
            <span className="rounded border border-border px-2.5 py-1 text-xs capitalize text-muted">
              {scoring ? "scoring" : waveMode}
            </span>
          </div>

          {error ? (
            <div className="mt-4 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
        </section>

        <section className="surface-card flex min-h-[320px] flex-col rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Transcript
            </h3>
            <span className="text-xs text-muted">{turns.length} turns</span>
          </div>
          <div className="mt-4 max-h-[28rem] flex-1 space-y-2 overflow-y-auto">
            {turns.length === 0 ? (
              <p className="text-sm text-muted">
                Start the drill to capture spoken turns.
              </p>
            ) : (
              turns.map((t) => (
                <div
                  key={t.id}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    t.role === "user"
                      ? "border-border bg-background text-foreground"
                      : t.role === "agent"
                        ? "border-accent/20 bg-accent-soft text-foreground"
                        : "border-border bg-card text-muted"
                  }`}
                >
                  <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
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
        </section>
      </div>

      {score ? (
        <div className="space-y-4">
          <FeedbackCard score={score} whatYouSaid={userLines} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setScore(null);
                setError(null);
                setTurns([]);
                turnsRef.current = [];
                setConversationId(null);
                conversationIdRef.current = null;
                void start();
              }}
              disabled={connecting || scoring || connected}
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Practice again
            </button>
            <a
              href="/coach"
              className="text-sm font-medium text-muted hover:text-accent"
            >
              View progress on diagnosis →
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PracticeSession(props: PracticeSessionProps) {
  // Remount provider only when scenario changes — not on every transcript turn.
  return (
    <ConversationProvider key={props.scenario.id}>
      <SignalStreamGuard />
      <PracticeControls {...props} />
    </ConversationProvider>
  );
}
