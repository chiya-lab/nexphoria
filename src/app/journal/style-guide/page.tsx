import type { Metadata } from "next";
import {
  JOURNAL_ARTICLES,
  JOURNAL_PILLARS,
  type JournalPillar,
} from "@/lib/mock-journal-articles";

export const metadata: Metadata = {
  title: "Journal Style Guide | Nexphoria",
  description:
    "The editorial standard behind the Nexphoria research journal: mission, the five content pillars, and the voice guardrails every article holds to.",
  alternates: { canonical: "https://nexphoria.com/journal/style-guide" },
  openGraph: {
    title: "Journal Style Guide | Nexphoria",
    description:
      "Editorial mission, content pillars, and voice guardrails for the Nexphoria research journal.",
    url: "https://nexphoria.com/journal/style-guide",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Journal Style Guide",
  description:
    "Editorial mission, content pillars, and voice guardrails for the Nexphoria research journal.",
  url: "https://nexphoria.com/journal/style-guide",
  inLanguage: "en-US",
  publisher: { "@type": "Organization", name: "Nexphoria" },
};

const PILLAR_BLURBS: Record<JournalPillar, string> = {
  "Compound monograph":
    "Sequence, physicochemical handling, and the in vitro / animal-model literature for a single compound. Structured for the bench, cited to primary sources.",
  Methodology:
    "How the work is actually done — purity verification, reconstitution, cold-chain, study design. Reproducibility is the throughline.",
  "Industry signal":
    "Field-level reads on where research attention is moving. Description, not prediction; never hype.",
  "Researcher interview":
    "Conversations (clearly labeled composites where illustrative) that model rigorous thinking about endpoints and quality control.",
  "Lab-bench how-to":
    "Practical reference procedures a researcher can act on at the bench, with the failure modes named.",
};

// Voice guardrails — the say / don't-say substitutions every article holds to.
// Sourced from NEXPHORIA_BRAND_SPEC.md and NEXPHORIA_CONTENT_BRIEF.md.
const VOICE_RULES: { dont: string; say: string }[] = [
  { dont: "Mental clarity", say: "Molecular precision" },
  { dont: "Cognitive performance", say: "Advanced peptide research" },
  { dont: "Nootropic stack", say: "Research protocol" },
  { dont: "Boost focus", say: "Investigate cognition pathways" },
  { dont: "Supplement", say: "Research compound" },
  { dont: "Daily ritual", say: "Reconstitution protocol" },
  { dont: "Wellness", say: "Research integrity" },
  { dont: "Cure / treat / heal", say: "Studied for [measured endpoint]" },
  { dont: "Anti-aging", say: "Longevity-science endpoints" },
  { dont: "Miracle / breakthrough", say: "Cited in [N] peer-reviewed studies" },
  { dont: "For best results, take…", say: "Reconstitute with [N] mL bacteriostatic water" },
  { dont: "Feel better / more energy", say: "Oxygen consumption rate / measured readout" },
  { dont: "Free shipping over $X", say: "Cold-chain shipping included over $150" },
  { dont: "Scrape / crawl", say: "Collect / extract / gather" },
];

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.18em",
  color: "var(--accent)",
};

