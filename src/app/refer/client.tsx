"use client";

import PprReferHero from "@/components/refer/PprReferHero";
import PprReferLinkBox from "@/components/refer/PprReferLinkBox";
import PprReferStats from "@/components/refer/PprReferStats";
import PprReferProgram from "@/components/refer/PprReferProgram";
import PprReferFaq from "@/components/refer/PprReferFaq";
import PprReferCta from "@/components/refer/PprReferCta";

export default function ReferClient() {
  return (
    <>
      <PprReferHero />
      <PprReferLinkBox />
      <PprReferStats />
      <PprReferProgram />
      <PprReferFaq />
      <PprReferCta />
    </>
  );
}
