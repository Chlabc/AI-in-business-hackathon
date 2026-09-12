"use client";

import { useEffect } from "react";

/**
 * ElevenLabs WebRTC occasionally logs `error reading from signal stream {}`
 * on clean disconnect. Filter that noise from the console without swallowing
 * real errors.
 */
export function SignalStreamGuard() {
  useEffect(() => {
    const original = console.error;
    console.error = (...args: unknown[]) => {
      const text = args
        .map((a) => {
          if (typeof a === "string") return a;
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(" ")
        .toLowerCase();

      if (
        text.includes("signal stream") ||
        (text.includes("reading from signal") && text.includes("{}"))
      ) {
        return;
      }
      original.apply(console, args as Parameters<typeof console.error>);
    };

    return () => {
      console.error = original;
    };
  }, []);

  return null;
}
