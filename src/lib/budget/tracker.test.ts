import { describe, expect, it } from "vitest";
import { guessCategory, summarizeMonth, type Entry } from "./tracker";
import type { Expense } from "./plan";

const expenses: Expense[] = [
  { id: "rent", name: "Rent", amount: 1500, kind: "need", fixed: true },
  { id: "food", name: "Groceries", amount: 400, kind: "need", fixed: false },
];
const entries: Entry[] = [
  { id: "1", date: "2026-10-01", categoryId: "rent", amount: 1500 },
  { id: "2", date: "2026-10-05", categoryId: "food", amount: 120 },
  { id: "3", date: "2026-10-12", categoryId: "food", amount: 330 },
  { id: "4", date: "2026-10-13", categoryId: "other", amount: 25 },
  { id: "5", date: "2026-11-01", categoryId: "rent", amount: 1500 },
];

describe("monthly summary", () => {
  const s = summarizeMonth(entries, expenses, "2026-10");
  it("totals planned vs actual by category for the month only", () => {
    expect(s.rows.find((r) => r.categoryId === "food")).toMatchObject({ planned: 400, actual: 450 });
    expect(s.rows.find((r) => r.categoryId === "food")!.ratio).toBeCloseTo(1.125, 10);
  });
  it("collects uncategorized spending", () => {
    expect(s.rows.find((r) => r.categoryId === "other")).toMatchObject({ planned: 0, actual: 25, ratio: Infinity });
  });
  it("adds up totals", () => {
    expect(s.planned).toBe(1900);
    expect(s.actual).toBe(1975);
  });
});

describe("category guessing", () => {
  it("matches a category name inside a description", () => {
    expect(guessCategory("SAFEWAY GROCERIES #123", expenses)).toBe("food");
    expect(guessCategory("Netflix", expenses)).toBe("other");
  });
});
