"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import PprAffiliateDisclosure from "./PprAffiliateDisclosure";

export default function PprAffiliateCta() {
  return (
    <section className="px-5 py-16 lg:py-24" style={{ background: "linear-gradient(135deg, #0A0B0D 0%, #111317 60%, #1A1D22 100%)" }}>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl p-10 text-center"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 6%, var(--ink-2))", border: "1px solid var(--accent)" }}
      >
        <h2 className="text-[28px] font-semibold lg:text-[40px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Apply in 60 seconds
        </h2>
        <p className="max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          Tell us where you publish and how you plan to promote. Approved partners start at 15% and climb to 30%.
        </p>
        <Link
          href="/affiliates/apply"
          className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Start your application
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <PprAffiliateDisclosure />
      </motion.div>
    </section>
  );
}
