"use client";

import { Download } from "lucide-react";

interface VerificationPanelProps {
  purity: string;
  lab: string;
  lotNumber: string;
  reportDate: string;
  coaAvailable: boolean;
  productSlug: string;
}

/**
 * Verification panel — surfaces purity, identity method, lab partner,
 * cold-chain status, and COA access directly beside the buy box.
 * Designed to attach trust proof tightly to the buy decision.
 */
export default function VerificationPanel({
  purity,
  lab,
  lotNumber,
  reportDate,
  coaAvailable,
  productSlug,
}: VerificationPanelProps) {
  const rows: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: "Purity spec", value: purity, mono: false },
    { label: "Identity method", value: "RP-HPLC / ESI-MS", mono: true },
    { label: "Testing partner", value: lab },
    { label: "Current lot", value: lotNumber, mono: true },
    { label: "Report date", value: reportDate, mono: true },
    { label: "Shipping", value: "Cold-chain packed" },
  ];

  return (
    <div
      className="mt-5"
      style={{
        border: "1px solid #E5E5E5",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
      aria-label="Lot verification details"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #EEEDE8", backgroundColor: "#FAF9F5" }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="#7A6B2A" strokeWidth="1.2" />
            <path
              d="M4 7.2l2 2 4-4"
              stroke="#7A6B2A"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className="text-[10px] uppercase font-semibold"
            style={{ letterSpacing: "0.14em", color: "#1A1A1A" }}
          >
            Lot Verification
          </p>
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5"
          style={{
            borderRadius: "999px",
            backgroundColor: "rgba(122,107,42,0.10)",
            color: "#7A6B2A",
            letterSpacing: "0.04em",
          }}
        >
          Verified
        </span>
      </div>

      {/* Spec rows */}
      <dl className="px-4 py-3">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 py-2"
            style={{
              borderBottom: i < rows.length - 1 ? "1px solid #F2F1ED" : "none",
            }}
          >
            <dt
              className="text-[11px]"
              style={{ color: "#666666", letterSpacing: "0.02em" }}
            >
              {row.label}
            </dt>
            <dd
              className={`text-[12px] text-right ${row.mono ? "font-mono" : ""}`}
              style={{ color: "#1A1A1A", fontWeight: 500 }}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* COA CTA strip */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderTop: "1px solid #EEEDE8", backgroundColor: "#FAF9F5" }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] font-medium"
            style={{ color: "#1A1A1A", lineHeight: 1.35 }}
          >
            {coaAvailable
              ? "Lot-specific Certificate of Analysis"
              : "Certificate of Analysis available on request"}
          </p>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "#777", lineHeight: 1.4 }}
          >
            HPLC purity report &middot; MS identity confirmation &middot; batch traceability
          </p>
        </div>
        {coaAvailable ? (
          <a
            href={`/coa/${productSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 transition-all duration-200"
            style={{
              border: "1px solid #1A1A1A",
              borderRadius: "999px",
              color: "#1A1A1A",
              backgroundColor: "transparent",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1A1A1A";
              (e.currentTarget as HTMLAnchorElement).style.color = "#F9F9F9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A1A";
            }}
            aria-label="View Certificate of Analysis"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            View COA
          </a>
        ) : (
          <a
            href="/contact?subject=COA%20Request"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 transition-all duration-200"
            style={{
              border: "1px solid #1A1A1A",
              borderRadius: "999px",
              color: "#1A1A1A",
              backgroundColor: "transparent",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1A1A1A";
              (e.currentTarget as HTMLAnchorElement).style.color = "#F9F9F9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A1A";
            }}
            aria-label="Request Certificate of Analysis"
          >
            Request COA
          </a>
        )}
      </div>
    </div>
  );
}
