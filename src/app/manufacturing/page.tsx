import type { Metadata } from "next";
import ManufacturingClient from "./client";

export const metadata: Metadata = {
  title: "Manufacturing — From Synthesis to Vial | Nexphoria",
  description:
    "Fully traceable peptide manufacturing: solid-phase synthesis, HPLC purification, lyophilization, five QC gates, monitored 2-8°C cold chain, and per-lot certificates of analysis. For research use only.",
  alternates: {
    canonical: "https://nexphoria.com/manufacturing",
  },
  openGraph: {
    title: "Manufacturing — From Synthesis to Vial | Nexphoria",
    description:
      "Solid-phase synthesis, HPLC purification, five QC gates, monitored cold chain, and full batch traceability.",
    url: "https://nexphoria.com/manufacturing",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Manufacturing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manufacturing — From Synthesis to Vial | Nexphoria",
    description: "Solid-phase synthesis, HPLC purification, five QC gates, monitored cold chain, and full batch traceability.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const manufacturingSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://nexphoria.com/manufacturing",
  name: "Manufacturing — From Synthesis to Vial",
  url: "https://nexphoria.com/manufacturing",
  description:
    "Fully traceable peptide manufacturing: solid-phase synthesis, HPLC purification, lyophilization, QC gates, cold chain, and per-lot certificates of analysis.",
  isPartOf: { "@type": "WebSite", url: "https://nexphoria.com" },
  about: {
    "@type": "Thing",
    name: "Peptide Manufacturing & Supply Chain",
    description:
      "Solid-phase peptide synthesis, HPLC purification, lyophilization, quality-control gates, monitored cold-chain logistics, and batch traceability.",
  },
};

export default function ManufacturingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(manufacturingSchema) }}
      />
      <ManufacturingClient />
    </>
  );
}
