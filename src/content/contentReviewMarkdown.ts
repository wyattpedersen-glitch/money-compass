import { figures } from "./figures.ts";
import { lessons } from "./lessons.ts";
import { sources } from "./sources.ts";
import { tax2026 } from "./taxFigures.ts";

/**
 * CONTENT_REVIEW.md: the checklist for keeping the site's facts current.
 * The fixed checklist is written here; the status tables are generated from
 * the registries, so they can't drift. Regenerate with `npm run review`.
 */
export function renderContentReviewMarkdown(): string {
  const unchecked = sources.filter((s) => !s.checked);
  const uncheckedFigures = figures.filter((f) => !f.checked);
  const published = lessons.filter((l) => l.status === "published");

  const lines = [
    "# Content review",
    "",
    "<!-- Generated from src/content/*.ts by `npm run review`. Edit the generator, not this file. -->",
    "",
    "How to keep the facts on this site correct and current.",
    "",
    "## Every year (November to January)",
    "",
    "The IRS announces next year's retirement contribution limits around October or November and inflation adjustments to tax brackets in the fall. HSA limits are usually announced in the spring.",
    "",
    "- [ ] Update every entry in `src/content/figures.ts`: change `value` and `taxYear`, confirm the `sourceUrl` still states it, and set `checked` to today's date.",
    '- [ ] Search lessons for any year mentioned in prose (`rg "20[0-9][0-9]" src/content/lessons`) and confirm each is still right.',
    "- [ ] Re-run `npm test` (it checks every figure states a tax year and an IRS link).",
    "",
    "## Every six months",
    "",
    "- [ ] Click through every link on `/sources` and confirm it still works and still supports the claim. Set `checked` on each source in `src/content/sources.ts`.",
    "- [ ] Check for newer editions of recurring research (SPIVA scorecards, Morningstar *Mind the Gap*, Vanguard and Morningstar fee studies, FICO factor weights, CFPB reports). Update the citation and any numbers quoted from it.",
    "- [ ] Update the `lastReviewed` date on each lesson you reviewed in `src/content/lessons.ts`.",
    "",
    "## Whenever a lesson changes",
    "",
    "- [ ] Every new claim, number or rule of thumb has a `<Cite>` to a source in the registry.",
    "- [ ] Every new term is in the glossary and wrapped in `<Term>` the first time it appears.",
    "- [ ] The lesson still ends with `<KeyTakeaways>` and `<CommonMistakes>`.",
    "- [ ] `npm run sources && npm run review && npm test` all pass.",
    "",
    "## Current status",
    "",
    `### Sources whose link and claim haven't been re-checked (${unchecked.length} of ${sources.length})`,
    "",
    "These were cited from well-known primary sources but the live page wasn't re-opened when the content was written. Check each, then set `checked` in `src/content/sources.ts`.",
    "",
    ...(unchecked.length ? unchecked.map((s) => `- [ ] \`${s.id}\`: ${s.title} <${s.url ?? "no link"}>`) : ["None."]),
    "",
    `### Year-specific figures awaiting confirmation (${uncheckedFigures.length} of ${figures.length})`,
    "",
    "| Figure | Value | Tax year | Source |",
    "| --- | --- | --- | --- |",
    ...figures.map(
      (f) =>
        `| ${f.label}${f.checked ? "" : " ⚠️"} | ${f.unit === "usd" ? "$" + f.value.toLocaleString("en-US") : f.value + "%"} | ${f.taxYear} | <${f.sourceUrl}> |`,
    ),
    "",
    "⚠️ means the value hasn't been confirmed against the IRS page yet.",
    "",
    `### Take-home pay estimator figures (tax year ${tax2026.taxYear})${tax2026.checked ? `, checked ${tax2026.checked}` : " ⚠️ not yet confirmed"}`,
    "",
    `- Single-filer brackets: ${tax2026.singleBrackets.map((b) => `${Math.round(b.rate * 100)}% from $${b.from.toLocaleString("en-US")}`).join(", ")}`,
    `- Standard deduction (single): $${tax2026.singleStandardDeduction.toLocaleString("en-US")}`,
    `- Social Security: ${(tax2026.socialSecurityRate * 100).toFixed(1)}% up to $${tax2026.socialSecurityWageBase.toLocaleString("en-US")}; Medicare: ${(tax2026.medicareRate * 100).toFixed(2)}%`,
    ...tax2026.sources.map((s) => `- Source: ${s.label} <${s.url}>`),
    "",
    `### Lesson review dates (${published.length} published of ${lessons.length} planned)`,
    "",
    ...(published.length
      ? [
          "| Lesson | Last reviewed |",
          "| --- | --- |",
          ...published.map((l) => `| ${l.section}/${l.slug} | ${l.lastReviewed} |`),
        ]
      : ["No lessons published yet."]),
    "",
  ];
  return lines.join("\n");
}
