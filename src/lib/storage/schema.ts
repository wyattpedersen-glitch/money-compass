import { z } from "zod";

/**
 * Everything the site saves lives in one versioned JSON document. New fields
 * are added with defaults so older saved data and older export files keep
 * loading. Unknown keys are preserved (looseObject) so a file exported from a
 * newer version of the site isn't silently trimmed by an older one.
 */
export const CURRENT_VERSION = 1;

export const quizResultSchema = z.enum(["emergency-fund", "debt", "investing"]);

export const appDataSchema = z.looseObject({
  version: z.number().int().min(1),
  updatedAt: z.string().nullable().default(null),
  progress: z
    .looseObject({
      /** Lesson key ("investing/why-invest") to the ISO date it was completed. */
      completed: z.record(z.string(), z.string()).default({}),
    })
    .default({ completed: {} }),
  quiz: z
    .looseObject({
      result: quizResultSchema,
      takenAt: z.string(),
    })
    .nullable()
    .default(null),
});

export type AppData = z.infer<typeof appDataSchema>;
export type QuizResult = z.infer<typeof quizResultSchema>;

export function emptyData(): AppData {
  return appDataSchema.parse({ version: CURRENT_VERSION });
}

/**
 * Upgrade older documents to the current shape. Each future schema change
 * adds a step here (e.g. `if (v === 1) { ...; v = 2 }`).
 */
export function migrate(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const doc = { ...(raw as Record<string, unknown>) };
  if (typeof doc.version !== "number") doc.version = 1;
  return doc;
}

export type ParseResult = { ok: true; data: AppData } | { ok: false; error: string };

export function parseAppData(raw: unknown): ParseResult {
  const migrated = migrate(raw);
  const result = appDataSchema.safeParse(migrated);
  if (!result.success) {
    const first = result.error.issues[0];
    const where = first?.path.length ? ` at "${first.path.join(".")}"` : "";
    return {
      ok: false,
      error: `This file doesn't look like an Epicurus & Co. backup${where}: ${first?.message ?? "invalid data"}.`,
    };
  }
  if (result.data.version > CURRENT_VERSION) {
    return {
      ok: false,
      error: `This backup was made by a newer version of the site (version ${result.data.version}). Reload the page to get the latest version, then try again.`,
    };
  }
  return { ok: true, data: { ...result.data, version: CURRENT_VERSION } };
}
