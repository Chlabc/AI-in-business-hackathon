"use client";

import { useState } from "react";
import type { FirmPlaybook, PlaybookTalkTrack } from "@/lib/playbook";

type PlaybookEditorProps = {
  initial: FirmPlaybook;
};

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function listToLines(items: string[]): string {
  return items.join("\n");
}

export function PlaybookEditor({ initial }: PlaybookEditorProps) {
  const [draft, setDraft] = useState<FirmPlaybook>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openTrack, setOpenTrack] = useState<string | null>(
    initial.talkTracks[0]?.id ?? null,
  );

  const update = <K extends keyof FirmPlaybook>(key: K, value: FirmPlaybook[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setMessage(null);
  };

  const updateTrack = (
    id: string,
    patch: Partial<PlaybookTalkTrack>,
  ) => {
    setDraft((d) => ({
      ...d,
      talkTracks: d.talkTracks.map((t) =>
        t.id === id ? { ...t, ...patch } : t,
      ),
    }));
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/playbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json()) as FirmPlaybook & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setDraft(data);
      setMessage("Saved. Next drill will use these firm facts and talk-tracks.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent";

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-xl p-5 sm:p-6">
        <p className="eyebrow">Firm facts</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Pricing & positioning (B2B SaaS)
        </h2>
        <p className="mt-2 text-sm text-muted">
          Seat prices feed the AI buyer (thin facts only) and scoring. Coaching
          tips below never go into ElevenLabs.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Company name
            <input
              className={fieldClass}
              value={draft.firmName}
              onChange={(e) => update("firmName", e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted sm:col-span-2 lg:col-span-2">
            Vertical
            <input
              className={fieldClass}
              value={draft.vertical}
              onChange={(e) => update("vertical", e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            List seat $/mo
            <input
              type="number"
              min={1}
              max={500}
              className={fieldClass}
              value={draft.standardPermFeePct}
              onChange={(e) =>
                update("standardPermFeePct", Number(e.target.value))
              }
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Floor seat $/mo
            <input
              type="number"
              min={1}
              max={500}
              className={fieldClass}
              value={draft.feeFloorPct}
              onChange={(e) => update("feeFloorPct", Number(e.target.value))}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Competitor quote $/mo
            <input
              type="number"
              min={1}
              max={500}
              className={fieldClass}
              value={draft.competitorQuotePct}
              onChange={(e) =>
                update("competitorQuotePct", Number(e.target.value))
              }
            />
          </label>
        </div>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted">
          Value anchors (one per line)
          <textarea
            rows={4}
            className={fieldClass}
            value={listToLines(draft.valueAnchors)}
            onChange={(e) =>
              update("valueAnchors", linesToList(e.target.value))
            }
          />
        </label>
      </section>

      <section className="surface-card rounded-xl p-5 sm:p-6">
        <p className="eyebrow">Talk-tracks</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Objection playbooks
        </h2>
        <p className="mt-2 text-sm text-muted">
          Drive live Soft/Full cue cards and scoring. Not injected into the voice
          client.
        </p>

        <div className="mt-4 space-y-3">
          {draft.talkTracks.map((t) => {
            const open = openTrack === t.id;
            return (
              <div
                key={t.id}
                className="rounded-lg border border-border bg-background"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  onClick={() => setOpenTrack(open ? null : t.id)}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {t.title}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted">
                    {t.objectionType} · {open ? "Hide" : "Edit"}
                  </span>
                </button>
                {open ? (
                  <div className="space-y-3 border-t border-border px-4 py-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Approved play
                      <textarea
                        rows={2}
                        className={fieldClass}
                        value={t.approvedPlay}
                        onChange={(e) =>
                          updateTrack(t.id, { approvedPlay: e.target.value })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Anchor points (one per line)
                      <textarea
                        rows={3}
                        className={fieldClass}
                        value={listToLines(t.anchorPoints)}
                        onChange={(e) =>
                          updateTrack(t.id, {
                            anchorPoints: linesToList(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Never do (one per line)
                      <textarea
                        rows={2}
                        className={fieldClass}
                        value={listToLines(t.neverDo)}
                        onChange={(e) =>
                          updateTrack(t.id, {
                            neverDo: linesToList(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Example line (Full cues)
                      <textarea
                        rows={2}
                        className={fieldClass}
                        value={t.exampleLine}
                        onChange={(e) =>
                          updateTrack(t.id, { exampleLine: e.target.value })
                        }
                      />
                    </label>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="surface-card rounded-xl p-5 sm:p-6">
        <p className="eyebrow">FAQ / dump</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Extra company notes
        </h2>
        <p className="mt-2 text-sm text-muted">
          Freeform dump for humans (and future retrieval). Not pasted wholesale
          into ElevenLabs.
        </p>
        <textarea
          rows={6}
          className={`${fieldClass} mt-4`}
          value={draft.faqNotes}
          onChange={(e) => update("faqNotes", e.target.value)}
        />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save playbook"}
        </button>
        {message ? (
          <p className="text-sm text-ok">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <p className="w-full text-xs text-muted sm:w-auto">
          Updated{" "}
          {draft.updatedAt && draft.updatedAt !== new Date(0).toISOString()
            ? new Date(draft.updatedAt).toLocaleString()
            : "— defaults (not saved yet)"}
        </p>
      </div>
    </div>
  );
}
