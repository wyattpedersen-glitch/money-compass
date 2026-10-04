import { describe, expect, it } from "vitest";
import { niceTicks } from "@/components/calculators/LineChart";

describe("chart axis ticks", () => {
  it("always cover the data range", () => {
    for (const [min, max] of [
      [0, 750_000],
      [0, 404_108],
      [0, 1],
      [-5, 123],
      [0, 98_765_432],
    ]) {
      const t = niceTicks(min, max);
      expect(t[0]).toBeLessThanOrEqual(min);
      expect(t[t.length - 1]).toBeGreaterThanOrEqual(max);
      expect(t.length).toBeLessThanOrEqual(7);
    }
  });
});
