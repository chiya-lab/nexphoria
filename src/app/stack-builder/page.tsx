import type { Metadata } from "next";
import StackBuilderClient from "./client";

export const metadata: Metadata = {
  title: "Stack Builder | Nexphoria Research Peptides",
  description:
    "Compose a multi-compound research protocol: select peptides, set pack sizes and planning doses, lay out daily timing, review composition notes and bulk pricing, and share the result as a link. For research use only.",
  alternates: { canonical: "https://nexphoria.com/stack-builder" },
  openGraph: {
    title: "Stack Builder | Nexphoria",
    description:
      "Interactive multi-compound research-protocol composer with timing layout, composition notes, bulk pricing, and shareable links.",
    url: "https://nexphoria.com/stack-builder",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Stack Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Builder | Nexphoria",
    description: "Compose, time, and share a multi-compound research protocol.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com/" },
    { "@type": "ListItem", position: 2, name: "Stack Builder" },
  ],
};

export default function StackBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <StackBuilderClient />
    </>
  );
}
