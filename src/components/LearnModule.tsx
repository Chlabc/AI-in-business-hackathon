"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Flashcard, QuizQuestion } from "@/lib/learn";

type Phase = "study" | "quiz" | "done";

type LearnModuleProps = {
  firmName: string;
  cards: Flashcard[];
  questions: QuizQuestion[];
};

export function LearnModule({ firmName, cards, questions }: LearnModuleProps) {
  const [phase, setPhase] = useState<Phase>("study");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const card = cards[cardIndex];
  const question = questions[qIndex];
  const score = useMemo(() => {
    let n = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctId) n += 1;
    }
    return n;
  }, [answers, questions]);

  function nextCard() {
    setFlipped(false);
    setCardIndex((i) => Math.min(i + 1, cards.length - 1));
  }

  function prevCard() {
    setFlipped(false);
    setCardIndex((i) => Math.max(i - 1, 0));
  }

  function submitAnswer() {
    if (!question || !selected) return;
    const nextAnswers = { ...answers, [question.id]: selected };
    setAnswers(nextAnswers);
    if (qIndex >= questions.length - 1) {
      setPhase("done");
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
  }

  if (phase === "study" && card) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Study</p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">
              Firm facts — {firmName}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Card {cardIndex + 1} of {cards.length}. Flip, then continue. Quiz
              unlocks when you&apos;re ready.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase("quiz");
              setQIndex(0);
              setSelected(null);
              setAnswers({});
            }}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg"
          >
            Start 5-question quiz
          </button>
        </div>

        {/* Same 3D flip as the employee credential: wrapper owns perspective
            and clipping, rotor owns the transform, both faces share one grid
            cell so the card never changes size between sides. */}
        <div className="flashcard">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="flashcard-control"
            aria-label={
              flipped ? "Hide the answer" : `Show the answer: ${card.front}`
            }
          />
          <div className="flashcard-rotor" data-flipped={flipped}>
            <div className="flashcard-face" aria-hidden={flipped}>
              <span className="pill pill-accent w-fit">{card.tag}</span>
              <p className="mt-5 text-lg font-medium leading-relaxed text-foreground sm:text-2xl">
                {card.front}
              </p>
              <span className="mt-auto inline-flex h-11 w-fit items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-fg">
                Show the answer
              </span>
            </div>
            <div
              className="flashcard-face flashcard-back"
              aria-hidden={!flipped}
            >
              <span className="pill pill-ok w-fit">Answer</span>
              <p className="mt-5 text-lg font-medium leading-relaxed text-foreground sm:text-2xl">
                {card.back}
              </p>
              <span className="mt-auto inline-flex h-11 w-fit items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-muted">
                Flip back
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={prevCard}
            disabled={cardIndex === 0}
            className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={nextCard}
            disabled={cardIndex >= cards.length - 1}
            className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next card
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz" && question) {
    const locked = Boolean(answers[question.id]);
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow">Quiz</p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            Question {qIndex + 1} of {questions.length}
          </h2>
          <p className="mt-2 text-base text-foreground">{question.prompt}</p>
        </div>

        <ul className="grid gap-2">
          {question.options.map((opt) => {
            const isSel = selected === opt.id;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setSelected(opt.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                    isSel
                      ? "border-accent bg-accent-soft text-foreground"
                      : "border-border bg-card text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          disabled={!selected}
          onClick={submitAnswer}
          className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg disabled:opacity-40"
        >
          {qIndex >= questions.length - 1 ? "Finish" : "Next question"}
        </button>
      </div>
    );
  }

  // done
  const missed = questions.filter((q) => answers[q.id] !== q.correctId);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Results</p>
        <h2 className="mt-1 text-2xl font-semibold text-foreground">
          {score}/{questions.length} correct
        </h2>
        <p className="mt-2 text-sm text-muted">
          {score === questions.length
            ? "Sharp — take that into a live drill."
            : "Review the misses, then drill the price objection while it’s fresh."}
        </p>
      </div>

      {missed.length > 0 ? (
        <section className="surface-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground">Missed</h3>
          <ul className="mt-3 space-y-3">
            {missed.map((q) => (
              <li key={q.id} className="text-sm text-muted">
                <p className="font-medium text-foreground">{q.prompt}</p>
                <p className="mt-1">{q.explain}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/coach/practice?scenario=price-objection"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg"
        >
          Start a drill
        </Link>
        <button
          type="button"
          onClick={() => {
            setPhase("study");
            setCardIndex(0);
            setFlipped(false);
            setQIndex(0);
            setSelected(null);
            setAnswers({});
          }}
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Study again
        </button>
      </div>
    </div>
  );
}
