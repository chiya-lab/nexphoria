"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function PprContactHero() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-16 pb-10 text-center lg:pt-24">
      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="flex flex-col items-center gap-5">
        <motion.span
          variants={staggerItem()}
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
        >
          Research support · 21+ · US only
        </motion.span>
        <motion.h1
          variants={staggerItem()}
          className="text-[34px] font-semibold leading-[1.05] lg:text-[52px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Talk to the people behind the lot
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="max-w-2xl text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Analytical data, custom synthesis, documentation, and account questions — routed to the
          right desk and answered by researchers, not a script.
        </motion.p>
      </motion.div>
    </section>
  );
}
