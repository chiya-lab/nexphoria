"use client";

import type { Protocol } from "@/lib/mock-protocols";
import PprProtocolHero from "@/components/protocols/PprProtocolHero";
import PprProtocolStack from "@/components/protocols/PprProtocolStack";
import PprProtocolTimeline from "@/components/protocols/PprProtocolTimeline";
import PprProtocolReconstitution from "@/components/protocols/PprProtocolReconstitution";
import PprProtocolMonitoring from "@/components/protocols/PprProtocolMonitoring";
import PprProtocolCitations from "@/components/protocols/PprProtocolCitations";
import PprProtocolFaq from "@/components/protocols/PprProtocolFaq";
import PprProtocolCta from "@/components/protocols/PprProtocolCta";

interface ProtocolDetailClientProps {
  protocol: Protocol;
}

export default function ProtocolDetailClient({ protocol }: ProtocolDetailClientProps) {
  return (
    <div style={{ backgroundColor: "var(--ink)" }}>
      <PprProtocolHero protocol={protocol} />
      <PprProtocolStack protocol={protocol} />
      <PprProtocolTimeline protocol={protocol} />
      <PprProtocolReconstitution protocol={protocol} />
      <PprProtocolMonitoring protocol={protocol} />
      <PprProtocolCitations dois={protocol.citationDois} />
      <PprProtocolFaq faq={protocol.faq} />
      <PprProtocolCta protocol={protocol} />
    </div>
  );
}
