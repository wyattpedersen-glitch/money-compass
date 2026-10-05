import { formatFigure, getFigure } from "@/content/figures";

/**
 * A year-specific number (contribution limit, tax bracket...) pulled from
 * src/content/figures.ts, always shown with its tax year and IRS link.
 *
 *   You can put up to <Fig id="ira-contribution-limit" /> into an IRA.
 */
export function Fig({ id }: { id: string }) {
  const f = getFigure(id);
  return (
    <span>
      <strong>{formatFigure(f)}</strong>{" "}
      <span className="text-[0.85em] text-muted">
        (
        <a
          data-plain
          href={f.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2"
          title={f.sourceTitle}
        >
          {f.taxYear} tax year, IRS
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        {!f.checked && " · figure pending re-check"})
      </span>
    </span>
  );
}
