/**
 * Timing for the home-page greeting easter egg. Kept pure so it can be
 * tested. Gaps are random (not a fixed timer) and long enough that you can
 * watch for a minute and easily miss it.
 */
export const GLITCH_MIN_GAP_MS = 90_000;
export const GLITCH_MAX_GAP_MS = 300_000;
export const GLITCH_MIN_DURATION_MS = 300;
export const GLITCH_MAX_DURATION_MS = 600;

/** Fraction of the glitch during which the alternate text shows. */
export const SWAP_START = 0.3;
export const SWAP_END = 0.7;

export function nextGlitchGap(rand: () => number = Math.random): number {
  return Math.round(GLITCH_MIN_GAP_MS + rand() * (GLITCH_MAX_GAP_MS - GLITCH_MIN_GAP_MS));
}

export function glitchDuration(rand: () => number = Math.random): number {
  return Math.round(GLITCH_MIN_DURATION_MS + rand() * (GLITCH_MAX_DURATION_MS - GLITCH_MIN_DURATION_MS));
}

export function swapWindow(durationMs: number): { start: number; end: number } {
  return {
    start: Math.round(durationMs * SWAP_START),
    end: Math.round(durationMs * SWAP_END),
  };
}

/** True when the URL asks for an immediate glitch (`?glitch=now`). */
export function wantsImmediateGlitch(search: string): boolean {
  return new URLSearchParams(search).get("glitch") === "now";
}
