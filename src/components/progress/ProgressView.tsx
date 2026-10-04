"use client";

import Link from "next/link";
import { lessonHref, publishedLessonsIn } from "@/content/lessons";
import { sectionLabels } from "@/content/types";
import { resultLabels } from "@/lib/quiz/quiz";
import { updateData, useAppData, useHydrated } from "@/lib/storage/store";
import { Bar } from "@/components/budget/Bar";

const sections = ["budgeting", "credit", "investing"] as const;

export function ProgressView() {
  const data = useAppData();
  const hydrated = useHydrated();
  if (!hydrated) return <p className="text-muted">Loading your progress…</p>;
  const done = data.progress.completed;
  const all = sections.flatMap((s) => publishedLessonsIn(s));
  const count = all.filter((l) => done[`${l.section}/${l.slug}`]).length;

  return (
    <div>
      <p className="text-lg">
        <strong>
          {count} of {all.length}
        </strong>{" "}
        lessons completed
      </p>
      <div className="mt-2 max-w-md">
        <Bar value={count} max={all.length} label="Lessons completed" />
      </div>

      {data.quiz ? (
        <p className="mt-6 rounded-lg bg-surface-2 p-4">
          Your quiz suggested: <strong>{resultLabels[data.quiz.result].title}</strong>.{" "}
          <Link href="/quiz/" className="text-accent underline underline-offset-2">
            See your next steps
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-muted">
          Not sure where to begin?{" "}
          <Link href="/quiz/" className="text-accent underline underline-offset-2">
            Take the four-question quiz
          </Link>
          .
        </p>
      )}

      {sections.map((s) => {
        const ls = publishedLessonsIn(s);
        const n = ls.filter((l) => done[`${l.section}/${l.slug}`]).length;
        return (
          <section key={s} aria-labelledby={`p-${s}`} className="mt-8">
            <h2 id={`p-${s}`} className="text-lg font-semibold">
              {sectionLabels[s]}{" "}
              <span className="text-sm font-normal text-muted">
                ({n} of {ls.length})
              </span>
            </h2>
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
              {ls.map((l) => {
                const when = done[`${l.section}/${l.slug}`];
                return (
                  <li key={l.slug} className="flex items-center justify-between gap-4 px-4 py-3">
                    <Link href={lessonHref(l)} className="font-medium hover:text-accent">
                      {l.title}
                    </Link>
                    <span className={`shrink-0 text-sm ${when ? "text-accent" : "text-muted"}`}>
                      {when ? `✓ Done ${when}` : "Not yet"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {count > 0 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all lesson progress? Your budget and quiz result are kept."))
              updateData((d) => ({ ...d, progress: { ...d.progress, completed: {} } }));
          }}
          className="mt-8 rounded-md px-3 py-2 text-sm text-danger-text hover:bg-danger-bg"
        >
          Reset lesson progress
        </button>
      )}
    </div>
  );
}
