"use client";

import { motion } from "framer-motion";
import { Share2, Gift, Wallet } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const STEPS = [
  { icon: Share2, title: "Share your link", body: "Send your personal referral link to a colleague who works with research compounds." },
  { icon: Gift, title: "They save $20", body: "Your colleague gets $20 off their first qualifying order over $100." },
  { icon: Wallet, title: "You earn $20", body: "Once their order ships, a $20 store credit lands in your account." },
];

export default function PprReferProgram() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          How it works
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Three steps, two credits
        </h2>
      </motion.div>
      <motion.ol
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.li key={s.title} variants={fadeInUp} className="flex flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md" style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="text-[28px] font-semibold leading-none" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>0{i + 1}</span>
              </div>
              <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{s.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>{s.body}</p>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}
