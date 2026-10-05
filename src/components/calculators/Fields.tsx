"use client";

import { useId, type ReactNode } from "react";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  help?: ReactNode;
}

/**
 * Labeled number input. Keeps the last valid number if the field is cleared
 * mid-edit, and clamps to min/max.
 */
export function NumberField({ label, value, onChange, min, max, step = 1, prefix, suffix, help }: NumberFieldProps) {
  const id = useId();
  const helpId = `${id}-help`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1 flex items-stretch overflow-hidden rounded-md border border-border bg-bg focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[var(--focus)]">
        {prefix && (
          <span className="flex items-center bg-surface-2 px-2.5 text-muted" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="w-full min-w-0 bg-transparent px-3 py-2 text-base text-text outline-none"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          aria-describedby={help ? helpId : undefined}
          onChange={(e) => {
            const n = e.target.valueAsNumber;
            if (Number.isNaN(n)) return;
            let v = n;
            if (min !== undefined) v = Math.max(min, v);
            if (max !== undefined) v = Math.min(max, v);
            onChange(v);
          }}
        />
        {suffix && (
          <span className="flex items-center bg-surface-2 px-2.5 text-muted" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {help && (
        <p id={helpId} className="mt-1 text-sm text-muted">
          {help}
        </p>
      )}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  help,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
  help?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
      />
      <label htmlFor={id} className="text-sm">
        <span className="font-medium">{label}</span>
        {help && <span className="mt-0.5 block text-muted">{help}</span>}
      </label>
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-base"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-lg border border-border bg-bg p-3">
      <div className="text-sm text-muted">{label}</div>
      <div
        className={`mt-0.5 text-xl font-semibold tabular-nums ${tone === "good" ? "text-accent" : tone === "bad" ? "text-danger-text" : ""}`}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

/** Frame around every interactive tool. */
export function CalculatorCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      className="not-prose print-break-avoid my-8 rounded-2xl border border-border bg-surface p-4 text-base sm:p-6"
    >
      <h3 className="!mt-0 text-lg font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
