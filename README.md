# Epicurus & Co.

A private, well-sourced guide to personal finance, built for one reader: Daniel. It covers budgeting (with a working
plan and tracker), credit and debt, and investing. Everything is explained in plain English, and every claim cites its
source.

- **Static site.** Next.js (App Router) + TypeScript + Tailwind, exported to plain HTML/JS. No server, no accounts.
- **Private data.** Everything Daniel enters is saved in his browser (localStorage) and never leaves the device. The
  settings page has JSON export/import to back it up or move it between devices.
- **Tested math.** Every calculator is a pure TypeScript function in `src/lib/finance/`, tested against textbook
  values with Vitest.

## Running it locally

You need Node.js 22.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + tests
npm run build      # static export into ./out
```

Handy URLs while developing:

- `/?glitch=now` triggers the home page greeting's easter egg immediately. (It never runs if your device has
  "reduce motion" turned on.)
- `/quiz/` is the optional "Where should I start?" quiz. `/progress/` shows completed lessons.

## Before you send the link to Daniel

1. **Skim the four unchecked sources.** Every other link, claim and 2026 figure was checked against the live page on
   2026-10-05 (`checked` in `src/content/sources.ts`, `figures.ts` and `taxFigures.ts`). The four left are listed in
   `CONTENT_REVIEW.md`: three StudentAid.gov pages that only render in a browser, and one Bogleheads wiki page that
   blocked automated access. Open each, confirm it supports the claim, set `checked`, then run
   `npm run sources && npm run review`.
2. **Set the passcode** (below).
3. **Open the site on your phone** and try a lesson, the budget setup and a calculator.

## Deploying to Vercel (free tier)

The site is a static export, so Vercel's free Hobby plan is plenty.

### 1. Create the Vercel project

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account (choose the **Hobby** plan).
2. Click **Add New… → Project**.
3. Find `money-compass` in the list of your GitHub repositories and click **Import**. If it isn't listed, click
   **Adjust GitHub App Permissions** and give Vercel access to the repo.
4. Leave the framework preset as **Next.js** and the build settings as they are. Vercel detects the static export on
   its own.

### 2. Set the passcode

Before the first deploy, still on the import screen:

1. Pick a passcode for Daniel. On your own computer, in this repo, run:

   ```bash
   npm run hash-passcode -- "the passcode you picked"
   ```

   It prints a long string of letters and numbers (a hash of the passcode).

2. Open **Environment Variables** and add:
   - **Name:** `NEXT_PUBLIC_PASSCODE_HASH`
   - **Value:** the string the command printed

3. Click **Deploy**.

To change the passcode later, update the variable in **Project → Settings → Environment Variables**, then redeploy
(**Deployments → ⋯ → Redeploy**). Every device will be asked for the new passcode once.

If the variable isn't set, the site works with no passcode at all, which is handy for local development.

### 3. Get the shareable URL

When the deploy finishes, Vercel shows a URL like `https://money-compass-yourname.vercel.app`. That's the link to
send Daniel. You can rename it under **Project → Settings → Domains** (for example to `epicurus-and-co.vercel.app`, if
it's free).

From then on, every push to `main` redeploys the site automatically, and every pull request gets its own preview URL.

### About the passcode (please read)

The passcode is a **courtesy lock, not real security**. It keeps casual visitors and search engines out, and the site
asks search engines not to index it. But the site's files are publicly downloadable by anyone who has the URL, and
someone who reads the JavaScript could get past the gate.

That's fine here because **there is nothing sensitive on the server to protect.** The lessons are general education,
and everything Daniel types (budget, goals, tracker) is stored only in his own browser. It is never uploaded anywhere.

## How the content stays accurate

Accuracy is the most important requirement, so it's enforced by tests, not just by care.

- **Sources** live in `src/content/sources.ts`. Pages cite them with `<Cite id="..." />`. Tests fail if a page cites
  a source that doesn't exist, if a source is never used, or if `SOURCES.md` is stale (`npm run sources` regenerates
  it). The `/sources` page is built from the same list.
- **Glossary terms** live in `src/content/glossary.ts`, each backed by a source. Lessons use
  `<Term id="apr">APR</Term>` to show a tap-to-define popover.
- **Year-specific numbers** (contribution limits, tax brackets) live in `src/content/figures.ts` with their tax year
  and IRS link. Lessons show them with `<Fig id="..." />`, so updating one value updates every page.
- **`CONTENT_REVIEW.md`** is the checklist for keeping figures current, plus a generated list of anything not yet
  re-checked (`npm run review` regenerates it).

## Project layout

```
src/
  app/                 pages (one folder per route)
  components/
    lesson/            Cite, Term, Fig, KeyTakeaways, CommonMistakes, HowCalculated...
    layout/            header, footer, passcode gate, section index
    Greeting.tsx       "For Daniel <3" with its easter egg
  config/site.ts       site name, the "Start here" path, onboarding settings
  content/
    lessons/           lesson text in MDX, one file per lesson
    sources.ts         every reference
    glossary.ts        every term
    figures.ts         every year-specific number
    lessons.ts         list of lessons and their review dates
  lib/
    finance/           investing calculator math (pure functions + tests)
    budget/            budget plan, take-home pay, CSV import and tracker math
    credit/            loan, debt payoff and rent-vs-buy math
    quiz/              onboarding quiz scoring
    storage/           localStorage store, backup export/import
tests/                 content-integrity, storage, gate, glitch and contrast tests
```

## Accessibility

The site targets WCAG 2.1 AA:

- Color tokens are contrast-tested in both light and dark mode (`tests/contrast.test.ts`).
- Every page was checked with axe-core (WCAG 2.1 A/AA plus best-practice rules) in light and dark mode, with no
  violations remaining.
- Charts have a text summary, a keyboard-reachable crosshair and a "Show the numbers as a table" view, and they never
  rely on color alone.
- Popovers work with hover, tap and keyboard, and close with Escape.
- The glitch easter egg is disabled entirely when "reduce motion" is on.

## Customizing

- **The "Start here" path** is in `src/config/site.ts` (`startHere`). Reorder or edit the steps there.
- **The onboarding quiz** is skipped by default (`skipOnboardingQuiz: true` in the same file), so the home page goes
  straight to the Start here path, with a small link to the optional quiz. Set it to `false` to show the quiz to
  first-time visitors before the Start here path.
