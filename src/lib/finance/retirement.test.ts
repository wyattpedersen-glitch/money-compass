import { describe, expect, it } from "vitest";
import { nestEggNeeded, projectRetirement, yearsMoneyLasts } from "./retirement";

describe("nest egg", () => {
  it("$40,000 of spending at a 4% withdrawal rate needs $1,000,000 (the '25× rule')", () => {
    expect(nestEggNeeded(40_000, 0, 0.04)).toBe(1_000_000);
  });
  it("subtracts Social Security or pension income first", () => {
    expect(nestEggNeeded(60_000, 20_000, 0.04)).toBe(1_000_000);
  });
  it("needs nothing if other income covers spending", () => {
    expect(nestEggNeeded(30_000, 40_000, 0.04)).toBe(0);
  });
});

describe("retirement projection", () => {
  const base = {
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 0,
    monthlyContribution: 500,
    nominalReturn: 0.06,
    inflation: 0,
    desiredSpending: 40_000,
    otherIncome: 0,
    withdrawalRate: 0.04,
  };
  it("with no inflation, matches the plain annuity formula (effective monthly rate)", () => {
    const res = projectRetirement(base);
    const r = 1.06 ** (1 / 12) - 1;
    expect(res.projected).toBeCloseTo((500 * ((1 + r) ** 360 - 1)) / r, 4);
    expect(res.series).toHaveLength(31);
    expect(res.series[30].balance).toBeCloseTo(res.projected, 6);
  });
  it("monthlyNeeded hits the target exactly", () => {
    const res = projectRetirement(base);
    const again = projectRetirement({ ...base, monthlyContribution: res.monthlyNeeded });
    expect(again.projected).toBeCloseTo(res.needed, 4);
  });
  it("uses the real return when inflation is set", () => {
    const res = projectRetirement({ ...base, inflation: 0.03 });
    expect(res.realReturn).toBeCloseTo(1.06 / 1.03 - 1, 12);
  });
  it("onTrack reflects projected vs needed", () => {
    expect(projectRetirement({ ...base, monthlyContribution: 5000 }).onTrack).toBe(true);
    expect(projectRetirement({ ...base, monthlyContribution: 10 }).onTrack).toBe(false);
  });
});

describe("how long money lasts", () => {
  it("at 0% real return, $1M lasts 25 years at $40k a year", () => {
    expect(yearsMoneyLasts(1_000_000, 40_000, 0)).toBe(25);
  });
  it("lasts forever if returns exceed withdrawals", () => {
    expect(yearsMoneyLasts(1_000_000, 40_000, 0.05)).toBe(Infinity);
  });
  it("matches a direct year-by-year simulation", () => {
    const n = yearsMoneyLasts(1_000_000, 70_000, 0.03);
    let b = 1_000_000;
    let years = 0;
    while (b >= 70_000) {
      b = (b - 70_000) * 1.03;
      years++;
    }
    expect(Math.floor(n)).toBe(years);
  });
});
