"use client";

import Link from "next/link";
import { useState } from "react";

type ShareControlsProps = {
  initialShared: boolean;
  repId: string;
};

export function ShareControls({ initialShared, repId }: ShareControlsProps) {
  const [shared, setShared] = useState(initialShared);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    const next = !shared;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/practice/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repId,
          shareProgressWithManager: next,
        }),
      });
      const data = (await res.json()) as {
        shareProgressWithManager?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Failed to update share");
      setShared(Boolean(data.shareProgressWithManager));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update share");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      aria-labelledby="sharing-heading"
      className="border-t border-border pt-6 lg:pt-8"
    >
      <p className="text-xs font-semibold text-muted">
        Your progress, your choice
      </p>
      <h2
        id="sharing-heading"
        className="mt-2 text-xl font-semibold leading-7 text-foreground"
      >
        Privacy &amp; sharing
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Private by default. When you share, your manager sees{" "}
        <strong className="font-medium text-foreground">
          progress summary only
        </strong>{" "}
        — never raw practice transcripts in the manager view.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={saving}
          role="switch"
          aria-checked={shared}
          aria-label="Share progress with manager"
          aria-describedby="sharing-status"
          className="inline-flex min-h-11 items-center gap-3 rounded-md text-left text-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coach-action disabled:cursor-wait disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className={`flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 ${shared ? "border-coach-positive bg-coach-positive" : "border-muted bg-card"}`}
          >
            <span
              className={`h-4 w-4 rounded-full transition-transform motion-reduce:transition-none ${shared ? "translate-x-5 bg-background" : "bg-muted"}`}
            />
          </span>
          Share progress with manager
        </button>
        <Link
          href="/coach/manager"
          className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted transition hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coach-action sm:ml-auto"
        >
          Open manager view →
        </Link>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <p id="sharing-status" role="status" className="mt-2 text-xs text-muted">
        {saving
          ? "Saving…"
          : shared
            ? "Sharing on · Manager can see your practice summary"
            : "Private · Practice summary is not shared"}
      </p>
    </section>
  );
}
