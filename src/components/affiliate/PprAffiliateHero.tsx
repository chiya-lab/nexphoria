"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function PprAffiliateHero() {
  const [rate, setRate] = useState(15);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRate(30);
      return;
    }
    const seq = [15, 20, 25, 30];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % seq.length;
      setRate(seq[i]);
    }, 1600);
    return () => clearInterval(id);
  }, []);

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
        className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center"
      >
        <motion.span
          variants={staggerItem()}
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--accent)" }}
        >
          Partner program · Peer-to-peer · RUO
        </motion.span>
        <motion.h1
          variants={staggerItem()}
          className="text-[34px] font-semibold leading-[1.05] lg:text-[56px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Earn{" "}
          <span style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{rate}%</span> on every
          research compound you refer
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="max-w-2xl text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Commission scales from 15% to 30% as your referrals grow. Tracked links, transparent reporting,
          and monthly payouts — built for researchers, educators, and technical creators.
        </motion.p>
        <motion.div variants={staggerItem()} className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/affiliates/apply"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Apply in 60 seconds
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="#tiers"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            See commission tiers
          </Link>
        </motion.div>
        <motion.p
          variants={staggerItem()}
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
        >
          Earnings are illustrative. Research-content promotion only — no medical claims.
        </motion.p>
      </motion.div>
    </section>
  );
}
