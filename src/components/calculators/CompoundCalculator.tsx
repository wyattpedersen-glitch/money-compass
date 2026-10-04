"use client";

import { useState } from "react";
import { growthSchedule } from "@/lib/finance/compound";
import { usd, usdCompact } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat, Toggle } from "./Fields";
import { LineChart } from "./LineChart";

export function CompoundCalculator() {
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(40);
  const [inflation, setInflation] = useState(3);
  const [real, setReal] = useState(true);

  const rows = growthSchedule({
    principal,
    monthlyContribution: monthly,
    annualRate: rate / 100,
    years,
    inflation: inflation / 100,
  });
  const last = rows[rows.length - 1];
  const shown = (r: (typeof rows)[number]) => (real ? r.realBalance : r.balance);
  const contributedShown = real
    ? rows.map((r) => r.contributed / Math.pow(1 + inflation / 100, r.year))
    : rows.map((r) => r.contributed);

  return (
    <CalculatorCard title="Compound growth calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Starting amount" prefix="$" value={principal} onChange={setPrincipal} min={0} step={100} />
        <NumberField label="Added every month" prefix="$" value={monthly} onChange={setMonthly} min={0} step={25} />
        <NumberField
          label="Yearly return"
          suffix="%"
          value={rate}
          onChange={setRate}
          min={-10}
          max={20}
          step={0.5}
          help="Before inflation. See the asset classes lesson for historical ranges."
        />
        <NumberField label="Years" value={years} onChange={setYears} min={1} max={70} />
        <NumberField
          label="Inflation"
          suffix="%"
          value={inflation}
          onChange={setInflation}
          min={0}
          max={15}
          step={0.5}
        />
        <div className="flex items-end pb-2">
          <Toggle label="Show in today's dollars" checked={real} onChange={setReal} help="Adjusts for inflation." />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label={`Balance after ${years} years`}
          value={usd(shown(last))}
          sub={real ? "in today's dollars" : "in future dollars"}
        />
        <Stat label="You put in" value={usd(real ? contributedShown[contributedShown.length - 1] : last.contributed)} />
        <Stat
          label="Growth"
          value={usd(shown(last) - (real ? contributedShown[contributedShown.length - 1] : last.contributed))}
          tone="good"
        />
      </div>

      <div className="mt-5">
        <LineChart
          x={rows.map((r) => r.year)}
          xLabel="Year"
          formatY={usdCompact}
          formatX={(n) => String(n)}
          summary={`Balance grows from ${usd(principal)} to ${usd(shown(last))} over ${years} years.`}
          series={[
            { name: "Balance", color: "var(--series-1)", values: rows.map(shown) },
            { name: "What you put in", color: "var(--series-2)", values: contributedShown, dashed: true },
          ]}
        />
      </div>

      <HowCalculated>
        <p>
          The return is divided into 12 equal monthly rates (yearly return ÷ 12), and contributions are added at the end
          of each month. After <em>n</em> months the balance is:
        </p>
        <p>
          <code>P × (1 + r)ⁿ + PMT × ((1 + r)ⁿ − 1) ÷ r</code>
        </p>
        <p>
          where <code>P</code> is the starting amount, <code>PMT</code> the monthly contribution and <code>r</code> the
          monthly rate. In today&apos;s dollars, each year&apos;s balance is divided by (1 + inflation)<sup>years</sup>.
        </p>
        <ul>
          <li>The return is the same every year. Real markets go up and down, sometimes sharply.</li>
          <li>Taxes and fund fees aren&apos;t included. In a Roth IRA there&apos;s no tax on qualified withdrawals.</li>
          <li>
            &quot;Today&apos;s dollars&quot; assumes your contributions stay the same in dollars (they don&apos;t rise
            with inflation).
          </li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
