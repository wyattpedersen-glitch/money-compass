import type { QuizResult } from "@/lib/storage/schema";

export type Answer = "yes" | "no" | "unsure";

export interface Question {
  id: "struggling" | "cushion" | "high-interest" | "tracking";
  text: string;
  help?: string;
}

export const questions: Question[] = [
  {
    id: "struggling",
    text: "Are you having trouble keeping up with minimum payments on any debt?",
  },
  {
    id: "cushion",
    text: "Could you cover a surprise $1,000 expense from savings, without borrowing?",
    help: "For example a car repair, a medical bill or a last-minute flight.",
  },
  {
    id: "high-interest",
    text: "Do you carry a credit card balance, or any other debt at a high interest rate, from month to month?",
    help: "Paying your card in full every month counts as no.",
  },
  {
    id: "tracking",
    text: "Do you know roughly how much you spend each month?",
  },
];

export type Answers = Partial<Record<Question["id"], Answer>>;

export interface QuizOutcome {
  result: QuizResult;
  /** Whether the reader should also start by setting up a budget. */
  startWithBudget: boolean;
  /** Ordered next steps (hrefs). */
  steps: Array<{ href: string; label: string }>;
}

/**
 * Same order of priorities the Next dollar helper uses: get current on debt
 * and build a small cushion first, then pay down expensive debt, then invest.
 * "Not sure" is treated cautiously (as the answer that needs attention).
 */
export function scoreQuiz(a: Answers): QuizOutcome {
  const startWithBudget = a.tracking !== "yes";
  const struggling = a.struggling === "yes";
  const result: QuizResult = struggling
    ? "debt"
    : a.cushion !== "yes"
      ? "emergency-fund"
      : a["high-interest"] !== "no"
        ? "debt"
        : "investing";
  return { result, startWithBudget, steps: stepsFor(result, { startWithBudget, struggling }) };
}

const budget = { href: "/budget/", label: "Set up your budget" };

export function stepsFor(
  result: QuizResult,
  { startWithBudget, struggling = false }: { startWithBudget: boolean; struggling?: boolean },
): QuizOutcome["steps"] {
  let steps: QuizOutcome["steps"];
  if (result === "debt" && struggling) {
    steps = [
      { href: "/credit/getting-help/", label: "When debt gets dangerous" },
      budget,
      { href: "/credit/debt-payoff/", label: "Paying off debt" },
    ];
  } else if (result === "emergency-fund") {
    steps = [
      budget,
      { href: "/budget/goals/", label: "Set an emergency fund goal" },
      { href: "/budget/automation/", label: "Why automatic beats willpower" },
    ];
  } else if (result === "debt") {
    steps = [
      { href: "/credit/how-interest-works/", label: "How interest and loans work" },
      { href: "/credit/debt-payoff/", label: "Paying off debt" },
      budget,
    ];
  } else {
    steps = [
      { href: "/investing/why-invest/", label: "Why invest at all" },
      { href: "/investing/account-types/", label: "Account types and tax advantages" },
      { href: "/investing/simple-portfolio/", label: "Building a simple portfolio" },
    ];
  }
  // Someone who's struggling should see help first, even before the budget.
  if (startWithBudget && !struggling && steps[0].href !== "/budget/")
    steps = [budget, ...steps.filter((s) => s.href !== "/budget/")];
  return steps;
}

export const resultLabels: Record<QuizResult, { title: string; body: string }> = {
  debt: {
    title: "Focus on debt first",
    body: "Expensive debt grows faster than most investments do, so paying it down is usually the best return available.",
  },
  "emergency-fund": {
    title: "Build a cash cushion first",
    body: "A starter emergency fund keeps a surprise bill from becoming credit card debt. It's the foundation for everything else.",
  },
  investing: {
    title: "You're ready to start investing",
    body: "With a cushion in place and no expensive debt, time in the market is your biggest advantage.",
  },
};
