import { mulberry32, normal, percentile } from "./random";

/**
 * A teaching simulation, not a forecast. Each stock's yearly return is the
 * market's return plus its own company-specific shock:
 *
 *   log(1 + stock return) = market draw + company draw
 *
 * Market shocks hit every stock; company shocks are independent, so they
 * cancel out as more stocks are held. That is the core of Markowitz's
 * insight. The default numbers are illustrative round values chosen to look
 * like a broad stock market, not estimates from any dataset.
 */
export interface DiversificationParams {
  years: number;
  stocksInPortfolio: number;
  /** Number of simulated lifetimes. */
  trials: number;
  /** Mean of the market's yearly log return. */
  marketMean: number;
  /** Volatility of the market's yearly log return. */
  marketVol: number;
  /** Volatility of each company's own yearly log shock. */
  companyVol: number;
  seed: number;
}

export const defaultDiversificationParams: DiversificationParams = {
  years: 30,
  stocksInPortfolio: 100,
  trials: 400,
  marketMean: 0.06,
  marketVol: 0.17,
  companyVol: 0.35,
  seed: 42,
};

export interface OutcomeSummary {
  /** Ending value of $1 at the 10th, 50th and 90th percentile. */
  p10: number;
  median: number;
  p90: number;
  /** Share of trials that ended below the starting $1. */
  lossRate: number;
  /** Yearly volatility of returns, averaged across trials. */
  typicalYearlySwing: number;
}

export interface DiversificationResult {
  single: OutcomeSummary;
  portfolio: OutcomeSummary;
  /** A few sample paths of $1 for charting, by year. */
  samplePaths: { single: number[][]; portfolio: number[][] };
}

function summarize(endings: number[], vols: number[]): OutcomeSummary {
  const sorted = [...endings].sort((a, b) => a - b);
  return {
    p10: percentile(sorted, 0.1),
    median: percentile(sorted, 0.5),
    p90: percentile(sorted, 0.9),
    lossRate: endings.filter((x) => x < 1).length / endings.length,
    typicalYearlySwing: vols.reduce((a, b) => a + b, 0) / vols.length,
  };
}

function stdev(xs: number[]): number {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}

export function simulateDiversification(
  p: DiversificationParams = defaultDiversificationParams,
): DiversificationResult {
  const rand = mulberry32(p.seed);
  const n = Math.max(1, Math.round(p.stocksInPortfolio));
  // Company draws are centered so each stock has the same expected value as
  // the market: E[e^(m + c)] = e^m when c ~ N(-σ²/2, σ²).
  const companyMean = -(p.companyVol ** 2) / 2;
  const singleEnds: number[] = [];
  const portEnds: number[] = [];
  const singleVols: number[] = [];
  const portVols: number[] = [];
  const singlePaths: number[][] = [];
  const portPaths: number[][] = [];

  for (let t = 0; t < p.trials; t++) {
    // Each portfolio holds n stocks with equal weight, rebalanced yearly.
    let single = 1;
    let port = 1;
    const singleR: number[] = [];
    const portR: number[] = [];
    const sp = [1];
    const pp = [1];
    for (let y = 0; y < p.years; y++) {
      const market = p.marketMean + p.marketVol * normal(rand);
      let sum = 0;
      let first = 0;
      for (let i = 0; i < n; i++) {
        const r = Math.exp(market + companyMean + p.companyVol * normal(rand)) - 1;
        if (i === 0) first = r;
        sum += r;
      }
      const portR1 = sum / n;
      single *= 1 + first;
      port *= 1 + portR1;
      singleR.push(first);
      portR.push(portR1);
      sp.push(single);
      pp.push(port);
    }
    singleEnds.push(single);
    portEnds.push(port);
    singleVols.push(stdev(singleR));
    portVols.push(stdev(portR));
    if (t < 6) {
      singlePaths.push(sp);
      portPaths.push(pp);
    }
  }
  return {
    single: summarize(singleEnds, singleVols),
    portfolio: summarize(portEnds, portVols),
    samplePaths: { single: singlePaths, portfolio: portPaths },
  };
}
