// Generates CONTENT_REVIEW.md. Run with: npm run review
import { writeFileSync } from "node:fs";
import { renderContentReviewMarkdown } from "../src/content/contentReviewMarkdown.ts";

writeFileSync(new URL("../CONTENT_REVIEW.md", import.meta.url), renderContentReviewMarkdown());
console.log("Wrote CONTENT_REVIEW.md");
