"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { expectedPasscodeHash, GATE_STORAGE_KEY, hashPasscode } from "@/lib/gate/hash";

/**
 * Courtesy lock shown on a device's first visit. It is NOT real security:
 * the site's files are public to anyone with the link who reads the code.
 * Nothing sensitive is protected by it, because no personal data ever
 * leaves the browser. The boot script in layout.tsx decides whether the
 * gate shows; this form unlocks it.
 */
export function PasscodeGate() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!expectedPasscodeHash) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const hash = await hashPasscode(value);
    setBusy(false);
    if (hash === expectedPasscodeHash) {
      try {
        localStorage.setItem(GATE_STORAGE_KEY, hash);
      } catch {
        // If storage is blocked he'll just be asked again next visit.
      }
      document.documentElement.removeAttribute("data-gate");
      setValue("");
    } else {
      setError("That passcode didn't match. Check for typos and try again.");
    }
  };

  return (
    <div id="gate" className="flex min-h-dvh items-center justify-center bg-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold">{siteConfig.name}</h1>
        <p className="mt-2 text-muted">
          Enter the passcode to continue. You&apos;ll only need to do this once on this device.
        </p>
        <label htmlFor="passcode" className="mt-6 block text-sm font-medium">
          Passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          autoComplete="current-password"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "passcode-error" : undefined}
          className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2.5 text-base text-text"
        />
        {error && (
          <p id="passcode-error" role="alert" className="mt-2 text-sm text-danger-text">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-md bg-accent px-4 py-2.5 font-medium text-on-accent hover:bg-accent-hover disabled:opacity-60"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
