"use client";

import PprAffiliateShell from "@/components/affiliate/PprAffiliateShell";
import { AFFILIATE_USER } from "@/lib/mock-affiliate";

const labelStyle = { fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" } as const;

const FIELDS = [
  { label: "Handle", value: AFFILIATE_USER.handle },
  { label: "Referral code", value: AFFILIATE_USER.referralCode },
  { label: "Tier", value: `${AFFILIATE_USER.tier.name} · ${AFFILIATE_USER.tier.commission}%` },
  { label: "Joined", value: AFFILIATE_USER.joined },
  { label: "Payout method", value: AFFILIATE_USER.payoutMethod },
  { label: "Tax status", value: AFFILIATE_USER.taxDocStatus },
];

export default function AffiliateSettingsPage() {
  return (
    <PprAffiliateShell title="Settings" subtitle="Account profile and program preferences — demo only">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((f) => (
          <div key={f.label} className="rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
            <p className="text-[11px] uppercase" style={labelStyle}>{f.label}</p>
            <p className="mt-1.5 text-[15px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{f.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        This is a demo console. Profile fields are read-only synthetic data. For research use only.
      </p>
    </PprAffiliateShell>
  );
}
