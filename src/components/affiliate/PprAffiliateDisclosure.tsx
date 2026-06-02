/**
 * FTC affiliate disclosure. Reusable across affiliate and refer surfaces.
 * Transparency-first: research integrity is independent of commissions.
 */
export default function PprAffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={compact ? "text-[11px]" : "text-[12px] leading-relaxed"}
      style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
    >
      Some links are affiliate links. Nexphoria research integrity is not influenced by commissions.
      Earnings figures shown are illustrative. Research use only.
    </p>
  );
}
