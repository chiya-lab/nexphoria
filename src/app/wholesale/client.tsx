"use client";

import PprWholesaleHero from "@/components/wholesale/PprWholesaleHero";
import PprWholesaleTiers from "@/components/wholesale/PprWholesaleTiers";
import PprWholesaleBenefits from "@/components/wholesale/PprWholesaleBenefits";
import PprWholesaleForm from "@/components/wholesale/PprWholesaleForm";
import PprWholesaleFaq from "@/components/wholesale/PprWholesaleFaq";
import PprWholesaleCta from "@/components/wholesale/PprWholesaleCta";

export default function WholesaleClient() {
  return (
    <>
      <PprWholesaleHero />
      <PprWholesaleTiers />
      <PprWholesaleBenefits />
      <PprWholesaleForm />
      <PprWholesaleFaq />
      <PprWholesaleCta />
    </>
  );
}
