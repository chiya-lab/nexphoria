"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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

const steps = [
  {
    step: "01",
    title: "Raw Material Qualification",
    desc: "All amino acid building blocks and reagents sourced from qualified, GMP-certified suppliers. Identity, purity, and endotoxin levels verified on receipt before use in synthesis.",
  },
  {
    step: "02",
    title: "Solid-Phase Peptide Synthesis",
    desc: "Fmoc or Boc SPPS chemistry depending on compound requirements. Resin loading, coupling efficiency, and deprotection monitored at every step. Automated platform with real-time UV quantification.",
  },
  {
    step: "03",
    title: "Preparative HPLC Purification",
    desc: "Mass-directed preparative HPLC achieves final purity ≥98–99%+. Fractions collected and pooled by purity threshold. Multiple UV and MS checkpoints throughout purification.",
  },
  {
    step: "04",
    title: "Lyophilization",
    desc: "Purified peptide solution freeze-dried to stable lyophilized powder. Residual moisture below 5% by Karl Fischer titration. Batch sealed under inert atmosphere to prevent oxidation.",
  },
  {
    step: "05",
    title: "Independent Third-Party Verification",
    desc: "Every production lot is submitted to accredited, independent analytical laboratories — Janoshik Analytical and Freedom Diagnostics. RP-HPLC purity, ESI-MS identity, moisture, and residual solvent analysis are performed and documented by the lab, not by us.",
  },
  {
    step: "06",
    title: "Lot Release & Certificate of Analysis",
    desc: "A signed COA is issued by the testing laboratory. The lot is released only after every specification is met. The COA — naming the lab, lot number, and analyst — accompanies every shipment.",
  },
  {
    step: "07",
    title: "Cold-Chain Packing",
    desc: "Lyophilized compounds are packed with insulated barriers and phase-change cooling appropriate to the compound's stability profile. Packaging is sealed and labeled with lot and storage-condition data for research handling.",
  },
  {
    step: "08",
    title: "Lot-Traceable Shipment",
    desc: "Each shipment is tied to its lot number and COA, so any vial can be traced back to its synthesis run, testing date, and analyst. Cold-chain integrity is maintained from facility to delivery.",
  },
];

const methodsExplained = [
  {
    code: "RP-HPLC",
    name: "Reverse-Phase HPLC",
    measures: "What it measures: purity.",
    desc: "Reverse-phase high-performance liquid chromatography separates a sample by how strongly each component binds a C18 column. The target peptide elutes as a distinct peak; impurities and truncated sequences elute separately. Purity is reported as the target peak's percentage of total UV peak area.",
  },
  {
    code: "ESI-MS",
    name: "Electrospray Ionization MS",
    measures: "What it measures: identity.",
    desc: "Electrospray ionization mass spectrometry determines the molecular mass of the compound. Matching the observed mass to the theoretical mass of the intended sequence confirms the peptide is the molecule it claims to be — distinct from purity, which is what HPLC quantifies.",
  },
];

const labPartners = [
  {
    name: "Janoshik Analytical",
    methods: "HPLC · ESI-MS · NMR",
    sub: "Independent analytical laboratory providing purity, identity, and structural confirmation for each production lot.",
  },
  {
    name: "Freedom Diagnostics",
    methods: "LC-MS/MS · GC-MS",
    sub: "ISO/IEC 17025-aligned testing for quantitative analysis and residual solvent screening.",
  },
];

const standards = [
  { code: "cGMP", label: "Current Good Manufacturing Practice", sub: "Pharmaceutical-grade production controls on every batch" },
  { code: "ISO", label: "ISO-Compliant Facility", sub: "Certified infrastructure and quality management systems" },
  { code: "HPLC", label: "Reverse-Phase HPLC", sub: "C18 column, UV/DAD detection, certified reference standards" },
  { code: "ESI-MS", label: "Electrospray Ionization MS", sub: "Molecular identity confirmation ≤5 ppm mass accuracy" },
  { code: "KF", label: "Karl Fischer Titration", sub: "Precise moisture content determination on every lot" },
  { code: "ICH Q3C", label: "Residual Solvent Testing", sub: "Class 1/2/3 limits per ICH Q3C guidelines" },
];

