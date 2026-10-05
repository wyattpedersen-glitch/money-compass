// @section budgeting
"use client";

import Link from "next/link";
import { buildPlan, currentMonth, type Framework, type Plan } from "@/lib/budget/plan";
import { monthLabel, pct, usd } from "@/lib/format";
import { Cite } from "@/components/lesson/Cite";
import { HowCalculated } from "@/components/lesson/Boxes";
import { Bar } from "./Bar";
import { useBudget } from "./useBudget";

const frameworks: Array<{
  id: Framework;
  name: string;
  how: string;
  origin: React.ReactNode;
  limits: string;
}> = [
  {
    id: "50-30-20",
    name: "50/30/20",
    how: "Split take-home pay into about 50% needs, 30% wants and 20% savings and debt payoff.",
    origin: (
      <>
        Popularized by Elizabeth Warren and Amelia Warren Tyagi in <cite>All Your Worth</cite> (2005){" "}
        <Cite id="warren-tyagi-2005" />.
      </>
    ),
    limits:
      'The percentages are a starting point, not a law. In high-rent cities like the Bay Area, needs alone can exceed 50%, and on a student budget 20% savings may not be realistic yet. It\'s also loose about what counts as a "need".',
  },
  {
    id: "zero-based",
    name: "Zero-based",
    how: "Give every dollar a job until income minus spending minus savings equals zero.",
    origin: (
      <>
        Began as a corporate method: Peter Pyhrr described zero-base budgeting at Texas Instruments in the{" "}
        <cite>Harvard Business Review</cite> in 1970 <Cite id="pyhrr-1970" />. Personal-finance versions adapted it
        later.
      </>
    ),
    limits:
      "It gives the most control but takes the most effort: you plan every category each month. Many people find it hard to keep up with, especially at first.",
  },
  {
    id: "pay-yourself-first",
    name: "Pay yourself first",
    how: "Move goal money out on payday, cover needs, and spend what's left on wants without tracking every dollar.",
    origin: (
      <>
        The idea of saving a set part of everything you earn before spending goes back at least to George Clason&apos;s{" "}
        <cite>The Richest Man in Babylon</cite> (1926) <Cite id="clason-1926" />.
      </>
    ),
    limits:
      "It's the lowest-effort method and works well with automation, but it doesn't tell you where spending is leaking. If wants regularly run over, you may end up pulling money back out of savings.",
  },
];

