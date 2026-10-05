export function usd(n: number, opts: { cents?: boolean } = {}): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts.cents ? 2 : 0,
    minimumFractionDigits: opts.cents ? 2 : 0,
  }).format(n);
}

/** Compact dollars for chart axes: $1.2M, $350K. */
export function usdCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function pct(decimal: number, digits = 1): string {
  if (!Number.isFinite(decimal)) return "—";
  return `${(decimal * 100).toFixed(digits).replace(/\.0+$/, "")}%`;
}

/** "2027-03" → "March 2027". */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
