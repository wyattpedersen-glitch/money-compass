"use client";

import { useState } from "react";
import { estimateTakeHome } from "@/lib/budget/takeHome";
import { tax2026 } from "@/content/taxFigures";
import type { Expense } from "@/lib/budget/plan";
import { pct, usd } from "@/lib/format";
import { NumberField } from "@/components/calculators/Fields";
import { HowCalculated } from "@/components/lesson/Boxes";
import { newId, useBudget } from "./useBudget";

const starter: Array<Omit<Expense, "id">> = [
  { name: "Rent", amount: 0, kind: "need", fixed: true },
  { name: "Utilities", amount: 0, kind: "need", fixed: true },
  { name: "Phone", amount: 0, kind: "need", fixed: true },
  { name: "Health insurance", amount: 0, kind: "need", fixed: true },
  { name: "Groceries", amount: 0, kind: "need", fixed: false },
  { name: "Transportation", amount: 0, kind: "need", fixed: false },
  { name: "Eating out", amount: 0, kind: "want", fixed: false },
  { name: "Entertainment", amount: 0, kind: "want", fixed: false },
  { name: "Subscriptions", amount: 0, kind: "want", fixed: true },
];

function TakeHomeEstimator({ onUse }: { onUse: (monthly: number) => void }) {
  const [gross, setGross] = useState(30_000);
  const [pretax, setPretax] = useState(0);
  const [state, setState] = useState(3);
  const r = estimateTakeHome({ grossAnnual: gross, pretaxDeductions: pretax, stateRate: state / 100 }, tax2026);
  return (
    <details className="mt-4 rounded-lg border border-border bg-surface-2 p-4">
      <summary className="cursor-pointer font-medium">Only know your salary? Estimate take-home pay</summary>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <NumberField label="Yearly gross pay" prefix="$" value={gross} onChange={setGross} min={0} step={1000} />
        <NumberField
          label="Pre-tax deductions per year"
          prefix="$"
          value={pretax}
          onChange={setPretax}
          min={0}
          step={500}
          help="Traditional 401(k)/403(b)/457(b), health premiums."
        />
        <NumberField
          label="State + local tax (rough)"
          suffix="%"
          value={state}
          onChange={setState}
          min={0}
          max={15}
          step={0.5}
          help="A flat estimate. Your pay stub is the real answer."
        />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        <dt className="text-muted">Federal income tax</dt>
        <dd className="tabular-nums">{usd(r.federalIncomeTax)}</dd>
        <dt className="text-muted">Social Security + Medicare</dt>
        <dd className="tabular-nums">{usd(r.socialSecurity + r.medicare)}</dd>
        <dt className="text-muted">State and local</dt>
        <dd className="tabular-nums">{usd(r.stateTax)}</dd>
      </dl>
      <p className="mt-3">
        Estimated take-home: <strong>{usd(r.netMonthly)} a month</strong> ({usd(r.netAnnual)} a year). Federal bracket
        on your last dollar: {pct(r.marginalRate, 0)}.
      </p>
      <button
        type="button"
        onClick={() => onUse(Math.round(r.netMonthly))}
        className="mt-3 rounded-md bg-accent px-4 py-2 font-medium text-on-accent hover:bg-accent-hover"
      >
        Use {usd(r.netMonthly)} as my monthly take-home pay
      </button>
      <HowCalculated>
        <p>
          A rough estimate for a single filer with wage income only, using {tax2026.taxYear} federal figures: the
          standard deduction ({usd(tax2026.singleStandardDeduction)}), the single-filer brackets, Social Security tax of
          6.2% up to {usd(tax2026.socialSecurityWageBase)} of wages and Medicare tax of 1.45%. State and local tax is
          your flat estimate times gross pay.
        </p>
        <p>
          It ignores tax credits, itemized deductions, the extra Medicare tax for high earners, and the fact that FICA
          is charged before some deductions. Grad school stipends are often paid without any tax withheld, so you may
          owe tax at filing time.
        </p>
        <ul>
          {tax2026.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p>
          {tax2026.checked
            ? `Checked ${tax2026.checked}.`
            : "These figures are pending a re-check against the IRS and SSA pages."}
        </p>
      </HowCalculated>
    </details>
  );
}

export function SetupEditor() {
  const { budget, ready, update } = useBudget();
  if (!ready) return <p className="text-muted">Loading your budget…</p>;

  const setExpense = (id: string, patch: Partial<Expense>) =>
    update((b) => ({ ...b, expenses: b.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const total = budget.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-10">
      <section aria-labelledby="income-h">
        <h2 id="income-h" className="text-xl font-semibold">
          Monthly take-home pay
        </h2>
        <p className="mt-1 text-muted">
          What actually lands in your bank account each month after taxes and deductions. If your income varies, use a
          cautious typical month.
        </p>
        <div className="mt-3 max-w-xs">
          <NumberField
            label="Take-home pay per month"
            prefix="$"
            value={budget.income}
            onChange={(n) => update((b) => ({ ...b, income: n }))}
            min={0}
            step={50}
          />
        </div>
        <TakeHomeEstimator onUse={(n) => update((b) => ({ ...b, income: n }))} />
      </section>

      <section aria-labelledby="exp-h">
        <h2 id="exp-h" className="text-xl font-semibold">
          Monthly spending
        </h2>
        <p className="mt-1 text-muted">
          List what you spend in a typical month. Mark each one as a <strong>need</strong> (you&apos;d have to pay it no
          matter what) or a <strong>want</strong>. Your bank and card statements from the last two or three months are
          the best place to find real numbers.
        </p>
        {budget.expenses.length === 0 && (
          <button
            type="button"
            onClick={() => update((b) => ({ ...b, expenses: starter.map((e) => ({ ...e, id: newId() })) }))}
            className="mt-4 rounded-md border border-border bg-surface px-4 py-2 font-medium hover:border-accent"
          >
            Start with common categories
          </button>
        )}
        <ul className="mt-4 space-y-3">
          {budget.expenses.map((e) => (
            <li
              key={e.id}
              className="grid grid-cols-2 items-end gap-3 rounded-lg border border-border bg-surface p-3 sm:grid-cols-[1fr_9rem_8rem_6rem_auto]"
            >
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium" htmlFor={`n-${e.id}`}>
                  Category
                </label>
                <input
                  id={`n-${e.id}`}
                  value={e.name}
                  onChange={(ev) => setExpense(e.id, { name: ev.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2"
                />
              </div>
              <NumberField
                label="Per month"
                prefix="$"
                value={e.amount}
                onChange={(n) => setExpense(e.id, { amount: n })}
                min={0}
                step={10}
              />
              <div>
                <label className="block text-sm font-medium" htmlFor={`k-${e.id}`}>
                  Type
                </label>
                <select
                  id={`k-${e.id}`}
                  value={e.kind}
                  onChange={(ev) => setExpense(e.id, { kind: ev.target.value as Expense["kind"] })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-2"
                >
                  <option value="need">Need</option>
                  <option value="want">Want</option>
                </select>
              </div>
              <label className="flex items-center gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={e.fixed}
                  onChange={(ev) => setExpense(e.id, { fixed: ev.target.checked })}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                Fixed
              </label>
              <button
                type="button"
                onClick={() => update((b) => ({ ...b, expenses: b.expenses.filter((x) => x.id !== e.id) }))}
                className="rounded-md px-3 py-2 text-sm text-danger-text hover:bg-danger-bg"
              >
                Remove<span className="sr-only"> {e.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            update((b) => ({
              ...b,
              expenses: [...b.expenses, { id: newId(), name: "", amount: 0, kind: "need", fixed: false }],
            }))
          }
          className="mt-3 rounded-md border border-border px-4 py-2 font-medium hover:border-accent"
        >
          + Add a category
        </button>
        <p className="mt-4 text-lg">
          Total spending: <strong className="tabular-nums">{usd(total)}</strong> a month
          {budget.income > 0 && (
            <span className="text-muted">
              {" "}
              ({pct(total / budget.income, 0)} of take-home pay, leaving {usd(budget.income - total)})
            </span>
          )}
        </p>
      </section>
    </div>
  );
}
