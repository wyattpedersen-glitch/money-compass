import type { Metadata } from "next";

export const metadata: Metadata = { title: "About this site" };

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <article className="prose-lesson mx-auto max-w-3xl px-4 pb-8 pt-10 sm:pt-14">{children}</article>;
}
