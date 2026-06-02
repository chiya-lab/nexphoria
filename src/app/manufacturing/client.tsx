"use client";

import PprMfgHero from "@/components/manufacturing/PprMfgHero";
import PprFacilityTour from "@/components/manufacturing/PprFacilityTour";
import PprQualityGates from "@/components/manufacturing/PprQualityGates";
import PprColdChain from "@/components/manufacturing/PprColdChain";
import PprBatchTraceability from "@/components/manufacturing/PprBatchTraceability";
import PprCertifications from "@/components/manufacturing/PprCertifications";
import PprSourceMap from "@/components/manufacturing/PprSourceMap";
import PprMfgCta from "@/components/manufacturing/PprMfgCta";

export default function ManufacturingClient() {
  return (
    <>
      <PprMfgHero />
      <PprFacilityTour />
      <PprQualityGates />
      <PprColdChain />
      <PprBatchTraceability />
      <PprCertifications />
      <PprSourceMap />
      <PprMfgCta />
    </>
  );
}
