/**
 * Site-wide settings. This is the one file to edit for names, the default
 * learning path, and onboarding behavior.
 */
export const siteConfig = {
  name: "Epicurus & Co.",
  tagline: "A calm, well-sourced guide to money.",
  reader: "Daniel",

  /**
   * When true, the onboarding quiz is skipped and the home page sends the
   * reader straight to the "Start here" path below. The quiz stays available
   * from the home page as an optional extra.
   */
  skipOnboardingQuiz: true,

  /**
   * The default "Start here" path, in order. Each step links to a page or
   * lesson. Steps whose lesson isn't published yet show as "coming soon".
   * Tailored to Daniel: a student heading into a master's, then a few years
   * of public-sector work, then a PhD.
   */
  startHere: [
    {
      title: "Know where your money goes",
      why: "Every other step depends on knowing what comes in and what goes out.",
      href: "/budget/",
    },
    {
      title: "Build a starter emergency fund",
      why: "A cash cushion keeps a surprise bill from turning into credit card debt.",
      href: "/budget/goals/",
    },
    {
      title: "Understand credit before you need it",
      why: "A good credit history makes renting an apartment and borrowing cheaper.",
      href: "/credit/credit-scores/",
    },
    {
      title: "Learn how student loans work",
      why: "Grad school may involve borrowing, and federal and private loans differ a lot.",
      href: "/credit/loan-types/",
    },
    {
      title: "Start investing basics",
      why: "Time is the biggest ingredient in compound growth, and you have a lot of it.",
      href: "/investing/why-invest/",
    },
  ],

  /** The date the site-wide content was last reviewed as a whole. */
  siteLastReviewed: "2026-10-04",
} as const;

export type StartHereStep = (typeof siteConfig.startHere)[number];
