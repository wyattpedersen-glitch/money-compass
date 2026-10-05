import type { Metadata } from "next";
import { BudgetShell, SavedNote } from "@/components/budget/BudgetNav";
import { PlanView } from "@/components/budget/PlanView";

export const metadata: Metadata = { title: "Your plan" };

export default function Page() {
  return (
    <BudgetShell title="Your plan" intro="Your income, spending and goals put together into one monthly plan.">
      <PlanView />
      <SavedNote />
    </BudgetShell>
  );
}
