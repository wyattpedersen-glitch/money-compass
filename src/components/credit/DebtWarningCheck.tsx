"use client";

import { useState } from "react";
import { CalculatorCard, Toggle } from "@/components/calculators/Fields";

const signs = [
  "I can only afford the minimum payments on my cards.",
  "I use credit cards for basics like groceries or rent because I'm out of cash.",
  "I've borrowed from one card or loan to pay another.",
  "I've missed payments or paid late in the last few months.",
  "Debt collectors are calling me.",
  "I don't know how much I owe in total.",
  "My debt payments (not counting rent) take more than about a fifth of my take-home pay.",
];

export function DebtWarningCheck() {
  const [checked, setChecked] = useState<boolean[]>(signs.map(() => false));
  const n = checked.filter(Boolean).length;
  return (
    <CalculatorCard title="Debt warning signs checklist">
      <p className="text-muted">Check any that are true for you right now. Nothing is saved.</p>
      <div className="mt-4 space-y-3">
        {signs.map((s, i) => (
          <Toggle
            key={s}
            label={s}
            checked={checked[i]}
            onChange={(b) => setChecked((c) => c.map((x, j) => (j === i ? b : x)))}
          />
        ))}
      </div>
      <p className="mt-5 rounded-md bg-surface-2 p-3" aria-live="polite">
        {n === 0
          ? "None checked. Keep it that way with an emergency fund and paying cards in full."
          : n <= 2
            ? `${n} checked. This is worth acting on now: list every debt, stop adding new charges, and use the payoff planner to make a plan.`
            : `${n} checked. Consider talking to a nonprofit credit counselor soon. It's usually free or low-cost, and the earlier you go, the more options you have.`}
      </p>
    </CalculatorCard>
  );
}
