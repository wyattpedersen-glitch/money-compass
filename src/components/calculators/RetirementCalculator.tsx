"use client";

import { useState } from "react";
import { projectRetirement, yearsMoneyLasts } from "@/lib/finance/retirement";
import { pct, usd, usdCompact } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat } from "./Fields";
import { LineChart } from "./LineChart";

export function RetirementCalculator() {
  const [age, setAge] = useState(25);
  const [retireAge, setRetireAge] = useState(65);
  const [savings, setSavings] = useState(0);
  const [monthly, setMonthly] = useState(400);
  const [ret, setRet] = useState(6);
  const [inflation, setInflation] = useState(2.5);
  const [spending, setSpending] = useState(50_000);
  const [other, setOther] = useState(20_000);
  const [wr, setWr] = useState(4);

  const res = projectRetirement({
    currentAge: age,
    retirementAge: retireAge,
    currentSavings: savings,
    monthlyContribution: monthly,
    nominalReturn: ret / 100,
    inflation: inflation / 100,
    desiredSpending: spending,
    otherIncome: other,
    withdrawalRate: wr / 100,
  });
  const gap = Math.max(0, spending - other);
  const lastsYears = yearsMoneyLasts(res.projected, gap, 0);

  return (
    <CalculatorCard title="Retirement projection (in today's dollars)">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Age you start saving" value={age} onChange={setAge} min={16} max={80} />
        <NumberField label="Retirement age" value={retireAge} onChange={setRetireAge} min={30} max={90} />
        <NumberField label="Saved so far" prefix="$" value={savings} onChange={setSavings} min={0} step={1000} />
        <NumberField
          label="Saved every month"
          prefix="$"
          value={monthly}
          onChange={setMonthly}
          min={0}
          step={50}
          help="Assumed to rise with inflation."
        />
        <NumberField
          label="Yearly return"
          suffix="%"
          value={ret}
          onChange={setRet}
          min={0}
          max={15}
          step={0.5}
          help="Before inflation."
        />
        <NumberField
          label="Inflation"
          suffix="%"
          value={inflation}
          onChange={setInflation}
          min={0}
          max={10}
          step={0.5}
        />
        <NumberField
          label="Yearly spending in retirement"
          prefix="$"
          value={spending}
          onChange={setSpending}
          min={0}
          step={1000}
          help="In today's dollars."
        />
        <NumberField
          label="Social Security / pension per year"
          prefix="$"
          value={other}
          onChange={setOther}
          min={0}
          step={1000}
          help="Your estimate is at ssa.gov/myaccount."
        />
        <NumberField
          label="Starting withdrawal rate"
          suffix="%"
          value={wr}
          onChange={setWr}
          min={2}
          max={8}
          step={0.1}
        />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label={`Projected at ${retireAge}`} value={usd(res.projected)} tone={res.onTrack ? "good" : undefined} />
        <Stat label="Target savings" value={usd(res.needed)} sub={`${usd(gap)} a year ÷ ${pct(wr / 100)}`} />
        <Stat
          label={res.onTrack ? "You're on track" : "Monthly saving to hit the target"}
          value={res.onTrack ? "✓" : usd(res.monthlyNeeded)}
          tone={res.onTrack ? "good" : "bad"}
          sub={res.onTrack ? `Supports about ${usd(res.supportedSpending)} a year` : `vs. ${usd(monthly)} now`}
        />
      </div>
      <div className="mt-5">
        <LineChart
          x={res.series.map((s) => s.age)}
          xLabel="Age"
          formatY={usdCompact}
          summary={`Savings grow to about ${usd(res.projected)} by age ${retireAge}, against a target of ${usd(res.needed)}.`}
          series={[
            { name: "Projected savings", color: "var(--series-1)", values: res.series.map((s) => s.balance) },
            { name: "Target", color: "var(--series-2)", values: res.series.map(() => res.needed), dashed: true },
          ]}
        />
      </div>
      <HowCalculated>
        <ul>
          <li>
            Everything is in today&apos;s dollars. The real return is (1 + return) ÷ (1 + inflation) − 1 ={" "}
            {pct(res.realReturn, 2)}, applied monthly as (1 + real)<sup>1/12</sup> − 1.
          </li>
          <li>
            Target = (spending − Social Security/pension) ÷ withdrawal rate. At 4% that&apos;s 25 times the yearly gap.
          </li>
          <li>
            Returns are steady. Real returns vary, and a bad stretch early in retirement matters most. The lesson
            explains this &quot;sequence risk&quot;.
          </li>
          <li>
            With no growth at all, the projected savings would cover the yearly gap for about{" "}
            {Number.isFinite(lastsYears) ? `${Math.floor(lastsYears)} years` : "forever"}.
          </li>
          <li>
            Taxes aren&apos;t modeled. Withdrawals from traditional accounts are taxed, and qualified Roth withdrawals
            are not.
          </li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
