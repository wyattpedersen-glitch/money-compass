import Link from "next/link";
import type { ReactNode } from "react";
import { lessonHref, lessonsIn } from "@/content/lessons";
import type { LessonMeta } from "@/content/types";
import { PageHeader } from "./PageHeader";
import { Disclaimer } from "@/components/lesson/Boxes";
import { LessonProgressBadge } from "./LessonProgressBadge";

export function SectionIndex({
  section,
  title,
  intro,
  children,
}: {
  section: LessonMeta["section"];
  title: string;
  intro: ReactNode;
  children?: ReactNode;
}) {
  const items = lessonsIn(section);
  return (
    <div className="mx-auto max-w-3xl px-4">
      <PageHeader title={title}>{intro}</PageHeader>
      <Disclaimer compact />
      {children}
      <h2 className="mt-10 text-xl font-semibold">Lessons</h2>
      <ol className="mt-4 space-y-3">
        {items.map((l, i) => {
          const ready = l.status === "published";
          const body = (
            <>
              <span className="text-sm text-muted">Lesson {i + 1}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-2 text-lg font-medium">
                {l.title}
                {!ready && <span className="text-sm font-normal text-muted">(coming soon)</span>}
                {ready && <LessonProgressBadge lessonKey={`${l.section}/${l.slug}`} />}
              </span>
              <span className="mt-1 block text-muted">{l.summary}</span>
            </>
          );
          return (
            <li key={l.slug}>
              {ready ? (
                <Link
                  href={lessonHref(l)}
                  className="block rounded-xl border border-border bg-surface p-4 hover:border-accent"
                >
                  {body}
                </Link>
              ) : (
                <div className="block rounded-xl border border-dashed border-border p-4">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
