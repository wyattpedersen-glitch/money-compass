"use client";

import { useState } from "react";
import { pct, usd } from "@/lib/format";
import { CalculatorCard, NumberField } from "@/components/calculators/Fields";
import { HowCalculated } from "@/components/lesson/Boxes";

export function UtilizationCalculator() {
  const [cards, setCards] = useState([
    { id: 1, limit: 1000, balance: 450 },
    { id: 2, limit: 500, balance: 0 },
  ]);
  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
  const totalBal = cards.reduce((s, c) => s + c.balance, 0);
  const u = totalLimit > 0 ? totalBal / totalLimit : 0;
  const set = (id: number, patch: Partial<(typeof cards)[number]>) =>
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const target = totalLimit * 0.3 - totalBal;

  return (
    <CalculatorCard title="Credit utilization calculator">
      <ul className="list-none space-y-3 pl-0">
        {cards.map((c, i) => (
          <li key={c.id} className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label={`Card ${i + 1} limit`}
              prefix="$"
              value={c.limit}
              onChange={(n) => set(c.id, { limit: n })}
              min={0}
              step={100}
            />
            <NumberField
              label={`Card ${i + 1} statement balance`}
              prefix="$"
              value={c.balance}
              onChange={(n) => set(c.id, { balance: n })}
              min={0}
              step={25}
            />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setCards((cs) => [...cs, { id: Date.now(), limit: 1000, balance: 0 }])}
        className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-sm font-medium hover:border-accent"
      >
        + Add a card
      </button>
      <p className="mt-5 text-lg" aria-live="polite">
        Your overall utilization is <strong className="tabular-nums">{pct(u, 0)}</strong> ({usd(totalBal)} of{" "}
        {usd(totalLimit)}).
      </p>
      <p className="mt-1 text-muted">
        {u <= 0.1
          ? "That's low, which is good for your score."
          : u <= 0.3
            ? "That's under the common 30% guideline. Lower still is better."
            : `Paying down ${usd(target < 0 ? -target : 0)} before the statement closes would bring it under 30%.`}
      </p>
      <HowCalculated>
        <p>Utilization is total card balances ÷ total card limits. Scores also look at each card on its own.</p>
        <p>
          Card companies usually report the balance on your statement, so paying before the statement date lowers the
          number that gets reported, even if you always pay in full.
        </p>
      </HowCalculated>
    </CalculatorCard>
  );
}
