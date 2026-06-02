import { LEGAL_CONTACT_EMAIL } from "./legalContent";

interface PprLegalContactFooterProps {
  lastUpdated: string;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export default function PprLegalContactFooter({ lastUpdated }: PprLegalContactFooterProps) {
  return (
    <footer
      className="mt-10 flex flex-col gap-3 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
    >
      <div>
        <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Questions about this policy?
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--silver-2)" }}>
          Contact our legal team at{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-1"
            style={{ color: "var(--accent)" }}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
      <p className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Last updated{" "}
        <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
      </p>
    </footer>
  );
}
