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

import { CompoundCalculator } from "@/components/calculators/CompoundCalculator";
import { DiversificationSim } from "@/components/calculators/DiversificationSim";
import { FeeDragCalculator } from "@/components/calculators/FeeDragCalculator";
import { NextDollarHelper } from "@/components/calculators/NextDollarHelper";
import { AutoTransfers } from "@/components/budget/AutoTransfers";
import { AmortizationCalculator } from "@/components/calculators/AmortizationCalculator";
import { DebtPayoffPlanner } from "@/components/calculators/DebtPayoffPlanner";
import { RentVsBuyCalculator } from "@/components/calculators/RentVsBuyCalculator";
import { ScoreFactors } from "@/components/credit/ScoreFactors";
import { UtilizationCalculator } from "@/components/credit/UtilizationCalculator";
import { DebtWarningCheck } from "@/components/credit/DebtWarningCheck";
import { AllocationTool } from "@/components/calculators/AllocationTool";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";

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
  CompoundCalculator,
  DiversificationSim,
  FeeDragCalculator,
  NextDollarHelper,
  AutoTransfers,
  AmortizationCalculator,
  DebtPayoffPlanner,
  RentVsBuyCalculator,
  ScoreFactors,
  UtilizationCalculator,
  DebtWarningCheck,
  AllocationTool,
  RetirementCalculator,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