export default function ManufacturingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0F0E" }}>

      {/* Hero */}
      <section className="relative pt-36 pb-24 border-b overflow-hidden" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Breadcrumb items={[{label:"Home",href:"/"},{label:"Manufacturing"}]} variant="dark" className="mb-6" />
            <span className="eyebrow mb-5 block">Manufacturing</span>
            <h1
              className="font-bold tracking-tight mb-6 max-w-3xl"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1,
                color: "#FDFCF8",
              }}
            >
              Built to{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>Pharmaceutical</em>
              <br />
              Standards
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-secondary">
              Every Nexphoria compound is synthesized, purified, and released through a rigorous
              cGMP-aligned process — from raw-material qualification through independent verification,
              lot release, and cold-chain packing on every shipment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* cGMP commitment — dark pullout */}
      <section className="py-20" style={{ backgroundColor: "#F5F3F0" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="max-w-4xl"
          >
            <p
              className="text-2xl md:text-3xl leading-relaxed"
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, color: "#1A1A1A" }}
            >
              We impose pharmaceutical-grade manufacturing controls on research compounds because{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>
                the integrity of your research depends on the integrity of your reagents.
              </em>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-28 border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mb-14"
          >
            <span className="eyebrow mb-4 block">Production Process</span>
            <h2
              className="font-bold tracking-tight max-w-2xl"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#FDFCF8",
              }}
            >
              From Synthesis to{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>Your Lab</em>
            </h2>
          </motion.div>

          <div className="space-y-0 border-t" style={{ borderColor: "#2A2A28" }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.07}
                className="grid md:grid-cols-[120px_1fr] gap-8 py-10 border-b items-start"
                style={{ borderColor: "#2A2A28" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="text-xs font-mono font-medium px-3 py-1.5"
                    style={{ backgroundColor: "#F5F3F0", color: "#B8A44C" }}
                  >
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-playfair, Georgia, serif)", color: "#FDFCF8" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-2xl text-secondary">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What we measure — RP-HPLC vs ESI-MS, explained */}
      <section className="py-24 border-b" style={{ backgroundColor: "#F5F3F0", borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mb-12 max-w-2xl"
          >
            <span className="eyebrow mb-4 block">What We Measure</span>
            <h2
              className="font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#1A1A1A",
              }}
            >
              Purity and Identity,{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>Explained</em>
            </h2>
            <p className="text-base leading-relaxed mt-4 text-secondary">
              Two independent measurements answer two different questions. These are analytical
              characterizations of the compound itself — not statements about any biological effect.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {methodsExplained.map((m, i) => (
              <motion.div
                key={m.code}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                className="p-8 border bg-white"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <div
                  className="text-xs font-mono font-medium px-2 py-1 inline-block mb-4"
                  style={{ backgroundColor: "#010101", color: "#B8A44C" }}
                >
                  {m.code}
                </div>
                <h3 className="text-xl mb-1" style={{ fontFamily: "var(--font-playfair, Georgia, serif)", color: "#1A1A1A" }}>
                  {m.name}
                </h3>
                <p className="text-sm font-medium mb-3" style={{ color: "#B8923A" }}>{m.measures}</p>
                <p className="text-sm leading-relaxed text-secondary">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Independent testing partners */}
      <section className="py-24 border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mb-12 max-w-2xl"
          >
            <span className="eyebrow mb-4 block">Independent Testing Partners</span>
            <h2
              className="font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#FDFCF8",
              }}
            >
              Verified by Accredited{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>Laboratories</em>
            </h2>
            <p className="text-base leading-relaxed mt-4 text-secondary">
              We do not test our own compounds. Every lot is characterized by independent laboratories,
              and their results — not ours — appear on the Certificate of Analysis.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {labPartners.map((p, i) => (
              <motion.div
                key={p.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                className="p-7 border"
                style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}
              >
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-playfair, Georgia, serif)", color: "#FDFCF8" }}>
                  {p.name}
                </h3>
                <div className="text-xs font-mono mb-3" style={{ color: "#B8A44C" }}>{p.methods}</div>
                <p className="text-sm leading-relaxed text-secondary">{p.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality standards grid */}
      <section className="py-24 border-b" style={{ backgroundColor: "#161614", borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mb-12"
          >
            <span className="eyebrow mb-4 block">Quality Framework</span>
            <h2
              className="font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#FDFCF8",
              }}
            >
              Our Standards
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {standards.map((s, i) => (
              <motion.div
                key={s.code}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.07}
                className="flex items-start gap-4 p-6 border"
                style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}
              >
                <div
                  className="text-xs font-mono font-medium px-2 py-1 whitespace-nowrap mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: "#F5F3F0", color: "#B8A44C" }}
                >
                  {s.code}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#FDFCF8" }}>{s.label}</div>
                  <p className="text-xs leading-relaxed text-secondary">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* White label section */}
      <section className="py-24" style={{ backgroundColor: "#F5F3F0" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="max-w-3xl"
          >
            <span className="eyebrow mb-5 block">Partners</span>
            <h2
              className="font-bold tracking-tight mb-6"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#1A1A1A",
              }}
            >
              White-Label &{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>Custom Packaging</em>
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-secondary">
              We produce private-label peptide compounds for qualified distributors, research
              institutions, and branded product lines. Same cGMP standards, your branding.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Full COA transfer for your brand documentation",
                "Custom vial labeling and packaging",
                "Bulk synthesis for defined peptide sequences",
                "Minimum quantities from 100mg — scalable to gram-scale",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#B8A44C" }} />
                  <span className="text-sm text-secondary">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-acid">
              Inquire About Partnership
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: "#161614" }}>
        <div className="container-nex flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="font-bold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "2rem", color: "#FDFCF8" }}
            >
              View the full compound catalog
            </h2>
            <p className="text-sm text-secondary">
              Every compound includes HPLC data, MS confirmation, and third-party COA.
            </p>
          </div>
          <Link href="/products" className="btn-acid whitespace-nowrap">
            Browse Compounds <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Research Use Only — manufacturing output is RUO only */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <RUOBanner variant="card" tone="dark" />
        </div>
      </section>
    </div>
  );
}
