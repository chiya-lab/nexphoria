"use client";

import PprAffiliateShell from "@/components/affiliate/PprAffiliateShell";
import PprAffiliateAssetsGallery from "@/components/affiliate/PprAffiliateAssetsGallery";

export default function AffiliateAssetsPage() {
  return (
    <PprAffiliateShell title="Assets" subtitle="Banners, social, email, brand kit, and product shots — download as files">
      <PprAffiliateAssetsGallery />
    </PprAffiliateShell>
  );
}
