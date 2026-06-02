import Link from "next/link";

const TRUST_POINTS = [
  "≥99% HPLC purity",
  "Independent third-party assay",
  "COA with every lot",
  "Cold-chain shipped",
];

/**
 * Shared conversion footer for every /tools/* page: an inline catalog CTA card
 * that ties the calculation just performed back to the catalog, followed by the
 * trust strip.
 */
export default function PprToolFooter({
  compound,
  href = "/products",
}: {
  /** Optional compound name to personalize the CTA copy. */
  compound?: string;
  /** Catalog destination — defaults to the full catalog. */
  href?: string;
}) {
  return (
    <div className="mx-auto mt-16 max-w-[760px] px-6 pb-24">
      {/* Inline catalog CTA */}
      <div
        className="ppr-grid-hex flex flex-col items-start gap-5 rounded-lg p-8 md:flex-row md:items-center md:justify-between"
        style={{ border: "1px solid var(--steel)", backgroundColor: "var(--ink-2)" }}
      >
        <div>
          <p
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
          >
            Order the compound you just calculated for
          </p>
          <p
            className="mt-2 text-[22px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--platinum)", lineHeight: 1.2 }}
          >
            {compound ? `${compound}, characterized per lot.` : "Research-grade peptides, characterized per lot."}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex flex-shrink-0 items-center justify-center rounded-md px-6 text-[15px] font-semibold transition-opacity hover:opacity-90"
          style={{ height: 50, backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
        >
          Browse the catalog &rarr;
        </Link>
      </div>

      {/* Trust strip */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {TRUST_POINTS.map((point) => (
          <span
            key={point}
            className="text-[12px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
          >
            <span style={{ color: "var(--accent)" }}>&middot; </span>
            {point}
          </span>
        ))}
      </div>
    </div>
  );
}
