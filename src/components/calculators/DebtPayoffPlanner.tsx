"use client";

import { useState } from "react";
import { simulatePayoff, type Debt, type Strategy } from "@/lib/credit/payoff";
import { usd, usdCompact } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat } from "./Fields";
import { LineChart } from "./LineChart";

const starter: Debt[] = [
  { id: "a", name: "Credit card", balance: 3000, apr: 0.24, minPayment: 90 },
  { id: "b", name: "Car loan", balance: 8000, apr: 0.07, minPayment: 200 },
  { id: "c", name: "Store card", balance: 600, apr: 0.18, minPayment: 25 },
];

function months(n: number) {
  const y = Math.floor(n / 12);
  const m = n % 12;
  return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(" ") || "0 mo";
}

export function DebtPayoffPlanner() {
  const [debts, setDebts] = useState(starter);
  const [budget, setBudget] = useState(500);
  const set = (id: string, patch: Partial<Debt>) =>
    setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const results: Record<Strategy, ReturnType<typeof simulatePayoff>> = {
    avalanche: simulatePayoff(debts, budget, "avalanche"),
    snowball: simulatePayoff(debts, budget, "snowball"),
  };
  const minTotal = debts.reduce((s, d) => s + d.minPayment, 0);
  const a = results.avalanche;
  const s = results.snowball;
  const len = Math.max(a.balances.length, s.balances.length);
  const pad = (xs: number[]) => Array.from({ length: len }, (_, i) => xs[i] ?? 0);
  const name = (id: string) => debts.find((d) => d.id === id)?.name ?? id;

  return (
    <CalculatorCard title="Debt payoff planner: avalanche vs. snowball">
      <ul className="list-none space-y-4 pl-0">
        {debts.map((d) => (
          <li key={d.id} className="rounded-lg border border-border bg-bg p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor={`dn-${d.id}`} className="block text-sm font-medium">
                  Debt name
                </label>
                <input
                  id={`dn-${d.id}`}
                  value={d.name}
                  onChange={(e) => set(d.id, { name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => setDebts((ds) => ds.filter((x) => x.id !== d.id))}
                className="rounded-md px-3 py-2 text-sm text-danger-text hover:bg-danger-bg"
              >
                Remove<span className="sr-only"> {d.name}</span>
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <NumberField
                label="Balance"
                prefix="$"
                value={d.balance}
                onChange={(n) => set(d.id, { balance: n })}
                min={0}
                step={100}
              />
              <NumberField
                label="APR"
                suffix="%"
                value={Math.round(d.apr * 1000) / 10}
                onChange={(n) => set(d.id, { apr: n / 100 })}
                min={0}
                max={40}
                step={0.1}
              />
              <NumberField
                label="Minimum payment"
                prefix="$"
                value={d.minPayment}
                onChange={(n) => set(d.id, { minPayment: n })}
                min={0}
                step={5}
              />
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          setDebts((ds) => [
            ...ds,
            { id: Math.random().toString(36).slice(2), name: "New debt", balance: 1000, apr: 0.2, minPayment: 30 },
          ])
        }
        className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-sm font-medium hover:border-accent"
      >
        + Add a debt
      </button>

      <div className="mt-5 max-w-xs">
        <NumberField
          label="Total you can pay each month"
          prefix="$"
          value={budget}
          onChange={setBudget}
          min={0}
          step={25}
          help={`Minimums add up to ${usd(minTotal)}.`}
        />
      </div>

      {debts.length === 0 ? (
        <p className="mt-4 text-muted">Add a debt to compare strategies.</p>
      ) : a.shortfall ? (
        <p role="alert" className="mt-4 rounded-md bg-danger-bg p-3 text-danger-text">
          {usd(budget)} doesn&apos;t cover the minimum payments ({usd(minTotal)}). Missing minimums leads to late fees
          and credit damage. If this is your real situation, a nonprofit credit counselor can help (see the lesson on
          when debt gets dangerous).
        </p>
      ) : a.stalled ? (
        <p role="alert" className="mt-4 rounded-md bg-danger-bg p-3 text-danger-text">
          At this payment the balances don&apos;t go down within 50 years, because the interest is about as large as the
          payments. Try a larger monthly amount.
        </p>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(["avalanche", "snowball"] as const).map((k) => {
              const r = results[k];
              return (
                <div key={k} className="rounded-lg border border-border bg-bg p-4">
                  <h3 className="font-semibold">
                    {k === "avalanche" ? "Avalanche (highest rate first)" : "Snowball (smallest balance first)"}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Stat label="Debt-free in" value={months(r.months)} />
                    <Stat label="Total interest" value={usd(r.totalInterest)} />
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    First debt gone: {name(r.order[0].id)} in month {r.order[0].month}
                  </p>
                  <ol className="mt-1 list-decimal pl-5 text-sm">
                    {r.order.map((o) => (
                      <li key={o.id}>
                        {name(o.id)}: month {o.month}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
          <p className="mt-4">
            {s.totalInterest - a.totalInterest < 1
              ? "Here both methods cost about the same in interest."
              : `Avalanche saves ${usd(s.totalInterest - a.totalInterest)} in interest. Snowball pays off its first debt ${a.order[0].month - s.order[0].month} months sooner.`}
          </p>
          <div className="mt-5">
            <LineChart
              x={Array.from({ length: len }, (_, i) => i)}
              xLabel="Month"
              formatX={(n) => String(n)}
              formatY={usdCompact}
              summary={`Total balance falls to zero in ${a.months} months with avalanche and ${s.months} months with snowball.`}
              series={[
                { name: "Avalanche", color: "var(--series-1)", values: pad(a.balances) },
                { name: "Snowball", color: "var(--series-2)", values: pad(s.balances), dashed: true },
              ]}
            />
          </div>
        </>
      )}

      <HowCalculated>
        <p>
          Each month, every balance grows by its APR ÷ 12. Then every debt gets its minimum payment, and whatever is
          left of your monthly total goes to the top-priority debt: the highest APR for avalanche, the smallest balance
          for snowball. When a debt is paid off, its minimum rolls into the next one, so your total payment stays the
          same.
        </p>
        <ul>
          <li>Rates and minimums stay fixed. Real credit card minimums usually shrink as the balance falls.</li>
          <li>No new charges, fees or missed payments are included.</li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
