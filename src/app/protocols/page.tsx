import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Research Cycles & Protocols | Nexphoria",
  description:
    "Understand the Nexphoria research-cycle model — 3-Month and 6-Month cycles, monthly billing, reconstitution and storage guidance, and research-use terms.",
  alternates: {
    canonical: "https://nexphoria.com/protocols",
  },
  openGraph: {
    title: "Research Cycles & Protocols | Nexphoria",
    description: "3-Month and 6-Month research cycles, monthly billing, reconstitution and storage guidance.",
    url: "https://nexphoria.com/protocols",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const STUDY_DESIGNS: {
  title: string;
  model: string;
  objective: string;
  considerations: string;
  endpoints: string[];
  compounds: { slug: string; name: string }[];
}[] = [
  {
    title: "Tissue-repair recovery model",
    model: "In vivo / animal model",
    objective:
      "Characterize angiogenic and connective-tissue remodeling responses to a candidate compound in a controlled injury-recovery design.",
    considerations:
      "Use age- and weight-matched cohorts with sham and vehicle controls. Randomize and blind outcome assessment. Predefine the observation window relative to the injury model.",
    endpoints: [
      "Histological tissue-repair scoring",
      "Capillary density / angiogenesis markers",
      "Functional recovery timeline",
    ],
    compounds: [
      { slug: "bpc-157", name: "BPC-157" },
      { slug: "tb-500", name: "TB-500" },
    ],
  },
  {
    title: "Extracellular-matrix restoration assay",
    model: "In vitro",
    objective:
      "Evaluate collagen and ECM-protein expression in cultured fibroblasts exposed to a candidate compound across a concentration range.",
    considerations:
      "Run dose-response with technical and biological replicates. Include positive and negative controls and confirm viability to separate signal from cytotoxicity.",
    endpoints: [
      "Collagen I / III expression",
      "Cell viability and proliferation",
      "Dose-response curve fit",
    ],
    compounds: [{ slug: "ghk-cu", name: "GHK-Cu" }],
  },
  {
    title: "Metabolic-regulation comparative outline",
    model: "In vivo / animal model",
    objective:
      "Compare metabolic and body-composition responses between candidate compounds against vehicle control over a defined study period.",
    considerations:
      "Standardize diet and housing. Pre-register endpoints and analysis plan. Account for pair-feeding where intake differences may confound interpretation.",
    endpoints: [
      "Body-composition change vs. control",
      "Fasting metabolic markers",
      "Tolerability observations",
    ],
    compounds: [
      { slug: "semaglutide", name: "Semaglutide" },
      { slug: "tirzepatide", name: "Tirzepatide" },
    ],
  },
];

export default function ProtocolsPage() {
  return (
    <div style={{ backgroundColor: "#EAE7E3" }}>
      {/* Header band */}
      <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "#010101" }}>
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "Research Protocols" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "#C9DD69" }}>
            Research Cycles
          </p>
          <h1
            className="text-4xl md:text-5xl mb-6"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            The research-cycle model.
          </h1>
          <p className="text-lg max-w-2xl" style={{ fontWeight: 300, lineHeight: 1.6, color: "#A0A0A0" }}>
            Most research questions are not answered in a single shipment. A
            research cycle aligns supply to the window over which a compound is
            actually studied — so material is on the bench when a protocol calls
            for it, without over-ordering up front.
          </p>
        </div>
      </section>

      {/* Two cycle options */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 3-Month */}
            <div
              className="rounded-sm p-8 bg-white-card"
              style={{ border: "1px solid rgba(0,0,0,0.06)", borderTop: "2px solid #C9DD69" }}
            >
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#B8923A" }}>
                Standard
              </p>
              <h2 className="text-2xl mb-3 text-near-black" style={{ fontWeight: 300 }}>
                3-Month Research Cycle
              </h2>
              <p className="text-sm text-stone mb-6" style={{ lineHeight: 1.7 }}>
                A single response window. Three monthly shipments provide enough
                material to run a defined protocol from initiation through an
                initial observation period, with consistent lot continuity across
                the cycle. Suited to recovery, growth-hormone-axis, and metabolic
                research questions that resolve over weeks rather than months.
              </p>
              <ul className="space-y-3">
                {[
                  "Three monthly shipments, billed monthly",
                  "Continuity of supply across one protocol window",
                  "Lot-specific Certificate of Analysis with each shipment",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#C9DD69" }}
                    />
                    <span className="text-sm text-stone">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6-Month */}
            <div
              className="rounded-sm p-8 bg-white-card"
              style={{ border: "1px solid rgba(0,0,0,0.06)", borderTop: "2px solid #B8923A" }}
            >
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#B8923A" }}>
                Extended
              </p>
              <h2 className="text-2xl mb-3 text-near-black" style={{ fontWeight: 300 }}>
                6-Month Research Cycle
              </h2>
              <p className="text-sm text-stone mb-6" style={{ lineHeight: 1.7 }}>
                Two cycles across an extended timeframe. Six monthly shipments
                support longer-running protocols — longevity, anti-aging, and
                tissue-repair research, or any design that compares an initial
                response window against a sustained follow-up. Material arrives in
                step with the study rather than in a single large order.
              </p>
              <ul className="space-y-3">
                {[
                  "Six monthly shipments, billed monthly",
                  "Built for extended and comparative protocols",
                  "Lot-specific Certificate of Analysis with each shipment",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#B8923A" }}
                    />
                    <span className="text-sm text-stone">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-sm text-stone mt-6" style={{ lineHeight: 1.7 }}>
            A one-time purchase remains the default for any single product. Cycles
            are optional and selected at the point of ordering.
          </p>
        </div>
      </section>

      {/* What to expect + billing */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#C9DD69" }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "#B8923A" }}>
              What to Expect
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl mb-8 text-near-black" style={{ fontWeight: 200 }}>
            How a cycle runs.
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg mb-2 text-near-black" style={{ fontWeight: 400 }}>
                Monthly billing
              </h3>
              <p className="text-sm text-stone" style={{ lineHeight: 1.7 }}>
                Cycles are billed monthly for the duration of the cycle — three
                payments for a 3-Month Cycle, six for a 6-Month Cycle — rather than
                as a single charge. Each billing period corresponds to one
                shipment. There are no day-, week-, or quantity-based dropdowns;
                the cycle length is the only schedule decision.
              </p>
            </div>

            <div>
              <h3 className="text-lg mb-2 text-near-black" style={{ fontWeight: 400 }}>
                Shipments and continuity
              </h3>
              <p className="text-sm text-stone" style={{ lineHeight: 1.7 }}>
                A shipment is dispatched for each cycle month. Where possible,
                material is supplied from consistent lots to reduce batch-to-batch
                variability across a protocol. Every shipment is cold-chain
                packaged and accompanied by the Certificate of Analysis for the lot
                supplied.
              </p>
            </div>

            <div>
              <h3 className="text-lg mb-2 text-near-black" style={{ fontWeight: 400 }}>
                Documentation
              </h3>
              <p className="text-sm text-stone" style={{ lineHeight: 1.7 }}>
                Each compound page lists its full specification — sequence,
                molecular formula, purity, appearance, solubility, storage, and
                reconstitution guidance. Reviewing these before a cycle begins
                allows the protocol and storage plan to be set in advance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reconstitution & storage */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#C9DD69" }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "#B8923A" }}>
              Handling
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl mb-8 text-near-black" style={{ fontWeight: 200 }}>
            General reconstitution &amp; storage guidance.
          </h2>
          <p className="text-sm text-stone mb-8" style={{ lineHeight: 1.7 }}>
            The following is general laboratory guidance. Always defer to the
            specific storage, solubility, and reconstitution values listed on each
            product page, as they vary by compound.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Lyophilized storage",
                body: "Most lyophilized peptides are stored desiccated at −20°C, protected from light and moisture, and are stable for extended periods in that state. Some copper- and temperature-sensitive compounds are refrigerated at 2–8°C instead — confirm per product.",
              },
              {
                title: "Reconstitution",
                body: "Reconstitute with sterile or bacteriostatic water, adding solvent slowly down the vial wall. Swirl gently to dissolve; do not vortex or shake. Allow the vial to fully clarify before use.",
              },
              {
                title: "After reconstitution",
                body: "Reconstituted solutions are generally stored at 2–8°C and used within the window stated on the product page. Avoid repeated freeze-thaw cycles, which can degrade peptide integrity.",
              },
              {
                title: "Light and contamination",
                body: "Keep light-sensitive compounds shielded and use aseptic technique throughout. Some peptides require polypropylene rather than glass surfaces to limit adsorption — check the product specification.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-sm p-6 bg-white-card"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h3 className="text-base mb-2 text-near-black" style={{ fontWeight: 500 }}>
                  {card.title}
                </h3>
                <p className="text-sm text-stone" style={{ lineHeight: 1.7 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study-design reference templates */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#C9DD69" }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "#B8923A" }}>
              Study-Design References
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl mb-4 text-near-black" style={{ fontWeight: 200 }}>
            Research protocol outlines.
          </h2>
          <p className="text-sm text-stone mb-10 max-w-2xl" style={{ lineHeight: 1.7 }}>
            The following are skeleton study-design references for in&nbsp;vitro and
            animal-model research only. They describe objectives, model
            considerations, and candidate endpoints — not dosing guidance for
            humans. Investigators are responsible for protocol approval,
            statistical design, and compliance with institutional and regulatory
            requirements.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {STUDY_DESIGNS.map((d) => (
              <div
                key={d.title}
                className="rounded-2xl p-6 bg-white-card flex flex-col"
                style={{ border: "1px solid rgba(0,0,0,0.08)", borderTop: "2px solid #B8A44C" }}
              >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#B8923A" }}>
                  {d.model}
                </p>
                <h3 className="text-lg mb-3 text-near-black" style={{ fontWeight: 500, lineHeight: 1.25 }}>
                  {d.title}
                </h3>

                <div className="mb-4">
                  <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "#999" }}>
                    Objective
                  </div>
                  <p className="text-sm text-stone" style={{ lineHeight: 1.6 }}>
                    {d.objective}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "#999" }}>
                    Model considerations
                  </div>
                  <p className="text-sm text-stone" style={{ lineHeight: 1.6 }}>
                    {d.considerations}
                  </p>
                </div>

                <div className="mb-5">
                  <div className="text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#999" }}>
                    Candidate endpoints
                  </div>
                  <ul className="space-y-1.5">
                    {d.endpoints.map((ep) => (
                      <li key={ep} className="flex items-start gap-2">
                        <span
                          className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: "#B8A44C" }}
                        />
                        <span className="text-sm text-stone" style={{ lineHeight: 1.5 }}>
                          {ep}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#999" }}>
                    Referenced compounds
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.compounds.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/coa/${c.slug}`}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "rgba(184,164,76,0.12)", color: "#7A6B2A" }}
                      >
                        {c.name}
                        <span aria-hidden>· COA</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone mt-8" style={{ lineHeight: 1.7 }}>
            References are illustrative starting points drawn from the peer-reviewed
            literature in each domain. Confirm current primary sources, model
            suitability, and ethics approval before initiating any study.
          </p>
        </div>
      </section>

      {/* Research-use disclaimer */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "#010101" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "#C9DD69" }}>
            Research Use Only
          </p>
          <h2
            className="text-2xl md:text-3xl mb-6"
            style={{ fontWeight: 200, color: "#EAE7E3", lineHeight: 1.3 }}
          >
            For qualified research applications.
          </h2>
          <p className="text-sm mb-4" style={{ color: "#A0A0A0", lineHeight: 1.8 }}>
            All compounds supplied by Nexphoria are intended exclusively for
            laboratory research and analytical use by qualified professionals.
            They are not drugs, foods, cosmetics, or medical devices, are not
            approved for human or veterinary use, and are not intended to
            diagnose, treat, cure, or prevent any condition.
          </p>
          <p className="text-sm" style={{ color: "#A0A0A0", lineHeight: 1.8 }}>
            Purchasers are responsible for handling, storing, and using these
            materials in accordance with applicable institutional protocols and
            regulations. Nothing on this page constitutes medical advice or a
            recommendation for use in humans.
          </p>

          <div className="mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold uppercase tracking-wide text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#B8A44C", color: "#000000" }}
            >
              Browse the Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
