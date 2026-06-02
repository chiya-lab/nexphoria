"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const STATS = [
  "99.2% avg purity",
  "247 batches tested",
  "14 SKUs in stock",
  "24h ship cutoff",
];

export default function PprStatRow() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--ink-2)", borderBottom: "1px solid var(--steel)" }}
      aria-label="Key metrics"
    >
      <motion.div
        variants={staggerContainer(0.08, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-5 gap-y-3 px-8 py-5"
      >
        {STATS.map((stat, i) => (
          <motion.div key={stat} variants={staggerItem(6)} className="flex items-center gap-5">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: "var(--steel)", fontSize: 14 }}>
                ·
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: "var(--silver-2)",
                letterSpacing: "0.01em",
              }}
            >
              {stat}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
