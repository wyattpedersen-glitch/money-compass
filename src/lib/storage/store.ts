"use client";

import { useSyncExternalStore } from "react";
import { emptyData, parseAppData, type AppData } from "./schema";

/** The localStorage key for all saved data. */
export const STORAGE_KEY = "eco:data";

type Listener = () => void;

const listeners = new Set<Listener>();
let current: AppData | null = null;
const serverSnapshot = emptyData();

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Some private-browsing modes throw on access.
    return null;
  }
}

function readFromStorage(): AppData {
  const raw = storage()?.getItem(STORAGE_KEY);
  if (!raw) return emptyData();
  try {
    const parsed = parseAppData(JSON.parse(raw));
    return parsed.ok ? parsed.data : emptyData();
  } catch {
    return emptyData();
  }
}

export function getData(): AppData {
  if (current === null) current = readFromStorage();
  return current;
}

function emit() {
  for (const l of listeners) l();
}

/** Replace all saved data. Returns false if the browser refused to save. */
export function setData(next: AppData): boolean {
  const stamped: AppData = { ...next, updatedAt: new Date().toISOString() };
  current = stamped;
  let saved = true;
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(stamped));
  } catch {
    saved = false;
  }
  emit();
  return saved;
}

export function updateData(fn: (prev: AppData) => AppData): boolean {
  return setData(fn(getData()));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  // Keep tabs in sync: a change saved in another tab updates this one.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      current = readFromStorage();
      listener();
    }
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

/** React hook: the saved data, re-rendering when it changes. */
export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getData, () => serverSnapshot);
}

/** True once the component is running in the browser (after hydration). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
const noopSubscribe = () => () => {};

/** For tests: forget the in-memory copy so the next read hits storage. */
export function __resetForTests() {
  current = null;
  listeners.clear();
}
