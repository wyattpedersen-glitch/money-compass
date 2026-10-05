# Content review

<!-- Generated from src/content/*.ts by `npm run review`. Edit the generator, not this file. -->

How to keep the facts on this site correct and current.

## Every year (November to January)

The IRS announces next year's retirement contribution limits around October or November and inflation adjustments to tax brackets in the fall. HSA limits are usually announced in the spring.

- [ ] Update every entry in `src/content/figures.ts`: change `value` and `taxYear`, confirm the `sourceUrl` still states it, and set `checked` to today's date.
- [ ] Search lessons for any year mentioned in prose (`rg "20[0-9][0-9]" src/content/lessons`) and confirm each is still right.
- [ ] Re-run `npm test` (it checks every figure states a tax year and an IRS link).

## Every six months

- [ ] Click through every link on `/sources` and confirm it still works and still supports the claim. Set `checked` on each source in `src/content/sources.ts`.
- [ ] Check for newer editions of recurring research (SPIVA scorecards, Morningstar *Mind the Gap*, Vanguard and Morningstar fee studies, FICO factor weights, CFPB reports). Update the citation and any numbers quoted from it.
- [ ] Update the `lastReviewed` date on each lesson you reviewed in `src/content/lessons.ts`.

## Whenever a lesson changes

- [ ] Every new claim, number or rule of thumb has a `<Cite>` to a source in the registry.
- [ ] Every new term is in the glossary and wrapped in `<Term>` the first time it appears.
- [ ] The lesson still ends with `<KeyTakeaways>` and `<CommonMistakes>`.
- [ ] `npm run sources && npm run review && npm test` all pass.

## Current status

### Sources whose link and claim haven't been re-checked (4 of 118)

These were cited from well-known primary sources but the live page wasn't re-opened when the content was written. Check each, then set `checked` in `src/content/sources.ts`.

- [ ] `bogleheads-three-fund`: Three-fund portfolio <https://www.bogleheads.org/wiki/Three-fund_portfolio>
- [ ] `studentaid-loans`: Subsidized and Unsubsidized Loans <https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized>
- [ ] `studentaid-rates`: Federal Interest Rates and Fees <https://studentaid.gov/understand-aid/types/loans/interest-rates>
- [ ] `studentaid-pslf`: Public Service Loan Forgiveness (PSLF) <https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service>

### Year-specific figures awaiting confirmation (0 of 6)

| Figure | Value | Tax year | Source |
| --- | --- | --- | --- |
| 401(k), 403(b) and most 457(b) employee contribution limit | $24,500 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits> |
| 401(k) catch-up contribution, age 50 and over | $8,000 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions> |
| IRA contribution limit (traditional and Roth combined) | $7,500 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits> |
| IRA catch-up contribution, age 50 and over | $1,100 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits> |
| HSA contribution limit, self-only coverage | $4,400 | 2026 | <https://www.irs.gov/pub/irs-drop/rp-25-19.pdf> |
| HSA contribution limit, family coverage | $8,750 | 2026 | <https://www.irs.gov/pub/irs-drop/rp-25-19.pdf> |

⚠️ means the value hasn't been confirmed against the IRS page yet.

### Take-home pay estimator figures (tax year 2026), checked 2026-10-05

- Single-filer brackets: 10% from $0, 12% from $12,400, 22% from $50,400, 24% from $105,700, 32% from $201,775, 35% from $256,225, 37% from $640,600
- Standard deduction (single): $16,100
- Social Security: 6.2% up to $184,500; Medicare: 1.45%
- Source: IRS: Tax inflation adjustments for tax year 2026 <https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill>
- Source: IRS: Topic no. 751, Social Security and Medicare withholding rates <https://www.irs.gov/taxtopics/tc751>
- Source: SSA: Contribution and benefit base <https://www.ssa.gov/oact/cola/cbb.html>

### Lesson review dates (17 published of 17 planned)

| Lesson | Last reviewed |
| --- | --- |
| investing/why-invest | 2026-10-04 |
| investing/risk-and-diversification | 2026-10-04 |
| investing/asset-classes | 2026-10-04 |
| investing/index-vs-active | 2026-10-04 |
| investing/account-types | 2026-10-04 |
| investing/behavioral-traps | 2026-10-04 |
| investing/simple-portfolio | 2026-10-04 |
| investing/retirement-math | 2026-10-04 |
| investing/be-skeptical | 2026-10-04 |
| budgeting/automation | 2026-10-04 |
| credit/credit-scores | 2026-10-04 |
| credit/building-credit | 2026-10-04 |
| credit/how-interest-works | 2026-10-04 |
| credit/loan-types | 2026-10-04 |
| credit/debt-payoff | 2026-10-04 |
| credit/rent-vs-buy | 2026-10-04 |
| credit/getting-help | 2026-10-04 |
