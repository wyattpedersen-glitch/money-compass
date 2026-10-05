/**
 * An illustrative stock/bond split by years until retirement and comfort
 * with risk. This is NOT a recommendation: there is no single correct
 * allocation. The shape loosely follows how target-date funds typically
 * reduce stocks as retirement approaches ("glide paths"): mostly stocks when
 * retirement is decades away, then gradually more bonds.
 */
export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export interface Allocation {
  usStocks: number;
  intlStocks: number;
  bonds: number;
}

const riskShift: Record<RiskTolerance, number> = {
  conservative: -0.2,
  moderate: 0,
  aggressive: 0.1,
};

/** Share of the portfolio in stocks (0–1). */
export function stockShare(yearsToRetirement: number, risk: RiskTolerance): number {
  // Base path: 90% stocks 25+ years out, falling linearly to 50% at retirement.
  const y = Math.max(0, Math.min(25, yearsToRetirement));
  const base = 0.5 + (0.4 * y) / 25;
  return Math.round(Math.min(1, Math.max(0.2, base + riskShift[risk])) * 100) / 100;
}

/**
 * Splits stocks between U.S. and international. The default 40%
 * international share of stocks is an illustrative choice, not a rule (see
 * the "Building a simple portfolio" lesson for the reasoning and sources).
 */
export function sampleAllocation(yearsToRetirement: number, risk: RiskTolerance, intlShareOfStocks = 0.4): Allocation {
  const stocks = stockShare(yearsToRetirement, risk);
  const intl = Math.round(stocks * intlShareOfStocks * 100) / 100;
  return {
    usStocks: Math.round((stocks - intl) * 100) / 100,
    intlStocks: intl,
    bonds: Math.round((1 - stocks) * 100) / 100,
  };
}

/**
 * Trades needed to bring a portfolio back to its target mix.
 * Positive numbers are buys, negative are sells.
 */
export function rebalance(holdings: Allocation, target: Allocation): Allocation {
  const total = holdings.usStocks + holdings.intlStocks + holdings.bonds;
  return {
    usStocks: target.usStocks * total - holdings.usStocks,
    intlStocks: target.intlStocks * total - holdings.intlStocks,
    bonds: target.bonds * total - holdings.bonds,
  };
}
