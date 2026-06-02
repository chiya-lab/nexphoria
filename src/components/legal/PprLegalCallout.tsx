import type { CalloutTone } from "./legalContent";

interface PprLegalCalloutProps {
  tone: CalloutTone;
  title: string;
  children: React.ReactNode;
}

const TONE_STYLES: Record<CalloutTone, { border: string; accent: string; label: string }> = {
  info: { border: "var(--steel)", accent: "var(--accent)", label: "Note" },
  warning: { border: "var(--warn)", accent: "var(--warn)", label: "Important" },
  critical: { border: "var(--danger)", accent: "var(--danger)", label: "Critical" },
};

export default function PprLegalCallout({ tone, title, children }: PprLegalCalloutProps) {
  const s = TONE_STYLES[tone];
  return (
    <div
      role="note"
      className="my-5 rounded-lg border-l-2 p-4"
      style={{
        borderLeftColor: s.accent,
        backgroundColor: "var(--ink-2)",
        border: `1px solid var(--steel)`,
        borderLeftWidth: "3px",
        borderLeftStyle: "solid",
      }}
    >
      <p
        className="mb-1 text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: s.accent }}
      >
        {s.label} · {title}
      </p>
      <div className="text-sm leading-relaxed" style={{ color: "var(--silver-1)" }}>
        {children}
      </div>
    </div>
  );
}
