import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlossarySearch } from "./GlossarySearch";

export const metadata: Metadata = { title: "Glossary" };

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <PageHeader title="Glossary">
        Plain-English definitions of every term used on the site. In lessons, words with a dotted underline open their
        definition when you tap or hover them.
      </PageHeader>
      <GlossarySearch />
    </div>
  );
}
