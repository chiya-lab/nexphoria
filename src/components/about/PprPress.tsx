"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const PRESS = [
  {
    outlet: "BENCH REPORT",
    quote:
      "The certificate references the column, the method, and the lot. That is rarer than it should be in the research-compound market.",
  },
  {
    outlet: "ASSAY QUARTERLY",
    quote:
      "Identity confirmation by mass spec on every compound, not a representative sample. Nexphoria treats documentation as the product.",
  },
  {
    outlet: "THE PROTOCOL",
    quote:
      "Cold-chain dispatch with a temperature logger closes the last gap most suppliers leave open between synthesis and bench.",
  },
];

export default function PprPress() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--ink-2)", borderTop: "1px solid var(--steel)", borderBottom: "1px solid var(--steel)" }}
      aria-labelledby="about-press-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <h2
          id="about-press-heading"
          className="mb-12 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          What the field is saying
        </h2>

        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {PRESS.map((p) => (
            <motion.figure
              key={p.outlet}
              variants={staggerItem(12)}
              className="flex flex-col gap-5 rounded-lg p-7"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
            >
              <figcaption
                className="text-[13px] font-semibold uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
              >
                {p.outlet}
              </figcaption>
              <blockquote
                className="text-[15px] leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
              >
                {p.quote}
              </blockquote>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
