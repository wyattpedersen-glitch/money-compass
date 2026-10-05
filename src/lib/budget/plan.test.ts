import { describe, expect, it } from "vitest";
import { addMonths, buildPlan, emergencyTarget, goalMonthly, monthsBetween, type Expense, type Goal } from "./plan";

const expenses: Expense[] = [
  { id: "1", name: "Rent", amount: 1500, kind: "need", fixed: true },
  { id: "2", name: "Groceries", amount: 400, kind: "need", fixed: false },
  { id: "3", name: "Eating out", amount: 300, kind: "want", fixed: false },
];

describe("dates", () => {
  it("counts months between", () => {
    expect(monthsBetween("2026-10", "2027-10")).toBe(12);
    expect(monthsBetween("2026-10", "2026-10")).toBe(1);
  });
  it("adds months across years", () => {
    expect(addMonths("2026-11", 3)).toBe("2027-02");
    expect(addMonths("2026-01", 0)).toBe("2026-01");
  });
});

describe("goal contributions", () => {
  it("splits the remaining amount evenly with no interest", () => {
    const g: Goal = { id: "g", type: "purchase", name: "Laptop", target: 1200, saved: 0, targetDate: "2027-10" };
    expect(goalMonthly(g, "2026-10")).toBeCloseTo(100, 10);
  });
  it("needs less each month when savings earn interest", () => {
    const g: Goal = {
      id: "g",
      type: "emergency",
      name: "EF",
      target: 10_000,
      saved: 0,
      targetDate: "2028-10",
      apy: 0.04,
    };
    expect(goalMonthly(g, "2026-10")).toBeLessThan(10_000 / 24);
  });
  it("is zero once reached", () => {
    expect(
      goalMonthly({ id: "g", type: "custom", name: "x", target: 100, saved: 150, targetDate: "2027-01" }, "2026-10"),
    ).toBe(0);
  });
  it("emergency target is months × essential spending", () => {
    expect(emergencyTarget(expenses, 3)).toBe(5700);
  });
});

describe("plan", () => {
  const goals: Goal[] = [
    { id: "a", type: "emergency", name: "Emergency fund", target: 6000, saved: 0, targetDate: "2027-10" }, // 500/mo
    { id: "b", type: "purchase", name: "Trip", target: 1200, saved: 0, targetDate: "2027-10" }, // 100/mo
  ];
  it("funds every goal when money allows", () => {
    const p = buildPlan({ income: 3500, expenses, goals, framework: "zero-based", now: "2026-10" });
    expect(p.fits).toBe(true);
    expect(p.goalsFunded).toBeCloseTo(600, 6);
    expect(p.leftover).toBeCloseTo(3500 - 2200 - 600, 6);
  });
  it("slows all goals proportionally and reports new dates when money is short", () => {
    const p = buildPlan({ income: 2500, expenses, goals, framework: "zero-based", now: "2026-10" });
    expect(p.fits).toBe(false);
    // 300 available for 600 needed: each goal gets half and takes twice as long.
    expect(p.goalLines[0].funded).toBeCloseTo(250, 6);
    expect(p.goalLines[0].monthsAtFunded).toBe(24);
    expect(p.goalLines[0].reachedBy).toBe("2028-10");
    expect(p.leftover).toBeCloseTo(0, 6);
  });
  it("50/30/20 reports targets and flags overspending", () => {
    const p = buildPlan({ income: 3000, expenses, goals: [], framework: "50-30-20", now: "2026-10" });
    expect(p.targets).toEqual({ needs: 1500, wants: 900, savings: 600 });
    expect(p.notes.some((n) => n.includes("Needs are above 50%"))).toBe(true);
  });
  it("pay-yourself-first funds goals before wants", () => {
    const p = buildPlan({ income: 2500, expenses, goals, framework: "pay-yourself-first", now: "2026-10" });
    // 600 available after needs (1900): goals fully funded, wants overshoot.
    expect(p.goalsFunded).toBeCloseTo(600, 6);
    expect(p.leftover).toBeCloseTo(2500 - 2200 - 600, 6);
    expect(p.fits).toBe(false);
  });
  it("with no money for goals, nothing is reached", () => {
    const p = buildPlan({ income: 2000, expenses, goals, framework: "zero-based", now: "2026-10" });
    expect(p.goalLines[0].reachedBy).toBeNull();
  });
});
