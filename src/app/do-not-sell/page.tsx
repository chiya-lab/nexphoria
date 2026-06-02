import type { Metadata } from "next";
import PprLegalShell from "@/components/legal/PprLegalShell";
import PprDoNotSellForm from "@/components/legal/PprDoNotSellForm";
import { getLegalPage } from "@/components/legal/legalContent";

const page = getLegalPage("do-not-sell")!;

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

export default function DoNotSellPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <PprLegalShell page={page} />
      <div className="mx-auto max-w-6xl px-5 pb-16">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <div className="hidden lg:block" aria-hidden="true" />
          <div className="min-w-0">
            <h2
              id="request-form"
              className="scroll-mt-28 mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
            >
              Submit a privacy request
            </h2>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--silver-2)" }}>
              Use the form below to opt out of the sale or sharing of your personal information, or
              to exercise another California privacy right. We will verify your identity before
              fulfilling certain requests.
            </p>
            <PprDoNotSellForm />
          </div>
        </div>
      </div>
    </>
  );
}
