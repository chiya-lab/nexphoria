import type { Metadata } from "next";
import ShippingClient from "./client";
import { POLICY_FAQ } from "@/components/policies/policyFaqData";

export const metadata: Metadata = {
  title: "Shipping & Cold-Chain | Nexphoria Research Peptides",
  description:
    "How Nexphoria ships research peptides across the contiguous US: shipping methods and costs, monitored 2–8°C cold chain, discreet packaging, regional transit times, and tracking. For research use only.",
  alternates: { canonical: "https://nexphoria.com/shipping" },
  openGraph: {
    title: "Shipping & Cold-Chain | Nexphoria",
    description:
      "Shipping methods, monitored cold chain, discreet packaging, and US transit times for research peptides.",
    url: "https://nexphoria.com/shipping",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Shipping" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Cold-Chain | Nexphoria",
    description: "Shipping methods, monitored cold chain, discreet packaging, and US transit times.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com/" },
    { "@type": "ListItem", position: 2, name: "Shipping" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://nexphoria.com/shipping#faq",
  url: "https://nexphoria.com/shipping",
  mainEntity: POLICY_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ShippingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ShippingClient />
    </>
  );
}
