import Link from "next/link";
import type { ReactNode } from "react";
import { lessonHref, publishedLessonsIn, sectionPaths } from "@/content/lessons";
import { sectionLabels, type LessonMeta } from "@/content/types";
import { Disclaimer, LastReviewed } from "./Boxes";
import { MarkComplete } from "./MarkComplete";

export function LessonLayout({ lesson, children }: { lesson: LessonMeta; children: ReactNode }) {
  const siblings = publishedLessonsIn(lesson.section);
  const i = siblings.findIndex((l) => l.slug === lesson.slug);
  const prev = i > 0 ? siblings[i - 1] : undefined;
  const next = i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : undefined;
  const key = `${lesson.section}/${lesson.slug}`;
  return (
    <article className="mx-auto max-w-3xl px-4 pb-8">
      <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted">
        <Link href={`${sectionPaths[lesson.section]}/`} className="underline underline-offset-2">
          {sectionLabels[lesson.section]}
        </Link>
      </nav>
      <header className="pb-6 pt-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <p className="mt-3 text-lg text-muted">{lesson.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {lesson.lastReviewed && <LastReviewed date={lesson.lastReviewed} />}
          {lesson.minutes && <p className="text-sm text-muted">About {lesson.minutes} minutes</p>}
        </div>
      </header>
      <Disclaimer compact />
      <div className="prose-lesson mt-6">{children}</div>
      <div className="no-print mt-10">
        <MarkComplete lessonKey={key} />
      </div>
      <nav aria-label="Lesson navigation" className="no-print mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={lessonHref(prev)} className="rounded-xl border border-border p-4 hover:border-accent">
            <span className="block text-sm text-muted">Previous</span>
            <span className="font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={lessonHref(next)} className="rounded-xl border border-border p-4 text-right hover:border-accent">
            <span className="block text-sm text-muted">Next</span>
            <span className="font-medium">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
