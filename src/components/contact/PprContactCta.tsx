"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export default function PprContactCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-start gap-5 rounded-2xl p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10"
        style={{
          backgroundColor: "var(--ink-2)",
          border: "1px solid var(--accent)",
          backgroundImage: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 60%)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
          >
            <HelpCircle size={22} aria-hidden="true" style={{ color: "var(--accent)" }} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-semibold lg:text-[24px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              Many answers are already written
            </h2>
            <p className="max-w-md text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              Purity, COA, storage, and shipping questions are covered in detail in the FAQ.
            </p>
          </div>
        </div>
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Browse FAQ first
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
