import { describe, expect, it } from "vitest";
import { tax2026 } from "@/content/taxFigures";
import { estimateTakeHome, federalIncomeTax, marginalRate } from "./takeHome";

const b = tax2026.singleBrackets;

describe("federal income tax (progressive brackets)", () => {
  it("is zero on zero income", () => {
    expect(federalIncomeTax(0, b)).toBe(0);
  });
  it("taxes only the first bracket at 10%", () => {
    expect(federalIncomeTax(10_000, b)).toBeCloseTo(1_000, 6);
  });
  it("applies each rate only to the income inside its bracket", () => {
    // 10% of 12,400 + 12% of (40,000 − 12,400)
    expect(federalIncomeTax(40_000, b)).toBeCloseTo(1_240 + 3_312, 6);
  });
  it("crossing into a higher bracket never reduces take-home pay", () => {
    const below = 50_400 - 1;
    expect(below - federalIncomeTax(below, b)).toBeLessThan(50_401 - federalIncomeTax(50_401, b));
  });
  it("reports the marginal rate", () => {
    expect(marginalRate(40_000, b)).toBe(0.12);
    expect(marginalRate(60_000, b)).toBe(0.22);
  });
});

describe("take-home estimate", () => {
  it("a $60,000 salary with no deductions or state tax", () => {
    const r = estimateTakeHome({ grossAnnual: 60_000, pretaxDeductions: 0, stateRate: 0 }, tax2026);
    const taxable = 60_000 - 16_100;
    const fed = 1_240 + (taxable - 12_400) * 0.12;
    expect(r.federalIncomeTax).toBeCloseTo(fed, 6);
    expect(r.socialSecurity).toBeCloseTo(3_720, 6);
    expect(r.medicare).toBeCloseTo(870, 6);
    expect(r.netAnnual).toBeCloseTo(60_000 - fed - 3_720 - 870, 6);
    expect(r.netMonthly).toBeCloseTo(r.netAnnual / 12, 6);
  });
  it("pre-tax retirement contributions lower income tax", () => {
    const a = estimateTakeHome({ grossAnnual: 60_000, pretaxDeductions: 0, stateRate: 0 }, tax2026);
    const c = estimateTakeHome({ grossAnnual: 60_000, pretaxDeductions: 6_000, stateRate: 0 }, tax2026);
    expect(c.federalIncomeTax).toBeCloseTo(a.federalIncomeTax - 6_000 * 0.12, 6);
  });
  it("caps Social Security tax at the wage base", () => {
    const r = estimateTakeHome({ grossAnnual: 300_000, pretaxDeductions: 0, stateRate: 0 }, tax2026);
    expect(r.socialSecurity).toBeCloseTo(184_500 * 0.062, 6);
  });
  it("income below the standard deduction owes no federal income tax", () => {
    expect(estimateTakeHome({ grossAnnual: 15_000, pretaxDeductions: 0, stateRate: 0 }, tax2026).federalIncomeTax).toBe(
      0,
    );
  });
});
