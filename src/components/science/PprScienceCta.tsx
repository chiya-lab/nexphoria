"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileText } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export default function PprScienceCta() {
  const [email, setEmail] = useState("");
  const [compound, setCompound] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitted(true);
  }

  return (
    <section className="px-5 py-16 md:px-10 lg:py-24" style={{ backgroundColor: "var(--ink-2)" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="mx-auto grid max-w-5xl gap-10 rounded-xl p-7 md:p-10 lg:grid-cols-[1fr_1fr]"
        style={{ backgroundColor: "var(--ink)", border: "1px solid var(--accent)" }}
      >
        <div className="flex flex-col justify-center">
          <span
            className="mb-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
              color: "var(--accent)",
              border: "1px solid var(--steel)",
            }}
          >
            <FileText size={12} aria-hidden="true" />
            Sample documentation
          </span>
          <h2
            className="mb-3 text-[28px] font-semibold leading-tight md:text-[34px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Request a sample COA
          </h2>
          <p className="mb-6 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            See a representative Certificate of Analysis before you order. We will send a recent
            lot report for the compound you specify.
          </p>
          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
          >
            Browse peptides
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col justify-center">
          {submitted ? (
            <div
              className="flex flex-col items-start gap-3 rounded-lg p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 18%, transparent)" }}
              >
                <Check size={22} style={{ color: "var(--accent)" }} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                Request received
              </span>
              <span className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                A sample Certificate of Analysis is on its way to {email}.
              </span>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
                  Compound of interest
                </span>
                <input
                  type="text"
                  value={compound}
                  onChange={(e) => setCompound(e.target.value)}
                  placeholder="e.g. BPC-157"
                  className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                  style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", color: "var(--platinum)", fontFamily: "var(--font-body)" }}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
                  Work email
                </span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@lab.org"
                  className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                  style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", color: "var(--platinum)", fontFamily: "var(--font-body)" }}
                />
              </label>
              <button
                type="submit"
                className="mt-1 flex items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2"
                style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
              >
                Send me a sample COA
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
