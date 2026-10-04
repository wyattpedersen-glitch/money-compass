import { parseAppData, type AppData, type ParseResult } from "./schema";

/** The backup file's contents: the saved data plus a little context. */
export function serializeBackup(data: AppData, now = new Date()): string {
  return JSON.stringify({ ...data, exportedAt: now.toISOString(), app: "epicurus-and-co" }, null, 2);
}

export function backupFileName(now = new Date()): string {
  const d = now.toISOString().slice(0, 10);
  return `epicurus-backup-${d}.json`;
}

export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "That file isn't valid JSON. Make sure you picked the backup file you exported from this site.",
    };
  }
  const result = parseAppData(raw);
  if (!result.ok) return result;
  // Drop export-only fields so they don't accumulate across imports.
  const data = { ...result.data } as Record<string, unknown>;
  delete data.exportedAt;
  delete data.app;
  return { ok: true, data: data as AppData };
}

/** Trigger a download of the backup in the browser. */
export function downloadBackup(data: AppData) {
  const blob = new Blob([serializeBackup(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
