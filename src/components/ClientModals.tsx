"use client";

/**
 * ClientModals — lazy-loaded overlay components.
 * Grouped here so they can use `ssr: false` inside a Client Component boundary,
 * which is required in the App Router. All are invisible on first paint,
 * so deferring them reduces initial JS bundle size.
 */

import dynamic from "next/dynamic";

const PprRuoGate = dynamic(() => import("@/components/gates/PprRuoGate"), { ssr: false });
const PprExitIntent = dynamic(() => import("@/components/gates/PprExitIntent"), { ssr: false });
const PprNewsletterBand = dynamic(() => import("@/components/marketing/PprNewsletterBand"), { ssr: false });
const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

export default function ClientModals() {
  return (
    <>
      <PprRuoGate />
      <SearchModal />
      <PprExitIntent />
      <PprNewsletterBand />
      <BackToTop />
    </>
  );
}
