"use client";

import { useState } from "react";
import { rentVsBuy, type RentVsBuyInput } from "@/lib/credit/rentVsBuy";
import { usd, usdCompact } from "@/lib/format";
import { HowCalculated } from "@/components/lesson/Boxes";
import { CalculatorCard, NumberField, Stat } from "./Fields";
import { LineChart } from "./LineChart";

const defaults: RentVsBuyInput = {
  years: 7,
  price: 450_000,
  downPct: 0.1,
  mortgageRate: 0.065,
  termYears: 30,
  closingPct: 0.03,
  sellingPct: 0.06,
  propertyTaxPct: 0.011,
  insurancePerYear: 1500,
  maintenancePct: 0.01,
  hoaPerMonth: 0,
  appreciation: 0.03,
  rentPerMonth: 2200,
  rentGrowth: 0.03,
  rentersInsurancePerYear: 200,
  investReturn: 0.05,
};

type PctKey =
  | "downPct"
  | "mortgageRate"
  | "closingPct"
  | "sellingPct"
  | "propertyTaxPct"
  | "maintenancePct"
  | "appreciation"
  | "rentGrowth"
  | "investReturn";

export function RentVsBuyCalculator() {
  const [v, setV] = useState(defaults);
  const set = (patch: Partial<RentVsBuyInput>) => setV((x) => ({ ...x, ...patch }));
  const pctField = (key: PctKey, label: string, help?: string, max = 20) => (
    <NumberField
      label={label}
      suffix="%"
      value={Math.round(v[key] * 10000) / 100}
      onChange={(n) => set({ [key]: n / 100 })}
      min={0}
      max={max}
      step={0.1}
      help={help}
    />
  );
  const r = rentVsBuy(v);
  const last = r.rows.at(-1)!;
  const diff = last.buyNetWorth - last.rentNetWorth;

  return (
    <CalculatorCard title="Rent vs. buy calculator">
      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset className="space-y-3">
          <legend className="font-semibold">Buying</legend>
          <NumberField
            label="Home price"
            prefix="$"
            value={v.price}
            onChange={(n) => set({ price: n })}
            min={0}
            step={5000}
          />
          {pctField("downPct", "Down payment", undefined, 100)}
          {pctField("mortgageRate", "Mortgage rate")}
          {pctField(
            "propertyTaxPct",
            "Property tax (of home value, per year)",
            "Varies by location. Check your county's rate.",
          )}
          {pctField("maintenancePct", "Maintenance (of home value, per year)")}
          <NumberField
            label="Home insurance per year"
            prefix="$"
            value={v.insurancePerYear}
            onChange={(n) => set({ insurancePerYear: n })}
            min={0}
            step={100}
          />
          <NumberField
            label="HOA fee per month"
            prefix="$"
            value={v.hoaPerMonth}
            onChange={(n) => set({ hoaPerMonth: n })}
            min={0}
            step={25}
          />
          {pctField("closingPct", "Closing costs when buying")}
          {pctField("sellingPct", "Selling costs (agent fees, etc.)")}
          {pctField("appreciation", "Home price growth per year")}
        </fieldset>
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="font-semibold">Renting</legend>
            <NumberField
              label="Rent per month"
              prefix="$"
              value={v.rentPerMonth}
              onChange={(n) => set({ rentPerMonth: n })}
              min={0}
              step={50}
            />
            {pctField("rentGrowth", "Rent increase per year")}
            <NumberField
              label="Renter's insurance per year"
              prefix="$"
              value={v.rentersInsurancePerYear}
              onChange={(n) => set({ rentersInsurancePerYear: n })}
              min={0}
              step={25}
            />
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="font-semibold">Both</legend>
            <NumberField
              label="Years you'd stay"
              value={v.years}
              onChange={(n) => set({ years: Math.max(1, Math.round(n)) })}
              min={1}
              max={30}
            />
            {pctField(
              "investReturn",
              "Return on invested savings",
              "What the renter earns by investing the down payment instead.",
            )}
          </fieldset>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Cash needed to buy" value={usd(r.upfront)} sub="down payment + closing costs" />
        <Stat label="Mortgage payment" value={usd(r.payment)} sub="principal and interest only" />
        <Stat
          label={`After ${v.years} years`}
          value={diff >= 0 ? `Buying +${usd(diff)}` : `Renting +${usd(-diff)}`}
          sub={
            r.breakEvenYear ? `Buying pulls ahead in year ${r.breakEvenYear}` : "Buying doesn't pull ahead in this time"
          }
        />
      </div>

      <div className="mt-5">
        <LineChart
          x={[0, ...r.rows.map((x) => x.year)]}
          xLabel="Year"
          formatX={(n) => String(n)}
          formatY={usdCompact}
          summary={`After ${v.years} years, the buyer's net worth is ${usd(last.buyNetWorth)} and the renter's is ${usd(last.rentNetWorth)}.`}
          series={[
            {
              name: "Buy: net worth",
              color: "var(--series-1)",
              values: [v.price * (1 - v.sellingPct) - v.price * (1 - v.downPct), ...r.rows.map((x) => x.buyNetWorth)],
            },
            {
              name: "Rent: net worth",
              color: "var(--series-2)",
              values: [r.upfront, ...r.rows.map((x) => x.rentNetWorth)],
              dashed: true,
            },
          ]}
        />
      </div>

      <HowCalculated>
        <p>
          This compares two people with the same money. The buyer spends the down payment and closing costs up front.
          The renter invests that same cash instead. Each month, whoever&apos;s housing costs less invests the
          difference at the same return.
        </p>
        <p>
          Owner costs each month are the mortgage payment, property tax and maintenance (as a percentage of the current
          home value), insurance and HOA. The buyer&apos;s net worth assumes they sell at that point: home value minus
          selling costs, minus the remaining mortgage, plus anything they invested. The renter&apos;s net worth is their
          investments.
        </p>
        <ul>
          <li>
            Income taxes are left out, including the mortgage interest deduction. Most people take the standard
            deduction, so it often doesn&apos;t help.
          </li>
          <li>PMI isn&apos;t included. With less than 20% down it adds to the cost of buying.</li>
          <li>Growth rates are constant. Real home prices, rents and investments go up and down.</li>
        </ul>
      </HowCalculated>
    </CalculatorCard>
  );
}
