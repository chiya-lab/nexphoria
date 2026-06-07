import type { Metadata } from "next";
import Script from "next/script";
import { products } from "@/lib/products";
import { COA_SLUGS, labPartnerFor, lotPatternFor } from "@/lib/coa";
import CoaViewerClient, { type CoaEntry } from "./CoaViewerClient";

export const metadata: Metadata = {
  title: "Certificate of Analysis Library | Nexphoria",
  description:
    "Search Nexphoria's Certificate of Analysis library by compound name or lot. Every lot is verified by independent HPLC / ESI-MS analysis with a lot-specific COA.",
  alternates: { canonical: "https://nexphoria.com/coa" },
  openGraph: {
    title: "Certificate of Analysis Library | Nexphoria",
    description:
      "Independent HPLC / ESI-MS verification and lot-specific COAs for every research compound we supply.",
    url: "https://nexphoria.com/coa",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Nexphoria Certificate of Analysis Library",
  url: "https://nexphoria.com/coa",
  description:
    "Searchable library of sample Certificates of Analysis for Nexphoria research compounds, each verified by an independent analytical laboratory.",
};

export default function CoaLibraryPage() {
  const entries: CoaEntry[] = COA_SLUGS.map((slug) => {
    const product = products.find((p) => p.slug === slug);
    return {
      slug,
      name: product?.name ?? slug,
      casNumber: product?.casNumber ?? "—",
      purity: product?.purity ?? "—",
      category: product?.category ?? "Research Compound",
      labPartner: labPartnerFor(slug),
      lotPattern: lotPatternFor(slug),
    };
  });

  return (
    <>
      <Script
        id="coa-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CoaViewerClient entries={entries} />
    </>
  );
}
