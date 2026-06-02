"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LifeBuoy, ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export default function PprFaqStillStuck() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-4">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center gap-5 rounded-2xl px-6 py-12 text-center lg:px-12"
        style={{
          backgroundColor: "var(--ink-2)",
          border: "1px solid var(--accent)",
          backgroundImage:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 60%)",
        }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
        >
          <LifeBuoy size={24} aria-hidden="true" style={{ color: "var(--accent)" }} />
        </span>
        <h2
          className="text-[24px] font-semibold lg:text-[30px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Didn&rsquo;t find your answer?
        </h2>
        <p
          className="max-w-md text-[15px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Our research support team handles questions on analytical data, custom synthesis, and
          wholesale accounts directly.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Contact research support
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
