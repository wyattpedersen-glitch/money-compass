import { describe, expect, it } from "vitest";
import { balanceAfterFees, compareFees, monthlyRateFromAnnual } from "./fees";

describe("fee drag", () => {
  it("monthly rate compounds back to the annual rate", () => {
    expect((1 + monthlyRateFromAnnual(0.06)) ** 12 - 1).toBeCloseTo(0.06, 12);
  });

  it("a lump sum matches annual compounding at the net return", () => {
    // $10,000 at 7% gross, 1% fee, 30 years: 10,000 × 1.06^30 = $57,434.91
    expect(
      balanceAfterFees({ principal: 10_000, monthlyContribution: 0, grossReturn: 0.07, years: 30 }, 0.01),
    ).toBeCloseTo(57434.91, 1);
    // Same at 0.05%: 10,000 × 1.0695^30 = $75,0xx
    expect(
      balanceAfterFees({ principal: 10_000, monthlyContribution: 0, grossReturn: 0.07, years: 30 }, 0.0005),
    ).toBeCloseTo(10_000 * 1.0695 ** 30, 6);
  });

  it("a 1% fee costs about a quarter of the ending balance over 30 years", () => {
    const c = compareFees({ principal: 10_000, monthlyContribution: 0, grossReturn: 0.07, years: 30 }, 0.0005, 0.01);
    expect(c.shareLost).toBeCloseTo(1 - (1.06 / 1.0695) ** 30, 10);
    expect(c.shareLost).toBeGreaterThan(0.23);
    expect(c.shareLost).toBeLessThan(0.25);
  });

  it("equal fees cost nothing", () => {
    const c = compareFees({ principal: 1000, monthlyContribution: 100, grossReturn: 0.05, years: 10 }, 0.01, 0.01);
    expect(c.difference).toBe(0);
  });

  it("series runs from year 0 to the last year", () => {
    const c = compareFees({ principal: 1000, monthlyContribution: 0, grossReturn: 0.05, years: 5 }, 0, 0.01);
    expect(c.series.map((s) => s.year)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(c.series[0]).toEqual({ year: 0, low: 1000, high: 1000 });
  });
});
