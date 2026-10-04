export type SectionId = "general" | "investing" | "budgeting" | "credit";

export const sectionLabels: Record<SectionId, string> = {
  general: "General and glossary",
  investing: "Understanding investing",
  budgeting: "Budgeting plan and tracker",
  credit: "Credit, loans and debt",
};

export type SourceKind = "academic" | "government" | "regulator" | "industry" | "practitioner";

export interface Source {
  /** Stable id used by <Cite id="..."/>. Lowercase, hyphenated. */
  id: string;
  /** Authors or the publishing institution. */
  authors: string;
  title: string;
  /** Journal, publisher or website, when different from the authors. */
  publisher?: string;
  /** Publication year, or "updated regularly" for living web pages. */
  year: number | "updated regularly";
  url?: string;
  kind: SourceKind;
  /** Sections whose pages cite this source. Checked by tests. */
  sections: SectionId[];
  /** Short note on what this source supports, shown on /sources. */
  note?: string;
  /**
   * ISO date the link and the cited claim were last checked against the
   * live source. Undefined means not yet checked; CONTENT_REVIEW.md lists
   * every unchecked source.
   */
  checked?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  /** Other spellings people search for (e.g. "annual percentage rate"). */
  aliases?: string[];
  /** One or two plain-English sentences. */
  definition: string;
  /** Source id backing the definition. */
  sourceId: string;
  /** Lesson or page where the term is explained in depth. */
  learnMore?: string;
}

export type LessonStatus = "published" | "planned";

export interface LessonMeta {
  section: Exclude<SectionId, "general">;
  slug: string;
  title: string;
  summary: string;
  status: LessonStatus;
  /** ISO date the lesson's content was last reviewed. */
  lastReviewed?: string;
  /** Rough reading time in minutes. */
  minutes?: number;
}

export interface Figure {
  id: string;
  label: string;
  value: number;
  unit: "usd" | "percent";
  /** The tax year the figure applies to. */
  taxYear: number;
  /** The IRS (or other primary) page that states the figure. */
  sourceUrl: string;
  sourceTitle: string;
  /** ISO date the value was confirmed against the source page. */
  checked?: string;
}
