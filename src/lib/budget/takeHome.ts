import type { TaxYearFigures } from "@/content/taxFigures";

/**
 * Rough take-home pay for a single filer with only wage income. It ignores
 * credits, itemized deductions, local taxes and the extra 0.9% Medicare tax
 * on high earners, so it's an estimate to start a budget with, not a tax
 * calculation. Your pay stub is the real answer.
 */
export interface TakeHomeInput {
  grossAnnual: number;
  /** Pre-tax payroll deductions per year (traditional 401(k)/403(b)/457(b), health premiums). */
  pretaxDeductions: number;
  /** Combined state and local income tax as a flat share of gross pay (an approximation). */
  stateRate: number;
}

export interface TakeHomeResult {
  federalIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  stateTax: number;
  netAnnual: number;
  netMonthly: number;
  /** Federal income tax as a share of gross pay. */
  effectiveFederalRate: number;
  /** The federal bracket rate on the last dollar earned. */
  marginalRate: number;
}

export function federalIncomeTax(taxableIncome: number, brackets: TaxYearFigures["singleBrackets"]): number {
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const lo = brackets[i].from;
    const hi = i + 1 < brackets.length ? brackets[i + 1].from : Infinity;
    if (taxableIncome <= lo) break;
    tax += (Math.min(taxableIncome, hi) - lo) * brackets[i].rate;
  }
  return tax;
}

export function marginalRate(taxableIncome: number, brackets: TaxYearFigures["singleBrackets"]): number {
  let rate = brackets[0].rate;
  for (const b of brackets) if (taxableIncome > b.from) rate = b.rate;
  return rate;
}

export function estimateTakeHome(input: TakeHomeInput, fig: TaxYearFigures): TakeHomeResult {
  const gross = Math.max(0, input.grossAnnual);
  const pretax = Math.min(gross, Math.max(0, input.pretaxDeductions));
  const taxable = Math.max(0, gross - pretax - fig.singleStandardDeduction);
  const fed = federalIncomeTax(taxable, fig.singleBrackets);
  // FICA applies to wages before most retirement deferrals; simplified to gross pay.
  const ss = Math.min(gross, fig.socialSecurityWageBase) * fig.socialSecurityRate;
  const medicare = gross * fig.medicareRate;
  const state = gross * Math.max(0, input.stateRate);
  const net = gross - pretax - fed - ss - medicare - state;
  return {
    federalIncomeTax: fed,
    socialSecurity: ss,
    medicare,
    stateTax: state,
    netAnnual: net,
    netMonthly: net / 12,
    effectiveFederalRate: gross > 0 ? fed / gross : 0,
    marginalRate: marginalRate(taxable, fig.singleBrackets),
  };
}
