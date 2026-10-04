import { monthlyPayment } from "./amortization";

export interface RentVsBuyInput {
  years: number;
  // Buying
  price: number;
  downPct: number;
  mortgageRate: number;
  termYears: number;
  closingPct: number;
  sellingPct: number;
  propertyTaxPct: number;
  insurancePerYear: number;
  maintenancePct: number;
  hoaPerMonth: number;
  appreciation: number;
  // Renting
  rentPerMonth: number;
  rentGrowth: number;
  rentersInsurancePerYear: number;
  // Both
  investReturn: number;
}

export interface YearRow {
  year: number;
  buyNetWorth: number;
  rentNetWorth: number;
  homeValue: number;
  mortgageBalance: number;
}

export interface RentVsBuyResult {
  rows: YearRow[];
  upfront: number;
  payment: number;
  /** First year in which buying comes out ahead, or null within the horizon. */
  breakEvenYear: number | null;
  totalOwnerCosts: number;
  totalRent: number;
}

/**
 * Compares two people with the same money. The buyer pays the down payment
 * and closing costs and then the costs of owning; the renter invests that
 * upfront cash instead. Each month, whoever's housing costs less invests the
 * difference at the same return, so neither side gets "free" money. Net
 * worth for the buyer counts the home as if sold (minus selling costs).
 * Income taxes, including the mortgage interest deduction, are ignored.
 */
export function rentVsBuy(i: RentVsBuyInput): RentVsBuyResult {
  const loan = i.price * (1 - i.downPct);
  const n = i.termYears * 12;
  const r = i.mortgageRate / 12;
  const payment = loan > 0 ? monthlyPayment(loan, i.mortgageRate, n) : 0;
  const upfront = i.price * i.downPct + i.price * i.closingPct;
  const g = Math.pow(1 + i.investReturn, 1 / 12) - 1;

  let balance = loan;
  let home = i.price;
  let rent = i.rentPerMonth;
  let buyPortfolio = 0;
  let rentPortfolio = upfront;
  let totalOwnerCosts = upfront;
  let totalRent = 0;
  const rows: YearRow[] = [];
  let breakEvenYear: number | null = null;

  for (let m = 1; m <= i.years * 12; m++) {
    let mortgage = 0;
    if (balance > 0.005) {
      const interest = balance * r;
      mortgage = Math.min(payment, balance + interest);
      balance = balance + interest - mortgage;
    }
    const owner =
      mortgage + (home * (i.propertyTaxPct + i.maintenancePct)) / 12 + i.insurancePerYear / 12 + i.hoaPerMonth;
    const renter = rent + i.rentersInsurancePerYear / 12;
    totalOwnerCosts += owner;
    totalRent += renter;
    buyPortfolio = buyPortfolio * (1 + g) + Math.max(0, renter - owner);
    rentPortfolio = rentPortfolio * (1 + g) + Math.max(0, owner - renter);
    home *= Math.pow(1 + i.appreciation, 1 / 12);
    if (m % 12 === 0) {
      rent *= 1 + i.rentGrowth;
      const year = m / 12;
      const buyNetWorth = home * (1 - i.sellingPct) - Math.max(0, balance) + buyPortfolio;
      rows.push({
        year,
        buyNetWorth,
        rentNetWorth: rentPortfolio,
        homeValue: home,
        mortgageBalance: Math.max(0, balance),
      });
      if (breakEvenYear === null && buyNetWorth >= rentPortfolio) breakEvenYear = year;
    }
  }
  return { rows, upfront, payment, breakEvenYear, totalOwnerCosts, totalRent };
}
