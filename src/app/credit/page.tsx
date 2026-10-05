import type { Metadata } from "next";
import { SectionIndex } from "@/components/layout/SectionIndex";

export const metadata: Metadata = { title: "Credit, loans and debt" };

export default function CreditPage() {
  return (
    <SectionIndex
      section="credit"
      title="Credit, loans and debt"
      intro="How credit scores are built, what borrowing really costs, and how to pay debt down faster."
    />
  );
}
