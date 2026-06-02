import type { Metadata } from "next";
import { protocols, PROTOCOL_CATEGORIES } from "@/lib/mock-protocols";
import PprProtocolsHero from "@/components/protocols/PprProtocolsHero";
import PprProtocolGrid from "@/components/protocols/PprProtocolGrid";

export const metadata: Metadata = {
  title: "Research Protocols | Nexphoria",
  description:
    "Pre-composed peptide research protocols summarizing typical research dosing observed in published literature — schedule, reconstitution, monitoring metrics, and citations. For research use only.",
  alternates: { canonical: "https://nexphoria.com/protocols" },
  openGraph: {
    title: "Research Protocols | Nexphoria",
    description:
      "Pre-composed peptide research protocols with schedule, reconstitution, monitoring, and citations.",
    url: "https://nexphoria.com/protocols",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Research Protocols" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Protocols | Nexphoria",
    description: "Pre-composed peptide research protocols with schedule, reconstitution, monitoring, and citations.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com/" },
    { "@type": "ListItem", position: 2, name: "Research Protocols" },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Nexphoria Research Protocols",
  itemListElement: protocols.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: p.name,
    url: `https://nexphoria.com/protocols/${p.slug}`,
  })),
};

export default function ProtocolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div style={{ backgroundColor: "var(--ink)" }}>
        <PprProtocolsHero />
        <PprProtocolGrid protocols={protocols} categories={PROTOCOL_CATEGORIES} />
      </div>
    </>
  );
}
