import { describe, expect, it } from "vitest";
import { rebalance, sampleAllocation, stockShare } from "./allocation";

describe("sample allocation", () => {
  it("is mostly stocks far from retirement and more bonds near it", () => {
    expect(stockShare(40, "moderate")).toBe(0.9);
    expect(stockShare(25, "moderate")).toBe(0.9);
    expect(stockShare(0, "moderate")).toBe(0.5);
    expect(stockShare(10, "moderate")).toBeLessThan(stockShare(20, "moderate"));
  });
  it("shifts with risk tolerance and stays within bounds", () => {
    expect(stockShare(30, "aggressive")).toBe(1);
    expect(stockShare(0, "conservative")).toBeCloseTo(0.3, 10);
    expect(stockShare(0, "conservative")).toBeGreaterThanOrEqual(0.2);
  });
  it("always adds up to 100%", () => {
    for (const y of [0, 5, 13, 25, 40])
      for (const r of ["conservative", "moderate", "aggressive"] as const) {
        const a = sampleAllocation(y, r);
        expect(a.usStocks + a.intlStocks + a.bonds).toBeCloseTo(1, 10);
      }
  });
});

describe("rebalancing", () => {
  it("brings a drifted 70/30 portfolio back to 60/40", () => {
    const trades = rebalance(
      { usStocks: 70_000, intlStocks: 0, bonds: 30_000 },
      { usStocks: 0.6, intlStocks: 0, bonds: 0.4 },
    );
    expect(trades.usStocks).toBeCloseTo(-10_000, 6);
    expect(trades.bonds).toBeCloseTo(10_000, 6);
  });
});
