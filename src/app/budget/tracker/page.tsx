import type { Metadata } from "next";
import { BudgetShell, SavedNote } from "@/components/budget/BudgetNav";
import { TrackerView } from "@/components/budget/TrackerView";

export const metadata: Metadata = { title: "Tracker" };

export default function Page() {
  return (
    <BudgetShell
      title="Tracker"
      intro="Record what you actually spend, by hand or from your bank's CSV file, and see how it compares to the plan."
    >
      <TrackerView />
      <SavedNote />
    </BudgetShell>
  );
}
