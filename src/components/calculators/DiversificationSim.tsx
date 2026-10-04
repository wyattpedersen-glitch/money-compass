"use client";

import { useMemo, useState } from "react";
import { defaultDiversificationParams, simulateDiversification } from "@/lib/finance/diversification";
import { pct, usd } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat } from "./Fields";
import { useHydrated } from "@/lib/storage/store";
import { LineChart } from "./LineChart";

export function DiversificationSim() {
  // The simulation runs in the browser only: tiny floating-point differences
  // between server and browser math would otherwise cause hydration errors.
  const hydrated = useHydrated();
  if (!hydrated) {
    return (
      <CalculatorCard title="Simulation: one stock vs. many">
        <p className="text-muted">Loading simulation…</p>
      </CalculatorCard>
    );
  }
  return <DiversificationSimInner />;
}

function DiversificationSimInner() {
  const [stocks, setStocks] = useState(100);
  const [seed, setSeed] = useState(42);
  const res = useMemo(
    () => simulateDiversification({ ...defaultDiversificationParams, stocksInPortfolio: stocks, seed }),
    [stocks, seed],
  );
  const start = 10_000;
  const years = defaultDiversificationParams.years;
  const x = Array.from({ length: years + 1 }, (_, i) => i);

  return (
    <CalculatorCard title="Simulation: one stock vs. many">
      <p className="text-muted">
        $10,000 invested for {years} years, simulated {defaultDiversificationParams.trials} times. Every stock has the
        same expected yearly return. The only difference is how many you hold.
      </p>
      <div className="mt-4 grid items-end gap-4 sm:grid-cols-2">
        <NumberField
          label="Stocks in the diversified portfolio"
          value={stocks}
          onChange={setStocks}
          min={2}
          max={500}
        />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-md border border-border bg-bg px-4 py-2 font-medium hover:bg-surface-2"
        >
          Run a new simulation
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border p-3">
          <div className="font-semibold">One stock</div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Typical result" value={usd(start * res.single.median)} />
            <Stat label="Ended with a loss" value={pct(res.single.lossRate, 0)} tone="bad" />
            <Stat label="Unlucky (10th percentile)" value={usd(start * res.single.p10)} />
            <Stat label="Lucky (90th percentile)" value={usd(start * res.single.p90)} />
          </div>
        </div>
        <div className="space-y-2 rounded-xl border border-border p-3">
          <div className="font-semibold">{stocks} stocks</div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Typical result" value={usd(start * res.portfolio.median)} tone="good" />
            <Stat label="Ended with a loss" value={pct(res.portfolio.lossRate, 0)} />
            <Stat label="Unlucky (10th percentile)" value={usd(start * res.portfolio.p10)} />
            <Stat label="Lucky (90th percentile)" value={usd(start * res.portfolio.p90)} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium">Six sample paths: one stock</p>
          <LineChart
            x={x}
            xLabel="Year"
            logScale
            hideLegend
            height={240}
            formatY={(v) => usd(v * start)}
            summary="Six simulated single-stock paths, which scatter widely: some soar, some fall toward zero."
            series={res.samplePaths.single.map((p, i) => ({
              name: `Path ${i + 1}`,
              color: "var(--series-2)",
              values: p,
            }))}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Six sample paths: {stocks} stocks</p>
          <LineChart
            x={x}
            xLabel="Year"
            logScale
            hideLegend
            height={240}
            formatY={(v) => usd(v * start)}
            summary="Six simulated diversified paths, which stay close together and mostly rise."
            series={res.samplePaths.portfolio.map((p, i) => ({
              name: `Path ${i + 1}`,
              color: "var(--series-1)",
              values: p,
            }))}
          />
        </div>
      </div>

      <HowCalculated>
        <p>
          Each year, the whole market gets one random shock that hits every stock, and each company gets its own random
          shock. Company shocks are independent, so in a portfolio they mostly cancel out, while the market shock
          remains. That&apos;s why diversification removes company-specific risk but not market risk.
        </p>
        <ul>
          <li>
            Market: yearly log return with mean {pct(defaultDiversificationParams.marketMean, 0)} and volatility{" "}
            {pct(defaultDiversificationParams.marketVol, 0)}. Each company adds its own shock with volatility{" "}
            {pct(defaultDiversificationParams.companyVol, 0)}.
          </li>
          <li>
            These are <strong>illustrative round numbers</strong> chosen to behave like a broad stock market. They are
            not estimates from historical data, and the results aren&apos;t a forecast.
          </li>
          <li>
            Every stock has the same expected return, the portfolio is equally weighted and rebalanced yearly, and no
            fees or taxes are included.
          </li>
          <li>Charts use a log scale, so equal vertical distances mean equal percentage changes.</li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
