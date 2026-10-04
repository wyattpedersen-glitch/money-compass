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

### Sources whose link and claim haven't been re-checked (16 of 16)

These were cited from well-known primary sources but the live page wasn't re-opened when the content was written. Check each, then set `checked` in `src/content/sources.ts`.

- [ ] `investor-gov-glossary`: Investor.gov Glossary <https://www.investor.gov/introduction-investing/investing-basics/glossary>
- [ ] `cfpb-apr-vs-interest`: What is the difference between a loan interest rate and the APR? <https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/>
- [ ] `cfpb-reg-dd`: Regulation DD (Truth in Savings), 12 CFR Part 1030 <https://www.consumerfinance.gov/rules-policy/regulations/1030/>
- [ ] `cfpb-credit-score`: What is a credit score? <https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-score-en-315/>
- [ ] `cfpb-credit-report`: What is a credit report? <https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-report-en-309/>
- [ ] `cfpb-emergency-fund`: An essential guide to building an emergency fund <https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/>
- [ ] `cfpb-your-money-your-goals`: Your Money, Your Goals: A financial empowerment toolkit <https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/>
- [ ] `irs-tax-withholding`: Tax withholding <https://www.irs.gov/payments/tax-withholding>
- [ ] `irs-401k-plans`: 401(k) plans <https://www.irs.gov/retirement-plans/401k-plans>
- [ ] `irs-iras`: Individual retirement arrangements (IRAs) <https://www.irs.gov/retirement-plans/individual-retirement-arrangements-iras>
- [ ] `irs-roth-iras`: Roth IRAs <https://www.irs.gov/retirement-plans/roth-iras>
- [ ] `bls-cpi`: Consumer Price Index (CPI) <https://www.bls.gov/cpi/>
- [ ] `cfpb-financial-advisor`: Choosing a financial advisor <https://www.consumerfinance.gov/consumer-tools/retirement/choosing-financial-advisor/>
- [ ] `hud-housing-counselors`: Find a HUD-approved housing counseling agency <https://www.hud.gov/counseling>
- [ ] `nfcc`: NFCC: nonprofit credit counseling <https://www.nfcc.org/>
- [ ] `irs-choosing-tax-pro`: Choosing a tax professional <https://www.irs.gov/tax-professionals/choosing-a-tax-professional>

### Year-specific figures awaiting confirmation (6 of 6)

| Figure | Value | Tax year | Source |
| --- | --- | --- | --- |
| 401(k), 403(b) and most 457(b) employee contribution limit ⚠️ | $24,500 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits> |
| 401(k) catch-up contribution, age 50 and over ⚠️ | $8,000 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions> |
| IRA contribution limit (traditional and Roth combined) ⚠️ | $7,500 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits> |
| IRA catch-up contribution, age 50 and over ⚠️ | $1,100 | 2026 | <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits> |
| HSA contribution limit, self-only coverage ⚠️ | $4,400 | 2026 | <https://www.irs.gov/publications/p969> |
| HSA contribution limit, family coverage ⚠️ | $8,750 | 2026 | <https://www.irs.gov/publications/p969> |

⚠️ means the value hasn't been confirmed against the IRS page yet.

### Lesson review dates (0 published of 17 planned)

No lessons published yet.
