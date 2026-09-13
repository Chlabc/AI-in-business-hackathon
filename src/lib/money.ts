/**
 * Seat pricing display.
 *
 * The numeric fields are still named *Pct from the original recruitment model,
 * where a fee was a percentage of salary. The product is now B2B SaaS and the
 * same fields hold dollars per seat per month (see the note in data/seed.ts).
 * Everything user-facing must therefore render them as money, never as "%".
 */
export function seatPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  // Whole dollars stay clean ($100); anything else gets real cents ($89.30, not $89.3).
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** Long form, for the first mention on a page. */
export function seatPriceFull(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return `${seatPrice(n)}/seat`;
}
