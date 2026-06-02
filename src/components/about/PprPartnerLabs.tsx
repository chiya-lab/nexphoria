"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const LABS = [
  { name: "Meridian Analytical", mono: "MRDN" },
  { name: "Halden BioAssay", mono: "HALDEN" },
  { name: "Castor Spectrometry", mono: "CASTOR" },
  { name: "Northvale Reference Lab", mono: "NRTHVL" },
];

export default function PprPartnerLabs() {
  return (
    <section className="w-full" style={{ backgroundColor: "var(--ink)" }} aria-labelledby="about-labs-heading">
      <div className="mx-auto max-w-[1100px] px-6 py-20">
        <h2
          id="about-labs-heading"
          className="mb-3 text-center text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          HPLC verification partners
        </h2>
        <p
          className="mx-auto mb-10 max-w-[44ch] text-center text-[15px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Independent laboratories that cross-check our identity and purity methods, so the
          figures on a certificate are not self-reported alone.
        </p>

        <motion.ul
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg md:grid-cols-4"
          style={{ border: "1px solid var(--steel)", backgroundColor: "var(--steel)" }}
        >
          {LABS.map((l) => (
            <motion.li
              key={l.mono}
              variants={staggerItem(8)}
              className="flex flex-col items-center justify-center gap-2 py-10"
              style={{ backgroundColor: "var(--ink-2)" }}
            >
              <span
                className="text-[18px] font-semibold tracking-wide"
                style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}
              >
                {l.mono}
              </span>
              <span
                className="text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
              >
                {l.name}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
