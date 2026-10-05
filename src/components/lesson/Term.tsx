import type { ReactNode } from "react";
import { getTerm } from "@/content/glossary";
import { getSource, shortCitation } from "@/content/sources";
import { InlinePopover } from "@/components/ui/InlinePopover";

/**
 * A glossary term. Renders the text with a dotted underline; tapping,
 * hovering or focusing it shows the plain-English definition.
 *
 *   An <Term id="index-fund">index fund</Term> tracks the whole market.
 */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const t = getTerm(id);
  const s = getSource(t.sourceId);
  return (
    <InlinePopover
      label={`Definition: ${t.term}`}
      triggerClassName="inline cursor-help border-b-2 border-dotted border-accent/70 text-inherit hover:bg-accent-soft"
      trigger={
        <>
          {children ?? t.term}
          <span className="sr-only"> (definition)</span>
        </>
      }
    >
      <span className="block font-semibold">{t.term}</span>
      <span className="mt-1 block">{t.definition}</span>
      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="text-muted">Source: {shortCitation(s)}</span>
        <a data-plain href={`/glossary/#${t.id}`} className="text-accent underline underline-offset-2">
          Glossary
        </a>
      </span>
    </InlinePopover>
  );
}
