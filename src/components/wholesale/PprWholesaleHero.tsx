"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function PprWholesaleHero() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-16 pb-10 text-center lg:pt-24">
      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="flex flex-col items-center gap-5">
        <motion.span
          variants={staggerItem()}
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
        >
          Lab accounts · Bulk research orders · US only
        </motion.span>
        <motion.h1
          variants={staggerItem()}
          className="text-[34px] font-semibold leading-[1.05] lg:text-[52px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Supply built for the bench, at scale
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="max-w-2xl text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Volume pricing, net terms, and documentation packages for laboratories, institutions, and
          qualified distributors. Every lot ships with its certificate of analysis.
        </motion.p>
        <motion.div variants={staggerItem()} className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#wholesale-form"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Apply for an account
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="mailto:accounts@nexphoria.com"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            <Mail size={16} aria-hidden="true" />
            accounts@nexphoria.com
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
