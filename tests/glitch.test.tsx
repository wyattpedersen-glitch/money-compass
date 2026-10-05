import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Greeting } from "@/components/Greeting";
import {
  GLITCH_MAX_DURATION_MS,
  GLITCH_MAX_GAP_MS,
  GLITCH_MIN_DURATION_MS,
  GLITCH_MIN_GAP_MS,
  glitchDuration,
  nextGlitchGap,
  swapWindow,
  wantsImmediateGlitch,
} from "@/lib/glitch/schedule";

describe("glitch schedule", () => {
  it("waits a random 1.5 to 5 minutes between glitches", () => {
    expect(nextGlitchGap(() => 0)).toBe(GLITCH_MIN_GAP_MS);
    expect(nextGlitchGap(() => 0.999999)).toBeCloseTo(GLITCH_MAX_GAP_MS, -2);
    expect(GLITCH_MIN_GAP_MS).toBeGreaterThanOrEqual(60_000);
  });

  it("lasts 300 to 600ms", () => {
    expect(glitchDuration(() => 0)).toBe(GLITCH_MIN_DURATION_MS);
    expect(glitchDuration(() => 1)).toBe(GLITCH_MAX_DURATION_MS);
    expect(GLITCH_MIN_DURATION_MS).toBe(300);
    expect(GLITCH_MAX_DURATION_MS).toBe(600);
  });

  it("swaps the text only in the middle of the glitch", () => {
    expect(swapWindow(500)).toEqual({ start: 150, end: 350 });
  });

  it("recognizes ?glitch=now", () => {
    expect(wantsImmediateGlitch("?glitch=now")).toBe(true);
    expect(wantsImmediateGlitch("?x=1&glitch=now")).toBe(true);
    expect(wantsImmediateGlitch("?glitch=later")).toBe(false);
    expect(wantsImmediateGlitch("")).toBe(false);
  });
});

function mockMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduce") ? reduce : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("<Greeting />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/?glitch=now");
  });
  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, "", "/");
  });

  const visible = () => document.querySelector(".glitch")!;

  it("always gives screen readers the real greeting", () => {
    mockMotion(false);
    render(<Greeting />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("For Daniel, with love");
  });

  it("?glitch=now flickers to the alternate text and snaps back", () => {
    mockMotion(false);
    vi.spyOn(Math, "random").mockReturnValue(0.5); // 450ms glitch
    render(<Greeting />);
    expect(visible()).toHaveTextContent("For Daniel <3");
    act(() => void vi.advanceTimersByTime(700)); // glitch starts
    expect(visible()).toHaveAttribute("data-glitching", "true");
    act(() => void vi.advanceTimersByTime(200)); // inside swap window
    expect(visible()).toHaveTextContent("For Diddy <3");
    act(() => void vi.advanceTimersByTime(300)); // over
    expect(visible()).toHaveTextContent("For Daniel <3");
    expect(visible()).toHaveAttribute("data-glitching", "false");
    vi.mocked(Math.random).mockRestore();
  });

  it("never glitches when reduced motion is preferred", () => {
    mockMotion(true);
    render(<Greeting />);
    act(() => void vi.advanceTimersByTime(GLITCH_MAX_GAP_MS * 3));
    expect(visible()).toHaveAttribute("data-glitching", "false");
    expect(visible()).toHaveTextContent("For Daniel <3");
  });
});
