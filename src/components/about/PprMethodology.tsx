"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const STAGES = [
  {
    n: "01",
    title: "Synthesis",
    body: "Solid-phase peptide synthesis under controlled conditions, with in-process monitoring at each coupling step.",
  },
  {
    n: "02",
    title: "HPLC purity",
    body: "Reversed-phase HPLC at 220 nm establishes total purity and resolves process-related impurities against the spec.",
  },
  {
    n: "03",
    title: "Mass spectrometry",
    body: "ESI-MS confirms molecular identity by matching the observed [M+H]+ to the theoretical mass of the sequence.",
  },
  {
    n: "04",
    title: "Certificate of analysis",
    body: "Results are compiled into a lot-traceable COA citing the analytical method, column, water, and acetate content.",
  },
  {
    n: "05",
    title: "Cold-chain ship",
    body: "Lyophilized and packed with a temperature logger; dispatched cold-chain so the compound arrives within threshold.",
  },
];

export default function PprMethodology() {
  return (
    <section className="w-full" style={{ backgroundColor: "var(--ink)" }} aria-labelledby="about-method-heading">
      <div className="mx-auto max-w-[1100px] px-6 py-24">
        <h2
          id="about-method-heading"
          className="mb-3 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          From bench to vial
        </h2>
        <p
          className="mb-12 max-w-[24ch] text-[32px] font-semibold leading-tight md:text-[40px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Five stages. Every lot.
        </p>

        <motion.ol
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col"
        >
          {STAGES.map((s, i) => (
            <motion.li
              key={s.n}
              variants={staggerItem(10)}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 py-6"
              style={{ borderTop: i === 0 ? "1px solid var(--steel)" : "none", borderBottom: "1px solid var(--steel)" }}
            >
              <span
                className="text-[15px] tabular-nums"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                aria-hidden="true"
              >
                {s.n}
              </span>
              <h3
                className="text-[20px] font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                {s.title}
              </h3>
              <p
                className="col-start-2 max-w-[60ch] text-[14px] leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
              >
                {s.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
