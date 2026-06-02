import type { LegalSection } from "./legalContent";
import PprLegalCallout from "./PprLegalCallout";

interface PprLegalSectionProps {
  section: LegalSection;
}

export default function PprLegalSection({ section }: PprLegalSectionProps) {
  return (
    <section
      id={section.id}
      data-legal-section
      className="scroll-mt-28 border-t pt-8"
      style={{ borderColor: "var(--steel)" }}
    >
      <h2
        className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        {section.heading}
      </h2>

      {section.callout && (
        <PprLegalCallout tone={section.callout.tone} title={section.callout.title}>
          {section.callout.body}
        </PprLegalCallout>
      )}

      <div className="space-y-4 text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--silver-1)" }}>
        {section.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--silver-1)" }}>
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
