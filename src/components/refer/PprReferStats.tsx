"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const STATS = [
  { label: "Friends referred", value: "4" },
  { label: "Credits earned", value: "$60" },
  { label: "Pending credit", value: "$20" },
  { label: "Available balance", value: "$40" },
];

export default function PprReferStats() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-6">
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeInUp} className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
            <p className="text-[24px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>{s.value}</p>
            <p className="mt-1.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-3 text-center text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Illustrative balances. Credits apply to research-use-only orders. For research use only.
      </p>
    </section>
  );
}
