import { describe, expect, it } from "vitest";
import { amortize, monthlyPayment, monthsToPayOff } from "./amortization";

describe("monthlyPayment", () => {
  it("matches textbook mortgage and car loan payments", () => {
    // $200,000, 30 years at 6%: $1,199.10 (standard mortgage table value)
    expect(monthlyPayment(200_000, 0.06, 360)).toBeCloseTo(1199.1, 2);
    // $10,000, 5 years at 5%: $188.71
    expect(monthlyPayment(10_000, 0.05, 60)).toBeCloseTo(188.71, 2);
    // $25,000, 10 years at 6.8%: $287.70
    expect(monthlyPayment(25_000, 0.068, 120)).toBeCloseTo(287.7, 1);
  });
  it("handles zero interest", () => {
    expect(monthlyPayment(1200, 0, 12)).toBe(100);
  });
});

describe("amortize", () => {
  it("pays the loan off exactly on schedule", () => {
    const a = amortize(200_000, 0.06, 360);
    expect(a.months).toBe(360);
    expect(a.rows.at(-1)!.balance).toBeCloseTo(0, 2);
    // Total interest on that mortgage: 360 × 1,199.10 − 200,000 ≈ $231,676
    expect(a.totalInterest).toBeCloseTo(231_676, -1);
    // First month: $1,000 of interest, $199.10 of principal
    expect(a.rows[0].interest).toBeCloseTo(1000, 6);
    expect(a.rows[0].principal).toBeCloseTo(199.1, 2);
  });
  it("extra payments shorten the loan and save interest", () => {
    const base = amortize(200_000, 0.06, 360);
    const extra = amortize(200_000, 0.06, 360, 200);
    expect(extra.months).toBeLessThan(base.months);
    expect(extra.totalInterest).toBeLessThan(base.totalInterest);
  });
});

describe("monthsToPayOff", () => {
  it("matches the closed-form payoff formula", () => {
    // $5,000 at 20% APR paying $200/month: about 32.6 months
    expect(monthsToPayOff(5000, 0.2, 200)).toBeCloseTo(32.6, 1);
  });
  it("never pays off if the payment only covers interest", () => {
    expect(monthsToPayOff(5000, 0.24, 100)).toBe(Infinity);
  });
  it("agrees with the schedule", () => {
    const n = monthsToPayOff(10_000, 0.05, monthlyPayment(10_000, 0.05, 60));
    expect(n).toBeCloseTo(60, 6);
  });
});
