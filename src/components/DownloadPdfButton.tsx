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
  accentSoft: [255, 244, 239] as const, // #fff4ef
  ok: [43, 138, 62] as const, // #2b8a3e
  okSoft: [235, 251, 238] as const, // #ebfbee
  danger: [201, 42, 42] as const, // #c92a2a
  dangerSoft: [255, 245, 245] as const, // #fff5f5
  foreground: [26, 29, 32] as const, // #1a1d20
  muted: [92, 101, 112] as const, // #5c6570
  border: [233, 236, 239] as const, // #e9ecef
  white: [255, 255, 255] as const,
};

const PAGE_MARGIN = 16;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const FOOTER_Y = PAGE_HEIGHT - 12;

function tierColor(fraction: number): readonly [number, number, number] {
  if (fraction >= 0.8) return COLOR.ok;
  if (fraction >= 0.5) return COLOR.accent;
  return COLOR.danger;
}

export function DownloadPdfButton({
  score,
  whatYouSaid = [],
  repName = "Rep",
}: DownloadPdfButtonProps) {
  async function download() {
    // Loaded on click, not on page load — a few hundred KB we only need
    // once someone actually asks for the report.
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 0;

    function newPage() {
      doc.addPage();
      drawHeader();
      y = 40;
    }

    function ensureSpace(need: number) {
      if (y + need > PAGE_HEIGHT - 22) newPage();
    }

    function drawHeader() {
      doc.setFillColor(...COLOR.accent);
      doc.rect(0, 0, PAGE_WIDTH, 26, "F");
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

    function bodyText(
      text: string,
      opts: { italic?: boolean; color?: readonly [number, number, number]; size?: number } = {}
    ) {
      doc.setFont("helvetica", opts.italic ? "italic" : "normal");
      doc.setFontSize(opts.size ?? 10);
      doc.setTextColor(...(opts.color ?? COLOR.foreground));
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 4);
      ensureSpace(lines.length * 5 + 2);
      doc.text(lines, PAGE_MARGIN + 2, y);
      y += lines.length * 5 + 3;
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

    function calloutBox(
      text: string,
      bg: readonly [number, number, number],
      opts: { italic?: boolean } = {}
    ) {
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

    /** Horizontal gauge bar — the overall-score "diagram" at the top. */
    function scoreGauge(overall: number) {
      const barW = CONTENT_WIDTH - 32;
      const barH = 6;
      const barX = PAGE_MARGIN + 32;
      const color = tierColor(overall / 100);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(...color);
      doc.text(String(overall), PAGE_MARGIN, y + 6);
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.muted);
      doc.text("/100", PAGE_MARGIN + (String(overall).length > 2 ? 17 : 12), y + 6);

      doc.setFillColor(...COLOR.border);
      doc.roundedRect(barX, y, barW, barH, 1.5, 1.5, "F");
      doc.setFillColor(...color);
      doc.roundedRect(barX, y, Math.max(barW * (overall / 100), 4), barH, 1.5, 1.5, "F");

      y += barH + 10;
    }

    /** One horizontal bar per rubric criterion — the "diagram" for the breakdown. */
    function rubricChart() {
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
        doc.rect(barX, y, barW, barH, "F");
        doc.setFillColor(...color);
        doc.rect(barX, y, Math.max(barW * c.score, 1.5), barH, "F");

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

    sectionTitle(`Score · ${score.scenarioId.replace(/-/g, " ")}`);
    scoreGauge(score.overall);

    const feeColor: readonly [number, number, number] = score.heldFee ? COLOR.ok : COLOR.accent;
    const feeSoft: readonly [number, number, number] = score.heldFee ? COLOR.okSoft : COLOR.accentSoft;
    doc.setFillColor(...feeSoft);
    const feeLabel = `${score.heldFee ? "Fee held" : "Fee softened"}${
      score.feeOfferedPct !== null ? ` · lowest offered ${score.feeOfferedPct}%` : ""
    } · scoring: ${score.method}`;
    const feeLines = doc.splitTextToSize(feeLabel, CONTENT_WIDTH - 8);
    const feeBoxH = feeLines.length * 4.6 + 5;
    doc.roundedRect(PAGE_MARGIN, y, CONTENT_WIDTH, feeBoxH, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...feeColor);
    doc.text(feeLines, PAGE_MARGIN + 4, y + 5.5);
    y += feeBoxH + 8;

    sectionTitle("What you said");
    bulletList(whatYouSaid.length > 0 ? whatYouSaid.slice(-3) : ["(No transcript captured)"]);
    y += 2;

    sectionTitle("Approved talk-track");
    calloutBox(score.approvedPlayReminder, COLOR.accentSoft as unknown as [number, number, number]);

    sectionTitle("Feedback");
    bulletList(score.feedback);
    y += 2;

    sectionTitle("Suggested response — rehearse this");
    calloutBox(`“${score.suggestedResponse}”`, COLOR.border as unknown as [number, number, number], {
      italic: true,
    });

    sectionTitle("Rubric breakdown");
    rubricChart();

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
