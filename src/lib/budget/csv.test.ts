import { describe, expect, it } from "vitest";
import { importBankCsv, parseCsv, parseDate, parseMoney } from "./csv";

describe("CSV parsing", () => {
  it("handles quotes, commas in quotes, escaped quotes and CRLF", () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\r\n')).toEqual([
      ["a", "b"],
      ["x, y", 'say "hi"'],
    ]);
  });
  it("strips a byte-order mark and blank lines", () => {
    expect(parseCsv("﻿a,b\n\n1,2\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("money and dates", () => {
  it("parses common money formats", () => {
    expect(parseMoney("$1,234.50")).toBe(1234.5);
    expect(parseMoney("-12.00")).toBe(-12);
    expect(parseMoney("(45.10)")).toBe(-45.1);
    expect(parseMoney("")).toBe(0);
  });
  it("parses common date formats", () => {
    expect(parseDate("2026-10-04")).toBe("2026-10-04");
    expect(parseDate("10/4/2026")).toBe("2026-10-04");
    expect(parseDate("1/2/26")).toBe("2026-01-02");
    expect(parseDate("Oct 4")).toBeNull();
  });
});

describe("bank import", () => {
  it("reads a signed amount column where spending is negative", () => {
    const csv = "Date,Description,Amount\n10/01/2026,Trader Joe's,-54.20\n10/02/2026,Paycheck,2000.00\n";
    const r = importBankCsv(csv, true);
    expect(r.transactions).toEqual([
      { date: "2026-10-01", description: "Trader Joe's", amount: 54.2 },
      { date: "2026-10-02", description: "Paycheck", amount: -2000 },
    ]);
  });
  it("reads separate debit and credit columns", () => {
    const csv = "Posted Date,Payee,Debit,Credit\n2026-10-03,BART,3.50,\n2026-10-04,Refund,,10.00\n";
    const r = importBankCsv(csv, true);
    expect(r.transactions.map((t) => t.amount)).toEqual([3.5, -10]);
  });
  it("skips rows it can't read and reports a missing header", () => {
    expect(importBankCsv("Date,Description,Amount\nbad,x,1\n", true).skipped).toBe(1);
    expect(importBankCsv("foo,bar\n1,2\n", true).error).toMatch(/Couldn't find/);
  });
});
