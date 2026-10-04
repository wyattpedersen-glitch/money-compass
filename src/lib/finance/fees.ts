import { fvAnnuity, fvLumpSum } from "./compound";

/**
 * How much a fund's yearly fee (expense ratio) costs over time.
 *
 * Model: the fee is subtracted from the yearly return, so a fund earning a
 * 7% gross return with a 1% expense ratio grows at 6%. Returns compound
 * monthly at the equivalent monthly rate, (1 + annual)^(1/12) − 1, and
 * contributions are made at the end of each month. This is the same
 * simplification the SEC uses in its fee illustrations.
 */
export interface FeeInput {
  principal: number;
  monthlyContribution: number;
  /** Return before fees, as a decimal. */
  grossReturn: number;
  years: number;
}

export function monthlyRateFromAnnual(annual: number): number {
  return Math.pow(1 + annual, 1 / 12) - 1;
}

export function balanceAfterFees(input: FeeInput, expenseRatio: number): number {
  const r = monthlyRateFromAnnual(input.grossReturn - expenseRatio);
  const n = Math.round(input.years * 12);
  return fvLumpSum(input.principal, r, n) + fvAnnuity(input.monthlyContribution, r, n);
}

export interface FeeComparison {
  low: number;
  high: number;
  /** Dollars lost to the higher fee. */
  difference: number;
  /** The higher-fee balance's shortfall as a share of the lower-fee balance. */
  shareLost: number;
  series: Array<{ year: number; low: number; high: number }>;
}

export function compareFees(input: FeeInput, lowFee: number, highFee: number): FeeComparison {
  const low = balanceAfterFees(input, lowFee);
  const high = balanceAfterFees(input, highFee);
  const series = [];
  for (let year = 0; year <= Math.floor(input.years); year++) {
    series.push({
      year,
      low: balanceAfterFees({ ...input, years: year }, lowFee),
      high: balanceAfterFees({ ...input, years: year }, highFee),
    });
  }
  return { low, high, difference: low - high, shareLost: low > 0 ? (low - high) / low : 0, series };
}
