"use client";

import PprAffiliateShell from "@/components/affiliate/PprAffiliateShell";
import PprAffiliateLeaderboard from "@/components/affiliate/PprAffiliateLeaderboard";

export default function AffiliateLeaderboardPage() {
  return (
    <PprAffiliateShell title="Leaderboard" subtitle="Anonymized monthly standings across active partners">
      <PprAffiliateLeaderboard />
    </PprAffiliateShell>
  );
}
