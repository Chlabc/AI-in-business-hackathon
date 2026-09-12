"use client";

import { useEffect } from "react";
import { isBenignElevenLabsError } from "@/lib/elevenlabs-errors";

/**
 * ElevenLabs WebRTC occasionally logs empty / hangup noise such as
 * `error reading from signal stream {}` or `Server error: Unknown error {}`.
 * Filter that from the console without swallowing real errors.
 */
export function SignalStreamGuard() {
  useEffect(() => {
    const original = console.error;
    console.error = (...args: unknown[]) => {
      if (isBenignElevenLabsError(...args)) return;
      original.apply(console, args as Parameters<typeof console.error>);
    };

    return () => {
      console.error = original;
    };
  }, []);

  return null;
}
