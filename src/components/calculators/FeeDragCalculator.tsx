"use client";

import { useState } from "react";
import { compareFees } from "@/lib/finance/fees";
import { pct, usd, usdCompact } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat } from "./Fields";
import { LineChart } from "./LineChart";

export function FeeDragCalculator() {
  const [principal, setPrincipal] = useState(10_000);
  const [monthly, setMonthly] = useState(300);
  const [gross, setGross] = useState(6);
  const [years, setYears] = useState(30);
  const [low, setLow] = useState(0.05);
  const [high, setHigh] = useState(1);

  const c = compareFees(
    { principal, monthlyContribution: monthly, grossReturn: gross / 100, years },
    low / 100,
    high / 100,
  );

  return (
    <CalculatorCard title="Fee drag calculator">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Starting amount" prefix="$" value={principal} onChange={setPrincipal} min={0} step={500} />
        <NumberField label="Added every month" prefix="$" value={monthly} onChange={setMonthly} min={0} step={25} />
        <NumberField
          label="Return before fees"
          suffix="%"
          value={gross}
          onChange={setGross}
          min={0}
          max={15}
          step={0.5}
        />
        <NumberField label="Years" value={years} onChange={setYears} min={1} max={60} />
        <NumberField label="Low-cost fund fee" suffix="%" value={low} onChange={setLow} min={0} max={3} step={0.01} />
        <NumberField
          label="High-cost fund fee"
          suffix="%"
          value={high}
          onChange={setHigh}
          min={0}
          max={3}
          step={0.05}
        />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label={`Low-cost fund (${low}%)`} value={usd(c.low)} tone="good" />
        <Stat label={`High-cost fund (${high}%)`} value={usd(c.high)} />
        <Stat
          label="Lost to the higher fee"
          value={usd(c.difference)}
          sub={`${pct(c.shareLost)} of the low-cost balance`}
          tone="bad"
        />
      </div>
      <div className="mt-5">
        <LineChart
          x={c.series.map((s) => s.year)}
          xLabel="Year"
          formatY={usdCompact}
          summary={`After ${years} years the ${low}% fund reaches ${usd(c.low)} and the ${high}% fund ${usd(c.high)}.`}
          series={[
            { name: `${low}% fee`, color: "var(--series-1)", values: c.series.map((s) => s.low) },
            { name: `${high}% fee`, color: "var(--series-2)", values: c.series.map((s) => s.high) },
          ]}
        />
      </div>
      <HowCalculated>
        <p>
          The fee is subtracted from the yearly return: a fund earning {gross}% before fees with a {high}% fee grows at{" "}
          {(gross - high).toFixed(2)}% a year. The yearly rate is converted to an equivalent monthly rate, (1 + yearly)
          <sup>1/12</sup> − 1, and contributions are added at the end of each month.
        </p>
        <ul>
          <li>
            Both funds are assumed to earn the same return before fees. That&apos;s the key question the index vs.
            active lesson addresses.
          </li>
          <li>Returns are steady every year, and taxes, trading costs and sales loads aren&apos;t included.</li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
