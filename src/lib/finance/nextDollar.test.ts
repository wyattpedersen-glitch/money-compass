import { describe, expect, it } from "vitest";
import { nextDollarSteps, type NextDollarInput } from "./nextDollar";

const none: NextDollarInput = {
  hasStarterEmergencyFund: false,
  employerMatchAvailable: false,
  gettingFullMatch: false,
  hasHighInterestDebt: false,
  hasFullEmergencyFund: false,
  hsaEligible: false,
  hasEarnedIncome: false,
  maxingIra: false,
  hasWorkplacePlan: false,
  maxingWorkplacePlan: false,
};

describe("next dollar priority", () => {
  it("starts with a starter emergency fund", () => {
    expect(nextDollarSteps(none).next?.id).toBe("starter-emergency");
  });
  it("puts the employer match before paying off high-interest debt", () => {
    const r = nextDollarSteps({
      ...none,
      hasStarterEmergencyFund: true,
      employerMatchAvailable: true,
      hasHighInterestDebt: true,
    });
    expect(r.next?.id).toBe("employer-match");
  });
  it("then high-interest debt", () => {
    const r = nextDollarSteps({
      ...none,
      hasStarterEmergencyFund: true,
      employerMatchAvailable: true,
      gettingFullMatch: true,
      hasHighInterestDebt: true,
    });
    expect(r.next?.id).toBe("high-interest-debt");
  });
  it("skips steps that don't apply (no match, no HSA, no earned income)", () => {
    const r = nextDollarSteps({ ...none, hasStarterEmergencyFund: true, hasFullEmergencyFund: true });
    expect(r.next?.id).toBe("taxable");
    expect(r.steps.find((s) => s.id === "ira")?.notApplicable).toBe(true);
  });
  it("a grad student with a taxable stipend and an emergency fund is pointed at an IRA", () => {
    const r = nextDollarSteps({ ...none, hasFullEmergencyFund: true, hasEarnedIncome: true });
    expect(r.next?.id).toBe("ira");
  });
  it("keeps the canonical order", () => {
    expect(nextDollarSteps(none).steps.map((s) => s.id)).toEqual([
      "starter-emergency",
      "employer-match",
      "high-interest-debt",
      "full-emergency",
      "hsa",
      "ira",
      "workplace-max",
      "taxable",
    ]);
  });
});
