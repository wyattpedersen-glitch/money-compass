import type { Metadata } from "next";
import { BudgetShell, SavedNote } from "@/components/budget/BudgetNav";
import { SetupEditor } from "@/components/budget/SetupEditor";

export const metadata: Metadata = { title: "Income and spending" };

export default function Page() {
  return (
    <BudgetShell
      title="Income and spending"
      intro="Start with what comes in and what goes out. Rough numbers are fine; you can refine them once you've tracked a month."
    >
      <SetupEditor />
      <SavedNote />
    </BudgetShell>
  );
}
