"use client";

import PprPolicyHero from "@/components/policies/PprPolicyHero";
import PprReturnsEligibility from "@/components/policies/PprReturnsEligibility";
import PprReturnsProcess from "@/components/policies/PprReturnsProcess";
import PprPolicyFaq from "@/components/policies/PprPolicyFaq";
import PprPolicyCta from "@/components/policies/PprPolicyCta";

export default function ReturnsClient() {
  return (
    <>
      <PprPolicyHero
        eyebrow="Returns & refunds"
        title="Clear terms, verified by lot"
        subtitle="When a research compound qualifies for return or replacement, and how the process works: eligibility by scenario, a four-step resolution, and answers to common shipping and returns questions."
        lastUpdated="June 2026"
        crumbs={[{ label: "Home", href: "/" }, { label: "Returns" }]}
      />
      <PprReturnsEligibility />
      <PprReturnsProcess />
      <PprPolicyFaq />
      <PprPolicyCta />
    </>
  );
}
