"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import PprAffiliateDisclosure from "@/components/affiliate/PprAffiliateDisclosure";

export default function PprReferCta() {
  return (
    <section className="px-5 py-16 lg:py-24" style={{ background: "linear-gradient(135deg, #0A0B0D 0%, #111317 60%, #1A1D22 100%)" }}>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
      >
        <h2 className="text-[26px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Publish research content?
        </h2>
        <p className="max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          The give-$20-get-$20 program is for customers. If you create technical content, the affiliate program pays
          15% to 30% commissions with monthly payouts.
        </p>
        <Link
          href="/affiliates"
          className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Explore the affiliate program
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <PprAffiliateDisclosure />
      </motion.div>
    </section>
  );
}
