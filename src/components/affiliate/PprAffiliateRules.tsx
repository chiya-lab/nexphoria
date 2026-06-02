"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const ALLOWED = [
  "Research-context content and methods discussion",
  "Technical reviews, COA walkthroughs, reconstitution guides",
  "Citations to peer-reviewed literature with DOIs",
  "Clear research-use-only framing on every placement",
  "FTC affiliate disclosure on all promotions",
];

const NOT_ALLOWED = [
  "Medical, therapeutic, or disease-treatment claims",
  "Before/after imagery or personal outcome promises",
  "Targeting minors or non-research consumer audiences",
  "Paid search bidding on Nexphoria trademark terms",
  "Self-referral, coupon stacking, or cookie stuffing",
];

export default function PprAffiliateRules() {
  return (
    <section className="px-5 py-14 lg:py-20" style={{ backgroundColor: "var(--ink-2)", borderTop: "1px solid var(--steel)", borderBottom: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
          <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
            Promotion guidelines
          </span>
          <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
            Promote responsibly — it protects us both
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
          >
            <h3 className="mb-4 text-[14px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--ok)" }}>
              Allowed
            </h3>
            <ul className="flex flex-col gap-3">
              {ALLOWED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  <Check size={16} aria-hidden="true" style={{ color: "var(--ok)", flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
          >
            <h3 className="mb-4 text-[14px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--danger)" }}>
              Not allowed
            </h3>
            <ul className="flex flex-col gap-3">
              {NOT_ALLOWED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  <X size={16} aria-hidden="true" style={{ color: "var(--danger)", flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <p className="mt-5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
          Violations may result in withheld commissions and removal from the program. Full terms at /affiliates/terms.
        </p>
      </div>
    </section>
  );
}
