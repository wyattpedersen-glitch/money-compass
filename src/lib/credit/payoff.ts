export interface Debt {
  id: string;
  name: string;
  balance: number;
  /** Yearly rate as a decimal. */
  apr: number;
  minPayment: number;
}

export type Strategy = "avalanche" | "snowball";

export interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Debt ids in the order they were paid off, with the month each finished. */
  order: Array<{ id: string; month: number }>;
  /** Total balance at the end of each month, starting with month 0. */
  balances: number[];
  /** True if the budget can't cover the minimum payments. */
  shortfall: boolean;
  /** True if the simulation stopped before every debt was paid (budget too small). */
  stalled: boolean;
}

/**
 * Avalanche puts extra money on the highest-rate debt first (least interest).
 * Snowball puts it on the smallest balance first (quickest early wins).
 * Ties fall back to the other rule.
 */
export function priority(debts: Debt[], strategy: Strategy): Debt[] {
  return [...debts].sort((a, b) =>
    strategy === "avalanche" ? b.apr - a.apr || a.balance - b.balance : a.balance - b.balance || b.apr - a.apr,
  );
}

/**
 * Simulates paying a fixed total each month. Every debt gets its minimum
 * (or its remaining balance); everything left goes to the top-priority debt.
 * When a debt is paid off, its minimum rolls into the next one.
 */
export function simulatePayoff(
  debts: Debt[],
  monthlyBudget: number,
  strategy: Strategy,
  maxMonths = 600,
): PayoffResult {
  const bal = new Map(debts.map((d) => [d.id, d.balance]));
  const order: PayoffResult["order"] = [];
  const balances = [sumMap(bal)];
  const minTotal = debts.reduce((s, d) => s + d.minPayment, 0);
  const shortfall = monthlyBudget + 1e-9 < minTotal;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const ranked = priority(debts, strategy);

  while (sumMap(bal) > 0.005 && month < maxMonths) {
    month++;
    // Interest accrues on each balance for the month.
    for (const d of debts) {
      const b = bal.get(d.id)!;
      if (b <= 0) continue;
      const i = (b * d.apr) / 12;
      totalInterest += i;
      bal.set(d.id, b + i);
    }
    let left = monthlyBudget;
    // Minimums first.
    for (const d of debts) {
      const b = bal.get(d.id)!;
      if (b <= 0) continue;
      const pay = Math.min(d.minPayment, b, left);
      bal.set(d.id, b - pay);
      left -= pay;
      totalPaid += pay;
    }
    // Then the extra, in priority order.
    for (const d of ranked) {
      if (left <= 0) break;
      const b = bal.get(d.id)!;
      if (b <= 0) continue;
      const pay = Math.min(b, left);
      bal.set(d.id, b - pay);
      left -= pay;
      totalPaid += pay;
    }
    for (const d of debts) {
      if (bal.get(d.id)! <= 0.005 && !order.some((o) => o.id === d.id)) {
        bal.set(d.id, 0);
        order.push({ id: d.id, month });
      }
    }
    balances.push(sumMap(bal));
  }
  const stalled = sumMap(bal) > 0.005;
  return { months: month, totalInterest, totalPaid, order, balances, shortfall, stalled };
}

function sumMap(m: Map<string, number>): number {
  let s = 0;
  for (const v of m.values()) s += Math.max(0, v);
  return s;
}
