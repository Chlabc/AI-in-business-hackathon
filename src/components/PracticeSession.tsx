"use client";

import { useMemo } from "react";
import { AudioWaveform } from "@/components/AudioWaveform";
import { FeedbackCard } from "@/components/FeedbackCard";
import { SignalStreamGuard } from "@/components/SignalStreamGuard";
import { DrillIcon, ScoreIcon } from "@/components/NavIcons";
import type { PracticeScenario } from "@/data/scenarios";
import { usePracticeConversation } from "@/hooks/usePracticeConversation";

type PracticeSessionProps = {
  scenario: PracticeScenario;
  /** What a strong response does — shown as scannable bullets, not prose. */
  doThis: readonly string[];
  /** What loses the deal. */
  avoidThis: readonly string[];
};

function formatTurnTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function StepHeader({
  n,
  label,
  status,
  dimmed = false,
}: {
  n: number;
  label: string;
  status?: string;
  dimmed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            dimmed
              ? "bg-border text-muted"
              : "bg-accent text-accent-fg"
          }`}
        >
          {n}
        </span>
        <h2
          className={`text-xs font-semibold uppercase tracking-wider ${
            dimmed ? "text-muted" : "text-foreground"
          }`}
        >
          {label}
        </h2>
      </div>
      {status ? (
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          {status}
        </span>
      ) : null}
    </div>
  );
}

export function PracticeSession({
  scenario,
  doThis,
  avoidThis,
}: PracticeSessionProps) {
  const {
    turns,
    error,
    status,
    isSpeaking,
    scoring,
    score,
    lastDisconnect,
    start,
    end,
    practiceAgain,
    getInputLevels,
    getOutputLevels,
    userLines,
  } = usePracticeConversation(scenario);

  const connected = status === "connected";
  const connecting = status === "connecting";
  const live = connected || connecting;

  const waveMode = useMemo(() => {
    if (connecting) return "connecting" as const;
    if (connected && isSpeaking) return "speaking" as const;
    if (connected) return "listening" as const;
    return "idle" as const;
  }, [connected, connecting, isSpeaking]);

  /** Plain language, not internal state names. */
  const liveStatus = useMemo(() => {
    if (scoring) return "Scoring your call…";
    if (connecting) return "Connecting…";
    if (connected && isSpeaking) return "Client is speaking";
    if (connected) return "Listening — go ahead";
    return undefined;
  }, [connected, connecting, isSpeaking, scoring]);

  return (
    <div className="space-y-5">
      <SignalStreamGuard />

      {/* ── Step 1 · the brief ─────────────────────────────── */}
      <section className="surface-card rounded-xl p-5 sm:p-6">
        <StepHeader n={1} label="Before you start" />

        <div className="mt-4 rounded-lg border-l-2 border-accent bg-background px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            They&apos;ll open with
          </p>
          <p className="mt-1 text-base font-medium leading-relaxed text-foreground">
            &ldquo;{scenario.openingLine}&rdquo;
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ok">
              Do this
            </p>
            <ul className="mt-2 space-y-1.5">
              {doThis.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground">
                  <span className="mt-0.5 shrink-0 text-ok">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-danger">
              Don&apos;t
            </p>
            <ul className="mt-2 space-y-1.5">
              {avoidThis.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground">
                  <span className="mt-0.5 shrink-0 text-danger">✗</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Step 2 · the call ──────────────────────────────── */}
      <section className="surface-card rounded-xl p-5 sm:p-6">
        <StepHeader n={2} label="Talk it out" status={liveStatus} />

        <div className="mt-5 flex flex-col items-center gap-2 text-center">
          {!connected ? (
            <button
              type="button"
              onClick={() => void start()}
              disabled={connecting || scoring}
              className="btn-lift inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-base font-semibold text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <DrillIcon className="h-5 w-5" />
              {connecting ? "Connecting…" : "Start drill"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void end()}
              disabled={scoring}
              className="btn-lift inline-flex h-14 items-center justify-center gap-2.5 rounded-full border-2 border-danger bg-danger-soft px-8 text-base font-semibold text-danger transition disabled:opacity-60"
            >
              End &amp; score my call
            </button>
          )}
          <p className="text-sm text-muted">
            {connected
              ? "Speak naturally. Press the button when you're done."
              : "We'll ask for your microphone. Then just talk — out loud."}
          </p>
        </div>

        {live ? (
          <div className="mt-5">
            <AudioWaveform
              active
              mode={waveMode}
              getInputLevels={getInputLevels}
              getOutputLevels={getOutputLevels}
            />
          </div>
        ) : null}

        {turns.length > 0 ? (
          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Transcript
              </h3>
              <span className="text-xs text-muted">{turns.length} turns</span>
            </div>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {turns.map((t) => (
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
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    <span>
                      {t.role === "user"
                        ? "You"
                        : t.role === "agent"
                          ? "Client"
                          : "System"}
                    </span>
                    <time
                      dateTime={t.at}
                      className="font-mono font-normal normal-case tracking-normal opacity-80"
                    >
                      {formatTurnTime(t.at)}
                    </time>
                  </div>
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
            {lastDisconnect ? (
              <span className="mt-1 block text-xs opacity-75">
                Details: {lastDisconnect}
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* ── Step 3 · the score ─────────────────────────────── */}
      {score ? (
        <section className="space-y-4">
          <FeedbackCard score={score} whatYouSaid={userLines} />
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => void practiceAgain()}
              disabled={connecting || scoring || connected}
              className="btn-lift inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Practice again
            </button>
            <a
              href="/coach"
              className="text-sm font-medium text-muted transition hover:text-accent"
            >
              See my progress →
            </a>
            <a
              href="/coach/training"
              className="text-sm font-medium text-muted transition hover:text-accent"
            >
              Try another scenario →
            </a>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border p-5 sm:p-6">
          <StepHeader n={3} label="Get scored" dimmed />
          <div className="mt-4 flex items-start gap-3">
            <ScoreIcon className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
            <p className="text-sm leading-relaxed text-muted">
              When you end the call, your score appears here — what you did
              well, the one thing to fix, and a better line to use next time.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
