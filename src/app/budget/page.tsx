import type { Metadata } from "next";
import Link from "next/link";
import { SectionIndex } from "@/components/layout/SectionIndex";

export const metadata: Metadata = { title: "Budget plan and tracker" };

const steps = [
  {
    href: "/budget/setup/",
    title: "1. Income and spending",
    body: "Estimate your take-home pay and list what you spend each month.",
  },
  {
    href: "/budget/goals/",
    title: "2. Goals",
    body: "An emergency fund, a debt, a big purchase: each with a target and a date.",
  },
  {
    href: "/budget/plan/",
    title: "3. Your plan",
    body: "Pick a method and see whether everything fits, with new dates if it doesn't.",
  },
  {
    href: "/budget/tracker/",
    title: "4. Tracker",
    body: "Record spending by hand or import your bank's CSV, and compare it to the plan.",
  },
  { href: "/budget/print/", title: "Printable plan", body: "A one-page version to print or save as a PDF." },
];

export default function BudgetPage() {
  return (
    <SectionIndex
      section="budgeting"
      title="Budget plan and tracker"
      intro="Build a monthly plan around your real take-home pay and your goals, then track how each month actually goes."
    >
      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        {steps.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="block h-full rounded-xl border border-border bg-surface p-4 hover:border-accent"
            >
              <span className="block text-lg font-medium">{s.title}</span>
              <span className="mt-1 block text-muted">{s.body}</span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">
        Everything you enter is saved only in this browser. Back it up or move it to another device from{" "}
        <Link href="/settings/" className="underline underline-offset-2">
          Settings
        </Link>
        .
      </p>
    </SectionIndex>
  );
}
