"use client";

import Link from "next/link";
import { buildPlan, currentMonth } from "@/lib/budget/plan";
import { monthLabel, usd } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { PlanResult } from "./PlanView";
import { useBudget } from "./useBudget";

const frameworkNames = {
  "50-30-20": "50/30/20",
  "zero-based": "Zero-based",
  "pay-yourself-first": "Pay yourself first",
};

export function PrintPlan() {
  const { budget, ready } = useBudget();
  if (!ready) return <p className="text-muted">Loading your plan…</p>;
  const now = currentMonth();
  const plan = buildPlan({ ...budget, now });
  if (budget.income <= 0)
    return (
      <p className="rounded-xl border border-dashed border-border p-5 text-muted">
        There&apos;s nothing to print yet. Start with{" "}
        <Link href="/budget/setup/" className="text-accent underline underline-offset-2">
          step 1
        </Link>
        .
      </p>
    );
  const group = (kind: "need" | "want") => budget.expenses.filter((e) => e.kind === kind);

  return (
    <div>
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print rounded-md bg-accent px-4 py-2 font-medium text-on-accent hover:bg-accent-hover"
      >
        Print or save as PDF
      </button>
      <p className="no-print mt-2 text-sm text-muted">
        In the print window, choose &quot;Save as PDF&quot; as the printer to keep a copy.
      </p>

      <article className="mt-8">
        <header>
          <p className="text-sm text-muted">{siteConfig.name}</p>
          <h2 className="text-2xl font-semibold">Monthly budget plan, {monthLabel(now)}</h2>
          <p className="mt-1 text-muted">Method: {frameworkNames[budget.framework]}</p>
        </header>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
          {(["need", "want"] as const).map((k) => (
            <section key={k} className="print-break-avoid">
              <h3 className="font-semibold">{k === "need" ? "Needs" : "Wants"}</h3>
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {group(k).map((e) => (
                    <tr key={e.id} className="border-b border-border">
                      <th scope="row" className="py-1 text-left font-normal">
                        {e.name}
                      </th>
                      <td className="py-1 text-right tabular-nums">{usd(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        <PlanResult plan={plan} framework={budget.framework} />
      </article>
    </div>
  );
}
