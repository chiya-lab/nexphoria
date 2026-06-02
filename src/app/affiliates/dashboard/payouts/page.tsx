"use client";

import PprAffiliateShell from "@/components/affiliate/PprAffiliateShell";
import PprAffiliatePayouts from "@/components/affiliate/PprAffiliatePayouts";

export default function AffiliatePayoutsPage() {
  return (
    <PprAffiliateShell title="Payouts" subtitle="Earnings history, payout method, and tax document status">
      <PprAffiliatePayouts />
    </PprAffiliateShell>
  );
}
