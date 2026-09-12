"use client";

import { useEffect, useRef } from "react";

type AudioWaveformProps = {
  active: boolean;
  mode: "idle" | "listening" | "speaking" | "connecting";
  getInputLevels?: () => Uint8Array | undefined;
  getOutputLevels?: () => Uint8Array | undefined;
};

const BARS = 28;

export function AudioWaveform({
  active,
  mode,
  getInputLevels,
  getOutputLevels,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--accent").trim() || "#d9480f";
      const audio = styles.getPropertyValue("--audio").trim() || "#1c7ed6";
      const border = styles.getPropertyValue("--border").trim() || "#e9ecef";

      const color = mode === "speaking" ? accent : mode === "listening" ? audio : border;

      let values: number[] = Array.from({ length: BARS }, () => 0.12);

      if (active) {
        try {
          const raw =
            mode === "speaking"
              ? getOutputLevels?.()
              : getInputLevels?.();
          if (raw && raw.length > 0) {
            const step = Math.max(1, Math.floor(raw.length / BARS));
            values = Array.from({ length: BARS }, (_, i) => {
              const v = raw[i * step] ?? 0;
              return Math.max(0.08, Math.min(1, v / 255));
            });
          } else {
            // Soft pulse when SDK levels unavailable
            const t = Date.now() / 280;
            values = Array.from({ length: BARS }, (_, i) => {
              const wave = 0.25 + 0.55 * Math.abs(Math.sin(t + i * 0.35));
              return mode === "idle" ? 0.1 : wave * (mode === "connecting" ? 0.45 : 1);
            });
          }
        } catch {
          // ignore analyser read errors
        }
      }

      const gap = 3;
      const barW = (width - gap * (BARS - 1)) / BARS;
      values.forEach((v, i) => {
        const h = Math.max(3, v * height * 0.9);
        const x = i * (barW + gap);
        const y = (height - h) / 2;
        ctx.fillStyle = color;
        ctx.globalAlpha = active ? 0.9 : 0.35;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, getInputLevels, getOutputLevels, mode]);

  const label =
    mode === "speaking"
      ? "Client speaking"
      : mode === "listening"
        ? "Listening…"
        : mode === "connecting"
          ? "Connecting…"
          : "Idle";

  return (
    <div className="rounded-lg border border-border bg-audio-soft/40 px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Audio
        </span>
        <span
          className={`text-xs font-medium ${
            mode === "listening"
              ? "text-audio"
              : mode === "speaking"
                ? "text-accent"
                : "text-muted"
          }`}
        >
          {label}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={560}
        height={48}
        className="h-12 w-full"
        aria-hidden
      />
    </div>
  );
}
