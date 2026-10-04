import { describe, expect, it } from "vitest";
import { rentVsBuy, type RentVsBuyInput } from "./rentVsBuy";

const zero: RentVsBuyInput = {
  years: 1,
  price: 100_000,
  downPct: 1,
  mortgageRate: 0,
  termYears: 30,
  closingPct: 0,
  sellingPct: 0,
  propertyTaxPct: 0,
  insurancePerYear: 0,
  maintenancePct: 0,
  hoaPerMonth: 0,
  appreciation: 0,
  rentPerMonth: 1000,
  rentGrowth: 0,
  rentersInsurancePerYear: 0,
  investReturn: 0,
};

describe("rentVsBuy", () => {
  it("hand-checkable case: cash buyer with no costs saves the rent", () => {
    const r = rentVsBuy(zero);
    expect(r.rows[0].buyNetWorth).toBeCloseTo(112_000, 6);
    expect(r.rows[0].rentNetWorth).toBeCloseTo(100_000, 6);
    expect(r.breakEvenYear).toBe(1);
  });

  it("selling and closing costs count against the buyer", () => {
    const r = rentVsBuy({ ...zero, rentPerMonth: 0, closingPct: 0.03, sellingPct: 0.06 });
    // Buyer: home worth 100k minus 6% = 94k. Renter invested 103k.
    expect(r.rows[0].buyNetWorth).toBeCloseTo(94_000, 6);
    expect(r.rows[0].rentNetWorth).toBeCloseTo(103_000, 6);
    expect(r.breakEvenYear).toBeNull();
  });

  it("mortgage balance is subtracted and paid down", () => {
    const r = rentVsBuy({ ...zero, years: 30, downPct: 0.2, mortgageRate: 0.06, rentPerMonth: 0 });
    expect(r.payment).toBeCloseTo(479.64, 2); // $80k at 6% for 30 years
    expect(r.rows[0].mortgageBalance).toBeGreaterThan(78_000);
    expect(r.rows.at(-1)!.mortgageBalance).toBeCloseTo(0, 2);
  });

  it("higher appreciation favors buying, higher investment returns favor renting", () => {
    const base = {
      ...zero,
      years: 10,
      price: 500_000,
      downPct: 0.2,
      mortgageRate: 0.06,
      propertyTaxPct: 0.01,
      maintenancePct: 0.01,
      rentPerMonth: 2500,
      investReturn: 0.05,
    };
    const gap = (x: RentVsBuyInput) => {
      const last = rentVsBuy(x).rows.at(-1)!;
      return last.buyNetWorth - last.rentNetWorth;
    };
    expect(gap({ ...base, appreciation: 0.05 })).toBeGreaterThan(gap({ ...base, appreciation: 0.01 }));
    expect(gap({ ...base, investReturn: 0.08 })).toBeLessThan(gap(base));
  });
});
