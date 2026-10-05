import type { Source } from "./types.ts";

/**
 * Every reference the site uses. Pages cite these with <Cite id="..." />.
 * Tests fail if a page cites an id that isn't here, if a source here is never
 * used, or if SOURCES.md is out of date (regenerate with `npm run sources`).
 *
 * `checked` records when the link and claim were confirmed against the live
 * page. Sources without it are listed in CONTENT_REVIEW.md as unverified.
 */
export const sources: Source[] = [
  {
    id: "investor-gov-glossary",
    authors: "U.S. Securities and Exchange Commission, Office of Investor Education and Advocacy",
    title: "Investor.gov Glossary",
    publisher: "Investor.gov",
    year: "updated regularly",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary",
    kind: "regulator",
    sections: ["general"],
    note: "Plain-language definitions of investing terms from the SEC.",
  },
  {
    id: "cfpb-apr-vs-interest",
    authors: "Consumer Financial Protection Bureau",
    title: "What is the difference between a loan interest rate and the APR?",
    publisher: "Ask CFPB",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/",
    kind: "regulator",
    sections: ["general"],
    note: "APR includes the interest rate plus certain fees, expressed as a yearly rate.",
  },
  {
    id: "cfpb-reg-dd",
    authors: "Consumer Financial Protection Bureau",
    title: "Regulation DD (Truth in Savings), 12 CFR Part 1030",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/rules-policy/regulations/1030/",
    kind: "regulator",
    sections: ["general"],
    note: "The federal rule that requires banks to disclose savings rates as an annual percentage yield (APY).",
  },
  {
    id: "cfpb-credit-score",
    authors: "Consumer Financial Protection Bureau",
    title: "What is a credit score?",
    publisher: "Ask CFPB",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-score-en-315/",
    kind: "regulator",
    sections: ["general"],
  },
  {
    id: "cfpb-credit-report",
    authors: "Consumer Financial Protection Bureau",
    title: "What is a credit report?",
    publisher: "Ask CFPB",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-report-en-309/",
    kind: "regulator",
    sections: ["general"],
  },
  {
    id: "cfpb-emergency-fund",
    authors: "Consumer Financial Protection Bureau",
    title: "An essential guide to building an emergency fund",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
    kind: "regulator",
    sections: ["general"],
  },
  {
    id: "cfpb-your-money-your-goals",
    authors: "Consumer Financial Protection Bureau",
    title: "Your Money, Your Goals: A financial empowerment toolkit",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/",
    kind: "regulator",
    sections: ["general"],
    note: "CFPB's toolkit for budgeting, saving and managing debt.",
  },
  {
    id: "irs-tax-withholding",
    authors: "Internal Revenue Service",
    title: "Tax withholding",
    year: "updated regularly",
    url: "https://www.irs.gov/payments/tax-withholding",
    kind: "government",
    sections: ["general"],
  },
  {
    id: "irs-401k-plans",
    authors: "Internal Revenue Service",
    title: "401(k) plans",
    year: "updated regularly",
    url: "https://www.irs.gov/retirement-plans/401k-plans",
    kind: "government",
    sections: ["general"],
  },
  {
    id: "irs-iras",
    authors: "Internal Revenue Service",
    title: "Individual retirement arrangements (IRAs)",
    year: "updated regularly",
    url: "https://www.irs.gov/retirement-plans/individual-retirement-arrangements-iras",
    kind: "government",
    sections: ["general"],
  },
  {
    id: "irs-roth-iras",
    authors: "Internal Revenue Service",
    title: "Roth IRAs",
    year: "updated regularly",
    url: "https://www.irs.gov/retirement-plans/roth-iras",
    kind: "government",
    sections: ["general"],
  },
  {
    id: "bls-cpi",
    authors: "U.S. Bureau of Labor Statistics",
    title: "Consumer Price Index (CPI)",
    year: "updated regularly",
    url: "https://www.bls.gov/cpi/",
    kind: "government",
    sections: ["general"],
    note: "The official U.S. measure of inflation for consumer prices.",
  },
  {
    id: "cfpb-financial-advisor",
    authors: "Consumer Financial Protection Bureau",
    title: "Choosing a financial advisor",
    publisher: "Ask CFPB",
    year: "updated regularly",
    url: "https://www.consumerfinance.gov/consumer-tools/retirement/choosing-financial-advisor/",
    kind: "regulator",
    sections: ["general"],
    note: "How to check an advisor's background and whether they act as a fiduciary.",
  },
  {
    id: "hud-housing-counselors",
    authors: "U.S. Department of Housing and Urban Development",
    title: "Find a HUD-approved housing counseling agency",
    year: "updated regularly",
    url: "https://www.hud.gov/counseling",
    kind: "government",
    sections: ["general"],
  },
  {
    id: "nfcc",
    authors: "National Foundation for Credit Counseling",
    title: "NFCC: nonprofit credit counseling",
    year: "updated regularly",
    url: "https://www.nfcc.org/",
    kind: "practitioner",
    sections: ["general"],
    note: "The largest U.S. network of nonprofit credit counseling agencies.",
  },
  {
    id: "irs-choosing-tax-pro",
    authors: "Internal Revenue Service",
    title: "Choosing a tax professional",
    year: "updated regularly",
    url: "https://www.irs.gov/tax-professionals/choosing-a-tax-professional",
    kind: "government",
    sections: ["general"],
  },
];

export const sourcesById: ReadonlyMap<string, Source> = new Map(sources.map((s) => [s.id, s]));

export function getSource(id: string): Source {
  const s = sourcesById.get(id);
  if (!s) throw new Error(`Unknown source id "${id}". Add it to src/content/sources.ts.`);
  return s;
}

/** A short "Author, Year" label for inline citations. */
export function shortCitation(s: Source): string {
  const shortAuthor = institutionShortName(s.authors);
  return typeof s.year === "number" ? `${shortAuthor}, ${s.year}` : shortAuthor;
}

const institutionAbbreviations: Array<[RegExp, string]> = [
  [/Securities and Exchange Commission/, "SEC"],
  [/Consumer Financial Protection Bureau/, "CFPB"],
  [/Federal Trade Commission/, "FTC"],
  [/Internal Revenue Service/, "IRS"],
  [/Bureau of Labor Statistics/, "BLS"],
  [/Housing and Urban Development/, "HUD"],
  [/Financial Industry Regulatory Authority/, "FINRA"],
  [/Federal Reserve/, "Federal Reserve"],
  [/National Foundation for Credit Counseling/, "NFCC"],
];

function institutionShortName(authors: string): string {
  for (const [re, abbr] of institutionAbbreviations) {
    if (re.test(authors)) return abbr;
  }
  // People: "Sharpe, W. F." -> "Sharpe"; "Barber, B. M. & Odean, T." -> "Barber & Odean".
  const people = authors
    .split(/\s*(?:&|\band\b)\s*/)
    .flatMap((part) => part.split(/,\s*(?=[A-Z][a-z])/))
    .map((a) => a.split(",")[0].trim());
  if (people.length > 2) return `${people[0]} et al.`;
  return people.join(" & ");
}

/** Full reference in a consistent, readable format. */
export function fullCitation(s: Source): string {
  const year = typeof s.year === "number" ? ` (${s.year}).` : ".";
  const publisher = s.publisher ? ` ${s.publisher}.` : "";
  return `${s.authors}${year} ${s.title}${endPunct(s.title)}${publisher}`;
}

/** A period after a title, unless it already ends in punctuation. */
export function endPunct(title: string): string {
  return /[.?!]$/.test(title) ? "" : ".";
}
