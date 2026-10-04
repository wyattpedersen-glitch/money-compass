"use client";

import type { Budget } from "@/lib/storage/schema";
import { updateData, useAppData, useHydrated } from "@/lib/storage/store";

export function useBudget(): { budget: Budget; ready: boolean; update: (fn: (b: Budget) => Budget) => void } {
  const data = useAppData();
  const ready = useHydrated();
  return {
    budget: data.budget,
    ready,
    update: (fn) => updateData((d) => ({ ...d, budget: fn(d.budget) })),
  };
}

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
