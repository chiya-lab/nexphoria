"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function PprOriginStory() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--ink-2)", borderTop: "1px solid var(--steel)", borderBottom: "1px solid var(--steel)" }}
      aria-labelledby="about-origin-heading"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2">
        {/* Image placeholder */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative aspect-[4/3] overflow-hidden rounded-lg"
          style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
        >
          <div className="ppr-grid-hex absolute inset-0" style={{ opacity: 0.5 }} aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--silver-2)" }}
            >
              Synthesis bench · Lot NX-241
            </span>
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-5"
        >
          <h2
            id="about-origin-heading"
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Why Nexphoria exists
          </h2>
          <p
            className="text-[28px] font-semibold leading-tight md:text-[34px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
          >
            The research-integrity gap was the whole problem.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Nexphoria began with a recurring frustration: research compounds arriving
            with certificates that referenced an analytical method instead of reporting
            one, lot numbers that did not reconcile to a synthesis batch, and storage
            guidance copied across unrelated molecules. Reproducibility starts with
            knowing exactly what is in the vial.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            We built the supply chain in reverse — documentation first. Every compound
            is characterized by HPLC and mass spectrometry, traced to a single lot, and
            shipped cold-chain with a certificate a peer could audit. The result is a
            catalog researchers can standardize on across longitudinal work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
