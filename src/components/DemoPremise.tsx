import { FIRM } from "@/data/seed";

/**
 * States the made-up setup in one place.
 *
 * Every page showed numbers about "Northline" and "Alex Chen" without ever
 * saying who they were, so the data read as unexplained noise. This says it
 * plainly, once, wherever seeded data appears.
 */
export function DemoPremise({ name }: { name: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted">
      <span className="font-medium text-foreground">You&apos;re signed in as{" "}
        {name}</span>
      , a sales rep at <span className="font-medium text-foreground">
        {FIRM.name}
      </span>{" "}
      — a made-up software company invented for this demo. It sells a workflow
      tool at{" "}
      <span className="font-medium text-foreground">
        ${FIRM.standardPermFeePct} per seat per month
      </span>
      , and reps aren&apos;t allowed to go below{" "}
      <span className="font-medium text-foreground">
        ${FIRM.feeFloorPct}
      </span>{" "}
      without approval. Every call below is invented sample data, not a real CRM.
    </div>
  );
}
