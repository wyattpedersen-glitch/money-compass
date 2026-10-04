import { GATE_STORAGE_KEY } from "./gate/hash";
import { THEME_KEY } from "./theme";

/**
 * Same logic as the inline boot scripts, for re-applying after React renders
 * <html> on the client (React resets attributes it doesn't own, which would
 * otherwise drop the dark-mode class and the gate lock).
 */
export function applyBootState(expectedHash: string) {
  const root = document.documentElement;
  try {
    const t = localStorage.getItem(THEME_KEY);
    const dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", dark);
  } catch {
    // Storage blocked: leave the theme as rendered.
  }
  if (!expectedHash) return;
  let unlocked = false;
  try {
    unlocked = localStorage.getItem(GATE_STORAGE_KEY) === expectedHash;
  } catch {
    unlocked = false;
  }
  if (unlocked) root.removeAttribute("data-gate");
  else root.setAttribute("data-gate", "locked");
}
