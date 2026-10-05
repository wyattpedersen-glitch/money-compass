import { paymentToReach } from "@/lib/finance/compound";

export type ExpenseKind = "need" | "want";

export interface Expense {
  id: string;
  name: string;
  /** Monthly amount in dollars. */
  amount: number;
  kind: ExpenseKind;
  /** Fixed costs (rent, phone) stay the same each month; variable ones (groceries) change. */
  fixed: boolean;
}

export type GoalType = "emergency" | "debt" | "purchase" | "retirement" | "custom";

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  target: number;
  saved: number;
  /** Target month, "YYYY-MM". */
  targetDate: string;
  /** Yearly interest earned on money set aside (APY), as a decimal. Optional. */
  apy?: number;
}

export type Framework = "50-30-20" | "zero-based" | "pay-yourself-first";

/** Whole months from `from` (YYYY-MM) to `to` (YYYY-MM), at least 1. */
export function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return Math.max(1, (ty - fy) * 12 + (tm - fm));
}

export function currentMonth(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Monthly contribution needed to hit a goal by its date. */
export function goalMonthly(goal: Goal, now: string): number {
  const months = monthsBetween(now, goal.targetDate);
  const remaining = Math.max(0, goal.target - goal.saved);
  if (remaining === 0) return 0;
  const r = goal.apy ? Math.pow(1 + goal.apy, 1 / 12) - 1 : 0;
  return paymentToReach(goal.target, goal.saved, r, months);
}

/** Emergency fund target: months of essential (need) spending. */
export function emergencyTarget(expenses: Expense[], months: number): number {
  return expenses.filter((e) => e.kind === "need").reduce((s, e) => s + e.amount, 0) * months;
}

export interface PlanInput {
  income: number;
  expenses: Expense[];
  goals: Goal[];
  framework: Framework;
  now: string;
}

export interface GoalLine {
  goal: Goal;
  needed: number;
  /** What the plan can actually fund each month. */
  funded: number;
  /** Months to reach the goal at the funded amount (Infinity if unfunded). */
  monthsAtFunded: number;
  /** "YYYY-MM" the goal would be reached at the funded amount. */
  reachedBy: string | null;
}

export interface Plan {
  income: number;
  needs: number;
  wants: number;
  goalsNeeded: number;
  goalsFunded: number;
  leftover: number;
  fits: boolean;
  /** Framework targets in dollars (50/30/20 only). */
  targets?: { needs: number; wants: number; savings: number };
  goalLines: GoalLine[];
  notes: string[];
}

export function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const total = y * 12 + (m - 1) + Math.ceil(n);
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

function monthsToReach(goal: Goal, monthly: number): number {
  const remaining = Math.max(0, goal.target - goal.saved);
  if (remaining === 0) return 0;
  if (monthly <= 0) return Infinity;
  return Math.ceil(remaining / monthly);
}

/**
 * Builds a monthly plan. Spending is taken as entered; goals share whatever
 * is available after spending, in proportion to what each needs. When money
 * is short, every goal slows down by the same factor, and the plan reports
 * the new finish dates instead of silently dropping goals.
 */
export function buildPlan(input: PlanInput): Plan {
  const needs = sum(input.expenses.filter((e) => e.kind === "need").map((e) => e.amount));
  const wants = sum(input.expenses.filter((e) => e.kind === "want").map((e) => e.amount));
  const neededEach = input.goals.map((g) => goalMonthly(g, input.now));
  const goalsNeeded = sum(neededEach);
  const notes: string[] = [];

  let available = input.income - needs - wants;
  let targets: Plan["targets"];
  if (input.framework === "50-30-20") {
    targets = { needs: input.income * 0.5, wants: input.income * 0.3, savings: input.income * 0.2 };
    if (needs > targets.needs)
      notes.push(
        "Needs are above 50% of take-home pay. That's common with high rent or a low income, and it's a signal to look at the biggest fixed costs.",
      );
    if (wants > targets.wants)
      notes.push("Wants are above 30%. Trimming them is the fastest way to free up money for goals.");
  }
  if (input.framework === "pay-yourself-first") {
    // Goals are funded first; spending has to fit in what's left.
    available = input.income - needs;
    notes.push("Pay yourself first: goal money moves out on payday, and wants get whatever remains.");
  }

  const ratio = goalsNeeded > 0 ? Math.max(0, Math.min(1, available / goalsNeeded)) : 1;
  const goalLines = input.goals.map((goal, i) => {
    const funded = neededEach[i] * ratio;
    const m = monthsToReach(goal, funded);
    return {
      goal,
      needed: neededEach[i],
      funded,
      monthsAtFunded: m,
      reachedBy: Number.isFinite(m) ? addMonths(input.now, m) : null,
    };
  });
  const goalsFunded = sum(goalLines.map((g) => g.funded));
  let leftover = input.income - needs - wants - goalsFunded;
  if (input.framework === "pay-yourself-first" && leftover < 0) {
    notes.push(`Wants are ${fmt(-leftover)} more than what's left after needs and goals.`);
  }
  const fits = goalsNeeded <= available + 1e-9 && leftover >= -1e-9;
  if (input.framework === "zero-based" && leftover > 0.5) {
    notes.push(
      `${fmt(leftover)} is still unassigned. In zero-based budgeting every dollar gets a job: add it to a goal or a category.`,
    );
  }
  if (Math.abs(leftover) < 1e-9) leftover = 0;
  return { income: input.income, needs, wants, goalsNeeded, goalsFunded, leftover, fits, targets, goalLines, notes };
}

function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}
function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
