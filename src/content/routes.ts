import { lessonForHref } from "./lessons";

/**
 * Non-lesson pages that exist so far. Links to anything else (for example a
 * Start here step whose page isn't built yet) render as "coming soon".
 */
export const builtPages = new Set<string>([
  "/",
  "/about/",
  "/investing/",
  "/budget/",
  "/budget/setup/",
  "/budget/goals/",
  "/budget/plan/",
  "/budget/tracker/",
  "/budget/print/",
  "/credit/",
  "/glossary/",
  "/sources/",
  "/settings/",
]);

export function isAvailable(href: string): boolean {
  const lesson = lessonForHref(href);
  if (lesson) return lesson.status === "published";
  return builtPages.has(href);
}
