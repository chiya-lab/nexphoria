"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import PprStackShell from "@/components/stack/PprStackShell";

export default function StackBuilderClient() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-8 lg:pt-20">
        <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="visible" className="flex flex-col gap-4">
          <motion.span
            variants={staggerItem()}
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
          >
            Protocol composer
          </motion.span>
          <motion.h1
            variants={staggerItem()}
            className="text-[34px] font-semibold leading-[1.05] lg:text-[52px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Stack builder
          </motion.h1>
          <motion.p
            variants={staggerItem()}
            className="max-w-2xl text-[16px] leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
          >
            Compose a multi-compound research protocol: select compounds, set pack sizes and planning doses,
            lay out daily timing, and review composition notes and bulk pricing. Share the result as a link.
          </motion.p>
          <motion.span
            variants={staggerItem()}
            className="text-[11px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}
          >
            Research use only · United States only · Not medical guidance
          </motion.span>
        </motion.div>
      </section>
      <PprStackShell />
    </>
  );
}