export function PlanView() {
  const { budget, ready, update } = useBudget();
  if (!ready) return <p className="text-muted">Loading your plan…</p>;
  const now = currentMonth();
  const plan = buildPlan({ ...budget, now });
  const fw = frameworks.find((f) => f.id === budget.framework)!;
  const empty = budget.income <= 0;

  return (
    <div>
      <fieldset>
        <legend className="text-lg font-semibold">Pick a budgeting method</legend>
        <p className="mt-1 text-sm text-muted">
          There&apos;s no single best method. The research on budgeting styles is thin, so pick the one you&apos;ll
          actually stick with. You can switch any time.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {frameworks.map((f) => (
            <label
              key={f.id}
              className={`cursor-pointer rounded-xl border p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                budget.framework === f.id ? "border-accent bg-accent-soft" : "border-border bg-surface"
              }`}
            >
              <input
                type="radio"
                name="framework"
                value={f.id}
                checked={budget.framework === f.id}
                onChange={() => update((b) => ({ ...b, framework: f.id }))}
                className="sr-only"
              />
              <span className="block font-semibold">{f.name}</span>
              <span className="mt-1 block text-sm text-muted">{f.how}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section aria-labelledby="fw-h" className="mt-6 rounded-xl border border-border bg-surface p-5">
        <h2 id="fw-h" className="text-lg font-semibold">
          About {fw.name}
        </h2>
        <p className="mt-2 leading-relaxed">
          <strong>Where it comes from:</strong> {fw.origin}
        </p>
        <p className="mt-2 leading-relaxed">
          <strong>Limits:</strong> {fw.limits}
        </p>
      </section>

      {empty ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-5 text-muted">
          Add your take-home pay and spending in{" "}
          <Link href="/budget/setup/" className="text-accent underline underline-offset-2">
            step 1
          </Link>{" "}
          to see your plan.
        </p>
      ) : (
        <PlanResult plan={plan} framework={budget.framework} />
      )}
    </div>
  );
}

function Row({
  label,
  amount,
  of,
  target,
  over,
  savings,
}: {
  label: string;
  amount: number;
  of: number;
  target?: number;
  over?: boolean;
  /** For savings, going above the guideline is good, so it reads as a minimum. */
  savings?: boolean;
}) {
  return (
    <li>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">
          {usd(amount)} <span className="text-sm text-muted">({pct(of > 0 ? amount / of : 0, 0)} of take-home)</span>
        </span>
      </div>
      <div className="mt-1.5">
        <Bar value={amount} max={target ?? of} label={label} over={over} />
      </div>
      {target !== undefined && (
        <p className={`mt-1 text-sm ${over ? "text-danger-text" : "text-muted"}`}>
          {savings
            ? `${amount + 0.5 >= target ? "At or above" : "Below"} the guideline of ${usd(target)}`
            : `${over ? "Over" : "Within"} the guideline of ${usd(target)}`}
        </p>
      )}
    </li>
  );
}

export function PlanResult({ plan, framework }: { plan: Plan; framework: Framework }) {
  const t = plan.targets;
  const shortGoals = plan.goalLines.filter((g) => g.funded + 0.5 < g.needed);
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Your monthly plan</h2>
      <p className="mt-1 text-muted">Take-home pay: {usd(plan.income)} a month</p>
      <ul className="mt-4 space-y-4">
        <Row
          label="Needs"
          amount={plan.needs}
          of={plan.income}
          target={t?.needs}
          over={t ? plan.needs > t.needs : false}
        />
        <Row
          label="Wants"
          amount={plan.wants}
          of={plan.income}
          target={t?.wants}
          over={t ? plan.wants > t.wants : false}
        />
        <Row label="Goals and savings" amount={plan.goalsFunded} of={plan.income} target={t?.savings} savings />
      </ul>

      <p className={`mt-6 rounded-lg p-4 ${plan.fits ? "bg-accent-soft" : "bg-warn-bg text-warn-text"}`}>
        {plan.fits ? (
          <>
            <strong>Your plan fits.</strong>{" "}
            {plan.leftover > 0.5
              ? `${usd(plan.leftover)} a month is left over after everything.`
              : "Every dollar is assigned."}
          </>
        ) : (
          <>
            <strong>Your plan doesn&apos;t fully fit.</strong> Goals need {usd(plan.goalsNeeded)} a month but only{" "}
            {usd(Math.max(0, plan.goalsFunded))} is available, so each goal slows down by the same proportion. The new
            finish dates are below.
          </>
        )}
      </p>

      {plan.notes.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {plan.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}

      {plan.goalLines.length > 0 && (
        <section aria-labelledby="goals-h" className="mt-8">
          <h3 id="goals-h" className="text-lg font-semibold">
            Goals
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Goal
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">
                    Needed / mo
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">
                    Planned / mo
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Reached by
                  </th>
                </tr>
              </thead>
              <tbody>
                {plan.goalLines.map((g) => (
                  <tr key={g.goal.id} className="border-b border-border">
                    <th scope="row" className="py-2 pr-3 font-medium">
                      {g.goal.name}
                    </th>
                    <td className="py-2 pr-3 text-right tabular-nums">{usd(g.needed)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{usd(g.funded)}</td>
                    <td className="py-2">
                      {g.reachedBy ? monthLabel(g.reachedBy) : "Not funded yet"}
                      {g.reachedBy && g.reachedBy > g.goal.targetDate && (
                        <span className="block text-xs text-warn-text">target was {monthLabel(g.goal.targetDate)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {shortGoals.length > 0 && (
        <section aria-labelledby="tradeoffs-h" className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h3 id="tradeoffs-h" className="text-lg font-semibold">
            Ways to close the gap
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Free up {usd(plan.goalsNeeded - plan.goalsFunded)} a month by trimming wants, starting with the biggest
              ones.
            </li>
            <li>Push back the target date on a goal that isn&apos;t urgent. A later date lowers the monthly amount.</li>
            <li>Fund one goal at a time, usually a starter emergency fund first, then the rest.</li>
            <li>Look at the largest fixed costs (rent, car, phone plan). One change there can beat many small cuts.</li>
          </ul>
        </section>
      )}

      <HowCalculated>
        <p>
          Needs and wants are the monthly amounts you entered in step 1. Each goal&apos;s monthly amount is what&apos;s
          needed to go from &quot;already saved&quot; to the target by the target month. If you entered an APY, interest
          is included using monthly compounding: payment = (target − saved × (1 + r)<sup>n</sup>) × r ÷ ((1 + r)
          <sup>n</sup> − 1), where r is the monthly rate and n is the number of months.
        </p>
        <p>
          {framework === "pay-yourself-first"
            ? "With pay yourself first, goals are funded from income minus needs, and wants get what remains."
            : "Goals are funded from what's left after needs and wants."}{" "}
          If that isn&apos;t enough, every goal gets the same share of what it needs (for example, 80% each), so none is
          silently dropped. The &quot;reached by&quot; month is how long the remaining amount takes at the planned
          payment, ignoring interest, so it&apos;s slightly conservative.
        </p>
        {framework === "50-30-20" && <p>The guidelines are 50%, 30% and 20% of take-home pay.</p>}
      </HowCalculated>
    </div>
  );
}
