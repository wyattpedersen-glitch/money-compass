"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { resultLabels } from "@/lib/quiz/quiz";
import { useAppData, useHydrated } from "@/lib/storage/store";

/**
 * With skipOnboardingQuiz on (the default), the quiz is a small optional
 * link. With it off, first-time visitors see the quiz before Start here.
 */
export function HomeQuizPrompt() {
  const data = useAppData();
  const hydrated = useHydrated();
  if (hydrated && data.quiz) {
    return (
      <p className="mt-4 text-sm text-muted">
        Your quiz suggested: <strong className="text-text">{resultLabels[data.quiz.result].title}</strong>.{" "}
        <Link href="/quiz/" className="underline underline-offset-2">
          See your next steps
        </Link>
      </p>
    );
  }
  if (!siteConfig.skipOnboardingQuiz) {
    return (
      <div className="mt-6 rounded-xl border border-accent/40 bg-accent-soft p-5">
        <p className="text-lg font-semibold">Not sure where to start?</p>
        <p className="mt-1">Answer four quick questions and get a suggested first step.</p>
        <Link
          href="/quiz/"
          className="mt-3 inline-block rounded-md bg-accent px-4 py-2 font-medium text-on-accent hover:bg-accent-hover"
        >
          Take the quiz
        </Link>
      </div>
    );
  }
  return (
    <p className="mt-4 text-sm text-muted">
      Prefer a personalized starting point?{" "}
      <Link href="/quiz/" className="underline underline-offset-2">
        Take the optional four-question quiz
      </Link>
      .
    </p>
  );
}
