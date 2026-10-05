import Link from "next/link";
import { Greeting } from "@/components/Greeting";
import { siteConfig } from "@/config/site";
import { isAvailable } from "@/content/routes";
import { Disclaimer } from "@/components/lesson/Boxes";

const sections = [
  {
    href: "/budget/",
    title: "Budget plan and tracker",
    body: "Set up a plan around your real take-home pay and goals, then track how each month actually goes.",
  },
  {
    href: "/credit/",
    title: "Credit, loans and debt",
    body: "How credit scores work, what loans really cost, and how to get out of debt faster.",
  },
  {
    href: "/investing/",
    title: "Understanding investing",
    body: "Why investing matters, what the evidence says works, and the traps to avoid.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="pb-10 pt-12 sm:pt-20">
        <Greeting />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {siteConfig.name} is a private guide to managing money: budgeting, credit, and investing, explained in plain
          English. Every claim links to where it comes from, and every calculator shows its math.
        </p>
      </section>

      <section aria-labelledby="start-here" className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <h2 id="start-here" className="text-2xl font-semibold">
          Start here
        </h2>
        <p className="mt-2 text-muted">
          A suggested order for someone heading into grad school. Each step builds on the one before.
        </p>
        <ol className="mt-6 space-y-3">
          {siteConfig.startHere.map((step, i) => {
            const ready = isAvailable(step.href);
            const inner = (
              <>
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    ready ? "bg-accent text-on-accent" : "bg-surface-2 text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">
                    {step.title}
                    {!ready && <span className="ml-2 text-sm font-normal text-muted">(coming soon)</span>}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{step.why}</span>
                </span>
              </>
            );
            return (
              <li key={step.href}>
                {ready ? (
                  <Link href={step.href} className="flex gap-4 rounded-lg p-2 hover:bg-surface-2">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex gap-4 p-2">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="sections" className="mt-12">
        <h2 id="sections" className="text-2xl font-semibold">
          Everything on the site
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {sections.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <span className="block text-lg font-semibold">{s.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{s.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12">
        <Disclaimer compact />
      </div>
    </div>
  );
}
