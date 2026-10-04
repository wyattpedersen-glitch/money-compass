// @section budgeting
"use client";

import { addMonths, currentMonth, emergencyTarget, goalMonthly, type Goal, type GoalType } from "@/lib/budget/plan";
import { usd } from "@/lib/format";
import { NumberField } from "@/components/calculators/Fields";
import { Cite } from "@/components/lesson/Cite";
import { Bar } from "./Bar";
import { newId, useBudget } from "./useBudget";

const templates: Record<GoalType, { name: string; months: number; label: string }> = {
  emergency: { name: "Emergency fund", months: 12, label: "Emergency fund" },
  debt: { name: "Pay off a debt", months: 12, label: "Debt payoff" },
  purchase: { name: "Big purchase", months: 12, label: "Big purchase" },
  retirement: { name: "Retirement (this year's IRA)", months: 12, label: "Retirement" },
  custom: { name: "My goal", months: 12, label: "Custom" },
};

export function GoalsEditor() {
  const { budget, ready, update } = useBudget();
  if (!ready) return <p className="text-muted">Loading your goals…</p>;
  const now = currentMonth();
  const essentials = emergencyTarget(budget.expenses, 1);

  const add = (type: GoalType) =>
    update((b) => ({
      ...b,
      goals: [
        ...b.goals,
        {
          id: newId(),
          type,
          name: templates[type].name,
          target: type === "emergency" && essentials > 0 ? Math.round(essentials * 3) : 1000,
          saved: 0,
          targetDate: addMonths(now, templates[type].months),
        },
      ],
    }));
  const set = (id: string, patch: Partial<Goal>) =>
    update((b) => ({ ...b, goals: b.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  const total = budget.goals.reduce((s, g) => s + goalMonthly(g, now), 0);

  return (
    <div>
      <section aria-labelledby="ef-h" className="rounded-xl border border-border bg-surface p-5">
        <h2 id="ef-h" className="text-lg font-semibold">
          How big should an emergency fund be?
        </h2>
        <p className="mt-2 leading-relaxed">
          The common guideline is <strong>3 to 6 months of essential expenses</strong>. It&apos;s a rule of thumb from
          financial planning practice rather than a figure from any one study. The CFPB suggests starting with a small,
          reachable target and building from there <Cite id="cfpb-emergency-fund" />. Even a small cushion helps: the
          Federal Reserve&apos;s annual household survey regularly finds that a substantial share of adults
          couldn&apos;t cover an unexpected $400 expense with cash or its equivalent <Cite id="fed-shed" />.
        </p>
        <p className="mt-2 leading-relaxed text-muted">
          Lean toward the higher end if your income is irregular (like stipends or contract work), you support others,
          or a job search in your field takes a while.
        </p>
        {essentials > 0 ? (
          <p className="mt-3">
            Your essential (need) spending is {usd(essentials)} a month, so 3 months is{" "}
            <strong>{usd(essentials * 3)}</strong> and 6 months is <strong>{usd(essentials * 6)}</strong>.
          </p>
        ) : (
          <p className="mt-3 text-muted">Add your spending in step 1 to see your own 3- and 6-month numbers.</p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Add a goal">
        {(Object.keys(templates) as GoalType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => add(t)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:border-accent"
          >
            + {templates[t].label}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {budget.goals.map((g) => {
          const monthly = goalMonthly(g, now);
          return (
            <li key={g.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium" htmlFor={`gn-${g.id}`}>
                    Goal name
                  </label>
                  <input
                    id={`gn-${g.id}`}
                    value={g.name}
                    onChange={(e) => set(g.id, { name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2"
                  />
                </div>
                <NumberField
                  label="Target amount"
                  prefix="$"
                  value={g.target}
                  onChange={(n) => set(g.id, { target: n })}
                  min={0}
                  step={100}
                />
                <NumberField
                  label="Already saved"
                  prefix="$"
                  value={g.saved}
                  onChange={(n) => set(g.id, { saved: n })}
                  min={0}
                  step={50}
                />
                <div>
                  <label className="block text-sm font-medium" htmlFor={`gd-${g.id}`}>
                    Target month
                  </label>
                  <input
                    id={`gd-${g.id}`}
                    type="month"
                    value={g.targetDate}
                    min={now}
                    onChange={(e) => e.target.value && set(g.id, { targetDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2"
                  />
                </div>
                <NumberField
                  label="Savings account APY (optional)"
                  suffix="%"
                  value={g.apy ? g.apy * 100 : 0}
                  onChange={(n) => set(g.id, { apy: n > 0 ? n / 100 : undefined })}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
              <div className="mt-4">
                <Bar value={g.saved} max={g.target} label={`${g.name} progress`} />
                <p className="mt-2 text-sm text-muted">
                  {usd(g.saved)} of {usd(g.target)} saved
                </p>
              </div>
              <p className="mt-2 text-lg">
                Set aside <strong className="tabular-nums">{usd(monthly)}</strong> a month to reach it by {g.targetDate}
                .
              </p>
              {g.type === "debt" && (
                <p className="mt-1 text-sm text-muted">
                  This ignores interest on the debt, so the real payment needed is higher. The credit section&apos;s
                  payoff calculator handles interest.
                </p>
              )}
              <button
                type="button"
                onClick={() => update((b) => ({ ...b, goals: b.goals.filter((x) => x.id !== g.id) }))}
                className="mt-3 rounded-md px-3 py-1.5 text-sm text-danger-text hover:bg-danger-bg"
              >
                Remove goal<span className="sr-only"> {g.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {budget.goals.length > 0 && (
        <p className="mt-6 text-lg">
          All goals together: <strong className="tabular-nums">{usd(total)}</strong> a month.
        </p>
      )}
    </div>
  );
}
