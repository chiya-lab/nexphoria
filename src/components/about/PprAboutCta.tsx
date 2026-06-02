"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function PprAboutCta() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--ink)" }}
      aria-labelledby="about-cta-heading"
    >
      <div
        className="ppr-grid-hex pointer-events-none absolute inset-0"
        style={{ opacity: 0.3 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mx-auto flex max-w-[760px] flex-col items-center gap-6 px-6 py-28 text-center"
      >
        <h2
          id="about-cta-heading"
          className="max-w-[20ch] text-[36px] font-semibold leading-tight md:text-[48px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Standardize your research on a documented supply.
        </h2>
        <p
          className="max-w-[52ch] text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Begin with a research protocol or review the catalog. Every compound ships with a
          lot-traceable certificate of analysis.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/protocols"
            className="rounded-md px-7 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            Start with a protocol
          </Link>
          <Link
            href="/products"
            className="rounded-md px-7 py-3 text-[14px] font-semibold transition-colors hover:border-[var(--silver-2)]"
            style={{
              border: "1px solid var(--steel)",
              color: "var(--platinum)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            Browse catalog
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
