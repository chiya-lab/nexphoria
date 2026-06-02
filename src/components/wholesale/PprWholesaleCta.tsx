"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export default function PprWholesaleCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-start gap-6 rounded-2xl p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12"
        style={{
          backgroundColor: "var(--ink-2)",
          border: "1px solid var(--accent)",
          backgroundImage: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 60%)",
        }}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-[26px] font-semibold lg:text-[34px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Open a lab account
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Submit an application for review, or email the accounts desk directly to get started.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="#wholesale-form"
            className="flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Apply for account
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="mailto:accounts@nexphoria.com"
            className="flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            <Mail size={16} aria-hidden="true" />
            accounts@nexphoria.com
          </a>
        </div>
      </motion.div>
    </section>
  );
}
