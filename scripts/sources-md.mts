// Generates SOURCES.md from src/content/sources.ts.
// Run with: npm run sources
import { writeFileSync } from "node:fs";
import { renderSourcesMarkdown } from "../src/content/sourcesMarkdown.ts";

writeFileSync(new URL("../SOURCES.md", import.meta.url), renderSourcesMarkdown());
console.log("Wrote SOURCES.md");
