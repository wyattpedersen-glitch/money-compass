import { describe, expect, it } from "vitest";
import { monthLabel, usdCompact } from "@/lib/format";

describe("usdCompact", () => {
  it("formats chart axis values the same everywhere", () => {
    expect(usdCompact(0)).toBe("$0");
    expect(usdCompact(950)).toBe("$950");
    expect(usdCompact(5000)).toBe("$5K");
    expect(usdCompact(12_340)).toBe("$12.3K");
    expect(usdCompact(999_999)).toBe("$1M");
    expect(usdCompact(1_250_000)).toBe("$1.3M");
    expect(usdCompact(-20_000)).toBe("-$20K");
  });
});

describe("monthLabel", () => {
  it("names the month", () => {
    expect(monthLabel("2027-03")).toBe("March 2027");
  });
});
