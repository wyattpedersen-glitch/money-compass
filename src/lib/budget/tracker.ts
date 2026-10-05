import type { Expense } from "./plan";

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  /** Expense id from the budget, or "other". */
  categoryId: string;
  amount: number;
  note?: string;
}

export interface CategoryRow {
  categoryId: string;
  name: string;
  planned: number;
  actual: number;
  /** actual ÷ planned, or Infinity if nothing was planned but money was spent. */
  ratio: number;
}

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function summarizeMonth(
  entries: Entry[],
  expenses: Expense[],
  month: string,
): { rows: CategoryRow[]; planned: number; actual: number } {
  const inMonth = entries.filter((e) => monthOf(e.date) === month);
  const byCat = new Map<string, number>();
  for (const e of inMonth) byCat.set(e.categoryId, (byCat.get(e.categoryId) ?? 0) + e.amount);
  const rows: CategoryRow[] = expenses.map((x) => {
    const actual = byCat.get(x.id) ?? 0;
    return { categoryId: x.id, name: x.name, planned: x.amount, actual, ratio: ratio(actual, x.amount) };
  });
  const known = new Set(expenses.map((x) => x.id));
  const other = inMonth.filter((e) => !known.has(e.categoryId)).reduce((s, e) => s + e.amount, 0);
  if (other !== 0)
    rows.push({
      categoryId: "other",
      name: "Other / uncategorized",
      planned: 0,
      actual: other,
      ratio: ratio(other, 0),
    });
  return {
    rows,
    planned: rows.reduce((s, r) => s + r.planned, 0),
    actual: rows.reduce((s, r) => s + r.actual, 0),
  };
}

function ratio(actual: number, planned: number): number {
  if (planned > 0) return actual / planned;
  return actual > 0 ? Infinity : 0;
}

/** Simple keyword matching from a transaction description to a budget category. */
export function guessCategory(description: string, expenses: Expense[]): string {
  const d = description.toLowerCase();
  const hit = expenses.find((x) => x.name.trim().length > 2 && d.includes(x.name.toLowerCase().trim()));
  return hit ? hit.id : "other";
}
