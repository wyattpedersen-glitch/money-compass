"use client";

import { useState } from "react";
import { searchGlossary } from "@/content/glossary";
import { getSource, shortCitation } from "@/content/sources";

export function GlossarySearch() {
  const [q, setQ] = useState("");
  const results = searchGlossary(q);
  return (
    <div>
      <label htmlFor="glossary-q" className="block text-sm font-medium">
        Search terms
      </label>
      <input
        id="glossary-q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Try “APR” or “index fund”"
        className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base"
        aria-controls="glossary-results"
      />
      <p className="mt-2 text-sm text-muted" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "term" : "terms"}
      </p>
      <dl id="glossary-results" className="mt-4 space-y-3">
        {results.map((t) => {
          const s = getSource(t.sourceId);
          return (
            <div
              key={t.id}
              id={t.id}
              className="scroll-mt-20 rounded-lg border border-border bg-surface p-4 target:border-accent"
            >
              <dt className="font-semibold">{t.term}</dt>
              <dd className="mt-1 leading-relaxed">{t.definition}</dd>
              <dd className="mt-2 text-sm text-muted">
                Source:{" "}
                <a href={`/sources/#${s.id}`} className="underline underline-offset-2">
                  {shortCitation(s)}, “{s.title}”
                </a>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
