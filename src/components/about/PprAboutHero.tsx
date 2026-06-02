"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export default function PprAboutHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--ink)", borderBottom: "1px solid var(--steel)" }}
      aria-labelledby="about-hero-heading"
    >
      <div
        className="ppr-grid-hex pointer-events-none absolute inset-0"
        style={{ opacity: 0.35 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <motion.div
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-6 py-28 text-center md:py-36"
      >
        <motion.span
          variants={staggerItem(6)}
          className="rounded-full px-3 py-1 text-[11px] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            color: "var(--accent)",
            border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
          }}
        >
          Research integrity, by design
        </motion.span>

        <motion.h1
          id="about-hero-heading"
          variants={staggerItem(10)}
          className="max-w-[18ch] text-[44px] font-semibold leading-[1.05] md:text-[64px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Built for researchers who don&apos;t compromise
        </motion.h1>

        <motion.p
          variants={staggerItem(8)}
          className="max-w-[58ch] text-[16px] leading-relaxed md:text-[18px]"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Nexphoria exists to close the documentation gap in peptide research. Every
          compound is synthesized, characterized by HPLC and mass spectrometry, and
          shipped with a lot-traceable certificate of analysis. Molecular precision is
          not a feature here — it is the baseline.
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["HPLC verified", "Mass-spec confirmed", "Lot-traceable COA"].map((t) => (
            <span
              key={t}
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
            >
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
