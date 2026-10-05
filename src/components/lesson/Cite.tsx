import { fullCitation, getSource, shortCitation } from "@/content/sources";
import { InlinePopover } from "@/components/ui/InlinePopover";

/**
 * Inline citation. Shows a short "(Source, Year)" label; tapping it reveals
 * the full reference with a link to the original.
 *
 *   ...which costs most investors money <Cite id="sharpe-1991" />.
 */
export function Cite({ id, page }: { id: string; page?: string }) {
  const s = getSource(id);
  const label = shortCitation(s);
  return (
    <InlinePopover
      label={`Source: ${s.title}`}
      triggerClassName="mx-0.5 inline cursor-pointer rounded px-1 align-baseline text-[0.8em] font-medium text-accent underline decoration-dotted underline-offset-2 hover:bg-accent-soft"
      trigger={
        <>
          <span aria-hidden="true">[</span>
          {label}
          <span aria-hidden="true">]</span>
          <span className="sr-only"> (show source)</span>
        </>
      }
    >
      <span className="block">{fullCitation(s)}</span>
      {page && <span className="mt-1 block text-muted">{page}</span>}
      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {s.url && (
          <a
            data-plain
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline underline-offset-2"
          >
            Open source<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <a data-plain href={`/sources/#${s.id}`} className="text-muted underline underline-offset-2">
          All sources
        </a>
      </span>
    </InlinePopover>
  );
}
