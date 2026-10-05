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

### Sources whose link and claim haven't been re-checked (80 of 80)

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
- [ ] `markowitz-1952`: Portfolio Selection <https://doi.org/10.2307/2975974>
- [ ] `statman-1987`: How Many Stocks Make a Diversified Portfolio? <https://doi.org/10.2307/2330969>
- [ ] `bessembinder-2018`: Do Stocks Outperform Treasury Bills? <https://doi.org/10.1016/j.jfineco.2018.06.004>
- [ ] `sharpe-1991`: The Arithmetic of Active Management <https://doi.org/10.2469/faj.v47.n1.7>
- [ ] `fama-french-2010`: Luck versus Skill in the Cross-Section of Mutual Fund Returns <https://doi.org/10.1111/j.1540-6261.2010.01598.x>
- [ ] `fama-french-1993`: Common risk factors in the returns on stocks and bonds <https://doi.org/10.1016/0304-405X(93)90023-5>
- [ ] `carhart-1997`: On Persistence in Mutual Fund Performance <https://doi.org/10.1111/j.1540-6261.1997.tb03808.x>
- [ ] `spiva-us`: SPIVA U.S. Scorecard <https://www.spglobal.com/spdji/en/research-insights/spiva/>
- [ ] `kinnel-2016`: Fund Fees Predict Future Success or Failure <https://www.morningstar.com/funds/fund-fees-predict-future-success-or-failure>
- [ ] `bogle-2017`: The Little Book of Common Sense Investing (10th anniversary ed.) <https://www.wiley.com/en-us/The+Little+Book+of+Common+Sense+Investing%3A+The+Only+Way+to+Guarantee+Your+Fair+Share+of+Stock+Market+Returns%2C+10th+Anniversary+Edition-p-9781119404507>
- [ ] `sec-fees-bulletin`: Investor Bulletin: How Fees and Expenses Affect Your Investment Portfolio <https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf>
- [ ] `damodaran-returns`: Historical Returns on Stocks, Bonds, Bills and Real Estate (annual dataset, 1928 to present) <https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html>
- [ ] `barber-odean-2000`: Trading Is Hazardous to Your Wealth: The Common Stock Investment Performance of Individual Investors <https://doi.org/10.1111/0022-1082.00226>
- [ ] `barber-et-al-2014`: The cross-section of speculator skill: Evidence from day trading <https://doi.org/10.1016/j.finmar.2013.05.006>
- [ ] `kahneman-tversky-1979`: Prospect Theory: An Analysis of Decision under Risk <https://doi.org/10.2307/1914185>
- [ ] `tversky-kahneman-1992`: Advances in Prospect Theory: Cumulative Representation of Uncertainty <https://doi.org/10.1007/BF00122574>
- [ ] `tversky-kahneman-1974`: Judgment under Uncertainty: Heuristics and Biases <https://doi.org/10.1126/science.185.4157.1124>
- [ ] `morningstar-mind-the-gap-2024`: Mind the Gap 2024: A Report on Investor Returns in the US <https://www.morningstar.com/lp/mind-the-gap>
- [ ] `vanguard-dca-2012`: Dollar-cost averaging just means taking risk later <https://corporate.vanguard.com/content/dam/corp/research/pdf/Dollar-cost-averaging-just-means-taking-risk-later.pdf>
- [ ] `vanguard-rebalancing`: Best practices for portfolio rebalancing <https://corporate.vanguard.com/content/dam/corp/research/pdf/Best-practices-for-portfolio-rebalancing.pdf>
- [ ] `bogleheads-three-fund`: Three-fund portfolio <https://www.bogleheads.org/wiki/Three-fund_portfolio>
- [ ] `bogleheads-prioritizing`: Prioritizing investments <https://www.bogleheads.org/wiki/Prioritizing_investments>
- [ ] `investor-gov-asset-allocation`: Beginners' Guide to Asset Allocation, Diversification, and Rebalancing <https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset>
- [ ] `investor-gov-target-date`: Investor Bulletin: Target Date Retirement Funds <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/investor-14>
- [ ] `bengen-1994`: Determining Withdrawal Rates Using Historical Data <https://www.financialplanningassociation.org/sites/default/files/2021-04/MAR04%20Determining%20Withdrawal%20Rates%20Using%20Historical%20Data.pdf>
- [ ] `cooley-hubbard-walz-1998`: Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable <https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable>
- [ ] `finke-pfau-blanchett-2013`: The 4 Percent Rule Is Not Safe in a Low-Yield World <https://www.financialplanningassociation.org/article/journal/JUN13-4-percent-rule-not-safe-low-yield-world>
- [ ] `guyton-klinger-2006`: Decision Rules and Maximum Initial Withdrawal Rates <https://www.financialplanningassociation.org/article/journal/MAR06-decision-rules-and-maximum-initial-withdrawal-rates>
- [ ] `morningstar-retirement-income`: The State of Retirement Income <https://www.morningstar.com/lp/the-state-of-retirement-income>
- [ ] `ssa-retirement`: Retirement benefits <https://www.ssa.gov/benefits/retirement/>
- [ ] `ssa-my-account`: my Social Security account <https://www.ssa.gov/myaccount/>
- [ ] `ssa-full-retirement-age`: Retirement age and benefit reduction <https://www.ssa.gov/benefits/retirement/planner/agereduction.html>
- [ ] `ssa-fairness-act`: Social Security Fairness Act: Windfall Elimination Provision (WEP) and Government Pension Offset (GPO) <https://www.ssa.gov/benefits/retirement/social-security-fairness-act.html>
- [ ] `fed-inflation-target`: Why does the Federal Reserve aim for inflation of 2 percent over the longer run? <https://www.federalreserve.gov/faqs/economy_14400.htm>
- [ ] `fed-g19`: Consumer Credit – G.19 (interest rates on credit card plans) <https://www.federalreserve.gov/releases/g19/current/default.htm>
- [ ] `irs-pub-969`: Publication 969: Health Savings Accounts and Other Tax-Favored Health Plans <https://www.irs.gov/publications/p969>
- [ ] `irs-pub-590a`: Publication 590-A: Contributions to Individual Retirement Arrangements (IRAs) <https://www.irs.gov/publications/p590a>
- [ ] `irs-457b`: IRC 457(b) deferred compensation plans <https://www.irs.gov/retirement-plans/irc-457b-deferred-compensation-plans>
- [ ] `irs-403b`: IRC 403(b) tax-sheltered annuity plans <https://www.irs.gov/retirement-plans/irc-403b-tax-sheltered-annuity-plans>
- [ ] `investor-gov-red-flags`: Red flags of fraud <https://www.investor.gov/protect-your-investments/fraud/how-avoid-fraud/red-flags-fraud>
- [ ] `investor-gov-ponzi`: Ponzi scheme <https://www.investor.gov/protect-your-investments/fraud/types-fraud/ponzi-scheme>
- [ ] `investor-gov-crypto`: Crypto assets <https://www.investor.gov/additional-resources/spotlight/crypto-assets>
- [ ] `finra-day-trading`: Day trading <https://www.finra.org/investors/investing/investment-products/stocks/day-trading>
- [ ] `finra-brokercheck`: BrokerCheck <https://brokercheck.finra.org/>
- [ ] `fdic-deposit-insurance`: Deposit insurance <https://www.fdic.gov/resources/deposit-insurance>
- [ ] `sec-interest-rate-risk`: Investor Bulletin: Interest Rate Risk — When Interest Rates Go Up, Prices of Fixed-Rate Bonds Fall <https://www.sec.gov/files/ib_interestraterisk.pdf>
- [ ] `treasurydirect-tips`: Treasury Inflation-Protected Securities (TIPS) and I bonds <https://www.treasurydirect.gov/marketable-securities/tips/>
- [ ] `irs-topic-558`: Topic no. 558, Additional tax on early distributions from retirement plans other than IRAs <https://www.irs.gov/taxtopics/tc558>
- [ ] `irs-topic-409`: Topic no. 409, Capital gains and losses <https://www.irs.gov/taxtopics/tc409>
- [ ] `irs-pub-590b`: Publication 590-B: Distributions from Individual Retirement Arrangements (IRAs) <https://www.irs.gov/publications/p590b>
- [ ] `dalbar-qaib`: Quantitative Analysis of Investor Behavior (QAIB) <https://www.dalbar.com/>
- [ ] `spdji-sp500`: S&P 500 index <https://www.spglobal.com/spdji/en/indices/equity/sp-500/>
- [ ] `ssa-trustees`: The Annual Report of the Board of Trustees of the Federal Old-Age and Survivors Insurance and Federal Disability Insurance Trust Funds <https://www.ssa.gov/oact/TR/>
- [ ] `sec-variable-annuities`: Variable Annuities: What You Should Know <https://www.sec.gov/investor/pubs/varannty.htm>
- [ ] `sec-iapd`: Investment Adviser Public Disclosure <https://adviserinfo.sec.gov/>
- [ ] `sec-bitcoin-etp-2024`: Statement on the Approval of Spot Bitcoin Exchange-Traded Products <https://www.sec.gov/newsroom/speeches-statements/gensler-statement-spot-bitcoin-011023>
- [ ] `warren-tyagi-2005`: All Your Worth: The Ultimate Lifetime Money Plan <https://www.simonandschuster.com/books/All-Your-Worth/Elizabeth-Warren/9780743269872>
- [ ] `pyhrr-1970`: Zero-base budgeting <https://hbr.org/1970/11/zero-base-budgeting>
- [ ] `clason-1926`: The Richest Man in Babylon <https://www.gutenberg.org/ebooks/search/?query=richest+man+in+babylon>
- [ ] `thaler-benartzi-2004`: Save More Tomorrow: Using Behavioral Economics to Increase Employee Saving <https://doi.org/10.1086/380085>
- [ ] `madrian-shea-2001`: The Power of Suggestion: Inertia in 401(k) Participation and Savings Behavior <https://doi.org/10.1162/003355301753265543>
- [ ] `johnson-goldstein-2003`: Do Defaults Save Lives? <https://doi.org/10.1126/science.1091721>
- [ ] `fed-shed`: Economic Well-Being of U.S. Households (Survey of Household Economics and Decisionmaking) <https://www.federalreserve.gov/consumerscommunities/shed.htm>
- [ ] `cfpb-bank-statements`: Spending tracker (Your Money, Your Goals tool) <https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_spending-tracker_tool.pdf>

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

### Take-home pay estimator figures (tax year 2026) ⚠️ not yet confirmed

- Single-filer brackets: 10% from $0, 12% from $12,400, 22% from $50,400, 24% from $105,700, 32% from $201,775, 35% from $256,225, 37% from $640,600
- Standard deduction (single): $16,100
- Social Security: 6.2% up to $184,500; Medicare: 1.45%
- Source: IRS: Federal income tax rates and brackets <https://www.irs.gov/filing/federal-income-tax-rates-and-brackets>
- Source: IRS: Topic no. 751, Social Security and Medicare withholding rates <https://www.irs.gov/taxtopics/tc751>
- Source: SSA: Contribution and benefit base <https://www.ssa.gov/oact/cola/cbb.html>

### Lesson review dates (10 published of 17 planned)

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