export default function JournalStyleGuidePage() {
  const byPillar = (p: JournalPillar) =>
    JOURNAL_ARTICLES.filter((a) => a.category === p);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <main style={{ backgroundColor: "var(--ink)" }}>
        {/* Header band */}
        <section className="ppr-grid-hex px-6 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-[920px]">
            <p className="text-[12px] uppercase" style={eyebrowStyle}>
              Nexphoria Journal · Editorial Standard
            </p>
            <h1
              className="mt-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 8vw, 72px)",
                fontWeight: 600,
                color: "var(--platinum)",
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
              }}
            >
              Style Guide
            </h1>
            <p
              className="mt-5 max-w-[640px] text-[18px]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--silver-1)",
                lineHeight: 1.55,
              }}
            >
              The public mini-version of our content brief. It defines the
              editorial mission, the five pillars every article belongs to, and
              the voice guardrails that keep the journal peer-to-peer,
              citation-dense, and free of medical claims.
            </p>
          </div>
        </section>

        {/* Mission + voice */}
        <section className="px-6 pb-4">
          <div className="mx-auto max-w-[920px]">
            <h2 style={sectionHeadingStyle}>Editorial mission</h2>
            <p style={bodyStyle}>
              The Nexphoria Journal is written for the bench, not the buyer. Every
              article reads like a hybrid of a peer-reviewed methods section, a
              clinical-grade vendor catalog, and a boutique&apos;s restraint —
              specific, hedged, and dense with primary citations. We speak
              peer-to-peer with researchers. We describe what is measurable and
              cite where it was measured. We never promise personal health
              outcomes, and all compounds are presented strictly as research-use
              material.
            </p>
            <p style={bodyStyle}>
              If a sentence could plausibly appear in a clinical-grade reagent
              catalog and in a careful methods section at once, it is on-voice.
              If it could appear in a consumer-wellness advertisement, it is not.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="px-6 pt-12 pb-4">
          <div className="mx-auto max-w-[920px]">
            <h2 style={sectionHeadingStyle}>The five pillars</h2>
            <div className="mt-6 grid gap-px" style={{ backgroundColor: "var(--steel)" }}>
              {JOURNAL_PILLARS.map((pillar) => {
                const count = byPillar(pillar).length;
                return (
                  <div
                    key={pillar}
                    className="p-6"
                    style={{ backgroundColor: "var(--ink-2)" }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 22,
                          fontWeight: 600,
                          color: "var(--platinum)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {pillar}
                      </h3>
                      <span
                        className="text-[12px] uppercase whitespace-nowrap"
                        style={eyebrowStyle}
                      >
                        {count} seed{count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-2" style={{ ...bodyStyle, marginTop: 8 }}>
                      {PILLAR_BLURBS[pillar]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Voice guardrails table */}
        <section className="px-6 pt-12 pb-4">
          <div className="mx-auto max-w-[920px]">
            <h2 style={sectionHeadingStyle}>Voice guardrails</h2>
            <p style={bodyStyle}>
              The left column is forbidden in copy. The right column is the
              on-voice substitution. The pattern is consistent: replace
              consumer-wellness and therapeutic-claim language with measurable,
              research-register equivalents.
            </p>
            <div
              className="mt-6 overflow-hidden"
              style={{ border: "1px solid var(--steel)" }}
            >
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr style={{ backgroundColor: "var(--ink-3)" }}>
                    <th style={thStyle}>Don&apos;t say</th>
                    <th style={thStyle}>Say</th>
                  </tr>
                </thead>
                <tbody>
                  {VOICE_RULES.map((rule, i) => (
                    <tr
                      key={rule.dont}
                      style={{
                        backgroundColor:
                          i % 2 === 0 ? "var(--ink-2)" : "var(--ink)",
                      }}
                    >
                      <td style={{ ...tdStyle, color: "var(--silver-2)" }}>
                        {rule.dont}
                      </td>
                      <td style={{ ...tdStyle, color: "var(--silver-1)" }}>
                        {rule.say}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Seed article index */}
        <section className="px-6 pt-12 pb-24">
          <div className="mx-auto max-w-[920px]">
            <h2 style={sectionHeadingStyle}>Seed articles</h2>
            <p style={bodyStyle}>
              The twelve articles below are the canonical voice samples — the
              reference set every future contributor calibrates against.
            </p>
            <ul className="mt-6 space-y-px" style={{ backgroundColor: "var(--steel)" }}>
              {JOURNAL_ARTICLES.map((a) => (
                <li
                  key={a.slug}
                  className="p-5"
                  style={{ backgroundColor: "var(--ink-2)" }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span
                      className="text-[11px] uppercase"
                      style={eyebrowStyle}
                    >
                      {a.category}
                    </span>
                    <span
                      className="text-[12px]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--silver-3)",
                      }}
                    >
                      {a.readingMinutes} min · {a.author.name}, {a.author.credential}
                    </span>
                  </div>
                  <h3
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "var(--platinum)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    className="mt-1.5 text-[15px]"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--silver-2)",
                      lineHeight: 1.5,
                    }}
                  >
                    {a.subtitle}
                  </p>
                </li>
              ))}
            </ul>

            <p
              className="mt-10 text-[13px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--silver-3)",
                lineHeight: 1.6,
              }}
            >
              Research use only. Not for human consumption. All compounds
              referenced in the journal are research materials; the journal makes
              no medical claims.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 28,
  fontWeight: 600,
  color: "var(--platinum)",
  letterSpacing: "-0.02em",
  marginBottom: 16,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 16,
  color: "var(--silver-1)",
  lineHeight: 1.65,
  marginTop: 12,
  maxWidth: 720,
};

const thStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "var(--silver-2)",
  padding: "12px 16px",
  borderBottom: "1px solid var(--steel)",
};

const tdStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 15,
  padding: "12px 16px",
  lineHeight: 1.45,
  verticalAlign: "top",
};
