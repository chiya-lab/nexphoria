"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const TEAM = [
  {
    name: "Dr. Elena Varga",
    credential: "Chief Scientist · PhD, Peptide Chemistry",
    bio: "Twelve years in solid-phase synthesis; sets the purity threshold every lot is held to.",
  },
  {
    name: "Dr. Marcus Lindqvist",
    credential: "Head of QC · PhD, Analytical Chemistry",
    bio: "Owns the HPLC and mass-spec workflows; signs off on every certificate of analysis.",
  },
  {
    name: "Dr. Priya Raman",
    credential: "Synthesis Lead · PhD, Organic Chemistry",
    bio: "Optimizes coupling chemistry for difficult sequences and scales validated routes.",
  },
  {
    name: "Tomas Berg",
    credential: "Cold-Chain Operations · MSc, Logistics",
    bio: "Designed the temperature-logged dispatch process so compounds arrive within threshold.",
  },
  {
    name: "Dr. Sofia Almeida",
    credential: "Method Development · PhD, Mass Spectrometry",
    bio: "Builds the ESI-MS identity methods that confirm molecular mass against the theoretical.",
  },
  {
    name: "Wei Chen",
    credential: "Documentation Lead · MSc, Regulatory Science",
    bio: "Keeps lot traceability and COA records audit-ready for longitudinal research.",
  },
];

export default function PprTeamGrid() {
  return (
    <section className="w-full" style={{ backgroundColor: "var(--ink-2)", borderTop: "1px solid var(--steel)" }} aria-labelledby="about-team-heading">
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <h2
          id="about-team-heading"
          className="mb-3 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          The people behind the spec
        </h2>
        <p
          className="mb-12 max-w-[32ch] text-[32px] font-semibold leading-tight md:text-[40px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Chemists who answer their own email.
        </p>

        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TEAM.map((m) => (
            <motion.div
              key={m.name}
              variants={staggerItem(12)}
              className="flex flex-col gap-4 rounded-lg p-6"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ border: "1px solid var(--steel)", backgroundColor: "var(--ink-2)" }}
                aria-hidden="true"
              >
                <span
                  className="text-[16px] font-semibold"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                >
                  {m.name
                    .replace(/^Dr\.\s/, "")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3
                  className="text-[18px] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                >
                  {m.name}
                </h3>
                <p
                  className="text-[12px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
                >
                  {m.credential}
                </p>
              </div>
              <p
                className="text-[14px] leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
              >
                {m.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
