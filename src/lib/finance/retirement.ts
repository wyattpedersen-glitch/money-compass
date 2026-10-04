import { fvAnnuity, fvLumpSum, paymentToReach, realRate } from "./compound";

/**
 * Retirement projection in today's dollars.
 *
 * Everything is converted to "real" (after-inflation) terms with the Fisher
 * relation, so the results read in today's purchasing power. Contributions
 * are monthly, at the end of each month, and stay constant in real terms
 * (that is, they rise with inflation).
 */
export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  /** Expected nominal yearly return, as a decimal. */
  nominalReturn: number;
  inflation: number;
  /** Yearly spending wanted in retirement, in today's dollars. */
  desiredSpending: number;
  /** Expected yearly Social Security or pension income, in today's dollars. */
  otherIncome: number;
  /** Starting withdrawal rate, as a decimal (0.04 = 4%). */
  withdrawalRate: number;
}

export interface RetirementResult {
  yearsToRetirement: number;
  realReturn: number;
  /** Projected savings at retirement, in today's dollars. */
  projected: number;
  /** Savings needed so the withdrawal rate covers the spending gap. */
  needed: number;
  /** Spending the projected savings could support at the withdrawal rate. */
  supportedSpending: number;
  /** Monthly contribution that would reach the target (today's dollars). */
  monthlyNeeded: number;
  onTrack: boolean;
  series: Array<{ age: number; balance: number }>;
}

export function nestEggNeeded(spending: number, otherIncome: number, withdrawalRate: number): number {
  const gap = Math.max(0, spending - otherIncome);
  return withdrawalRate > 0 ? gap / withdrawalRate : Infinity;
}

export function projectRetirement(input: RetirementInput): RetirementResult {
  const years = Math.max(0, input.retirementAge - input.currentAge);
  const real = realRate(input.nominalReturn, input.inflation);
  const r = Math.pow(1 + real, 1 / 12) - 1;
  const n = Math.round(years * 12);
  const projected = fvLumpSum(input.currentSavings, r, n) + fvAnnuity(input.monthlyContribution, r, n);
  const needed = nestEggNeeded(input.desiredSpending, input.otherIncome, input.withdrawalRate);
  const series = [];
  for (let y = 0; y <= years; y++) {
    const m = y * 12;
    series.push({
      age: input.currentAge + y,
      balance: fvLumpSum(input.currentSavings, r, m) + fvAnnuity(input.monthlyContribution, r, m),
    });
  }
  return {
    yearsToRetirement: years,
    realReturn: real,
    projected,
    needed,
    supportedSpending: projected * input.withdrawalRate + input.otherIncome,
    monthlyNeeded: Number.isFinite(needed) ? paymentToReach(needed, input.currentSavings, r, n) : Infinity,
    onTrack: projected >= needed,
    series,
  };
}

/**
 * How many years a balance lasts with a fixed yearly withdrawal (taken at the
 * start of each year) and a constant real return. Returns Infinity if growth
 * covers the withdrawals forever.
 */
export function yearsMoneyLasts(balance: number, yearlyWithdrawal: number, realReturn: number): number {
  if (yearlyWithdrawal <= 0) return Infinity;
  if (realReturn === 0) return balance / yearlyWithdrawal;
  // Annuity-due present value solved for n: B = W(1+r)(1 − (1+r)^−n)/r
  const x = 1 - (balance * realReturn) / (yearlyWithdrawal * (1 + realReturn));
  if (x <= 0) return Infinity;
  return -Math.log(x) / Math.log(1 + realReturn);
}
