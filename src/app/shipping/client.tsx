"use client";

import PprPolicyHero from "@/components/policies/PprPolicyHero";
import PprShippingMatrix from "@/components/policies/PprShippingMatrix";
import PprColdChainPolicy from "@/components/policies/PprColdChainPolicy";
import PprDiscreetPackaging from "@/components/policies/PprDiscreetPackaging";
import PprTransitMap from "@/components/policies/PprTransitMap";
import PprPolicyFaq from "@/components/policies/PprPolicyFaq";
import PprPolicyCta from "@/components/policies/PprPolicyCta";

export default function ShippingClient() {
  return (
    <>
      <PprPolicyHero
        eyebrow="Shipping & cold chain"
        title="From freezer to your bench, in spec"
        subtitle="How Nexphoria ships research peptides across the contiguous United States: methods and costs, monitored 2–8°C cold chain, discreet packaging, and regional transit times."
        lastUpdated="June 2026"
        crumbs={[{ label: "Home", href: "/" }, { label: "Shipping" }]}
      />
      <PprShippingMatrix />
      <PprColdChainPolicy />
      <PprDiscreetPackaging />
      <PprTransitMap />
      <PprPolicyFaq />
      <PprPolicyCta />
    </>
  );
}
