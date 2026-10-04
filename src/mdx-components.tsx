import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Cite } from "@/components/lesson/Cite";
import { Term } from "@/components/lesson/Term";
import { Fig } from "@/components/lesson/Fig";
import {
  CommonMistakes,
  Disclaimer,
  Example,
  ExpertsDisagree,
  HowCalculated,
  KeyTakeaways,
  SeeAPro,
  Uncertain,
  WhyItMatters,
} from "@/components/lesson/Boxes";

const components: MDXComponents = {
  a: ({ href = "", children, ...rest }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...rest}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ),
  Cite,
  Term,
  Fig,
  KeyTakeaways,
  CommonMistakes,
  WhyItMatters,
  Example,
  ExpertsDisagree,
  HowCalculated,
  SeeAPro,
  Disclaimer,
  Uncertain,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
