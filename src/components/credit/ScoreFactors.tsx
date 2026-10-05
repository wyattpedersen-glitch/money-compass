// @section credit
import { Cite } from "@/components/lesson/Cite";

const factors = [
  { name: "Payment history", pct: 35, what: "Paying on time, every time" },
  { name: "Amounts owed", pct: 30, what: "Mostly how much of your card limits you use" },
  { name: "Length of credit history", pct: 15, what: "Age of your oldest and average accounts" },
  { name: "New credit", pct: 10, what: "Recent applications and new accounts" },
  { name: "Credit mix", pct: 10, what: "Having different kinds, like a card and a loan" },
];

/** FICO's published factor weights, as a labeled bar list (never color alone). */
export function ScoreFactors() {
  return (
    <figure className="not-prose print-break-avoid my-8 rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <figcaption className="font-semibold">
        What goes into a FICO Score <Cite id="myfico-score-factors" />
      </figcaption>
      <ul className="mt-4 list-none space-y-3 pl-0">
        {factors.map((f) => (
          <li key={f.name}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-medium">{f.name}</span>
              <span className="tabular-nums font-semibold">{f.pct}%</span>
            </div>
            <div className="mt-1 h-2.5 rounded-full bg-surface-2" aria-hidden="true">
              <div
                className="h-full rounded-full"
                style={{ width: `${(f.pct / 35) * 100}%`, background: "var(--series-1)" }}
              />
            </div>
            <p className="mt-1 text-sm text-muted">{f.what}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">
        These are FICO&apos;s weights for the general population. The exact importance varies from person to person, and
        other scoring models (like VantageScore) weigh things differently.
      </p>
    </figure>
  );
}
