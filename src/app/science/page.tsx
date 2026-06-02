import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PprScienceHero from "@/components/science/PprScienceHero";
import PprPurityStandards from "@/components/science/PprPurityStandards";
import PprAnalyticalMethods from "@/components/science/PprAnalyticalMethods";
import PprCoaWalkthrough from "@/components/science/PprCoaWalkthrough";
import PprStabilityData from "@/components/science/PprStabilityData";
import PprPublications from "@/components/science/PprPublications";
import PprScienceFaq from "@/components/science/PprScienceFaq";
import PprScienceCta from "@/components/science/PprScienceCta";

export const metadata: Metadata = {
  title: "The Science — Purity, Methods & COA | Nexphoria",
  description:
    "The data behind every vial: HPLC purity tiers, mass spectrometry identity, endotoxin and residual-solvent screening, COA walkthrough, stability data, and peer-reviewed methods. For research use only.",
  alternates: { canonical: "https://nexphoria.com/science" },
  openGraph: {
    title: "The Science — Purity, Methods & COA | Nexphoria",
    description:
      "HPLC purity tiers, mass spectrometry identity, endotoxin and residual-solvent screening, COA walkthrough, and stability data.",
    url: "https://nexphoria.com/science",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria analytical science" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Science — Purity, Methods & COA | Nexphoria",
    description: "HPLC purity tiers, mass spec identity, endotoxin screening, COA walkthrough, and stability data.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const scienceSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://nexphoria.com/science",
  name: "The Science — Purity, Methods & COA",
  url: "https://nexphoria.com/science",
  description:
    "Analytical transparency at Nexphoria: HPLC purity verification, mass spectrometry identity confirmation, endotoxin and residual-solvent screening, and independent third-party Certificates of Analysis.",
  isPartOf: { "@type": "WebSite", url: "https://nexphoria.com" },
  about: {
    "@type": "Thing",
    name: "Peptide Analytical Characterization",
    description:
      "HPLC purity analysis, mass spectrometry verification, endotoxin (LAL) screening, residual solvent analysis, and Certificate of Analysis documentation.",
  },
  specialty: [
    "HPLC Purity Analysis",
    "Mass Spectrometry Verification",
    "Endotoxin (LAL) Testing",
    "Residual Solvent Analysis",
    "Certificate of Analysis",
  ],
};

export default function SciencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scienceSchema) }}
      />
      <div style={{ backgroundColor: "var(--ink)" }}>
        <div className="px-5 pt-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "The Science" }]} variant="dark" />
          </div>
        </div>
        <PprScienceHero />
        <PprPurityStandards />
        <PprAnalyticalMethods />
        <PprCoaWalkthrough />
        <PprStabilityData />
        <PprPublications />
        <PprScienceFaq />
        <PprScienceCta />
      </div>
    </>
  );
}
