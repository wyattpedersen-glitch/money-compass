"use client";

import Link from "next/link";
import { buildPlan, currentMonth } from "@/lib/budget/plan";
import { usd } from "@/lib/format";
import { CalculatorCard } from "@/components/calculators/Fields";
import type { Budget } from "@/lib/storage/schema";
import { useBudget } from "./useBudget";

/** Turns the saved plan into a list of automatic transfers to schedule. */
export function AutoTransfers() {
  const { budget, ready } = useBudget();
  return (
    <CalculatorCard title="Your automatic transfers">
      {!ready ? (
        <p className="text-muted">Loading…</p>
      ) : budget.income <= 0 || budget.goals.length === 0 ? (
        <p className="text-muted">
          Once you&apos;ve entered your income and at least one goal in the{" "}
          <Link href="/budget/" className="text-accent underline underline-offset-2">
            budget planner
          </Link>
          , this box lists the transfers to set up.
        </p>
      ) : (
        <Transfers budget={budget} />
      )}
    </CalculatorCard>
  );
}

function Transfers({ budget }: { budget: Budget }) {
  const plan = buildPlan({ ...budget, now: currentMonth() });
  const lines = plan.goalLines.filter((g) => g.funded >= 1);
  const fixed = budget.expenses.filter((e) => e.fixed);
  return (
    <div>
      <p>Schedule these for the day after payday, so the money moves before you can spend it:</p>
      <ul className="mt-3 list-none space-y-2 pl-0">
        {lines.map((g) => (
          <li key={g.goal.id} className="flex justify-between gap-4 rounded-md border border-border bg-bg px-3 py-2">
            <span>{g.goal.name}</span>
            <strong className="tabular-nums">{usd(g.funded)} / month</strong>
          </li>
        ))}
      </ul>
      {fixed.length > 0 && (
        <>
          <p className="mt-4">Fixed bills you could put on autopay:</p>
          <ul className="mt-2 list-disc pl-5">
            {fixed.map((e) => (
              <li key={e.id}>
                {e.name} ({usd(e.amount)})
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-4 text-sm text-muted">
        Total moving automatically: {usd(lines.reduce((s, g) => s + g.funded, 0))} a month for goals.
      </p>
    </div>
  );
}
