import type { LegalPage } from "./legalContent";
import PprLegalHero from "./PprLegalHero";
import PprLegalToc from "./PprLegalToc";
import PprLegalSection from "./PprLegalSection";
import PprLegalContactFooter from "./PprLegalContactFooter";

interface PprLegalShellProps {
  page: LegalPage;
}

export default function PprLegalShell({ page }: PprLegalShellProps) {
  const tocSections = page.sections.map((s) => ({ id: s.id, heading: s.heading }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
      <PprLegalHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        effectiveDate={page.effectiveDate}
        lastUpdated={page.lastUpdated}
        version={page.version}
      />

      <div className="mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        {/* Left TOC — sticky on desktop, dropdown on mobile */}
        <aside className="mb-8 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <PprLegalToc sections={tocSections} />
          </div>
        </aside>

        {/* Right scrolling content */}
        <div className="min-w-0 space-y-8">
          {page.sections.map((section) => (
            <PprLegalSection key={section.id} section={section} />
          ))}
          <PprLegalContactFooter lastUpdated={page.lastUpdated} />
        </div>
      </div>
    </div>
  );
}
