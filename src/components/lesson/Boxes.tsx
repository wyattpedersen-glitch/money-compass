import type { ReactNode } from "react";
import Link from "next/link";
import { Cite } from "./Cite";

function Box({
  title,
  tone,
  icon,
  children,
}: {
  title: string;
  tone: "accent" | "warn" | "info" | "danger";
  icon: ReactNode;
  children: ReactNode;
}) {
  const tones = {
    accent: "bg-accent-soft border-accent/30",
    warn: "bg-warn-bg border-warn-text/25 text-warn-text",
    info: "bg-info-bg border-info-text/25 text-info-text",
    danger: "bg-danger-bg border-danger-text/25 text-danger-text",
  } as const;
  return (
    <aside className={`print-break-avoid my-8 rounded-xl border p-5 ${tones[tone]}`} aria-label={title}>
      <h2 className="!mt-0 flex items-center gap-2 text-lg font-semibold">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h2>
      <div className="mt-3 space-y-2 [&_li+li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">{children}</div>
    </aside>
  );
}

export function KeyTakeaways({ children }: { children: ReactNode }) {
  return (
    <Box title="Key takeaways" tone="accent" icon="✓">
      {children}
    </Box>
  );
}

export function CommonMistakes({ children }: { children: ReactNode }) {
  return (
    <Box title="Common mistakes" tone="warn" icon="!">
      {children}
    </Box>
  );
}

export function WhyItMatters({ children }: { children: ReactNode }) {
  return (
    <Box title="Why this matters to you" tone="info" icon="→">
      {children}
    </Box>
  );
}

/** A worked example with real numbers. */
export function Example({ title = "Worked example", children }: { title?: string; children: ReactNode }) {
  return (
    <figure className="print-break-avoid my-8 rounded-xl border border-border bg-surface p-5">
      <figcaption className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</figcaption>
      <div className="mt-3 space-y-3">{children}</div>
    </figure>
  );
}

/** Flags where the evidence is mixed or experts disagree. */
export function ExpertsDisagree({ children }: { children: ReactNode }) {
  return (
    <Box title="Where experts disagree" tone="info" icon="⇄">
      {children}
    </Box>
  );
}

export function Uncertain({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface-2 px-3 py-2 text-sm text-muted [&_p]:inline">
      <strong className="text-text">Note on certainty:</strong> {children}
    </div>
  );
}

type Pro = "fiduciary" | "credit-counselor" | "housing-counselor" | "tax";

const pros: Record<Pro, { who: string; when: string; sourceId: string; href: string }> = {
  fiduciary: {
    who: "a fee-only fiduciary financial advisor",
    when: "for a personalized investment or retirement plan",
    sourceId: "investor-gov-advisers",
    href: "https://www.investor.gov/introduction-investing/getting-started/working-investment-professional/investment-advisers",
  },
  "credit-counselor": {
    who: "a nonprofit credit counselor",
    when: "if debt payments feel unmanageable",
    sourceId: "nfcc",
    href: "https://www.nfcc.org/",
  },
  "housing-counselor": {
    who: "a HUD-approved housing counselor",
    when: "before buying a home or if you're behind on rent or a mortgage",
    sourceId: "hud-housing-counselors",
    href: "https://www.hud.gov/counseling",
  },
  tax: {
    who: "a tax professional (a CPA or enrolled agent)",
    when: "for anything beyond a simple tax return",
    sourceId: "irs-choosing-tax-pro",
    href: "https://www.irs.gov/tax-professionals/choosing-a-tax-professional",
  },
};

/** "When to talk to a professional" callout. */
export function SeeAPro({ kind, children }: { kind: Pro; children?: ReactNode }) {
  const p = pros[kind];
  return (
    <Box title="When to talk to a professional" tone="danger" icon="☎">
      <div className="[&_p]:inline">
        {children ?? (
          <>
            Consider talking to {p.who} {p.when}.
          </>
        )}{" "}
        <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
          Where to find one<span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        <Cite id={p.sourceId} />
      </div>
    </Box>
  );
}

/** Short "education, not advice" line used at the top of every lesson. */
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`rounded-md bg-surface-2 text-muted ${compact ? "px-3 py-2 text-sm" : "p-4"}`}>
      <strong className="text-text">Education, not personalized financial advice.</strong> This site explains how things
      generally work. Your situation may differ.{" "}
      <Link href="/about/#disclaimer" className="underline underline-offset-2">
        Read the full disclaimer
      </Link>
      .
    </p>
  );
}

export function LastReviewed({ date }: { date: string }) {
  const nice = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <p className="text-sm text-muted">
      Last reviewed: <time dateTime={date}>{nice}</time>
    </p>
  );
}

/**
 * "How this is calculated" panel for calculators: the formula and every
 * assumption, collapsed by default and expanded when printed.
 */
export function HowCalculated({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-4 rounded-lg border border-border bg-surface-2 p-4">
      <summary className="cursor-pointer font-medium text-text marker:text-accent">How this is calculated</summary>
      <div className="prose-lesson mt-3 text-[0.95rem]">{children}</div>
    </details>
  );
}
