"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Microscope, FileText, Quote } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import RUOBanner from "@/components/RUOBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const designConsiderations = [
  {
    icon: FlaskConical,
    title: "In Vitro Study Design",
    body: "Reconstitute lyophilized compound using the lot-specific moisture value from the COA so working concentrations reflect actual peptide mass, not gross powder weight. Account for adsorption to labware, freeze-thaw degradation, and vehicle effects with appropriate carrier-only controls. Verify compound stability under your assay conditions before extended incubations.",
  },
  {
    icon: Microscope,
    title: "Animal-Model Considerations",
    body: "Animal-model research should follow an approved institutional protocol (IACUC or equivalent) with documented endpoints, randomization, and blinding where feasible. Record lot numbers alongside experimental data so results remain traceable to a specific, independently verified batch. Nexphoria supplies compounds for these contexts; it does not design or conduct studies.",
  },
  {
    icon: FileText,
    title: "Documentation & Traceability",
    body: "Every Nexphoria lot carries a Certificate of Analysis with independent HPLC purity and ESI-MS identity results. Retain the COA with your records and reference the lot number in lab notebooks and manuscripts so any reviewer can map your data back to verified material.",
  },
];

const methodNotes = [
  {
    term: "Reconstitution accuracy",
    note: "Use the Karl Fischer water content from the COA to correct nominal mass. Bacteriostatic or sterile water choice depends on storage duration and assay sensitivity.",
  },
  {
    term: "Concentration verification",
    note: "Where assay-critical, confirm prepared stock concentration by UV absorbance (peptide bond ~205–214 nm or aromatic residues ~280 nm) against expected extinction coefficients.",
  },
  {
    term: "Storage & handling",
    note: "Store lyophilized powder per COA conditions. Aliquot reconstituted stock to minimize freeze-thaw cycles. Track time-at-temperature for cold-chain-sensitive sequences.",
  },
  {
    term: "Controls",
    note: "Include vehicle-only and, where applicable, scrambled-sequence or inactive-analog controls to isolate sequence-specific effects from formulation artifacts.",
  },
];

export default function ResearchClient() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0F0E" }}>
      {/* Hero */}
      <section className="relative pt-36 pb-24 border-b overflow-hidden" style={{ borderColor: "#2A2A28" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url(/brand/cell-pattern-1.png)",
            backgroundSize: "400px 400px",
            backgroundRepeat: "repeat",
            opacity: 0.04,
          }}
        />
        <div className="container-nex relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Research Methods" }]} variant="dark" className="mb-6" />
            <span className="eyebrow mb-5 block" style={{ color: "#B8A44C" }}>
              Research Methods
            </span>
            <h1
              className="font-bold tracking-tight mb-6 max-w-3xl leading-tight"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1,
                color: "#FDFCF8",
              }}
            >
              Rigorous Inputs for{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>
                Rigorous Research
              </em>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-secondary">
              Practical considerations for designing in vitro and animal-model studies with
              research-grade peptide compounds — and how to keep every result traceable to an
              independently verified lot. For qualified research use only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Design considerations */}
      <section className="py-28 border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mb-14"
          >
            <span className="eyebrow mb-4 block" style={{ color: "#B8A44C" }}>Study Design</span>
            <h2
              className="font-bold tracking-tight max-w-2xl"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FDFCF8" }}
            >
              Designing Defensible Experiments
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px border" style={{ backgroundColor: "#2A2A28", borderColor: "#2A2A28" }}>
            {designConsiderations.map((d, i) => (
              <motion.div
                key={d.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                className="p-8"
                style={{ backgroundColor: "#1C1C1A" }}
              >
                <div className="w-10 h-10 mb-6 flex items-center justify-center border" style={{ borderColor: "#2A2A28" }}>
                  <d.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}>
                  {d.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary">{d.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Method notes */}
      <section className="py-28 border-b" style={{ backgroundColor: "#1A1A18", borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mb-12 max-w-2xl"
          >
            <span className="eyebrow mb-4 block" style={{ color: "#B8A44C" }}>Bench Notes</span>
            <h2
              className="font-bold tracking-tight"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FDFCF8" }}
            >
              Handling That Protects Your Data
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {methodNotes.map((m, i) => (
              <motion.div
                key={m.term}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.07}
                className="p-6 border rounded-2xl"
                style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#FDFCF8" }}>{m.term}</h3>
                <p className="text-sm leading-relaxed text-secondary">{m.note}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-10"
          >
            <Link href="/tools/research-log" className="btn-outline-gold">
              Open the Research Log <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Citation */}
      <section className="py-28 border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="eyebrow mb-4 block" style={{ color: "#B8A44C" }}>Citation</span>
              <h2
                className="font-bold tracking-tight mb-4"
                style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#FDFCF8" }}
              >
                Citing Nexphoria Materials
              </h2>
              <p className="text-sm leading-relaxed text-secondary">
                When research materials are referenced in a manuscript or report, identify the
                compound, supplier, and the exact lot so the work remains reproducible and the
                material remains traceable to its independent verification.
              </p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="p-8 border rounded-2xl"
              style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}
            >
              <Quote className="w-6 h-6 mb-4" style={{ color: "#B8A44C" }} strokeWidth={1.5} />
              <p
                className="font-mono text-sm leading-relaxed mb-6"
                style={{ color: "rgba(253,252,248,0.85)" }}
              >
                [Compound name] (research-grade, Nexphoria Research, LLC; lot [LOT-NUMBER];
                purity ≥99% by RP-HPLC, identity confirmed by ESI-MS) was used for all
                experiments described.
              </p>
              <p className="text-xs leading-relaxed text-secondary">
                Substitute the bracketed fields with values from your lot-specific Certificate of
                Analysis. Retain the COA with your study records.
              </p>
              <Link href="/guides/how-to-read-coa" className="inline-flex items-center gap-2 mt-6 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: "#B8A44C" }}>
                How to read a COA <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust recap */}
      <section className="py-20 border-b" style={{ backgroundColor: "#1A1A18", borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: "Independent", label: "HPLC / ESI-MS verification on every lot" },
              { stat: "Lot-specific", label: "Certificate of Analysis with every order" },
              { stat: "Cold-chain", label: "Packed on every shipment" },
            ].map((t) => (
              <div key={t.label} className="p-6 border rounded-2xl" style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}>
                <div className="text-xl font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#B8A44C" }}>
                  {t.stat}
                </div>
                <p className="text-xs leading-relaxed text-secondary">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: "#0F0F0E" }}>
        <div className="container-nex flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="font-bold tracking-tight mb-2"
              style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#FDFCF8" }}
            >
              Source verified research material
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every compound ships with a lot-specific COA and full technical documentation.
            </p>
          </div>
          <Link href="/products" className="btn-outline-gold whitespace-nowrap">
            Browse Compounds <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* RUO */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <RUOBanner variant="card" tone="dark" />
        </div>
      </section>
    </div>
  );
}
