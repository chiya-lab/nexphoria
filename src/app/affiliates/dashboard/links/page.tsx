"use client";

import PprAffiliateShell from "@/components/affiliate/PprAffiliateShell";
import PprAffiliateLinkGenerator from "@/components/affiliate/PprAffiliateLinkGenerator";

export default function AffiliateLinksPage() {
  return (
    <PprAffiliateShell title="Links" subtitle="Generate tracked referral links with UTM tags and QR codes">
      <PprAffiliateLinkGenerator />
    </PprAffiliateShell>
  );
}
