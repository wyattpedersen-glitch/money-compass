import type { Metadata } from "next";
import { endPunct, sources } from "@/content/sources";
import { sectionLabels, type SectionId, type Source } from "@/content/types";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Sources" };

const order: SectionId[] = ["investing", "budgeting", "credit", "general"];

const kindLabels: Record<Source["kind"], string> = {
  academic: "Peer-reviewed research",
  government: "U.S. government",
  regulator: "Regulator",
  industry: "Industry data",
  practitioner: "Practitioner",
};

function SourceItem({ s }: { s: Source }) {
  return (
    <li
      id={s.id}
      className="scroll-mt-20 rounded-lg border border-border bg-surface p-4 target:border-accent target:ring-2 target:ring-accent/30"
    >
      <p>
        <span className="font-medium">{s.authors}</span>
        {typeof s.year === "number" && <> ({s.year})</>}. <cite className="not-italic">{s.title}</cite>
        {endPunct(s.title)}
        {s.publisher && <> {s.publisher}.</>}
      </p>
      {s.note && <p className="mt-1 text-sm text-muted">{s.note}</p>}
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="text-muted">{kindLabels[s.kind]}</span>
        {s.url && (
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-accent underline underline-offset-2"
          >
            {s.url.replace(/^https?:\/\//, "")}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </p>
    </li>
  );
}

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <PageHeader title="Sources">
        Every reference used on this site, grouped by section. Inline citations on each page link here. Where a figure
        changes every year, the page says which tax year it applies to.
      </PageHeader>
      {order.map((section) => {
        const list = sources
          .filter((s) => s.sections.includes(section))
          .sort((a, b) => a.authors.localeCompare(b.authors) || a.title.localeCompare(b.title));
        if (list.length === 0) return null;
        return (
          <section key={section} aria-labelledby={`h-${section}`} className="mt-8">
            <h2 id={`h-${section}`} className="text-xl font-semibold">
              {sectionLabels[section]}
            </h2>
            <ul className="mt-4 space-y-3">
              {list.map((s) => (
                <SourceItem key={`${section}-${s.id}`} s={s} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
