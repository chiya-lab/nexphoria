"use client";

import PprAffiliateHero from "@/components/affiliate/PprAffiliateHero";
import PprAffiliateTiers from "@/components/affiliate/PprAffiliateTiers";
import PprAffiliateHowItWorks from "@/components/affiliate/PprAffiliateHowItWorks";
import PprAffiliateCalculator from "@/components/affiliate/PprAffiliateCalculator";
import PprAffiliateProof from "@/components/affiliate/PprAffiliateProof";
import PprAffiliateAssets from "@/components/affiliate/PprAffiliateAssets";
import PprAffiliateRules from "@/components/affiliate/PprAffiliateRules";
import PprAffiliateFaq from "@/components/affiliate/PprAffiliateFaq";
import PprAffiliateCta from "@/components/affiliate/PprAffiliateCta";

export default function AffiliatesClient() {
  return (
    <>
      <PprAffiliateHero />
      <PprAffiliateTiers />
      <PprAffiliateHowItWorks />
      <PprAffiliateCalculator />
      <PprAffiliateProof />
      <PprAffiliateAssets />
      <PprAffiliateRules />
      <PprAffiliateFaq />
      <PprAffiliateCta />
    </>
  );
}
