"use client";

import { useRef, useState } from "react";
import { downloadBackup, parseBackup } from "@/lib/storage/backup";
import { emptyData } from "@/lib/storage/schema";
import { setData, useAppData, useHydrated } from "@/lib/storage/store";

type Message = { tone: "ok" | "error"; text: string } | null;

export function BackupPanel() {
  const data = useAppData();
  const hydrated = useHydrated();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message>(null);

  const onImport = async (file: File) => {
    const text = await file.text();
    const result = parseBackup(text);
    if (!result.ok) {
      setMessage({ tone: "error", text: result.error });
      return;
    }
    const saved = setData(result.data);
    setMessage(
      saved
        ? { tone: "ok", text: "Backup imported. Everything on this device now matches the file." }
        : {
            tone: "error",
            text: "The backup was read, but this browser refused to save it (storage may be full or blocked).",
          },
    );
  };

  const onReset = () => {
    if (window.confirm("Erase everything saved on this device? This can't be undone unless you have a backup file.")) {
      setData(emptyData());
      setMessage({ tone: "ok", text: "All saved data on this device was erased." });
    }
  };

  const lastSaved =
    hydrated && data.updatedAt
      ? new Date(data.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
      : null;

  return (
    <section aria-labelledby="backup" className="rounded-2xl border-2 border-accent/40 bg-surface p-5 sm:p-6">
      <h2 id="backup" className="text-xl font-semibold">
        Back up and move your data
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        Your data is saved only on this device. Export a backup file to keep it safe or to move it to your phone or
        laptop.
      </p>
      <p className="mt-2 text-sm text-muted">
        {lastSaved ? `Last change on this device: ${lastSaved}` : "Nothing saved on this device yet."}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            downloadBackup(data);
            setMessage({ tone: "ok", text: "Backup file downloaded. Keep it somewhere safe." });
          }}
          className="rounded-md bg-accent px-4 py-2.5 font-medium text-on-accent hover:bg-accent-hover"
        >
          Export backup file
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-md border border-border bg-bg px-4 py-2.5 font-medium hover:bg-surface-2"
        >
          Import backup file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImport(f);
            e.target.value = "";
          }}
        />
      </div>
      <div role="status" aria-live="polite" className="mt-4 min-h-6">
        {message && <p className={message.tone === "ok" ? "text-accent" : "text-danger-text"}>{message.text}</p>}
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted">Erase data on this device</summary>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 rounded-md border border-danger-text/40 px-3 py-2 font-medium text-danger-text hover:bg-danger-bg"
        >
          Erase everything on this device
        </button>
      </details>
    </section>
  );
}
