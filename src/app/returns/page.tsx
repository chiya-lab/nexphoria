import type { Metadata } from "next";
import ReturnsClient from "./client";
import { POLICY_FAQ } from "@/components/policies/policyFaqData";

export const metadata: Metadata = {
  title: "Returns & Refunds | Nexphoria Research Peptides",
  description:
    "Nexphoria's returns and refunds policy for research compounds: eligibility by scenario, unopened-vial returns within 14 days, lot and seal verification, and a four-step resolution process. For research use only.",
  alternates: { canonical: "https://nexphoria.com/returns" },
  openGraph: {
    title: "Returns & Refunds | Nexphoria",
    description:
      "Returns eligibility, unopened-vial window, lot verification, and the resolution process for research compounds.",
    url: "https://nexphoria.com/returns",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Returns" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Returns & Refunds | Nexphoria",
    description: "Returns eligibility, unopened-vial window, lot verification, and resolution process.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com/" },
    { "@type": "ListItem", position: 2, name: "Returns" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://nexphoria.com/returns#faq",
  url: "https://nexphoria.com/returns",
  mainEntity: POLICY_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ReturnsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ReturnsClient />
    </>
  );
}
