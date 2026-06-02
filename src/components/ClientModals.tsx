"use client";

/**
 * ClientModals — lazy-loaded overlay components.
 * Grouped here so they can use `ssr: false` inside a Client Component boundary,
 * which is required in the App Router. All four are invisible on first paint,
 * so deferring them reduces initial JS bundle size.
 */

import dynamic from "next/dynamic";

const AgeVerificationModal = dynamic(() => import("@/components/AgeVerificationModal"), { ssr: false });
const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });
const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

export default function ClientModals() {
  return (
    <>
      <AgeVerificationModal />
      <SearchModal />
      <NewsletterPopup />
      <BackToTop />
    </>
  );
}
