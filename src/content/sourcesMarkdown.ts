import { endPunct, sources } from "./sources.ts";
import { sectionLabels, type SectionId } from "./types.ts";

const order: SectionId[] = ["investing", "budgeting", "credit", "general"];

/** SOURCES.md content. Kept in sync with the registry by a test. */
export function renderSourcesMarkdown(): string {
  const lines: string[] = [
    "# Sources",
    "",
    "<!-- Generated from src/content/sources.ts by `npm run sources`. Do not edit by hand. -->",
    "",
    "Every reference used on the site, grouped by the section that cites it. The same list is on the site's `/sources` page.",
    "",
  ];
  for (const section of order) {
    const list = sources
      .filter((s) => s.sections.includes(section))
      .sort((a, b) => a.authors.localeCompare(b.authors) || a.title.localeCompare(b.title));
    if (list.length === 0) continue;
    lines.push(`## ${sectionLabels[section]}`, "");
    for (const s of list) {
      const year = typeof s.year === "number" ? ` (${s.year})` : "";
      const pub = s.publisher ? ` ${s.publisher}.` : "";
      const link = s.url ? ` <${s.url}>` : "";
      const checked = s.checked ? "" : " _(link not yet re-checked)_";
      lines.push(`- **${s.authors}**${year}. *${s.title}*${endPunct(s.title)}${pub}${link}${checked}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
