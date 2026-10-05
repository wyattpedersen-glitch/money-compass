/** Horizontal progress bar with a text label, so meaning never relies on color alone. */
export function Bar({ value, max, label, over }: { value: number; max: number; label: string; over?: boolean }) {
  const pctv = max > 0 ? Math.min(100, (value / max) * 100) : value > 0 ? 100 : 0;
  return (
    <div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(max)}
        aria-valuenow={Math.round(Math.min(value, max))}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pctv}%`, background: over ? "var(--series-2)" : "var(--series-1)" }}
        />
      </div>
    </div>
  );
}
