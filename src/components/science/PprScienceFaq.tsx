"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { fadeInUp, easing, duration } from "@/lib/motion";

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "What is HPLC and what does the purity percent mean?",
    a: "High-Performance Liquid Chromatography separates a sample into its components on a reverse-phase column. The purity percent is the area of the main peak divided by the total peak area in the UV trace, so 99% means the target compound accounts for 99% of detectable material.",
  },
  {
    q: "How do you verify the mass of a peptide?",
    a: "Electrospray-ionization mass spectrometry ionizes the molecule and measures its mass-to-charge ratio. We compare the observed monoisotopic mass against the theoretical mass calculated from the sequence; agreement within tolerance confirms molecular identity.",
  },
  {
    q: "What is residual TFA and why does it matter?",
    a: "Trifluoroacetic acid is commonly used in solid-phase peptide synthesis and purification. Residual trifluoroacetate counter-ions can persist and affect downstream assays, so we quantify and report residual solvent content against established class limits.",
  },
  {
    q: "What does the endotoxin (LAL) result tell me?",
    a: "The Limulus amebocyte lysate assay measures bacterial endotoxin. For compounds intended for injectable-route research models, a low endotoxin value (reported in EU/mg) indicates the material is suitable for those experimental contexts.",
  },
  {
    q: "Is the testing done in-house or independently?",
    a: "Characterization is performed by independent accredited laboratories. The Certificate of Analysis names the laboratory and analyst so the result is attributable and not a self-reported claim.",
  },
  {
    q: "How should I store compounds to preserve integrity?",
    a: "Store lyophilized material at −20 °C for long-term holding. Once reconstituted with bacteriostatic water, keep it at 4 °C and use it promptly. Stability data shows ambient storage measurably degrades peptide within months.",
  },
];

export default function PprScienceFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-5 py-16 md:px-10 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
          <p
            className="mb-3 text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Method questions
          </p>
          <h2
            className="mb-10 text-[28px] font-semibold md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Frequently asked
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-lg"
                style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}` }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
                >
                  <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: duration.fast, ease: easing.easeOut }}
                    style={{ color: "var(--accent)", flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <Plus size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: duration.base, ease: easing.easeOut }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="px-5 pb-5 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
