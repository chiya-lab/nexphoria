import type { Metadata } from "next";
import PprHeroBlock from "@/components/home/PprHeroBlock";
import PprStatRow from "@/components/home/PprStatRow";
import PprTrustMarquee from "@/components/home/PprTrustMarquee";
import PprCategoryGrid from "@/components/home/PprCategoryGrid";
import PprBestsellerRail from "@/components/home/PprBestsellerRail";
import PprStackCtaBand from "@/components/home/PprStackCtaBand";
import PprReviewCarousel from "@/components/home/PprReviewCarousel";
import PprStandardGrid from "@/components/home/PprStandardGrid";
import PprProtocolsTeaser from "@/components/home/PprProtocolsTeaser";
import PprJournalLatest from "@/components/home/PprJournalLatest";
import PprNewsletterBand from "@/components/home/PprNewsletterBand";

export const metadata: Metadata = {
  title: "Nexphoria — Research-Grade Peptide Compounds",
  description:
    "Pharmaceutical-grade peptide compounds manufactured under cGMP standards. Third-party tested for identity, purity, and potency. BPC-157, Semaglutide, Tirzepatide, GHK-Cu, and 30+ more. For qualified research use only.",
  alternates: {
    canonical: "https://nexphoria.com",
  },
  openGraph: {
    title: "Nexphoria — Research-Grade Peptide Compounds",
    description:
      "Pharmaceutical-grade peptide compounds manufactured under cGMP standards. Third-party tested for identity, purity, and potency.",
    url: "https://nexphoria.com",
    siteName: "Nexphoria",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexphoria — Research-Grade Peptide Compounds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexphoria — Research-Grade Peptide Compounds",
    description:
      "Pharmaceutical-grade peptide compounds manufactured under cGMP standards.",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      {/* ─── ABOVE THE FOLD (Nexphoria 03) ─── */}
      <PprHeroBlock />
      <PprStatRow />
      <PprTrustMarquee />

      {/* ─── BELOW THE FOLD (Nexphoria 04) ─── */}
      <PprCategoryGrid />
      <PprBestsellerRail />
      <PprStackCtaBand />
      <PprReviewCarousel />
      <PprStandardGrid />
      <PprProtocolsTeaser />
      <PprJournalLatest />
      <PprNewsletterBand />
    </>
  );
}
