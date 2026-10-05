import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { sources, sourcesById } from "@/content/sources";
import { glossary, glossaryById } from "@/content/glossary";
import { lessons } from "@/content/lessons";
import { figures } from "@/content/figures";
import { renderSourcesMarkdown } from "@/content/sourcesMarkdown";
import type { SectionId } from "@/content/types";

const root = join(__dirname, "..");
const src = join(root, "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const contentFiles = walk(src).filter((f) => /\.(mdx|tsx)$/.test(f));

/** Which section a file's citations belong to on /sources. */
function sectionOf(file: string): SectionId {
  // Shared components can declare which section they belong to.
  const declared = readFileSync(file, "utf8").match(/@section (investing|budgeting|credit|general)/);
  if (declared) return declared[1] as SectionId;
  const rel = relative(src, file).split(sep).join("/");
  const m = rel.match(/^(?:content\/lessons|app)\/(investing|budget|budgeting|credit)\//);
  if (!m) return "general";
  return m[1] === "budget" ? "budgeting" : (m[1] as SectionId);
}

const citeRe = /<Cite\s+id="([^"]+)"/g;
const termRe = /<Term\s+id="([^"]+)"/g;
const sourceIdRe = /sourceId:\s*"([^"]+)"/g;

function matches(re: RegExp, text: string): string[] {
  return [...text.matchAll(re)].map((m) => m[1]);
}

/** File text with comments removed, so usage examples in docs don't count. */
function code(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

const citations = contentFiles.flatMap((file) => {
  const text = code(file);
  return [
    ...matches(citeRe, text).map((id) => ({ id, file, section: sectionOf(file) })),
    ...matches(sourceIdRe, text).map((id) => ({ id, file, section: "general" as SectionId })),
  ];
});
const glossaryCitations = glossary.map((t) => ({
  id: t.sourceId,
  file: "glossary.ts",
  section: "general" as SectionId,
}));
const allCitations = [...citations, ...glossaryCitations];

describe("source registry", () => {
  it("has unique ids", () => {
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length);
  });

  it("every citation points at a real source", () => {
    const missing = allCitations.filter((c) => !sourcesById.has(c.id));
    expect(missing.map((c) => `${c.id} in ${relative(root, c.file)}`)).toEqual([]);
  });

  it("every source is cited somewhere", () => {
    const used = new Set(allCitations.map((c) => c.id));
    expect(sources.filter((s) => !used.has(s.id)).map((s) => s.id)).toEqual([]);
  });

  it("each source is listed under every section that cites it", () => {
    const wrong = allCitations.filter((c) => {
      const s = sourcesById.get(c.id);
      return s && !s.sections.includes(c.section);
    });
    expect(wrong.map((c) => `${c.id} is cited in ${c.section} (${relative(root, c.file)})`)).toEqual([]);
  });

  it("every source has a link or a clear reason not to", () => {
    expect(sources.filter((s) => !s.url).map((s) => s.id)).toEqual([]);
  });

  it("SOURCES.md is up to date (run `npm run sources`)", () => {
    expect(readFileSync(join(root, "SOURCES.md"), "utf8")).toBe(renderSourcesMarkdown());
  });
});

describe("glossary", () => {
  it("has unique ids", () => {
    expect(new Set(glossary.map((t) => t.id)).size).toBe(glossary.length);
  });

  it("every <Term> used in content exists", () => {
    const used = contentFiles.flatMap((f) => matches(termRe, code(f)).map((id) => ({ id, f })));
    expect(used.filter((u) => !glossaryById.has(u.id)).map((u) => `${u.id} in ${relative(root, u.f)}`)).toEqual([]);
  });

  it("definitions are short enough to read in a popover", () => {
    for (const t of glossary) expect(t.definition.length, t.id).toBeLessThan(320);
  });
});

describe("lessons", () => {
  it("published lessons have an MDX file and a review date, planned ones don't have a file yet", () => {
    for (const l of lessons) {
      const file = join(src, "content", "lessons", l.section, `${l.slug}.mdx`);
      if (l.status === "published") {
        expect(existsSync(file), `${l.section}/${l.slug} is published but has no MDX file`).toBe(true);
        expect(l.lastReviewed, `${l.section}/${l.slug} needs lastReviewed`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      } else {
        expect(existsSync(file), `${l.section}/${l.slug} has an MDX file but is marked planned`).toBe(false);
      }
    }
  });

  it("published lessons end with key takeaways and common mistakes", () => {
    for (const l of lessons.filter((x) => x.status === "published")) {
      const text = readFileSync(join(src, "content", "lessons", l.section, `${l.slug}.mdx`), "utf8");
      expect(text, l.slug).toContain("<KeyTakeaways>");
      expect(text, l.slug).toContain("<CommonMistakes>");
    }
  });

  it("slugs are unique within a section", () => {
    const keys = lessons.map((l) => `${l.section}/${l.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("year-specific figures", () => {
  it("each states its tax year and links to an IRS page", () => {
    for (const f of figures) {
      expect(f.taxYear, f.id).toBeGreaterThanOrEqual(2024);
      expect(f.sourceUrl, f.id).toMatch(/^https:\/\/www\.irs\.gov\//);
    }
  });

  it("every <Fig> used in content exists", () => {
    const ids = new Set(figures.map((f) => f.id));
    const used = contentFiles.flatMap((f) => matches(/<Fig\s+id="([^"]+)"/g, code(f)));
    expect(used.filter((id) => !ids.has(id))).toEqual([]);
  });
});

describe("CONTENT_REVIEW.md", () => {
  it("is up to date (run `npm run review`)", async () => {
    const { renderContentReviewMarkdown } = await import("@/content/contentReviewMarkdown");
    expect(readFileSync(join(root, "CONTENT_REVIEW.md"), "utf8")).toBe(renderContentReviewMarkdown());
  });
});
