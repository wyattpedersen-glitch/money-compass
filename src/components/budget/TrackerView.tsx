// @section budgeting
"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { currentMonth } from "@/lib/budget/plan";
import { importBankCsv, type Transaction } from "@/lib/budget/csv";
import { guessCategory, summarizeMonth } from "@/lib/budget/tracker";
import type { Budget } from "@/lib/storage/schema";
import { monthLabel, usd } from "@/lib/format";
import { Cite } from "@/components/lesson/Cite";
import { NumberField, Toggle } from "@/components/calculators/Fields";
import { Bar } from "./Bar";
import { newId, useBudget } from "./useBudget";

const input = "mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2";

export function TrackerView() {
  const { budget, ready, update } = useBudget();
  const [month, setMonth] = useState(currentMonth());
  if (!ready) return <p className="text-muted">Loading your tracker…</p>;

  const summary = summarizeMonth(budget.entries, budget.expenses, month);
  const entries = budget.entries.filter((e) => e.date.startsWith(month)).sort((a, b) => b.date.localeCompare(a.date));
  const nameOf = (id: string) => budget.expenses.find((x) => x.id === id)?.name ?? "Other / uncategorized";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="tracker-month" className="block text-sm font-medium">
            Month
          </label>
          <input
            id="tracker-month"
            type="month"
            value={month}
            onChange={(e) => e.target.value && setMonth(e.target.value)}
            className={input}
          />
        </div>
        <p className="pb-2 text-muted">
          Spent {usd(summary.actual)} of {usd(summary.planned)} planned in {monthLabel(month)}
        </p>
      </div>

      {budget.expenses.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed border-border p-5 text-muted">
          Add your spending categories in{" "}
          <Link href="/budget/setup/" className="text-accent underline underline-offset-2">
            step 1
          </Link>{" "}
          first, so there&apos;s something to compare against.
        </p>
      )}

      <section aria-labelledby="pva-h" className="mt-8">
        <h2 id="pva-h" className="text-lg font-semibold">
          Planned vs. actual
        </h2>
        {summary.rows.length === 0 ? (
          <p className="mt-2 text-muted">Nothing to show yet.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {summary.rows.map((r) => {
              const over = r.actual > r.planned + 0.005;
              return (
                <li key={r.categoryId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="font-medium">{r.name}</span>
                    <span className="tabular-nums">
                      {usd(r.actual)} <span className="text-sm text-muted">of {usd(r.planned)}</span>
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Bar value={r.actual} max={r.planned} label={`${r.name}: spent versus planned`} over={over} />
                  </div>
                  {over && <p className="mt-1 text-sm text-danger-text">Over by {usd(r.actual - r.planned)}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AddEntry budget={budget} month={month} onAdd={(e) => update((b) => ({ ...b, entries: [...b.entries, e] }))} />

      <CsvImport budget={budget} onImport={(rows) => update((b) => ({ ...b, entries: [...b.entries, ...rows] }))} />

      <section aria-labelledby="entries-h" className="mt-10">
        <h2 id="entries-h" className="text-lg font-semibold">
          Spending in {monthLabel(month)}
        </h2>
        {entries.length === 0 ? (
          <p className="mt-2 text-muted">No spending recorded for this month yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Note
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">
                    Amount
                  </th>
                  <th scope="col" className="py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-border">
                    <td className="py-2 pr-3 tabular-nums">{e.date}</td>
                    <td className="py-2 pr-3">
                      <label className="sr-only" htmlFor={`cat-${e.id}`}>
                        Category
                      </label>
                      <select
                        id={`cat-${e.id}`}
                        value={e.categoryId}
                        onChange={(ev) =>
                          update((b) => ({
                            ...b,
                            entries: b.entries.map((x) => (x.id === e.id ? { ...x, categoryId: ev.target.value } : x)),
                          }))
                        }
                        className="rounded border border-border bg-bg px-2 py-1"
                      >
                        <CategoryOptions budget={budget} />
                      </select>
                    </td>
                    <td className="py-2 pr-3 text-muted">{e.note}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{usd(e.amount, { cents: true })}</td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => update((b) => ({ ...b, entries: b.entries.filter((x) => x.id !== e.id) }))}
                        className="rounded px-2 py-1 text-danger-text hover:bg-danger-bg"
                      >
                        Delete
                        <span className="sr-only">
                          {" "}
                          {nameOf(e.categoryId)} entry from {e.date}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {budget.goals.length > 0 && (
        <section aria-labelledby="gp-h" className="mt-10">
          <h2 id="gp-h" className="text-lg font-semibold">
            Goal progress
          </h2>
          <ul className="mt-3 space-y-4">
            {budget.goals.map((g) => (
              <li key={g.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-medium">{g.name}</span>
                  <span className="tabular-nums">
                    {usd(g.saved)} <span className="text-sm text-muted">of {usd(g.target)}</span>
                  </span>
                </div>
                <div className="mt-1.5">
                  <Bar value={g.saved} max={g.target} label={`${g.name} progress`} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Update the &quot;already saved&quot; amounts on the{" "}
            <Link href="/budget/goals/" className="underline underline-offset-2">
              Goals
            </Link>{" "}
            page as you go.
          </p>
        </section>
      )}
    </div>
  );
}

function CategoryOptions({ budget }: { budget: Budget }) {
  return (
    <>
      {budget.expenses.map((x) => (
        <option key={x.id} value={x.id}>
          {x.name}
        </option>
      ))}
      <option value="other">Other / uncategorized</option>
    </>
  );
}

function AddEntry({
  budget,
  month,
  onAdd,
}: {
  budget: Budget;
  month: string;
  onAdd: (e: Budget["entries"][number]) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today.startsWith(month) ? today : `${month}-01`);
  const [categoryId, setCategoryId] = useState(budget.expenses[0]?.id ?? "other");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const id = useId();
  return (
    <form
      aria-labelledby={`${id}-h`}
      className="mt-10 rounded-xl border border-border bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!(amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
        onAdd({ id: newId(), date, categoryId, amount, note: note.trim() || undefined });
        setAmount(0);
        setNote("");
      }}
    >
      <h2 id={`${id}-h`} className="text-lg font-semibold">
        Add spending
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-d`} className="block text-sm font-medium">
            Date
          </label>
          <input id={`${id}-d`} type="date" value={date} onChange={(e) => setDate(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-c`} className="block text-sm font-medium">
            Category
          </label>
          <select id={`${id}-c`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={input}>
            <CategoryOptions budget={budget} />
          </select>
        </div>
        <NumberField label="Amount" prefix="$" value={amount} onChange={setAmount} min={0} step={1} />
        <div>
          <label htmlFor={`${id}-n`} className="block text-sm font-medium">
            Note (optional)
          </label>
          <input id={`${id}-n`} value={note} onChange={(e) => setNote(e.target.value)} className={input} />
        </div>
      </div>
      <button type="submit" className="mt-4 rounded-md bg-accent px-4 py-2 font-medium text-on-accent">
        Add
      </button>
    </form>
  );
}

function CsvImport({ budget, onImport }: { budget: Budget; onImport: (rows: Budget["entries"]) => void }) {
  const [text, setText] = useState<string | null>(null);
  const [negative, setNegative] = useState(true);
  const [done, setDone] = useState<string | null>(null);
  const id = useId();
  const result = text ? importBankCsv(text, negative) : null;
  const spending: Transaction[] = result ? result.transactions.filter((t) => t.amount > 0) : [];

  return (
    <section aria-labelledby={`${id}-h`} className="mt-10 rounded-xl border border-border bg-surface p-5">
      <h2 id={`${id}-h`} className="text-lg font-semibold">
        Import from your bank (CSV)
      </h2>
      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-medium text-accent">
          How to download a CSV from your bank
        </summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
          <li>Sign in to your bank or card&apos;s website (the desktop site usually has more options than the app).</li>
          <li>
            Open the account, then look for &quot;Download,&quot; &quot;Export&quot; or &quot;Statements and
            documents.&quot;
          </li>
          <li>Pick a date range and choose CSV (sometimes called &quot;Spreadsheet&quot; or &quot;Excel&quot;).</li>
          <li>Choose the file below. It&apos;s read in your browser and never uploaded anywhere.</li>
        </ol>
        <p className="mt-2 text-sm text-muted">
          Writing down every expense for a set period, up to a month, is also how the CFPB&apos;s spending tracker
          suggests getting started <Cite id="cfpb-bank-statements" />.
        </p>
      </details>
      <div className="mt-4">
        <label htmlFor={`${id}-f`} className="block text-sm font-medium">
          CSV file
        </label>
        <input
          id={`${id}-f`}
          type="file"
          accept=".csv,text/csv"
          className="mt-1 block w-full text-sm"
          onChange={async (e) => {
            setDone(null);
            const f = e.target.files?.[0];
            setText(f ? await f.text() : null);
          }}
        />
      </div>
      <div className="mt-3">
        <Toggle
          label="Purchases show as negative numbers"
          checked={negative}
          onChange={setNegative}
          help="Most bank accounts work this way. Many credit cards show purchases as positive numbers instead. Only matters if the file has a single Amount column."
        />
      </div>
      {result?.error && (
        <p role="alert" className="mt-3 text-danger-text">
          {result.error}
        </p>
      )}
      {result && !result.error && (
        <div className="mt-4">
          <p>
            Found {spending.length} purchase{spending.length === 1 ? "" : "s"} totaling{" "}
            {usd(spending.reduce((s, t) => s + t.amount, 0))}
            {result.transactions.length > spending.length &&
              `, plus ${result.transactions.length - spending.length} deposits or refunds that will be skipped`}
            {result.skipped > 0 && `. ${result.skipped} rows couldn't be read`}.
          </p>
          <p className="mt-1 text-sm text-muted">
            Categories are guessed by matching your category names in the description. You can change any of them
            afterward. If you&apos;ve imported this file before, importing again will double-count it.
          </p>
          <button
            type="button"
            disabled={spending.length === 0}
            className="mt-3 rounded-md bg-accent px-4 py-2 font-medium text-on-accent disabled:opacity-50"
            onClick={() => {
              onImport(
                spending.map((t) => ({
                  id: newId(),
                  date: t.date,
                  categoryId: guessCategory(t.description, budget.expenses),
                  amount: Math.round(t.amount * 100) / 100,
                  note: t.description.slice(0, 80) || undefined,
                })),
              );
              setDone(`Imported ${spending.length} purchases.`);
              setText(null);
            }}
          >
            Import {spending.length} purchases
          </button>
        </div>
      )}
      <p role="status" className="mt-2 text-sm text-accent">
        {done}
      </p>
    </section>
  );
}
