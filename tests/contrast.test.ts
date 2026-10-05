import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** WCAG 2.x contrast ratio between two hex colors. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = hex.replace("#", "");
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const css = readFileSync(join(__dirname, "../src/app/globals.css"), "utf8");

function tokens(selector: string): Record<string, string> {
  const block = css.match(new RegExp(`^${selector.replace(".", "\\.")} \\{([\\s\\S]*?)\\n\\}`, "m"))?.[1] ?? "";
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
}

// [foreground, background] pairs that carry body-size text.
const pairs: Array<[string, string]> = [
  ["text", "bg"],
  ["text", "surface"],
  ["text", "surface-2"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["muted", "surface-2"],
  ["accent", "bg"],
  ["accent", "surface"],
  ["accent", "accent-soft"],
  ["on-accent", "accent"],
  ["on-accent", "accent-hover"],
  ["warn-text", "warn-bg"],
  ["danger-text", "danger-bg"],
  ["danger-text", "surface"],
  ["info-text", "info-bg"],
];

describe("color contrast (WCAG AA, 4.5:1)", () => {
  it("matches a known value", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  for (const theme of [":root", ".dark"]) {
    const t = tokens(theme);
    for (const [fg, bg] of pairs) {
      it(`${theme}: ${fg} on ${bg}`, () => {
        expect(t[fg], `missing --${fg}`).toBeDefined();
        expect(t[bg], `missing --${bg}`).toBeDefined();
        expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
