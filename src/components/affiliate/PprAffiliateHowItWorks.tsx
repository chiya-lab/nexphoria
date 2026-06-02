"use client";

import { motion } from "framer-motion";
import { FileText, ShieldCheck, Link2, Wallet } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const STEPS = [
  { icon: FileText, title: "Apply", body: "Submit your platforms, content focus, and promotion plan. Takes about a minute." },
  { icon: ShieldCheck, title: "Get approved", body: "We review for research-content fit and FTC compliance — typically within two business days." },
  { icon: Link2, title: "Share your link", body: "Generate tracked links and pull from the creative library. Attribution runs on your tier's cookie window." },
  { icon: Wallet, title: "Earn monthly", body: "Commissions accrue per conversion. Payouts release monthly via ACH, PayPal, wire, or USDC." },
];

export default function PprAffiliateHowItWorks() {
  return (
    <section className="px-5 py-14 lg:py-20" style={{ backgroundColor: "var(--ink-2)", borderTop: "1px solid var(--steel)", borderBottom: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
          <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
            How it works
          </span>
          <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
            Four steps from application to payout
          </h2>
        </motion.div>
        <motion.ol
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                variants={fadeInUp}
                className="flex flex-col gap-3 rounded-2xl p-6"
                style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-md"
                    style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="text-[28px] font-semibold leading-none" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  {step.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                  {step.body}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
