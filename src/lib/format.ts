export function usd(n: number, opts: { cents?: boolean } = {}): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts.cents ? 2 : 0,
    minimumFractionDigits: opts.cents ? 2 : 0,
  }).format(n);
}

/**
 * Compact dollars for chart axes: $1.2M, $350K. Formatted by hand because
 * Intl's compact notation differs between Node and browsers ("$5.0K" vs
 * "$5K"), which breaks hydration of statically rendered charts.
 */
export function usdCompact(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  const units: Array<[number, string]> = [
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [size, suffix] of units) {
    if (a >= size * 0.9995) {
      const v = Math.round((a / size) * 10) / 10;
      return `${sign}$${String(v)}${suffix}`;
    }
  }
  return `${sign}$${Math.round(a)}`;
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
