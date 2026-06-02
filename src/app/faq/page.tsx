import type { Metadata } from "next";
import FaqClient from "./client";
import { FAQ_ITEMS } from "@/components/faq/faqData";

export const metadata: Metadata = {
  title: "FAQ — Peptide Research Questions Answered | Nexphoria",
  description:
    "Answers to the most common questions about Nexphoria research peptides: purity testing, COA documentation, shipping, cold-chain handling, payment, and researcher verification.",
  alternates: {
    canonical: "https://nexphoria.com/faq",
  },
  openGraph: {
    title: "FAQ — Peptide Research Questions Answered | Nexphoria",
    description:
      "Common questions about research peptides, purity testing, COA documentation, shipping, and researcher verification.",
    url: "https://nexphoria.com/faq",
    siteName: "Nexphoria",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexphoria FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — Peptide Research Questions Answered | Nexphoria",
    description:
      "Purity testing, COA documentation, shipping, and researcher verification questions answered.",
    images: ["/og-image.jpg"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://nexphoria.com/faq",
  url: "https://nexphoria.com/faq",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}
