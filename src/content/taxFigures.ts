/**
 * Federal tax figures used by the take-home pay estimator. They change every
 * year: update them along with figures.ts (see CONTENT_REVIEW.md).
 */
export interface TaxYearFigures {
  taxYear: number;
  /** Single filer brackets: each rate applies to income above `from`. */
  singleBrackets: Array<{ from: number; rate: number }>;
  singleStandardDeduction: number;
  socialSecurityRate: number;
  socialSecurityWageBase: number;
  medicareRate: number;
  sources: Array<{ label: string; url: string }>;
  /** ISO date the values were confirmed against the sources. */
  checked?: string;
}

export const tax2026: TaxYearFigures = {
  taxYear: 2026,
  singleBrackets: [
    { from: 0, rate: 0.1 },
    { from: 12_400, rate: 0.12 },
    { from: 50_400, rate: 0.22 },
    { from: 105_700, rate: 0.24 },
    { from: 201_775, rate: 0.32 },
    { from: 256_225, rate: 0.35 },
    { from: 640_600, rate: 0.37 },
  ],
  singleStandardDeduction: 16_100,
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 184_500,
  medicareRate: 0.0145,
  sources: [
    {
      label: "IRS: Federal income tax rates and brackets",
      url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
    },
    {
      label: "IRS: Topic no. 751, Social Security and Medicare withholding rates",
      url: "https://www.irs.gov/taxtopics/tc751",
    },
    { label: "SSA: Contribution and benefit base", url: "https://www.ssa.gov/oact/cola/cbb.html" },
  ],
};
