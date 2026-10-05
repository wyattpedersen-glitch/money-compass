import type { Metadata } from "next";
import { BudgetShell, SavedNote } from "@/components/budget/BudgetNav";
import { GoalsEditor } from "@/components/budget/GoalsEditor";

export const metadata: Metadata = { title: "Goals" };

export default function Page() {
  return (
    <BudgetShell
      title="Goals"
      intro="Give every goal a target amount and a date. The monthly amount needed is calculated for you."
    >
      <GoalsEditor />
      <SavedNote />
    </BudgetShell>
  );
}
