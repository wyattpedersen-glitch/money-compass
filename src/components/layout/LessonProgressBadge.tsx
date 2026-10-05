"use client";

import { useAppData, useHydrated } from "@/lib/storage/store";

export function LessonProgressBadge({ lessonKey }: { lessonKey: string }) {
  const data = useAppData();
  const hydrated = useHydrated();
  if (!hydrated || !data.progress.completed[lessonKey]) return null;
  return <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">Completed</span>;
}
