import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer data-site-footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-sm text-muted">
        <p>
          <strong className="text-text">Education, not personalized financial advice.</strong> {siteConfig.name}{" "}
          explains how money generally works and cites its sources. For decisions about your own situation, talk to a
          qualified professional.{" "}
          <Link href="/about/#disclaimer" className="underline underline-offset-2">
            Full disclaimer
          </Link>
        </p>
        <p>
          Everything you enter stays in this browser on this device.{" "}
          <Link href="/settings/" className="underline underline-offset-2">
            Back up or move your data
          </Link>
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li>
              <Link href="/about/" className="underline underline-offset-2">
                About
              </Link>
            </li>
            <li>
              <Link href="/sources/" className="underline underline-offset-2">
                Sources
              </Link>
            </li>
            <li>
              <Link href="/glossary/" className="underline underline-offset-2">
                Glossary
              </Link>
            </li>
            <li>
              <Link href="/settings/" className="underline underline-offset-2">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
