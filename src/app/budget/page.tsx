import type { Metadata } from "next";
import { SectionIndex } from "@/components/layout/SectionIndex";

export const metadata: Metadata = { title: "Budget plan and tracker" };

export default function BudgetPage() {
  return (
    <SectionIndex
      section="budgeting"
      title="Budget plan and tracker"
      intro="Build a monthly plan around your real take-home pay and your goals, then track how each month actually goes."
    >
      <p className="mt-8 rounded-xl border border-dashed border-border p-5 text-muted">
        The budgeting app (setup, goals, plan and tracker) is coming soon. Anything you enter will be saved only in this
        browser, and you can back it up from{" "}
        <a href="/settings/" className="text-accent underline underline-offset-2">
          Settings
        </a>
        .
      </p>
    </SectionIndex>
  );
}
