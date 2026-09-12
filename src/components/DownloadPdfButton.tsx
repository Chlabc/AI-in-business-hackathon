"use client";

import type { PracticeScore } from "@/lib/rubric";

type DownloadPdfButtonProps = {
  score: PracticeScore;
  whatYouSaid?: string[];
  repName?: string;
};

const PAGE_MARGIN = 15;
const PAGE_WIDTH = 210; // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const PAGE_HEIGHT = 297;

export function DownloadPdfButton({
  score,
  whatYouSaid = [],
  repName = "Rep",
}: DownloadPdfButtonProps) {
  async function download() {
    // Loaded on click, not on page load — jsPDF is a few hundred KB we don't
    // need until someone actually asks for the report.
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = PAGE_MARGIN;

    function ensureSpace(lines: number, lineHeight = 6) {
      if (y + lines * lineHeight > PAGE_HEIGHT - PAGE_MARGIN) {
        doc.addPage();
        y = PAGE_MARGIN;
      }
    }

    function heading(text: string, size = 13) {
      ensureSpace(2, 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.text(text, PAGE_MARGIN, y);
      y += size * 0.5;
    }

    function paragraph(text: string, opts: { italic?: boolean } = {}) {
      doc.setFont("helvetica", opts.italic ? "italic" : "normal");
      doc.setFontSize(10.5);
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
      ensureSpace(lines.length);
      doc.text(lines, PAGE_MARGIN, y);
      y += lines.length * 5.2 + 2;
    }

    function bulletList(items: string[]) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      for (const item of items) {
        const lines = doc.splitTextToSize(`• ${item}`, CONTENT_WIDTH - 4);
        ensureSpace(lines.length);
        doc.text(lines, PAGE_MARGIN + 2, y);
        y += lines.length * 5.2 + 1;
      }
      y += 2;
    }

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Sales Practice Report", PAGE_MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(
      `${repName} · ${new Date().toLocaleDateString()} · Scenario: ${score.scenarioId}`,
      PAGE_MARGIN,
      y
    );
    doc.setTextColor(0);
    y += 10;

    // Score summary
    heading(`Score: ${score.overall} / 100`, 15);
    paragraph(
      `Fee outcome: ${score.heldFee ? "Held" : "Softened"}${
        score.feeOfferedPct !== null ? ` (lowest offered: ${score.feeOfferedPct}%)` : ""
      } · Scoring method: ${score.method}`
    );
    y += 2;

    // What you said
    heading("What you said");
    bulletList(whatYouSaid.length > 0 ? whatYouSaid.slice(-3) : ["(No transcript captured)"]);

    // Approved talk-track
    heading("Approved talk-track");
    paragraph(score.approvedPlayReminder);

    // Feedback
    heading("Feedback");
    bulletList(score.feedback);

    // Suggested response
    heading("Suggested response (rehearse this)");
    paragraph(score.suggestedResponse, { italic: true });

    // Rubric breakdown
    heading("Rubric breakdown");
    for (const c of score.criteria) {
      ensureSpace(2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(`${c.label} — ${Math.round(c.score * c.max)}/${c.max}`, PAGE_MARGIN, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const notes = doc.splitTextToSize(c.notes, CONTENT_WIDTH);
      ensureSpace(notes.length);
      doc.text(notes, PAGE_MARGIN, y);
      y += notes.length * 5.2 + 3;
    }

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
