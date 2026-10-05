import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Where should I start?" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10">
      <PageHeader title="Where should I start?">
        Four quick questions to suggest which part of the site to read first. Your answers stay in this browser.
      </PageHeader>
      <Quiz />
    </div>
  );
}
