"use client";

import { updateData, useAppData, useHydrated } from "@/lib/storage/store";

export function MarkComplete({ lessonKey }: { lessonKey: string }) {
  const data = useAppData();
  const hydrated = useHydrated();
  const done = hydrated && Boolean(data.progress.completed[lessonKey]);
  const toggle = () =>
    updateData((d) => {
      const completed = { ...d.progress.completed };
      if (completed[lessonKey]) delete completed[lessonKey];
      else completed[lessonKey] = new Date().toISOString().slice(0, 10);
      return { ...d, progress: { ...d.progress, completed } };
    });
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={`w-full rounded-xl border-2 px-4 py-3 font-medium sm:w-auto ${
        done ? "border-accent bg-accent-soft text-accent" : "border-border hover:border-accent"
      }`}
    >
      {done ? "✓ Lesson completed" : "Mark this lesson as complete"}
    </button>
  );
}
