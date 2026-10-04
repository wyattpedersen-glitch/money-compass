import type { Metadata } from "next";
import { BudgetShell } from "@/components/budget/BudgetNav";
import { PrintPlan } from "@/components/budget/PrintPlan";

export const metadata: Metadata = { title: "Printable plan" };

export default function Page() {
  return (
    <BudgetShell title="Printable plan" intro="A one-page version of your plan to print or save as a PDF.">
      <PrintPlan />
    </BudgetShell>
  );
}
