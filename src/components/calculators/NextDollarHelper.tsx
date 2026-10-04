// @section investing
"use client";

import { useState, type ReactNode } from "react";
import { nextDollarSteps, type NextDollarInput, type StepId } from "@/lib/finance/nextDollar";
import { Cite } from "@/components/lesson/Cite";
import { Fig } from "@/components/lesson/Fig";
import { CalculatorCard, Toggle } from "./Fields";

const why: Record<StepId, ReactNode> = {
  "starter-emergency": (
    <>A small cash cushion keeps one surprise bill from landing on a credit card. Even a few hundred dollars helps.</>
  ),
  "employer-match": (
    <>
      A match is free money: a 50% match is an instant 50% return on those dollars, which no investment reliably beats.
      Check whether your employer&apos;s match &quot;vests&quot; (becomes yours) over time <Cite id="irs-401k-plans" />.
    </>
  ),
  "high-interest-debt": (
    <>
      Paying off a card charging over 20% is a guaranteed, risk-free return of over 20%. Average credit card rates have
      been above that level in recent Federal Reserve data <Cite id="fed-g19" />.
    </>
  ),
  "full-emergency": (
    <>
      Three to six months of essential expenses is the common guideline. Keep it in a savings account, not invested
      <Cite id="cfpb-emergency-fund" />.
    </>
  ),
  hsa: (
    <>
      Only if you have an HSA-eligible high-deductible health plan. Contributions are tax-deductible, growth is untaxed,
      and withdrawals for medical costs are tax-free. The self-only limit is <Fig id="hsa-limit-self" />{" "}
      <Cite id="irs-pub-969" />.
    </>
  ),
  ira: (
    <>
      You can contribute up to <Fig id="ira-contribution-limit" /> or your taxable compensation, whichever is less. For
      grad students, taxable stipend and fellowship payments now count as compensation for IRA purposes{" "}
      <Cite id="irs-pub-590a" />. A Roth IRA is often a good fit when your income (and tax rate) is low, as it usually
      is in school.
    </>
  ),
  "workplace-max": (
    <>
      Raise your 401(k), 403(b) or 457(b) contributions toward the employee limit of{" "}
      <Fig id="401k-elective-deferral-limit" />. Public employers often offer a 457(b), which has no 10%
      early-withdrawal penalty after you leave the job <Cite id="irs-457b" />.
    </>
  ),
  taxable: (
    <>
      Once tax-advantaged space is used up (or for goals before retirement), a regular brokerage account holding
      low-cost index funds is flexible: no contribution limits and no withdrawal rules.
    </>
  ),
};

const questions: Array<{ key: keyof NextDollarInput; label: string; help?: string }> = [
  { key: "hasStarterEmergencyFund", label: "I have at least a small emergency cushion (around one month of expenses)" },
  { key: "hasFullEmergencyFund", label: "I have a full emergency fund (3–6 months of essential expenses)" },
  {
    key: "hasHighInterestDebt",
    label: "I have high-interest debt, like a credit card balance I don't pay off monthly",
  },
  { key: "hasWorkplacePlan", label: "My job offers a retirement plan (401(k), 403(b) or 457(b))" },
  { key: "employerMatchAvailable", label: "My employer matches some of my contributions" },
  { key: "gettingFullMatch", label: "I already contribute enough to get the full match" },
  { key: "maxingWorkplacePlan", label: "I already contribute the maximum to my workplace plan" },
  {
    key: "hasEarnedIncome",
    label: "I have earned income this year",
    help: "Wages, self-employment, or taxable grad school stipends.",
  },
  { key: "maxingIra", label: "I already contribute the maximum to an IRA this year" },
  { key: "hsaEligible", label: "I have an HSA-eligible high-deductible health plan" },
];

export function NextDollarHelper() {
  const [input, setInput] = useState<NextDollarInput>({
    hasStarterEmergencyFund: false,
    employerMatchAvailable: false,
    gettingFullMatch: false,
    hasHighInterestDebt: false,
    hasFullEmergencyFund: false,
    hsaEligible: false,
    hasEarnedIncome: true,
    maxingIra: false,
    hasWorkplacePlan: false,
    maxingWorkplacePlan: false,
  });
  const { steps, next } = nextDollarSteps(input);

  return (
    <CalculatorCard title="Which account should my next dollar go to?">
      <fieldset>
        <legend className="text-sm text-muted">Check everything that&apos;s true for you right now.</legend>
        <div className="mt-3 grid gap-3">
          {questions.map((q) => (
            <Toggle
              key={q.key}
              label={q.label}
              help={q.help}
              checked={input[q.key]}
              onChange={(v) => setInput((prev) => ({ ...prev, [q.key]: v }))}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-6" aria-live="polite">
        {next && (
          <p className="rounded-lg bg-accent-soft p-4">
            <span className="block text-sm font-medium text-accent">Your next step</span>
            <span className="mt-1 block text-lg font-semibold">{next.title}</span>
          </p>
        )}
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s.id}
            className={`rounded-lg border p-3 ${s.id === next?.id ? "border-accent" : "border-border"} ${s.notApplicable ? "opacity-60" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-2 font-medium">
              <span className="text-muted">{i + 1}.</span> {s.title}
              {s.done && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">Done</span>}
              {s.notApplicable && (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">Doesn&apos;t apply</span>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{why[s.id]}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">
        This order is a widely used rule of thumb <Cite id="bogleheads-prioritizing" />, not a law. Reasonable people
        reorder steps: some pay off moderate-rate debt before investing, and some fill an IRA before an HSA. If you
        expect a much higher tax rate later, a Roth account moves up. If you have a pension, you may need less in other
        accounts.
      </p>
    </CalculatorCard>
  );
}
