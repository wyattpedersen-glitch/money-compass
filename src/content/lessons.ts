import type { LessonMeta } from "./types.ts";

/**
 * Every lesson on the site, in reading order within each section. A lesson
 * is "published" once its MDX file exists at
 * src/content/lessons/<section>/<slug>.mdx (checked by tests).
 */
export const lessons: LessonMeta[] = [
  // ---- Understanding investing ----
  {
    section: "investing",
    slug: "why-invest",
    title: "Why invest at all",
    summary: "Inflation, the time value of money, and how compound growth works.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 8,
  },
  {
    section: "investing",
    slug: "risk-and-diversification",
    title: "Risk, return and diversification",
    summary: "Why spreading your money out is the closest thing to a free lunch.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 9,
  },
  {
    section: "investing",
    slug: "asset-classes",
    title: "Asset classes",
    summary: "Cash, bonds, stocks and real estate, and what each one does for you.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 8,
  },
  {
    section: "investing",
    slug: "index-vs-active",
    title: "Index funds vs. active management",
    summary: "What decades of evidence say about fees and performance.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 9,
  },
  {
    section: "investing",
    slug: "account-types",
    title: "Account types and tax advantages",
    summary: "401(k), 403(b), 457(b), IRAs, HSAs, and where your next dollar should go.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 11,
  },
  {
    section: "investing",
    slug: "behavioral-traps",
    title: "Behavioral traps",
    summary: "Market timing, overtrading, panic selling, and what to do when markets drop.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 9,
  },
  {
    section: "investing",
    slug: "simple-portfolio",
    title: "Building a simple portfolio",
    summary: "Three-fund portfolios, target-date funds, rebalancing and dollar-cost averaging.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 8,
  },
  {
    section: "investing",
    slug: "retirement-math",
    title: "Retirement math",
    summary: "How much is enough, safe withdrawal rates, and Social Security basics.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 10,
  },
  {
    section: "investing",
    slug: "be-skeptical",
    title: "Things to be skeptical of",
    summary: "Guaranteed high returns, trading courses, hot tips, high fees and crypto hype.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 7,
  },

  // ---- Budgeting ----
  {
    section: "budgeting",
    slug: "automation",
    title: "Why automatic beats willpower",
    summary: "Defaults, Save More Tomorrow, and how to set your plan on autopilot.",
    status: "published",
    lastReviewed: "2026-10-04",
    minutes: 6,
  },

  // ---- Credit, loans and debt ----
  {
    section: "credit",
    slug: "credit-scores",
    title: "Credit scores and reports",
    summary: "Who makes your score, what goes into it, and how to check and fix your report.",
    status: "planned",
  },
  {
    section: "credit",
    slug: "building-credit",
    title: "Building and repairing credit",
    summary: "Starting from nothing, what hurts your score, and common myths.",
    status: "planned",
  },
  {
    section: "credit",
    slug: "how-interest-works",
    title: "How interest and loans work",
    summary: "APR vs. APY, simple vs. compound interest, and amortization.",
    status: "planned",
  },
  {
    section: "credit",
    slug: "loan-types",
    title: "Types of loans",
    summary: "Credit cards, student loans, auto loans, mortgages, BNPL and payday loans.",
    status: "planned",
  },
  {
    section: "credit",
    slug: "debt-payoff",
    title: "Paying off debt",
    summary: "Avalanche vs. snowball, and what the evidence says about each.",
    status: "planned",
  },
  {
    section: "credit",
    slug: "rent-vs-buy",
    title: "Mortgages and rent vs. buy",
    summary: "How much house you can afford, and when renting wins.",
    status: "planned",
  },
  {
    section: "credit",
    slug: "getting-help",
    title: "When debt gets dangerous",
    summary: "Warning signs, credit counseling, and bankruptcy basics.",
    status: "planned",
  },
];

export const sectionPaths = {
  investing: "/investing",
  budgeting: "/budget",
  credit: "/credit",
} as const;

export function lessonHref(l: Pick<LessonMeta, "section" | "slug">): string {
  return `${sectionPaths[l.section]}/${l.slug}/`;
}

export function lessonsIn(section: LessonMeta["section"]): LessonMeta[] {
  return lessons.filter((l) => l.section === section);
}

export function publishedLessonsIn(section: LessonMeta["section"]): LessonMeta[] {
  return lessonsIn(section).filter((l) => l.status === "published");
}

export function findLesson(section: LessonMeta["section"], slug: string) {
  return lessons.find((l) => l.section === section && l.slug === slug);
}

/** Lesson whose href matches a path, if any (used by the Start here path). */
export function lessonForHref(href: string): LessonMeta | undefined {
  return lessons.find((l) => lessonHref(l) === href);
}
