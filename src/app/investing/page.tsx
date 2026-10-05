import type { Metadata } from "next";
import { SectionIndex } from "@/components/layout/SectionIndex";

export const metadata: Metadata = { title: "Understanding investing" };

export default function InvestingPage() {
  return (
    <SectionIndex
      section="investing"
      title="Understanding investing"
      intro="Why investing matters, what decades of research say actually works, and how to avoid the mistakes that cost most people the most."
    />
  );
}
