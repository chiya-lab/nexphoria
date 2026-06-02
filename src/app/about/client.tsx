"use client";

import PprAboutHero from "@/components/about/PprAboutHero";
import PprMission from "@/components/about/PprMission";
import PprOriginStory from "@/components/about/PprOriginStory";
import PprMethodology from "@/components/about/PprMethodology";
import PprTeamGrid from "@/components/about/PprTeamGrid";
import PprPartnerLabs from "@/components/about/PprPartnerLabs";
import PprPress from "@/components/about/PprPress";
import PprAboutCta from "@/components/about/PprAboutCta";

export default function AboutClient() {
  return (
    <main>
      <PprAboutHero />
      <PprMission />
      <PprOriginStory />
      <PprMethodology />
      <PprTeamGrid />
      <PprPartnerLabs />
      <PprPress />
      <PprAboutCta />
    </main>
  );
}
