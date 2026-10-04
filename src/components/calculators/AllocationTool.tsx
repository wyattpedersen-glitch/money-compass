"use client";

import { useState } from "react";
import { sampleAllocation, type RiskTolerance } from "@/lib/finance/allocation";
import { pct } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, SelectField } from "./Fields";

export function AllocationTool() {
  const [age, setAge] = useState(21);
  const [retireAge, setRetireAge] = useState(65);
  const [risk, setRisk] = useState<RiskTolerance>("moderate");
  const years = Math.max(0, retireAge - age);
  const a = sampleAllocation(years, risk);
  const parts = [
    { label: "U.S. stocks", value: a.usStocks, color: "var(--series-1)" },
    { label: "International stocks", value: a.intlStocks, color: "var(--series-3)" },
    { label: "Bonds", value: a.bonds, color: "var(--series-2)" },
  ];

  return (
    <CalculatorCard title="Sample allocation (illustration only)">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Your age" value={age} onChange={setAge} min={16} max={100} />
        <NumberField label="Planned retirement age" value={retireAge} onChange={setRetireAge} min={30} max={100} />
        <SelectField
          label="How would you handle a 30% drop?"
          value={risk}
          onChange={setRisk}
          options={[
            { value: "conservative", label: "I'd lose sleep and want to sell" },
            { value: "moderate", label: "Uncomfortable, but I'd hold" },
            { value: "aggressive", label: "I'd keep buying" },
          ]}
        />
      </div>
      <div className="mt-6">
        <div
          className="flex h-8 w-full gap-0.5 overflow-hidden rounded-md"
          role="img"
          aria-label={parts.map((p) => `${p.label} ${pct(p.value, 0)}`).join(", ")}
        >
          {parts
            .filter((p) => p.value > 0)
            .map((p) => (
              <div key={p.label} style={{ width: `${p.value * 100}%`, background: p.color }} />
            ))}
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: p.color }} aria-hidden="true" />
              <span>
                {p.label}: <strong className="tabular-nums">{pct(p.value, 0)}</strong>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 rounded-md border border-dashed border-border p-3 text-sm text-muted">
        <strong className="text-text">This is an illustration, not advice.</strong> There is no single correct mix. A
        single target-date fund near your retirement year does this kind of shifting for you automatically.
      </p>
      <HowCalculated>
        <ul>
          <li>
            Stocks start at 90% when retirement is 25 or more years away and fall in a straight line to 50% at
            retirement. This is a simplified version of the &quot;glide path&quot; shape target-date funds use, not any
            specific fund&apos;s numbers.
          </li>
          <li>
            &quot;Uncomfortable, but I&apos;d hold&quot; uses that path. The cautious answer subtracts 20 points of
            stocks, and the bold answer adds 10, capped at 100%.
          </li>
          <li>Stocks are split 60% U.S. and 40% international, an illustrative choice explained in the lesson.</li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
