import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { gateBootScript, hashPasscode, PASSCODE_SALT } from "@/lib/gate/hash";

describe("passcode hashing", () => {
  it("matches the CLI helper (salted SHA-256, trimmed)", async () => {
    const expected = createHash("sha256")
      .update(PASSCODE_SALT + "open sesame")
      .digest("hex");
    expect(await hashPasscode("  open sesame ")).toBe(expected);
  });

  it("CLI script uses the same salt", async () => {
    const { readFileSync } = await import("node:fs");
    const script = readFileSync(`${__dirname}/../scripts/hash-passcode.mjs`, "utf8");
    expect(script).toContain(`const SALT = "${PASSCODE_SALT}"`);
  });
});

describe("gate boot script", () => {
  const run = (hash: string) => {
    document.documentElement.removeAttribute("data-gate");
    new Function(gateBootScript(hash))();
    return document.documentElement.getAttribute("data-gate");
  };

  it("does nothing when no passcode is configured", () => {
    expect(run("")).toBeNull();
  });

  it("locks a device that hasn't unlocked", () => {
    localStorage.clear();
    expect(run("abc")).toBe("locked");
  });

  it("stays unlocked on a device that already entered the current passcode", () => {
    localStorage.setItem("eco:gate", "abc");
    expect(run("abc")).toBeNull();
  });

  it("asks again after the passcode changes", () => {
    localStorage.setItem("eco:gate", "old");
    expect(run("new")).toBe("locked");
  });
});

describe("boot scripts", () => {
  it("theme script is valid JavaScript that applies a saved dark preference", async () => {
    const { themeBootScript } = await import("@/lib/theme");
    window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;
    localStorage.setItem("eco:theme", "dark");
    new Function(themeBootScript)();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    document.documentElement.classList.remove("dark");
  });
});

describe("applyBootState (re-applied after client renders)", () => {
  it("locks, unlocks and applies the saved theme", async () => {
    const { applyBootState } = await import("@/lib/boot");
    window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;
    localStorage.clear();
    localStorage.setItem("eco:theme", "dark");
    applyBootState("abc");
    expect(document.documentElement.getAttribute("data-gate")).toBe("locked");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    localStorage.setItem("eco:gate", "abc");
    applyBootState("abc");
    expect(document.documentElement.getAttribute("data-gate")).toBeNull();
    document.documentElement.classList.remove("dark");
  });
});
