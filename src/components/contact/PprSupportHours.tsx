"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export default function PprSupportHours() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-start gap-4 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
          >
            <Clock size={20} aria-hidden="true" style={{ color: "var(--accent)" }} />
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              Support hours
            </span>
            <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              Monday–Friday, 9:00am–6:00pm ET
            </span>
          </div>
        </div>
        <Link
          href="/faq"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
        >
          After-hours? Check the FAQ
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
