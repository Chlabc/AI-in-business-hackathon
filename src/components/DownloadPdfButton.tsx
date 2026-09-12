"use client";

import type { PracticeScore } from "@/lib/rubric";

type DownloadPdfButtonProps = {
  score: PracticeScore;
  whatYouSaid?: string[];
  repName?: string;
};

// A restrained palette: the app's actual accent (#d9480f) used as a genuine
// accent — rules, numbers, data — not as background fill.
const COLOR = {
  accent: [217, 72, 15] as const, // #d9480f
  ok: [43, 138, 62] as const, // #2b8a3e
  danger: [201, 42, 42] as const, // #c92a2a
  ink: [26, 29, 32] as const,
  muted: [110, 118, 128] as const,
  hairline: [225, 228, 231] as const,
  track: [237, 239, 241] as const,
};
type RGB = readonly [number, number, number];

const PAGE_MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const FOOTER_Y = PAGE_HEIGHT - 12;

function tierColor(fraction: number): RGB {
  if (fraction >= 0.8) return COLOR.ok;
  if (fraction >= 0.5) return COLOR.accent;
  return COLOR.danger;
}

const SHORT_LABEL: Record<string, string> = {
  explored_objection: "Explored objection",
  asked_clarifying_q: "Clarifying Qs",
  anchored_value: "Anchored value",
  held_fee: "Held fee",
  used_approved_play: "Approved play",
  no_early_cave: "No early cave",
};

