import type { GlossaryTerm } from "./types";

/**
 * Plain-English glossary. Lessons wrap terms with <Term id="...">text</Term>
 * to show the definition on hover, tap, or keyboard focus. Every definition
 * is backed by a source in sources.ts.
 */
export const glossary: GlossaryTerm[] = [
  {
    id: "apr",
    term: "APR (annual percentage rate)",
    aliases: ["annual percentage rate"],
    definition:
      "The yearly cost of borrowing, including the interest rate plus certain fees, expressed as a percentage. It's the number to compare when shopping for loans.",
    sourceId: "cfpb-apr-vs-interest",
  },
  {
    id: "apy",
    term: "APY (annual percentage yield)",
    aliases: ["annual percentage yield"],
    definition:
      "How much a savings account actually earns in a year once compounding is included. Banks must quote savings rates this way so accounts can be compared fairly.",
    sourceId: "cfpb-reg-dd",
  },
  {
    id: "interest-rate",
    term: "Interest rate",
    definition:
      "The percentage a lender charges you to borrow money, or a bank pays you to hold your money, usually stated per year.",
    sourceId: "cfpb-apr-vs-interest",
  },
  {
    id: "compound-interest",
    term: "Compound interest",
    aliases: ["compounding", "compound growth"],
    definition:
      "Interest earned on your original money and on the interest it has already earned. Over long periods this snowballs, which is why starting early matters so much.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "inflation",
    term: "Inflation",
    definition:
      "The general rise in prices over time, which means each dollar buys a little less each year. In the U.S. it's usually measured by the Consumer Price Index (CPI).",
    sourceId: "bls-cpi",
  },
  {
    id: "stock",
    term: "Stock",
    aliases: ["share", "equity"],
    definition:
      "A small piece of ownership in a company. Stock prices go up and down with the company's prospects and the market's mood.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "bond",
    term: "Bond",
    definition:
      "A loan you make to a government or company. In return they promise to pay you interest and give your money back on a set date.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "mutual-fund",
    term: "Mutual fund",
    definition:
      "A pool of money from many investors that buys a collection of stocks, bonds or other investments. Owning one share gives you a slice of everything in the pool.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "etf",
    term: "ETF (exchange-traded fund)",
    aliases: ["exchange-traded fund"],
    definition:
      "A fund, like a mutual fund, that holds many investments but trades on a stock exchange throughout the day like a single stock.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "index-fund",
    term: "Index fund",
    definition:
      "A fund that tries to match a market index (a list such as the 500 largest U.S. companies) instead of trying to beat it. Index funds usually have low fees.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "diversification",
    term: "Diversification",
    definition: "Spreading your money across many different investments so that one bad result doesn't sink you.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "expense-ratio",
    term: "Expense ratio",
    definition:
      "The yearly fee a fund charges, shown as a percentage of the money you have invested in it. A 0.05% expense ratio costs $5 a year per $10,000 invested.",
    sourceId: "investor-gov-glossary",
  },
  {
    id: "credit-score",
    term: "Credit score",
    aliases: ["FICO score", "credit rating"],
    definition:
      "A three-digit number that predicts how likely you are to repay a loan on time, calculated from your credit report. Lenders, landlords and insurers may use it.",
    sourceId: "cfpb-credit-score",
  },
  {
    id: "credit-report",
    term: "Credit report",
    definition:
      "A record of your borrowing and repayment history kept by the credit bureaus (Equifax, Experian and TransUnion). You can get yours free.",
    sourceId: "cfpb-credit-report",
  },
  {
    id: "emergency-fund",
    term: "Emergency fund",
    aliases: ["emergency savings", "rainy day fund"],
    definition:
      "Cash set aside only for unexpected costs or a loss of income, kept somewhere safe and easy to reach, like a savings account.",
    sourceId: "cfpb-emergency-fund",
  },
  {
    id: "budget",
    term: "Budget",
    aliases: ["spending plan"],
    definition:
      "A plan for how your money will be used each month: what comes in, what goes out, and what's set aside for goals.",
    sourceId: "cfpb-your-money-your-goals",
  },
  {
    id: "take-home-pay",
    term: "Take-home pay",
    aliases: ["net pay", "net income"],
    definition:
      "What actually lands in your bank account after taxes and other deductions are taken out of your paycheck. Budgets should be built on this number, not on your salary.",
    sourceId: "irs-tax-withholding",
  },
  {
    id: "401k",
    term: "401(k)",
    aliases: ["401k", "403(b)", "457(b)"],
    definition:
      "A retirement savings account offered through an employer, where money comes straight out of your paycheck, often with tax benefits and sometimes a matching contribution from your employer. Public employers often offer similar 403(b) or 457(b) plans.",
    sourceId: "irs-401k-plans",
  },
  {
    id: "ira",
    term: "IRA (individual retirement arrangement)",
    aliases: ["individual retirement account", "traditional IRA"],
    definition:
      "A tax-advantaged retirement account you open yourself, separate from any employer. You generally need earned income (such as wages) to contribute.",
    sourceId: "irs-iras",
  },
  {
    id: "roth-ira",
    term: "Roth IRA",
    aliases: ["roth"],
    definition:
      "An IRA you fund with money you've already paid tax on. In exchange, qualified withdrawals in retirement, including all the growth, are tax-free.",
    sourceId: "irs-roth-iras",
  },
  {
    id: "fiduciary",
    term: "Fiduciary",
    aliases: ["fee-only fiduciary"],
    definition:
      "An advisor who is legally required to put your interests first. A fee-only fiduciary is paid only by you, not by commissions on products they sell you.",
    sourceId: "cfpb-financial-advisor",
  },
];

export const glossaryById: ReadonlyMap<string, GlossaryTerm> = new Map(glossary.map((t) => [t.id, t]));

export function getTerm(id: string): GlossaryTerm {
  const t = glossaryById.get(id);
  if (!t) throw new Error(`Unknown glossary id "${id}". Add it to src/content/glossary.ts.`);
  return t;
}

/** Case-insensitive search over term names, aliases and definitions. */
export function searchGlossary(query: string, terms = glossary): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  if (!q) return sorted;
  const scored = sorted
    .map((t) => {
      const name = t.term.toLowerCase();
      const aliases = (t.aliases ?? []).map((a) => a.toLowerCase());
      let score = 0;
      if (name.startsWith(q) || aliases.some((a) => a.startsWith(q))) score = 3;
      else if (name.includes(q) || aliases.some((a) => a.includes(q))) score = 2;
      else if (t.definition.toLowerCase().includes(q)) score = 1;
      return { t, score };
    })
    .filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((x) => x.t);
}
