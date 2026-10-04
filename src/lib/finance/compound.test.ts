import { describe, expect, it } from "vitest";
import {
  fvAnnuity,
  fvLumpSum,
  growthSchedule,
  paymentToReach,
  realRate,
  ruleOf72,
  toTodaysDollars,
  yearsToDouble,
} from "./compound";

describe("lump sum future value", () => {
  it("$1,000 at 5% compounded yearly for 10 years is $1,628.89", () => {
    expect(fvLumpSum(1000, 0.05, 10)).toBeCloseTo(1628.89, 2);
  });
  it("$1,000 at 6% compounded monthly for 10 years is $1,819.40", () => {
    expect(fvLumpSum(1000, 0.06 / 12, 120)).toBeCloseTo(1819.4, 2);
  });
  it("zero periods returns the principal", () => {
    expect(fvLumpSum(500, 0.1, 0)).toBe(500);
  });
});

describe("annuity future value", () => {
  it("$100 a month at 6% for 30 years is $100,451.50", () => {
    expect(fvAnnuity(100, 0.005, 360)).toBeCloseTo(100451.5, 1);
  });
  it("$1,000 a year at 5% for 10 years is $12,577.89", () => {
    expect(fvAnnuity(1000, 0.05, 10)).toBeCloseTo(12577.89, 2);
  });
  it("handles a 0% rate", () => {
    expect(fvAnnuity(100, 0, 12)).toBe(1200);
  });
});

describe("payment needed to reach a goal", () => {
  it("$1,000,000 in 30 years at 6% (monthly) needs $995.51 a month", () => {
    expect(paymentToReach(1_000_000, 0, 0.005, 360)).toBeCloseTo(995.51, 2);
  });
  it("is the inverse of the annuity formula", () => {
    const pmt = paymentToReach(50_000, 5_000, 0.004, 120);
    expect(fvLumpSum(5_000, 0.004, 120) + fvAnnuity(pmt, 0.004, 120)).toBeCloseTo(50_000, 6);
  });
  it("is zero when the starting balance already gets there", () => {
    expect(paymentToReach(1000, 2000, 0.01, 12)).toBe(0);
  });
  it("splits evenly at 0%", () => {
    expect(paymentToReach(1200, 0, 0, 12)).toBe(100);
  });
});

describe("inflation", () => {
  it("Fisher: 7% nominal with 3% inflation is a 3.883% real return", () => {
    expect(realRate(0.07, 0.03)).toBeCloseTo(0.038835, 6);
  });
  it("$1,000 in 10 years at 3% inflation is $744.09 in today's dollars", () => {
    expect(toTodaysDollars(1000, 0.03, 10)).toBeCloseTo(744.09, 2);
  });
});

describe("doubling time", () => {
  it("rule of 72 at 8% is 9 years; exact is 9.006", () => {
    expect(ruleOf72(8)).toBe(9);
    expect(yearsToDouble(0.08)).toBeCloseTo(9.006, 3);
  });
});

describe("growth schedule", () => {
  const rows = growthSchedule({
    principal: 1000,
    monthlyContribution: 100,
    annualRate: 0.06,
    years: 30,
    inflation: 0.03,
  });
  it("has a row for year 0 through the final year", () => {
    expect(rows).toHaveLength(31);
    expect(rows[0]).toMatchObject({ year: 0, balance: 1000, contributed: 1000, growth: 0 });
  });
  it("matches the closed-form values in the final year", () => {
    const last = rows[30];
    expect(last.balance).toBeCloseTo(fvLumpSum(1000, 0.005, 360) + 100451.5, 0);
    expect(last.contributed).toBe(1000 + 100 * 360);
    expect(last.realBalance).toBeCloseTo(last.balance / 1.03 ** 30, 6);
  });
});
