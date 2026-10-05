/** Minimal RFC 4180 CSV parser: quoted fields, escaped quotes, CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

export interface Transaction {
  date: string; // YYYY-MM-DD
  description: string;
  /** Spending is positive; refunds and deposits are negative. */
  amount: number;
}

export interface ColumnGuess {
  date: number;
  description: number;
  /** A single signed amount column, or separate debit/credit columns. */
  amount?: number;
  debit?: number;
  credit?: number;
}

const find = (headers: string[], words: string[]) =>
  headers.findIndex((h) => words.some((w) => h.toLowerCase().trim().includes(w)));

export function guessColumns(headers: string[]): ColumnGuess | null {
  const date = find(headers, ["date", "posted"]);
  const description = find(headers, ["description", "payee", "merchant", "name", "memo", "details"]);
  const debit = find(headers, ["debit", "withdrawal", "outflow"]);
  const credit = find(headers, ["credit", "deposit", "inflow"]);
  const amount = find(headers, ["amount"]);
  if (date < 0 || description < 0) return null;
  if (debit >= 0) return { date, description, debit, credit: credit >= 0 ? credit : undefined };
  if (amount >= 0) return { date, description, amount };
  return null;
}

export function parseMoney(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  const negative = /^\(.*\)$/.test(t) || t.includes("-");
  const n = Number(t.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? (negative ? -n : n) : NaN;
}

/** Accepts YYYY-MM-DD, MM/DD/YYYY, M/D/YY. Returns YYYY-MM-DD or null. */
export function parseDate(s: string): string | null {
  const t = s.trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  }
  return null;
}

export interface ImportResult {
  transactions: Transaction[];
  skipped: number;
  error?: string;
}

/**
 * Turn a bank CSV export into transactions. `spendingIsNegative` covers the
 * two common conventions: most banks show purchases as negative numbers,
 * some (and most credit cards) show them as positive.
 */
export function importBankCsv(text: string, spendingIsNegative: boolean): ImportResult {
  const rows = parseCsv(text);
  if (rows.length < 2) return { transactions: [], skipped: 0, error: "The file looks empty." };
  const cols = guessColumns(rows[0]);
  if (!cols)
    return {
      transactions: [],
      skipped: 0,
      error:
        "Couldn't find Date, Description and Amount columns in the first row. Check that the file has a header row.",
    };
  const transactions: Transaction[] = [];
  let skipped = 0;
  for (const r of rows.slice(1)) {
    const date = parseDate(r[cols.date] ?? "");
    let amount: number;
    if (cols.debit !== undefined) {
      const debit = Math.abs(parseMoney(r[cols.debit] ?? ""));
      const credit = cols.credit !== undefined ? Math.abs(parseMoney(r[cols.credit] ?? "")) : 0;
      amount = (debit || 0) - (credit || 0);
    } else {
      const raw = parseMoney(r[cols.amount!] ?? "");
      amount = spendingIsNegative ? -raw : raw;
    }
    if (!date || !Number.isFinite(amount)) {
      skipped++;
      continue;
    }
    transactions.push({ date, description: (r[cols.description] ?? "").trim(), amount });
  }
  return { transactions, skipped };
}
