import { describe, expect, it } from "vitest";
import { defaultDiversificationParams as d, simulateDiversification } from "./diversification";
import { mulberry32, normal, percentile } from "./random";

describe("random helpers", () => {
  it("are repeatable for a given seed", () => {
    const a = mulberry32(1);
    const b = mulberry32(1);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("normal draws have mean ≈ 0 and sd ≈ 1", () => {
    const r = mulberry32(7);
    const xs = Array.from({ length: 20000 }, () => normal(r));
    const m = xs.reduce((s, x) => s + x, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length);
    expect(Math.abs(m)).toBeLessThan(0.03);
    expect(sd).toBeCloseTo(1, 1);
  });
  it("percentile interpolates", () => {
    expect(percentile([1, 2, 3, 4, 5], 0.5)).toBe(3);
    expect(percentile([0, 10], 0.25)).toBe(2.5);
  });
});

describe("diversification simulation", () => {
  const res = simulateDiversification({ ...d, trials: 300 });
  it("a diversified portfolio swings much less year to year than one stock", () => {
    expect(res.portfolio.typicalYearlySwing).toBeLessThan(res.single.typicalYearlySwing * 0.6);
  });
  it("one stock has a far wider range of outcomes", () => {
    const spread = (s: typeof res.single) => s.p90 / s.p10;
    expect(spread(res.single)).toBeGreaterThan(spread(res.portfolio) * 5);
  });
  it("one stock more often loses money over the whole period", () => {
    expect(res.single.lossRate).toBeGreaterThan(res.portfolio.lossRate);
  });
  it("a typical single stock ends with less than the typical portfolio", () => {
    // Volatility drag: same expected yearly return, lower median compounded result.
    expect(res.single.median).toBeLessThan(res.portfolio.median);
  });
  it("with one stock in the portfolio, both sides are identical", () => {
    const one = simulateDiversification({ ...d, trials: 50, stocksInPortfolio: 1 });
    expect(one.portfolio.median).toBeCloseTo(one.single.median, 10);
  });
});
