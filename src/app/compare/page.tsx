import type { Metadata } from "next";
import { Suspense } from "react";
import PprCompareHero from "@/components/compare/PprCompareHero";
import ComparePageClient from "./ComparePageClient";

export const metadata: Metadata = {
  title: "Compare Research Compounds — Nexphoria",
  description:
    "Side-by-side comparison of Nexphoria research peptides. Compare purity, pack pricing, half-life, solubility, reconstitution, and stability for up to 4 compounds at once. For research use only.",
  openGraph: {
    title: "Compare Research Compounds — Nexphoria",
    description:
      "Side-by-side specification matrix for research peptides. Purity, pricing, half-life, solubility, and more.",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com/" },
    { "@type": "ListItem", position: 2, name: "Compare", item: "https://nexphoria.com/compare" },
  ],
};

export default function ComparePage({
  searchParams,
}: {
  searchParams?: { ids?: string };
}) {
  const ids = searchParams?.ids ?? "";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <PprCompareHero />
      <Suspense fallback={<div className="min-h-[40vh]" style={{ backgroundColor: "var(--ink)" }} />}>
        <ComparePageClient initialIds={ids} />
      </Suspense>
    </>
  );
}
