import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Our Standards — Science & Testing | Nexphoria",
  description:
    "Nexphoria's commitment to purity: cGMP manufacturing, independent HPLC testing, mass spectrometry verification, and Certificate of Analysis with every order. ≥99% purity guaranteed.",
  alternates: {
    canonical: "https://nexphoria.com/science",
  },
  openGraph: {
    title: "Our Standards — Science & Testing | Nexphoria",
    description:
      "cGMP manufacturing, independent HPLC testing, mass spectrometry verification, and Certificate of Analysis with every order.",
    url: "https://nexphoria.com/science",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Science & Testing Standards" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Standards — Science & Testing | Nexphoria",
    description: "cGMP manufacturing, independent HPLC testing, and Certificate of Analysis with every order.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

const qualityCards = [
  {
    stat: "≥99%",
    label: "HPLC Purity",
    desc: "Every lot independently verified via High-Performance Liquid Chromatography. We reject anything below 99%.",
  },
  {
    stat: "100%",
    label: "Third-Party Tested",
    desc: "No in-house testing claims. Every batch goes to an independent analytical lab. Full transparency.",
  },
  {
    stat: "Lot #",
    label: "Full Traceability",
    desc: "Every vial traces back to its manufacturing lot, testing date, analyst, and raw material source.",
  },
];

const glossary = [
  {
    term: "Purity",
    def: "The percentage of the sample that is the intended compound, measured by RP-HPLC as the target peak's share of total UV peak area. Higher purity means fewer truncated sequences, deletion products, and process residues.",
  },
  {
    term: "Identity",
    def: "Confirmation that the compound is the molecule it claims to be, established by ESI mass spectrometry matching the observed molecular mass to the theoretical mass of the intended sequence. Identity and purity are separate questions.",
  },
  {
    term: "Lot",
    def: "A single, traceable production run. Every vial carries a lot number that ties it to its synthesis date, testing date, analyst, and raw-material source — so a COA always corresponds to a specific lot, not a generic claim.",
  },
  {
    term: "RUO",
    def: "Research Use Only. These compounds are supplied strictly for in vitro and animal-model research. They are not drugs, are not for human or veterinary use, and carry no claims of clinical benefit.",
  },
];

const labPartners = [
  {
    name: "Janoshik Analytical",
    methods: "HPLC · ESI-MS · NMR",
    sub: "Independent laboratory verifying purity, molecular identity, and structure for each lot.",
  },
  {
    name: "Freedom Diagnostics",
    methods: "LC-MS/MS · GC-MS",
    sub: "ISO/IEC 17025-aligned quantitative analysis and residual-solvent screening.",
  },
];

const scienceSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://nexphoria.com/science",
  name: "Our Standards — Science & Testing",
  url: "https://nexphoria.com/science",
  description:
    "Nexphoria's commitment to purity: cGMP manufacturing, independent HPLC testing, mass spectrometry verification.",
  isPartOf: { "@type": "WebSite", url: "https://nexphoria.com" },
  about: {
    "@type": "Thing",
    name: "Peptide Quality Standards",
    description:
      "cGMP manufacturing, HPLC purity verification, mass spectrometry identity confirmation, and independent third-party testing.",
  },
  specialty: [
    "cGMP Manufacturing",
    "HPLC Purity Analysis",
    "Mass Spectrometry Verification",
    "Certificate of Analysis",
    "Third-Party Testing",
  ],
};

