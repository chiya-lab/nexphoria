interface ToolDisclaimerProps {
  /** Optional extra sentence appended after the standard RUO note. */
  note?: string;
  className?: string;
}

/**
 * Standard research-use-only disclaimer shown at the foot of every research tool.
 * Mirrors the gold RUO note already used across the tools suite so the framing
 * is identical everywhere. Presentational only — no calculation logic.
 */
export default function ToolDisclaimer({ note, className = "" }: ToolDisclaimerProps) {
  return (
    <div
      className={`rounded-sm px-6 py-4 ${className}`}
      style={{ backgroundColor: "#FFF8ED", border: "1px solid #E8D5B0" }}
    >
      <p className="text-xs" style={{ color: "#7A6030", lineHeight: 1.6 }}>
        <strong>Research Use Only.</strong> This tool is provided as a reference
        for qualified researchers and produces research-planning estimates only.
        All compounds supplied by Nexphoria are for in vitro research use only.
        Nothing here constitutes medical advice or human-dosing guidance.
        {note ? ` ${note}` : ""}
      </p>
    </div>
  );
}
