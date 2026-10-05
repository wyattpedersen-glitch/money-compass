"use client";

import { useState } from "react";
import { amortize } from "@/lib/credit/amortization";
import { usd, usdCompact } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat } from "./Fields";
import { LineChart } from "./LineChart";

export function AmortizationCalculator({
  initialAmount = 20_000,
  initialRate = 7,
  initialYears = 5,
}: {
  initialAmount?: number;
  initialRate?: number;
  initialYears?: number;
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [rate, setRate] = useState(initialRate);
  const [years, setYears] = useState(initialYears);
  const [extra, setExtra] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const months = Math.max(1, Math.round(years * 12));
  const base = amortize(amount, rate / 100, months);
  const withExtra = extra > 0 ? amortize(amount, rate / 100, months, extra) : base;
  // Yearly points for the chart: cumulative interest vs principal paid.
  const yearsShown = Math.ceil(base.months / 12);
  const x = Array.from({ length: yearsShown + 1 }, (_, i) => i);
  const cum = (key: "interest" | "principal") =>
    x.map((y) => base.rows.slice(0, y * 12).reduce((s, r) => s + r[key], 0));

  return (
    <CalculatorCard title="Loan payment calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Amount borrowed" prefix="$" value={amount} onChange={setAmount} min={0} step={500} />
        <NumberField label="APR" suffix="%" value={rate} onChange={setRate} min={0} max={40} step={0.1} />
        <NumberField label="Length of loan" suffix="years" value={years} onChange={setYears} min={1} max={40} />
        <NumberField
          label="Extra paid each month"
          prefix="$"
          value={extra}
          onChange={setExtra}
          min={0}
          step={25}
          help="Goes straight to principal."
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Monthly payment"
          value={usd(base.payment + extra)}
          sub={extra > 0 ? `${usd(base.payment)} + ${usd(extra)} extra` : undefined}
        />
        <Stat label="Total interest" value={usd(withExtra.totalInterest)} tone="bad" />
        <Stat label="Total paid" value={usd(withExtra.totalPaid)} />
      </div>
      {extra > 0 && (
        <p className="mt-3 rounded-md bg-accent-soft p-3">
          Paying {usd(extra)} extra a month finishes {base.months - withExtra.months} months sooner and saves{" "}
          <strong>{usd(base.totalInterest - withExtra.totalInterest)}</strong> in interest.
        </p>
      )}

      <div className="mt-5">
        <LineChart
          x={x}
          xLabel="Year"
          formatX={(n) => String(n)}
          formatY={usdCompact}
          summary={`Over ${yearsShown} years you pay ${usd(base.totalInterest)} in interest on top of ${usd(amount)} of principal.`}
          series={[
            { name: "Principal paid so far", color: "var(--series-1)", values: cum("principal") },
            { name: "Interest paid so far", color: "var(--series-2)", values: cum("interest") },
          ]}
        />
      </div>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-accent underline underline-offset-2"
        aria-expanded={showTable}
        onClick={() => setShowTable((v) => !v)}
      >
        {showTable ? "Hide" : "Show"} the first 12 months
      </button>
      {showTable && (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-right text-sm tabular-nums">
            <thead className="text-muted">
              <tr className="border-b border-border">
                <th scope="col" className="py-1.5 text-left font-medium">
                  Month
                </th>
                <th scope="col" className="py-1.5 font-medium">
                  Interest
                </th>
                <th scope="col" className="py-1.5 font-medium">
                  Principal
                </th>
                <th scope="col" className="py-1.5 font-medium">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {withExtra.rows.slice(0, 12).map((r) => (
                <tr key={r.month} className="border-b border-border">
                  <th scope="row" className="py-1.5 text-left font-normal">
                    {r.month}
                  </th>
                  <td>{usd(r.interest, { cents: true })}</td>
                  <td>{usd(r.principal, { cents: true })}</td>
                  <td>{usd(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <HowCalculated>
        <p>
          The monthly rate is the APR ÷ 12. The fixed payment that pays off <code>P</code> dollars over <code>n</code>{" "}
          months is <code>P × r ÷ (1 − (1 + r)⁻ⁿ)</code>.
        </p>
        <p>
          Each month, interest is the remaining balance × <code>r</code>. The rest of the payment reduces the balance.
          That&apos;s why early payments are mostly interest: the balance is largest at the start.
        </p>
        <ul>
          <li>Assumes a fixed rate and on-time payments, with no fees or insurance included.</li>
          <li>Extra payments are applied to principal every month, starting in month 1.</li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
