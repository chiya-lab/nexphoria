"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function PprReferHero() {
  return (
    <section
      className="relative overflow-hidden px-5 pt-16 pb-12 lg:pt-24"
      style={{ background: "linear-gradient(135deg, #0A0B0D 0%, #111317 60%, #1A1D22 100%)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.06 }}
      />
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
      >
        <motion.span
          variants={staggerItem()}
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--accent)" }}
        >
          Refer a colleague · Research use only
        </motion.span>
        <motion.h1
          variants={staggerItem()}
          className="text-[34px] font-semibold leading-[1.05] lg:text-[56px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Give <span style={{ color: "var(--accent)" }}>$20</span>, get{" "}
          <span style={{ color: "var(--accent)" }}>$20</span>
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="max-w-xl text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Share Nexphoria with a fellow researcher. They get $20 off their first qualifying order, and you get a
          $20 credit once it ships.
        </motion.p>
      </motion.div>
    </section>
  );
}
