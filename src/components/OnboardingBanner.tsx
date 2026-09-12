"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cornerman-onboarding-dismissed";

export function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(true); // default hidden until we know it's a first visit

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY);
    setDismissed(seen === "1");
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className="surface-card flex flex-col gap-3 rounded-xl border-accent/30 bg-accent-soft p-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-accent">New here? Here's what this page does</p>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground">
          Below is your <strong>weakest pattern</strong>, found from your real call
          outcomes. Hit <strong>&ldquo;Practice this now&rdquo;</strong> to drill it
          live against an AI client — you&apos;ll get scored the moment you finish,
          and every attempt is tracked further down.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-md border border-accent/30 bg-card px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent-soft"
      >
        Got it
      </button>
    </div>
  );
}
