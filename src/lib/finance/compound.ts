/**
 * Compound growth with regular monthly contributions.
 *
 * Interest compounds monthly at annualRate / 12 and contributions are made at
 * the end of each month (an "ordinary annuity"). These are the conventions
 * used by most textbook examples and by the SEC's Investor.gov calculator.
 */

export interface GrowthInput {
  /** Starting balance in dollars. */
  principal: number;
  /** Amount added at the end of every month. */
  monthlyContribution: number;
  /** Nominal yearly return as a decimal (0.07 = 7%). */
  annualRate: number;
  years: number;
  /** Yearly inflation as a decimal, used for the "today's dollars" view. */
  inflation?: number;
}

export interface GrowthYear {
  year: number;
  /** Balance at the end of the year, in future (nominal) dollars. */
  balance: number;
  /** Same balance expressed in today's dollars. */
  realBalance: number;
  /** Total of the principal plus every contribution so far. */
  contributed: number;
  /** Growth earned so far (balance minus contributed). */
  growth: number;
}

/** Future value of a single lump sum: P(1 + r)^n. */
export function fvLumpSum(principal: number, ratePerPeriod: number, periods: number): number {
  return principal * Math.pow(1 + ratePerPeriod, periods);
}

/** Future value of an ordinary annuity: PMT × ((1 + r)^n − 1) / r. */
export function fvAnnuity(payment: number, ratePerPeriod: number, periods: number): number {
  if (ratePerPeriod === 0) return payment * periods;
  return (payment * (Math.pow(1 + ratePerPeriod, periods) - 1)) / ratePerPeriod;
}

/**
 * The payment per period needed to reach a future value:
 * PMT = (FV − PV(1 + r)^n) × r / ((1 + r)^n − 1).
 */
export function paymentToReach(target: number, present: number, ratePerPeriod: number, periods: number): number {
  if (periods <= 0) return Math.max(0, target - present);
  const growthOfPresent = fvLumpSum(present, ratePerPeriod, periods);
  const remaining = target - growthOfPresent;
  if (remaining <= 0) return 0;
  if (ratePerPeriod === 0) return remaining / periods;
  return (remaining * ratePerPeriod) / (Math.pow(1 + ratePerPeriod, periods) - 1);
}

/**
 * Real (after-inflation) rate via the Fisher relation:
 * (1 + nominal) / (1 + inflation) − 1.
 */
export function realRate(nominal: number, inflation: number): number {
  return (1 + nominal) / (1 + inflation) - 1;
}

/** Convert a future amount into today's dollars. */
export function toTodaysDollars(amount: number, inflation: number, years: number): number {
  return amount / Math.pow(1 + inflation, years);
}

/** Year-by-year growth of a starting balance plus monthly contributions. */
export function growthSchedule(input: GrowthInput): GrowthYear[] {
  const { principal, monthlyContribution, annualRate, years } = input;
  const inflation = input.inflation ?? 0;
  const r = annualRate / 12;
  const rows: GrowthYear[] = [];
  for (let year = 0; year <= Math.floor(years); year++) {
    const n = year * 12;
    const balance = fvLumpSum(principal, r, n) + fvAnnuity(monthlyContribution, r, n);
    const contributed = principal + monthlyContribution * n;
    rows.push({
      year,
      balance,
      realBalance: toTodaysDollars(balance, inflation, year),
      contributed,
      growth: balance - contributed,
    });
  }
  return rows;
}

/** Approximate years to double at a yearly rate (the "rule of 72"). */
export function ruleOf72(annualRatePercent: number): number {
  return 72 / annualRatePercent;
}

/** Exact years to double at a yearly rate compounded yearly: ln 2 / ln(1 + r). */
export function yearsToDouble(annualRate: number): number {
  return Math.log(2) / Math.log(1 + annualRate);
}
