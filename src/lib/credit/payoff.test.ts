import { describe, expect, it } from "vitest";
import { monthsToPayOff } from "./amortization";
import { simulatePayoff, type Debt } from "./payoff";

const debts: Debt[] = [
  { id: "card", name: "Credit card", balance: 3000, apr: 0.24, minPayment: 90 },
  { id: "car", name: "Car loan", balance: 8000, apr: 0.07, minPayment: 200 },
  { id: "store", name: "Store card", balance: 600, apr: 0.18, minPayment: 25 },
];

describe("simulatePayoff", () => {
  it("matches the closed-form result for a single debt", () => {
    const one: Debt[] = [{ id: "a", name: "A", balance: 5000, apr: 0.2, minPayment: 200 }];
    const r = simulatePayoff(one, 200, "avalanche");
    expect(r.months).toBe(Math.ceil(monthsToPayOff(5000, 0.2, 200)));
    expect(r.totalPaid - r.totalInterest).toBeCloseTo(5000, 6);
  });

  it("avalanche never costs more interest than snowball", () => {
    const a = simulatePayoff(debts, 500, "avalanche");
    const s = simulatePayoff(debts, 500, "snowball");
    expect(a.totalInterest).toBeLessThanOrEqual(s.totalInterest + 1e-6);
    expect(a.order[0].id).toBe("card");
    expect(s.order[0].id).toBe("store");
    // Snowball gets the first win sooner.
    expect(s.order[0].month).toBeLessThan(a.order[0].month);
  });

  it("pays everything off and conserves money", () => {
    const r = simulatePayoff(debts, 500, "avalanche");
    expect(r.stalled).toBe(false);
    expect(r.balances.at(-1)).toBeCloseTo(0, 6);
    expect(r.totalPaid).toBeCloseTo(11_600 + r.totalInterest, 4);
  });

  it("flags a budget below the minimums", () => {
    expect(simulatePayoff(debts, 200, "avalanche").shortfall).toBe(true);
  });

  it("stalls instead of looping forever when payments don't cover interest", () => {
    const r = simulatePayoff(
      [{ id: "x", name: "X", balance: 10_000, apr: 0.3, minPayment: 100 }],
      100,
      "snowball",
      120,
    );
    expect(r.stalled).toBe(true);
    expect(r.months).toBe(120);
  });
});
