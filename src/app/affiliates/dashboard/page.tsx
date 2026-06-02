"use client";

import PprAffiliateShell from "@/components/affiliate/PprAffiliateShell";
import PprAffiliateOverview from "@/components/affiliate/PprAffiliateOverview";

export default function AffiliateDashboardPage() {
  return (
    <PprAffiliateShell title="Overview" subtitle="Your partner performance — synthetic demo data">
      <PprAffiliateOverview />
    </PprAffiliateShell>
  );
}
