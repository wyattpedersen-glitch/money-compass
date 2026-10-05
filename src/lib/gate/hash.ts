/**
 * The passcode gate stores and compares a SHA-256 hash, never the passcode
 * itself, so the plain passcode doesn't appear in the shipped JavaScript.
 * This is a courtesy lock: anyone determined can read the site's code.
 */
export const PASSCODE_SALT = "epicurus-and-co:";

/** The localStorage key that remembers this device has been unlocked. */
export const GATE_STORAGE_KEY = "eco:gate";

export function normalizePasscode(passcode: string): string {
  return passcode.trim();
}

export async function hashPasscode(passcode: string): Promise<string> {
  const bytes = new TextEncoder().encode(PASSCODE_SALT + normalizePasscode(passcode));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The expected hash from the build environment, or "" when the gate is off. */
export const expectedPasscodeHash = (process.env.NEXT_PUBLIC_PASSCODE_HASH ?? "").trim().toLowerCase();

/**
 * Inline script that runs before first paint. It locks the page unless this
 * device already unlocked with the current passcode, so the content doesn't
 * flash before the gate appears.
 */
export function gateBootScript(hash: string): string {
  return `(function(){var h=${JSON.stringify(hash)};if(!h)return;try{if(localStorage.getItem(${JSON.stringify(GATE_STORAGE_KEY)})===h)return}catch(e){}document.documentElement.setAttribute("data-gate","locked")})();`;
}
