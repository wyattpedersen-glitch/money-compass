"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { href: "/budget/", label: "Overview" },
  { href: "/budget/setup/", label: "1. Income & spending" },
  { href: "/budget/goals/", label: "2. Goals" },
  { href: "/budget/plan/", label: "3. Plan" },
  { href: "/budget/tracker/", label: "4. Tracker" },
  { href: "/budget/print/", label: "Print" },
];

export function BudgetNav() {
  const path = usePathname();
  return (
    <nav aria-label="Budget steps" className="no-print -mx-4 overflow-x-auto px-4">
      <ul className="flex min-w-max gap-1 border-b border-border">
        {steps.map((s) => {
          const active = path === s.href;
          return (
            <li key={s.href}>
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`block border-b-2 px-3 py-2 text-sm font-medium ${
                  active ? "border-accent text-accent" : "border-transparent text-muted hover:text-text"
                }`}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function BudgetShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8">
      <div className="pb-4 pt-10">
        <p className="text-sm text-muted">Budget plan and tracker</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
        {intro && <div className="mt-3 max-w-2xl leading-relaxed text-muted">{intro}</div>}
      </div>
      <BudgetNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function SavedNote() {
  return (
    <p className="mt-8 text-sm text-muted">
      Saved automatically in this browser only.{" "}
      <Link href="/settings/" className="underline underline-offset-2">
        Back up or move your data
      </Link>
    </p>
  );
}
