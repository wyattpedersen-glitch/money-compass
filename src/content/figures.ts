import type { Figure } from "./types.ts";

/**
 * Numbers that change every year (contribution limits, tax brackets, and so
 * on). Lessons read from here instead of hard-coding values, so updating a
 * figure updates every page that mentions it. CONTENT_REVIEW.md explains
 * when and how to refresh these.
 *
 * `checked` is set only once a value has been confirmed against the linked
 * IRS page. Values without it are shown on the site with an
 * "unverified" note.
 */
export const figures: Figure[] = [
  {
    id: "401k-elective-deferral-limit",
    label: "401(k), 403(b) and most 457(b) employee contribution limit",
    value: 24500,
    unit: "usd",
    taxYear: 2026,
    sourceUrl:
      "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits",
    checked: "2026-10-05",
    sourceTitle: "IRS: Retirement topics, 401(k) and profit-sharing plan contribution limits",
  },
  {
    id: "401k-catch-up-50",
    label: "401(k) catch-up contribution, age 50 and over",
    value: 8000,
    unit: "usd",
    taxYear: 2026,
    sourceUrl:
      "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions",
    checked: "2026-10-05",
    sourceTitle: "IRS: Retirement topics, catch-up contributions",
  },
  {
    id: "ira-contribution-limit",
    label: "IRA contribution limit (traditional and Roth combined)",
    value: 7500,
    unit: "usd",
    taxYear: 2026,
    sourceUrl:
      "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits",
    checked: "2026-10-05",
    sourceTitle: "IRS: Retirement topics, IRA contribution limits",
  },
  {
    id: "ira-catch-up-50",
    label: "IRA catch-up contribution, age 50 and over",
    value: 1100,
    unit: "usd",
    taxYear: 2026,
    sourceUrl:
      "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits",
    checked: "2026-10-05",
    sourceTitle: "IRS: Retirement topics, IRA contribution limits",
  },
  {
    id: "hsa-limit-self",
    label: "HSA contribution limit, self-only coverage",
    value: 4400,
    unit: "usd",
    taxYear: 2026,
    sourceUrl: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf",
    checked: "2026-10-05",
    sourceTitle: "IRS Revenue Procedure 2025-19 (2026 HSA limits)",
  },
  {
    id: "hsa-limit-family",
    label: "HSA contribution limit, family coverage",
    value: 8750,
    unit: "usd",
    taxYear: 2026,
    sourceUrl: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf",
    checked: "2026-10-05",
    sourceTitle: "IRS Revenue Procedure 2025-19 (2026 HSA limits)",
  },
];

export const figuresById: ReadonlyMap<string, Figure> = new Map(figures.map((f) => [f.id, f]));

export function getFigure(id: string): Figure {
  const f = figuresById.get(id);
  if (!f) throw new Error(`Unknown figure id "${id}". Add it to src/content/figures.ts.`);
  return f;
}

export function formatFigure(f: Figure): string {
  if (f.unit === "percent") return `${f.value}%`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(f.value);
}