export default function SciencePage() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(scienceSchema) }}
    />
    <div style={{ backgroundColor: "#EAE7E3", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ paddingTop: "160px", paddingBottom: "80px" }} className="px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[{label:"Home",href:"/"},{label:"Our Standards"}]} variant="light" className="mb-6" />
          <p
            className="text-xs uppercase mb-6"
            style={{ color: "#B8923A", letterSpacing: "0.25em", fontWeight: 500 }}
          >
            Quality & Standards
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-8"
            style={{ fontWeight: 200, color: "#010101", letterSpacing: "-0.01em", lineHeight: 1.1 }}
          >
            The Standards Behind<br />Every Compound
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
            We manufacture under pharmaceutical-grade conditions and verify independently.
            No shortcuts. No self-testing. No batch ships without third-party confirmation.
          </p>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl mb-6" style={{ fontWeight: 300, color: "#010101" }}>
              cGMP Manufacturing
            </h2>
            <p className="text-sm mb-4" style={{ color: "#7F7F7D", lineHeight: 1.8 }}>
              All peptide compounds are synthesized in facilities certified under current Good
              Manufacturing Practice (cGMP) regulations. This means documented Standard Operating
              Procedures, environmental controls, equipment calibration records, and trained personnel
              at every step of production.
            </p>
            <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.8 }}>
              Raw materials are sourced from qualified vendors with full documentation chains.
              Every synthesis run is logged, reviewed, and approved by quality assurance before
              any product enters the testing pipeline.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-6" style={{ fontWeight: 300, color: "#010101" }}>
              Analytical Testing
            </h2>
            <p className="text-sm mb-4" style={{ color: "#7F7F7D", lineHeight: 1.8 }}>
              Every production lot undergoes comprehensive third-party analytical testing:
            </p>
            <ul className="space-y-3">
              {[
                "HPLC (High-Performance Liquid Chromatography) — purity determination",
                "Mass Spectrometry — molecular identity confirmation",
                "Endotoxin Testing (LAL) — safety for injectable compounds",
                "Residual Solvent Analysis — confirms removal of synthesis byproducts",
                "Water Content (Karl Fischer) — stability assurance",
              ].map((test) => (
                <li key={test} className="text-sm flex items-start gap-2" style={{ color: "#010101" }}>
                  <span style={{ color: "#C9DD69", fontWeight: 600 }}>→</span>
                  {test}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COA Section */}
      <section style={{ backgroundColor: "#FFFFFF" }} className="py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl mb-8" style={{ fontWeight: 200, color: "#010101" }}>
            Certificate of Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sm mb-4" style={{ color: "#7F7F7D", lineHeight: 1.8 }}>
                Every order ships with a Certificate of Analysis (COA) documenting:
              </p>
              <ul className="space-y-2">
                {[
                  "Compound identity (name, CAS number, molecular formula)",
                  "Purity percentage (HPLC peak area)",
                  "Appearance and physical characteristics",
                  "Lot number and manufacturing date",
                  "Testing laboratory name and analyst",
                  "Storage conditions and expiry date",
                ].map((item) => (
                  <li key={item} className="text-sm" style={{ color: "#010101" }}>
                    <span style={{ color: "#B8923A", marginRight: "8px" }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="p-8 rounded-lg"
              style={{ backgroundColor: "#EAE7E3", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <p className="text-xs uppercase mb-4" style={{ color: "#B8923A", letterSpacing: "0.2em" }}>
                Sample COA Data
              </p>
              <div className="space-y-3 font-mono text-xs" style={{ color: "#010101" }}>
                <div className="flex justify-between">
                  <span style={{ color: "#7F7F7D" }}>Compound:</span>
                  <span>BPC-157</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7F7F7D" }}>CAS:</span>
                  <span>137525-51-0</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7F7F7D" }}>Purity (HPLC):</span>
                  <span style={{ color: "#C9DD69" }}>99.47%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7F7F7D" }}>Endotoxin:</span>
                  <span>&lt;0.5 EU/mg</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7F7F7D" }}>Lab:</span>
                  <span>Janoshik Analytical</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7F7F7D" }}>Lot:</span>
                  <span>NXP-BPC-240601</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Cards */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#EAE7E3" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {qualityCards.map((card) => (
              <div
                key={card.label}
                className="p-8 rounded-lg text-center"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="text-4xl mb-3" style={{ fontWeight: 200, color: "#C9DD69" }}>
                  {card.stat}
                </div>
                <div
                  className="text-xs uppercase mb-4"
                  style={{ color: "#010101", letterSpacing: "0.15em", fontWeight: 500 }}
                >
                  {card.label}
                </div>
                <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to read a COA + glossary */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase mb-4" style={{ color: "#B8923A", letterSpacing: "0.25em" }}>
            Reading the Data
          </p>
          <h2 className="text-3xl mb-6" style={{ fontWeight: 200, color: "#010101" }}>
            How to Read a Certificate of Analysis
          </h2>
          <p className="text-sm max-w-2xl mb-10" style={{ color: "#7F7F7D", lineHeight: 1.8 }}>
            A COA reports what an independent lab measured for one specific lot. Read the purity
            figure (RP-HPLC peak area), confirm identity (ESI-MS mass match), and check that the lot
            number on the document matches the lot number on your vial. Our full walkthrough explains
            each line.
          </p>
          <Link href="/guides/how-to-read-coa" className="btn-primary inline-block mb-16">
            Read the COA Guide →
          </Link>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 border-t pt-12" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            {glossary.map((g) => (
              <div key={g.term}>
                <h3 className="text-lg mb-2" style={{ fontWeight: 400, color: "#010101" }}>
                  {g.term}
                </h3>
                <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
                  {g.def}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Independent testing partners */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#EAE7E3" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase mb-4" style={{ color: "#B8923A", letterSpacing: "0.25em" }}>
            Independent Testing Partners
          </p>
          <h2 className="text-3xl mb-6" style={{ fontWeight: 200, color: "#010101" }}>
            Who Verifies Our Compounds
          </h2>
          <p className="text-sm max-w-2xl mb-10" style={{ color: "#7F7F7D", lineHeight: 1.8 }}>
            We do not test our own products. Each lot is characterized by accredited, independent
            laboratories, and their results appear on the Certificate of Analysis we ship with it.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {labPartners.map((p) => (
              <div
                key={p.name}
                className="p-8 rounded-lg"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)", borderTop: "2px solid #B8923A" }}
              >
                <h3 className="text-xl mb-1" style={{ fontWeight: 300, color: "#010101" }}>
                  {p.name}
                </h3>
                <div className="text-xs font-mono mb-3" style={{ color: "#B8923A" }}>{p.methods}</div>
                <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAB Banner */}
      <section className="py-16 px-6 md:px-12" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-10 rounded-2xl"
            style={{ backgroundColor: "#F7F4F0", border: "1px solid rgba(184,146,58,0.25)" }}
          >
            <div>
              <p
                className="text-xs uppercase mb-3"
                style={{ color: "#B8923A", letterSpacing: "0.2em", fontWeight: 500 }}
              >
                Scientific Advisory Board
              </p>
              <h2
                className="text-2xl mb-2"
                style={{ fontWeight: 200, color: "#010101" }}
              >
                Independent researchers who challenge our standards
              </h2>
              <p className="text-sm" style={{ color: "#7F7F7D" }}>
                Four domain specialists — peptide pharmacology, metabolic biology, longevity research,
                and immunology — advise on compound specifications and quality benchmarks.
              </p>
            </div>
            <Link href="/about/science-advisors" className="btn-primary whitespace-nowrap">
              Meet the SAB →
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
