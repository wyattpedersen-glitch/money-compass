// Usage: npm run hash-passcode -- "your passcode"
// Prints the value to put in NEXT_PUBLIC_PASSCODE_HASH (in Vercel or .env.local).
import { createHash } from "node:crypto";

const SALT = "epicurus-and-co:"; // must match src/lib/gate/hash.ts
const passcode = process.argv.slice(2).join(" ").trim();
if (!passcode) {
  console.error('Usage: npm run hash-passcode -- "your passcode"');
  process.exit(1);
}
console.log(
  createHash("sha256")
    .update(SALT + passcode)
    .digest("hex"),
);
