import { describe, expect, it } from "vitest";
import { isAvailable } from "@/content/routes";
import { scoreQuiz, type Answers } from "./quiz";

const all: Answers = { struggling: "no", cushion: "yes", "high-interest": "no", tracking: "yes" };

describe("scoreQuiz", () => {
  it("sends someone struggling with payments to getting help first", () => {
    const r = scoreQuiz({ ...all, struggling: "yes" });
    expect(r.result).toBe("debt");
    expect(r.steps[0].href).toBe("/credit/getting-help/");
  });
  it("puts an emergency fund before investing", () => {
    expect(scoreQuiz({ ...all, cushion: "no" }).result).toBe("emergency-fund");
    expect(scoreQuiz({ ...all, cushion: "unsure" }).result).toBe("emergency-fund");
  });
  it("puts expensive debt before investing", () => {
    expect(scoreQuiz({ ...all, "high-interest": "yes" }).result).toBe("debt");
    expect(scoreQuiz({ ...all, "high-interest": "unsure" }).result).toBe("debt");
  });
  it("recommends investing when the basics are covered", () => {
    expect(scoreQuiz(all).result).toBe("investing");
  });
  it("adds the budget first when spending isn't known", () => {
    expect(scoreQuiz({ ...all, tracking: "no" }).steps[0].href).toBe("/budget/");
  });
  it("only links to pages that exist", () => {
    const combos: Answers[] = [
      all,
      { ...all, struggling: "yes" },
      { ...all, cushion: "no" },
      { ...all, "high-interest": "yes", tracking: "no" },
    ];
    for (const c of combos) for (const s of scoreQuiz(c).steps) expect(isAvailable(s.href), s.href).toBe(true);
  });
});
