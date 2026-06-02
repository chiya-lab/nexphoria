import type { Metadata } from "next";
import PprLegalShell from "@/components/legal/PprLegalShell";
import { getLegalPage } from "@/components/legal/legalContent";

const page = getLegalPage("accessibility")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: `https://nexphoria.com${page.route}` },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: page.title,
  description: page.metaDescription,
  url: `https://nexphoria.com${page.route}`,
  inLanguage: "en-US",
  datePublished: page.effectiveDate,
  dateModified: page.lastUpdated,
  publisher: { "@type": "Organization", name: "Nexphoria" },
};

export default function AccessibilityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <PprLegalShell page={page} />
    </>
  );
}
