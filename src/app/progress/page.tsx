import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressView } from "@/components/progress/ProgressView";

export const metadata: Metadata = { title: "Your progress" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10">
      <PageHeader title="Your progress">Lessons you&apos;ve marked complete. Saved in this browser only.</PageHeader>
      <ProgressView />
    </div>
  );
}
