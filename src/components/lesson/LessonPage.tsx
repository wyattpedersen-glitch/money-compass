import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findLesson, publishedLessonsIn } from "@/content/lessons";
import type { LessonMeta } from "@/content/types";
import { LessonLayout } from "./LessonLayout";

type Section = LessonMeta["section"];

export function lessonStaticParams(section: Section) {
  return publishedLessonsIn(section).map((l) => ({ slug: l.slug }));
}

export async function lessonMetadata(section: Section, slug: string): Promise<Metadata> {
  const l = findLesson(section, slug);
  return l ? { title: l.title, description: l.summary } : {};
}

export async function renderLesson(section: Section, slug: string) {
  const lesson = findLesson(section, slug);
  if (!lesson || lesson.status !== "published") notFound();
  const { default: Content } = await import(`@/content/lessons/${section}/${slug}.mdx`);
  return (
    <LessonLayout lesson={lesson}>
      <Content />
    </LessonLayout>
  );
}
