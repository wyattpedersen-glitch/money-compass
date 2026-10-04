import { beforeEach, describe, expect, it } from "vitest";
import { CURRENT_VERSION, emptyData, parseAppData } from "@/lib/storage/schema";
import { backupFileName, parseBackup, serializeBackup } from "@/lib/storage/backup";
import { STORAGE_KEY, __resetForTests, getData, setData, updateData } from "@/lib/storage/store";

describe("schema", () => {
  it("fills defaults for an empty document", () => {
    expect(emptyData()).toEqual({ version: CURRENT_VERSION, updatedAt: null, progress: { completed: {} }, quiz: null });
  });

  it("accepts a document with no version (treated as v1)", () => {
    const r = parseAppData({ progress: { completed: { "investing/why-invest": "2026-10-01" } } });
    expect(r.ok && r.data.progress.completed["investing/why-invest"]).toBe("2026-10-01");
  });

  it("keeps unknown fields so newer data isn't trimmed", () => {
    const r = parseAppData({ version: 1, budget: { income: 3000 } });
    expect(r.ok && (r.data as Record<string, unknown>).budget).toEqual({ income: 3000 });
  });

  it("rejects data from a newer version with a helpful message", () => {
    const r = parseAppData({ version: CURRENT_VERSION + 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/newer version/);
  });

  it("rejects malformed data", () => {
    expect(parseAppData({ version: 1, progress: { completed: "nope" } }).ok).toBe(false);
    expect(parseAppData("hello").ok).toBe(false);
  });
});

describe("backup files", () => {
  it("round-trips through export and import", () => {
    const data = { ...emptyData(), progress: { completed: { "credit/credit-scores": "2026-10-04" } } };
    const text = serializeBackup(data, new Date("2026-10-04T12:00:00Z"));
    const r = parseBackup(text);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.progress).toEqual(data.progress);
      expect(r.data).not.toHaveProperty("exportedAt");
      expect(r.data).not.toHaveProperty("app");
    }
  });

  it("gives a friendly error for a non-JSON file", () => {
    const r = parseBackup("not json");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/isn't valid JSON/);
  });

  it("names files by date", () => {
    expect(backupFileName(new Date("2026-10-04T12:00:00Z"))).toBe("epicurus-backup-2026-10-04.json");
  });
});

describe("store", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetForTests();
  });

  it("starts empty and persists changes to localStorage", () => {
    expect(getData().progress.completed).toEqual({});
    updateData((d) => ({ ...d, progress: { completed: { a: "2026-01-01" } } }));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.progress.completed).toEqual({ a: "2026-01-01" });
    expect(saved.updatedAt).toBeTypeOf("string");
  });

  it("recovers from corrupted storage instead of crashing", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    expect(getData()).toMatchObject({ version: CURRENT_VERSION });
  });

  it("reloads what was saved", () => {
    setData({ ...emptyData(), quiz: { result: "debt", takenAt: "2026-10-04" } });
    __resetForTests();
    expect(getData().quiz?.result).toBe("debt");
  });
});
