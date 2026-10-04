/**
 * "Where should my next dollar go?" A widely used priority order, as a
 * checklist. It encodes a common practitioner ordering, not a law of
 * nature, and every step comes with caveats shown in the UI.
 */
export interface NextDollarInput {
  /** Has at least a small starter emergency fund (e.g. one month of costs). */
  hasStarterEmergencyFund: boolean;
  /** Employer retirement plan with a matching contribution. */
  employerMatchAvailable: boolean;
  /** Already contributing enough to get the full match. */
  gettingFullMatch: boolean;
  /** Carries debt at a high interest rate (like credit cards). */
  hasHighInterestDebt: boolean;
  /** Has a full emergency fund (3–6 months of essential costs). */
  hasFullEmergencyFund: boolean;
  /** Enrolled in an HSA-eligible high-deductible health plan. */
  hsaEligible: boolean;
  /** Has earned income (wages, or taxable grad-school stipends) for an IRA. */
  hasEarnedIncome: boolean;
  /** Already maxing an IRA this year. */
  maxingIra: boolean;
  /** Has a workplace plan (401(k), 403(b), 457(b)) at all. */
  hasWorkplacePlan: boolean;
  /** Already maxing the workplace plan. */
  maxingWorkplacePlan: boolean;
}

export type StepId =
  | "starter-emergency"
  | "employer-match"
  | "high-interest-debt"
  | "full-emergency"
  | "hsa"
  | "ira"
  | "workplace-max"
  | "taxable";

export interface Step {
  id: StepId;
  title: string;
  done: boolean;
  /** Step doesn't apply to this person (e.g. no employer match offered). */
  notApplicable: boolean;
}

const titles: Record<StepId, string> = {
  "starter-emergency": "Build a small starter emergency fund",
  "employer-match": "Contribute enough to get the full employer match",
  "high-interest-debt": "Pay off high-interest debt",
  "full-emergency": "Finish your emergency fund (3–6 months of essentials)",
  hsa: "Contribute to an HSA",
  ira: "Contribute to an IRA (Roth or traditional)",
  "workplace-max": "Increase workplace plan contributions toward the limit",
  taxable: "Invest in a regular (taxable) brokerage account",
};

export function nextDollarSteps(i: NextDollarInput): { steps: Step[]; next: Step | undefined } {
  const raw: Array<[StepId, boolean, boolean]> = [
    ["starter-emergency", i.hasStarterEmergencyFund || i.hasFullEmergencyFund, false],
    ["employer-match", i.gettingFullMatch, !i.employerMatchAvailable],
    ["high-interest-debt", !i.hasHighInterestDebt, false],
    ["full-emergency", i.hasFullEmergencyFund, false],
    ["hsa", false, !i.hsaEligible],
    ["ira", i.maxingIra, !i.hasEarnedIncome],
    ["workplace-max", i.maxingWorkplacePlan, !i.hasWorkplacePlan],
    ["taxable", false, false],
  ];
  const steps = raw.map(([id, done, notApplicable]) => ({
    id,
    title: titles[id],
    done: done && !notApplicable,
    notApplicable,
  }));
  // HSA has no "done" flag here: it's open-ended, so it's the next step once
  // everything above it is done, and stays listed as ongoing.
  const next = steps.find((s) => !s.done && !s.notApplicable);
  return { steps, next };
}
