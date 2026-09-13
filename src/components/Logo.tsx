/**
 * Cornerman mark.
 *
 * Two ideas in one shape. The bracket is a ring corner seen from above —
 * the corner you're worked from between rounds, which is the name. Inside it
 * sits a short soundwave, because the product is a spoken rehearsal rather
 * than another course.
 *
 * Drawn on a 32x32 grid with heavy strokes so it survives a 16px favicon:
 * at that size the bracket still reads as a corner and the bars read as
 * "audio" even when individual bars blur together.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      {/* Ring corner: an L opening down-right, deliberately not a full box. */}
      <path
        d="M5 27V8.5A3.5 3.5 0 0 1 8.5 5H27"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Soundwave, tallest in the middle — the voice sitting in the corner. */}
      <g className="text-brand-gold" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12.5 20.5v-4" />
        <path d="M18 23.5v-10" />
        <path d="M23.5 21.5v-6" />
      </g>
    </svg>
  );
}

/** Mark plus wordmark, for the app header and the cover. */
export function Logo({
  className = "",
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-[22px] w-[22px] shrink-0 text-accent" />
      {showWord ? (
        <span className="text-base font-semibold tracking-tight">
          Cornerman
        </span>
      ) : null}
    </span>
  );
}
