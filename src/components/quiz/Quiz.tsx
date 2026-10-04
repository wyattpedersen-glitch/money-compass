"use client";

import { useState } from "react";
import Link from "next/link";
import { questions, resultLabels, scoreQuiz, stepsFor, type Answer, type Answers } from "@/lib/quiz/quiz";
import { updateData, useAppData, useHydrated } from "@/lib/storage/store";

const choices: Array<{ value: Answer; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export function Quiz() {
  const data = useAppData();
  const hydrated = useHydrated();
  const [answers, setAnswers] = useState<Answers>({});
  const [retake, setRetake] = useState(false);
  const complete = questions.every((q) => answers[q.id]);

  if (hydrated && data.quiz && !retake) {
    return <SavedResult onRetake={() => setRetake(true)} />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!complete) return;
        const outcome = scoreQuiz(answers);
        updateData((d) => ({
          ...d,
          quiz: {
            result: outcome.result,
            takenAt: new Date().toISOString().slice(0, 10),
            startWithBudget: outcome.startWithBudget,
            struggling: answers.struggling === "yes",
          },
        }));
        setRetake(false);
      }}
      className="space-y-6"
    >
      {questions.map((q, i) => (
        <fieldset key={q.id} className="rounded-xl border border-border bg-surface p-4">
          <legend className="sr-only">Question {i + 1}</legend>
          <p className="font-medium" id={`q-${q.id}`}>
            {i + 1}. {q.text}
          </p>
          {q.help && <p className="mt-1 text-sm text-muted">{q.help}</p>}
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`q-${q.id}`}>
            {choices.map((c) => {
              const checked = answers[q.id] === c.value;
              return (
                <label
                  key={c.value}
                  className={`cursor-pointer rounded-md border px-4 py-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    checked ? "border-accent bg-accent-soft font-medium" : "border-border bg-bg"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={c.value}
                    checked={checked}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: c.value }))}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      <button
        type="submit"
        disabled={!complete}
        className="rounded-md bg-accent px-5 py-2.5 font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50"
      >
        See my starting point
      </button>
      {!complete && <p className="text-sm text-muted">Answer all {questions.length} questions to continue.</p>}
    </form>
  );
}

function SavedResult({ onRetake }: { onRetake: () => void }) {
  const data = useAppData();
  if (!data.quiz) return null;
  const label = resultLabels[data.quiz.result];
  const steps = stepsFor(data.quiz.result, {
    startWithBudget: data.quiz.startWithBudget ?? false,
    struggling: data.quiz.struggling ?? false,
  });
  return (
    <div role="status" className="rounded-2xl border border-accent/40 bg-accent-soft p-5 sm:p-6">
      <p className="text-sm text-muted">Your result (taken {data.quiz.takenAt})</p>
      <h2 className="mt-1 text-2xl font-semibold">{label.title}</h2>
      <p className="mt-2 leading-relaxed">{label.body}</p>
      <h3 className="mt-5 font-semibold">Suggested next steps</h3>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        {steps.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="text-accent underline underline-offset-2">
              {s.label}
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">
        This is a rough starting point, not advice. For the reasoning behind this order, see{" "}
        <Link href="/investing/account-types/" className="underline underline-offset-2">
          where your next dollar should go
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRetake}
          className="rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium"
        >
          Retake the quiz
        </button>
        <button
          type="button"
          onClick={() => updateData((d) => ({ ...d, quiz: null }))}
          className="rounded-md px-4 py-2 text-sm text-muted underline underline-offset-2"
        >
          Clear my result
        </button>
      </div>
    </div>
  );
}
