"use client";

import type { PracticeScore } from "@/lib/rubric";

type DownloadPdfButtonProps = {
  score: PracticeScore;
  whatYouSaid?: string[];
  repName?: string;
};

// Matches the app's actual design tokens (src/app/globals.css, light theme)
const COLOR = {
  accent: [217, 72, 15] as const, // #d9480f
  accentDeep: [190, 60, 12] as const,
  accentSoft: [255, 244, 239] as const, // #fff4ef
  ok: [43, 138, 62] as const, // #2b8a3e
  okSoft: [235, 251, 238] as const, // #ebfbee
  danger: [201, 42, 42] as const, // #c92a2a
  foreground: [26, 29, 32] as const, // #1a1d20
  muted: [92, 101, 112] as const, // #5c6570
  border: [233, 236, 239] as const, // #e9ecef
  gridLine: [214, 220, 226] as const,
  white: [255, 255, 255] as const,
};
type RGB = readonly [number, number, number];

const PAGE_MARGIN = 16;
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
      doc.rect(0, 0, PAGE_WIDTH, 26, "F");
      doc.setFillColor(...COLOR.accentDeep);
      doc.rect(0, 22, PAGE_WIDTH, 4, "F");
      doc.setTextColor(...COLOR.white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CORNERMAN", PAGE_MARGIN, 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text("Sales Practice Report", PAGE_MARGIN, 19);
      doc.setFontSize(9);
      const dateLabel = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      doc.text(repName, PAGE_WIDTH - PAGE_MARGIN, 11, { align: "right" });
      doc.text(dateLabel, PAGE_WIDTH - PAGE_MARGIN, 17, { align: "right" });
      doc.setTextColor(...COLOR.foreground);
    }

    function newPage() {
      doc.addPage();
      drawHeader();
      y = 40;
    }

    function ensureSpace(need: number) {
      if (y + need > PAGE_HEIGHT - 22) newPage();
    }

    function sectionTitle(text: string) {
      ensureSpace(12);
      doc.setFillColor(...COLOR.accent);
      doc.rect(PAGE_MARGIN, y, 4, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(...COLOR.foreground);
      doc.text(text, PAGE_MARGIN + 7, y + 3.4);
      y += 10;
    }

    function bulletList(items: string[]) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.foreground);
      for (const item of items) {
        const lines = doc.splitTextToSize(item, CONTENT_WIDTH - 10);
        ensureSpace(lines.length * 5 + 2);
        doc.setFillColor(...COLOR.accent);
        doc.circle(PAGE_MARGIN + 3.5, y - 1.3, 0.8, "F");
        doc.text(lines, PAGE_MARGIN + 7, y);
        y += lines.length * 5 + 2.5;
      }
    }

    function calloutBox(text: string, bg: RGB, opts: { italic?: boolean } = {}) {
      doc.setFont("helvetica", opts.italic ? "italic" : "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 10);
      const boxHeight = lines.length * 5 + 8;
      ensureSpace(boxHeight + 2);
      doc.setFillColor(...bg);
      doc.roundedRect(PAGE_MARGIN, y, CONTENT_WIDTH, boxHeight, 2, 2, "F");
      doc.setFillColor(...COLOR.accent);
      doc.rect(PAGE_MARGIN, y, 1.2, boxHeight, "F");
      doc.setTextColor(...COLOR.foreground);
      doc.text(lines, PAGE_MARGIN + 6, y + 6.5);
      y += boxHeight + 5;
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
      const gaugeHeight = 62;
      ensureSpace(gaugeHeight);
      const cx = PAGE_MARGIN + 40;
      const cyBase = y + 34;
      const outerR = 30;
      const innerR = 20;
      const midR = (outerR + innerR) / 2;
      const capR = (outerR - innerR) / 2;
      const color = tierColor(score.overall / 100);
      const fraction = score.overall / 100;
      const startDeg = 180;
      const endDeg = 360;
      const fillEnd = startDeg + (endDeg - startDeg) * fraction;

      ringSector(cx, cyBase, outerR, innerR, startDeg, endDeg, COLOR.border);
      ringSector(cx, cyBase, outerR, innerR, startDeg, fillEnd, color);
      const startAngle = (startDeg * Math.PI) / 180;
      const endAngle = (fillEnd * Math.PI) / 180;
      doc.setFillColor(...color);
      doc.circle(cx + midR * Math.cos(startAngle), cyBase + midR * Math.sin(startAngle), capR, "F");
      doc.circle(cx + midR * Math.cos(endAngle), cyBase + midR * Math.sin(endAngle), capR, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(...color);
      doc.text(String(score.overall), cx, cyBase - 2, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.muted);
      doc.text("out of 100", cx, cyBase + 5, { align: "center" });

      const panelX = PAGE_MARGIN + 88;
      const panelW = CONTENT_WIDTH - 88;
      let py = y + 4;
      const feeColor: RGB = score.heldFee ? COLOR.ok : COLOR.accent;
      const feeSoft: RGB = score.heldFee ? COLOR.okSoft : COLOR.accentSoft;
      doc.setFillColor(...feeSoft);
      doc.roundedRect(panelX, py, panelW, 14, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...feeColor);
      doc.text(score.heldFee ? "Fee held" : "Fee softened", panelX + 5, py + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR.muted);
      doc.text(
        score.feeOfferedPct !== null ? `Lowest offered: ${score.feeOfferedPct}%` : "No explicit fee offered",
        panelX + 5,
        py + 11.5
      );
      py += 20;
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR.muted);
      doc.text(`Scenario: ${score.scenarioId.replace(/-/g, " ")}`, panelX, py);
      py += 5;
      doc.text(`Scoring method: ${score.method}`, panelX, py);

      y += gaugeHeight;
    }

    /** Radar chart across all rubric criteria — the "shape" of the performance at a glance. */
    function radarChart() {
      sectionTitle("Skill radar");
      const n = score.criteria.length;
      const R = 32;
      const chartHeight = R * 2 + 26;
      ensureSpace(chartHeight);
      const cx = PAGE_MARGIN + CONTENT_WIDTH / 2;
      const cy = y + R + 4;

      const angleFor = (i: number) => ((-90 + i * (360 / n)) * Math.PI) / 180;
      const pt = (i: number, frac: number): [number, number] => [
        cx + R * frac * Math.cos(angleFor(i)),
        cy + R * frac * Math.sin(angleFor(i)),
      ];

      doc.setDrawColor(...COLOR.gridLine);
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
      doc.setFillColor(...COLOR.accentSoft);
      doc.setDrawColor(...COLOR.accent);
      doc.setLineWidth(0.6);
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
        const [x, yy] = pt(i, 1.16);
        const cos = Math.cos(angleFor(i));
        const sin = Math.sin(angleFor(i));
        const align: "left" | "center" | "right" = Math.abs(cos) > 0.2 ? (cos > 0 ? "left" : "right") : "center";
        const dy = sin > 0.5 ? 3 : sin < -0.5 ? -1 : 1.5;
        doc.setTextColor(...COLOR.foreground);
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
      const labelW = 58;
      const ptsW = 16;
      const barX = PAGE_MARGIN + labelW;
      const barW = CONTENT_WIDTH - labelW - ptsW;
      const barH = 4.2;

      for (const c of score.criteria) {
        const noteLines = doc.splitTextToSize(c.notes, CONTENT_WIDTH - labelW);
        ensureSpace(barH + noteLines.length * 4.4 + 6);

        const color = tierColor(c.score);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.foreground);
        const labelLines = doc.splitTextToSize(c.label, labelW - 3);
        doc.text(labelLines, PAGE_MARGIN, y + 3);

        doc.setFillColor(...COLOR.border);
        doc.roundedRect(barX, y, barW, barH, 1, 1, "F");
        doc.setFillColor(...color);
        doc.roundedRect(barX, y, Math.max(barW * c.score, 3), barH, 1, 1, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...color);
        doc.text(`${Math.round(c.score * c.max)}/${c.max}`, PAGE_MARGIN + labelW + barW + 2, y + 3.3);

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
        doc.setDrawColor(...COLOR.border);
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
    y = 40;

    scoreSection();
    y += 8;
    radarChart();
    y += 4;

    sectionTitle("What you said");
    bulletList(whatYouSaid.length > 0 ? whatYouSaid.slice(-3) : ["(No transcript captured)"]);
    y += 2;

    sectionTitle("Approved talk-track");
    calloutBox(score.approvedPlayReminder, COLOR.accentSoft);

    sectionTitle("Feedback");
    bulletList(score.feedback);
    y += 2;

    sectionTitle("Suggested response — rehearse this");
    calloutBox(`“${score.suggestedResponse}”`, COLOR.border, { italic: true });

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