export function DownloadPdfButton({
  score,
  whatYouSaid = [],
  repName = "Rep",
}: DownloadPdfButtonProps) {
  async function download() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 0;

    function drawHeader() {
      doc.setFillColor(...COLOR.accent);
      doc.rect(0, 0, PAGE_WIDTH, 1.6, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLOR.accent);
      doc.text("S A L E S   P R A C T I C E   R E P O R T", PAGE_MARGIN, 16);
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...COLOR.ink);
      doc.text("Cornerman", PAGE_MARGIN, 27);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.muted);
      doc.text(repName, PAGE_WIDTH - PAGE_MARGIN, 16, { align: "right" });
      const dateLabel = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      doc.text(dateLabel, PAGE_WIDTH - PAGE_MARGIN, 21, { align: "right" });
      doc.setDrawColor(...COLOR.hairline);
      doc.setLineWidth(0.3);
      doc.line(PAGE_MARGIN, 34, PAGE_WIDTH - PAGE_MARGIN, 34);
    }

    function newPage() {
      doc.addPage();
      drawHeader();
      y = 42;
    }

    function ensureSpace(need: number) {
      if (y + need > PAGE_HEIGHT - 22) newPage();
    }

    function sectionTitle(text: string) {
      ensureSpace(10);
      doc.setFillColor(...COLOR.accent);
      doc.rect(PAGE_MARGIN, y - 2.6, 2.2, 2.2, "F");
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...COLOR.ink);
      doc.text(text, PAGE_MARGIN + 6, y);
      y += 8;
    }

    function bulletList(items: string[]) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.ink);
      for (const item of items) {
        const lines = doc.splitTextToSize(item, CONTENT_WIDTH - 10);
        ensureSpace(lines.length * 5 + 2);
        doc.setFillColor(...COLOR.accent);
        doc.circle(PAGE_MARGIN + 2.2, y - 1.3, 0.7, "F");
        doc.text(lines, PAGE_MARGIN + 6, y);
        y += lines.length * 5 + 2.5;
      }
    }

    /** Restrained callout: white background, thin hairline border, one accent stripe. No fill wash. */
    function calloutBox(text: string, opts: { italic?: boolean } = {}) {
      doc.setFont("helvetica", opts.italic ? "italic" : "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 14);
      const boxHeight = lines.length * 5 + 10;
      ensureSpace(boxHeight + 2);
      doc.setDrawColor(...COLOR.hairline);
      doc.setLineWidth(0.3);
      doc.roundedRect(PAGE_MARGIN, y, CONTENT_WIDTH, boxHeight, 1.5, 1.5, "S");
      doc.setFillColor(...COLOR.accent);
      doc.rect(PAGE_MARGIN, y, 1, boxHeight, "F");
      doc.setTextColor(...COLOR.ink);
      doc.text(lines, PAGE_MARGIN + 7, y + 6.5);
      y += boxHeight + 6;
    }

    /** Single continuous ring-segment path (annulus sector) — one fill, no seams. */
    function ringSector(cx: number, cy: number, outerR: number, innerR: number, fromDeg: number, toDeg: number, color: RGB) {
      if (toDeg <= fromDeg) return;
      doc.setFillColor(...color);
      const segments = 48;
      const step = (toDeg - fromDeg) / segments;
      const outer: [number, number][] = [];
      for (let s = 0; s <= segments; s++) {
        const a = ((fromDeg + s * step) * Math.PI) / 180;
        outer.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
      }
      const inner: [number, number][] = [];
      for (let s = segments; s >= 0; s--) {
        const a = ((fromDeg + s * step) * Math.PI) / 180;
        inner.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
      }
      const path = [...outer, ...inner];
      const start = path[0];
      const deltas = path.slice(1).map((p, i) => [p[0] - path[i][0], p[1] - path[i][1]] as [number, number]);
      doc.lines(deltas, start[0], start[1], [1, 1], "F", true);
    }

    /** Overall score: semi-circular donut gauge + a fee/context side panel. */
    function scoreSection() {
      sectionTitle("Overall score");
      const gaugeHeight = 58;
      ensureSpace(gaugeHeight);
      const cx = PAGE_MARGIN + 38;
      const cyBase = y + 32;
      const outerR = 28;
      const innerR = 19;
      const midR = (outerR + innerR) / 2;
      const capR = (outerR - innerR) / 2;
      const color = tierColor(score.overall / 100);
      const fraction = score.overall / 100;
      const startDeg = 180;
      const endDeg = 360;
      const fillEnd = startDeg + (endDeg - startDeg) * fraction;

      ringSector(cx, cyBase, outerR, innerR, startDeg, endDeg, COLOR.track);
      ringSector(cx, cyBase, outerR, innerR, startDeg, fillEnd, color);
      const a0 = (startDeg * Math.PI) / 180;
      const a1 = (fillEnd * Math.PI) / 180;
      doc.setFillColor(...color);
      doc.circle(cx + midR * Math.cos(a0), cyBase + midR * Math.sin(a0), capR, "F");
      doc.circle(cx + midR * Math.cos(a1), cyBase + midR * Math.sin(a1), capR, "F");

      doc.setFont("times", "bold");
      doc.setFontSize(28);
      doc.setTextColor(...color);
      doc.text(String(score.overall), cx, cyBase - 1, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR.muted);
      doc.text("OUT OF 100", cx, cyBase + 6, { align: "center" });

      const panelX = PAGE_MARGIN + 84;
      const panelW = CONTENT_WIDTH - 84;
      let py = y + 2;
      const feeColor: RGB = score.heldFee ? COLOR.ok : COLOR.accent;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...feeColor);
      doc.text(score.heldFee ? "Fee held" : "Fee softened", panelX, py + 4);
      doc.setDrawColor(...COLOR.hairline);
      doc.setLineWidth(0.3);
      doc.line(panelX, py + 7, panelX + panelW, py + 7);
      py += 13;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR.muted);
      doc.text(
        score.feeOfferedPct !== null ? `Lowest offered: ${score.feeOfferedPct}%` : "No explicit fee offered",
        panelX,
        py
      );
      py += 6;
      doc.text(`Scenario: ${score.scenarioId.replace(/-/g, " ")}`, panelX, py);
      py += 6;
      doc.text(`Scoring method: ${score.method}`, panelX, py);

      y += gaugeHeight;
    }

    /** Radar chart across all rubric criteria — the "shape" of the performance at a glance. */
    function radarChart() {
      sectionTitle("Skill radar");
      const n = score.criteria.length;
      const R = 30;
      const chartHeight = R * 2 + 24;
      ensureSpace(chartHeight);
      const cx = PAGE_MARGIN + CONTENT_WIDTH / 2;
      const cy = y + R + 6;

      const angleFor = (i: number) => ((-90 + i * (360 / n)) * Math.PI) / 180;
      const pt = (i: number, frac: number): [number, number] => [
        cx + R * frac * Math.cos(angleFor(i)),
        cy + R * frac * Math.sin(angleFor(i)),
      ];

      doc.setDrawColor(...COLOR.hairline);
      doc.setLineWidth(0.25);
      for (const level of [0.25, 0.5, 0.75, 1]) {
        const pts = Array.from({ length: n }, (_, i) => pt(i, level));
        for (let i = 0; i < n; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % n];
          doc.line(a[0], a[1], b[0], b[1]);
        }
      }
      for (let i = 0; i < n; i++) {
        const [x, yy] = pt(i, 1);
        doc.line(cx, cy, x, yy);
      }

      const dataPts = score.criteria.map((c, i) => pt(i, Math.max(c.score, 0.04)));
      doc.setFillColor(255, 244, 239);
      doc.setDrawColor(...COLOR.accent);
      doc.setLineWidth(0.7);
      const first = dataPts[0];
      const deltas = dataPts.slice(1).map((p, idx) => [p[0] - dataPts[idx][0], p[1] - dataPts[idx][1]] as [number, number]);
      deltas.push([first[0] - dataPts[n - 1][0], first[1] - dataPts[n - 1][1]]);
      doc.lines(deltas, first[0], first[1], [1, 1], "FD", true);

      for (let i = 0; i < n; i++) {
        const c = score.criteria[i];
        doc.setFillColor(...tierColor(c.score));
        doc.circle(dataPts[i][0], dataPts[i][1], 1.3, "F");
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      for (let i = 0; i < n; i++) {
        const [x, yy] = pt(i, 1.18);
        const cos = Math.cos(angleFor(i));
        const sin = Math.sin(angleFor(i));
        const align: "left" | "center" | "right" = Math.abs(cos) > 0.2 ? (cos > 0 ? "left" : "right") : "center";
        const dy = sin > 0.5 ? 3 : sin < -0.5 ? -1 : 1.5;
        doc.setTextColor(...COLOR.ink);
        doc.text(SHORT_LABEL[score.criteria[i].id] ?? score.criteria[i].label, x, yy + dy, { align });
        doc.setTextColor(...COLOR.muted);
        doc.setFontSize(7.5);
        doc.text(`${Math.round(score.criteria[i].score * 100)}%`, x, yy + dy + 3.6, { align });
        doc.setFontSize(8);
      }

      y += chartHeight;
    }

    /** Detailed per-criterion bars with notes — the radar's numbers, explained. */
    function rubricBreakdown() {
      sectionTitle("Rubric breakdown, in detail");
      const labelW = 56;
      const ptsW = 16;
      const barX = PAGE_MARGIN + labelW;
      const barW = CONTENT_WIDTH - labelW - ptsW;
      const barH = 4;

      for (const c of score.criteria) {
        const noteLines = doc.splitTextToSize(c.notes, CONTENT_WIDTH - labelW);
        ensureSpace(barH + noteLines.length * 4.4 + 6);

        const color = tierColor(c.score);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.ink);
        const labelLines = doc.splitTextToSize(c.label, labelW - 3);
        doc.text(labelLines, PAGE_MARGIN, y + 3);

        doc.setDrawColor(...COLOR.hairline);
        doc.setLineWidth(0.2);
        doc.setFillColor(...COLOR.track);
        doc.roundedRect(barX, y, barW, barH, 1, 1, "FD");
        doc.setFillColor(...color);
        doc.roundedRect(barX, y, Math.max(barW * c.score, 3), barH, 1, 1, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...color);
        doc.text(`${Math.round(c.score * c.max)}/${c.max}`, PAGE_MARGIN + labelW + barW + 2, y + 3.1);

        y += barH + 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR.muted);
        doc.text(noteLines, PAGE_MARGIN, y);
        y += noteLines.length * 4.4 + 4;
      }
    }

    function stampFooters() {
      const total = doc.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setDrawColor(...COLOR.hairline);
        doc.setLineWidth(0.3);
        doc.line(PAGE_MARGIN, FOOTER_Y - 4, PAGE_WIDTH - PAGE_MARGIN, FOOTER_Y - 4);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLOR.muted);
        doc.text("Cornerman · AI-assisted sales practice · fictional demo data", PAGE_MARGIN, FOOTER_Y);
        doc.text(`Page ${i} of ${total}`, PAGE_WIDTH - PAGE_MARGIN, FOOTER_Y, { align: "right" });
      }
    }

    // --- Build the document ---
    drawHeader();
    y = 42;

    scoreSection();
    y += 6;
    radarChart();
    y += 4;

    sectionTitle("What you said");
    bulletList(whatYouSaid.length > 0 ? whatYouSaid.slice(-3) : ["(No transcript captured)"]);
    y += 2;

    sectionTitle("Approved talk-track");
    calloutBox(score.approvedPlayReminder);

    sectionTitle("Feedback");
    bulletList(score.feedback);
    y += 2;

    sectionTitle("Suggested response — rehearse this");
    calloutBox(`“${score.suggestedResponse}”`, { italic: true });

    rubricBreakdown();

    stampFooters();
    doc.save(`sales-practice-report-${score.scenarioId}-${Date.now()}.pdf`);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
    >
      Download PDF report
    </button>
  );
}
