import { describe, expect, it } from "vitest";
import { searchGlossary } from "@/content/glossary";

describe("glossary search", () => {
  it("returns everything alphabetically for an empty query", () => {
    const all = searchGlossary("");
    expect(all.length).toBeGreaterThan(10);
    expect(all.map((t) => t.term)).toEqual([...all.map((t) => t.term)].sort((a, b) => a.localeCompare(b)));
  });

  it("finds terms by alias", () => {
    expect(searchGlossary("annual percentage rate")[0].id).toBe("apr");
    expect(searchGlossary("403(b)")[0].id).toBe("401k");
  });

  it("ranks name matches above definition matches", () => {
    expect(searchGlossary("index")[0].id).toBe("index-fund");
  });

  it("is case-insensitive", () => {
    expect(searchGlossary("ROTH")[0].id).toBe("roth-ira");
  });
});

describe("short citations", async () => {
  const { shortCitation } = await import("@/content/sources");
  const base = { id: "x", title: "t", kind: "academic" as const, sections: [] };
  it("abbreviates institutions", () => {
    expect(shortCitation({ ...base, authors: "Consumer Financial Protection Bureau", year: "updated regularly" })).toBe(
      "CFPB",
    );
  });
  it("uses surnames and year for people", () => {
    expect(shortCitation({ ...base, authors: "Sharpe, W. F.", year: 1991 })).toBe("Sharpe, 1991");
    expect(shortCitation({ ...base, authors: "Barber, B. M. & Odean, T.", year: 2000 })).toBe("Barber & Odean, 2000");
    expect(shortCitation({ ...base, authors: "Cooley, P. L., Hubbard, C. M. & Walz, D. T.", year: 1998 })).toBe(
      "Cooley et al., 1998",
    );
  });
});
