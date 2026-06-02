"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const CASES = [
  {
    monthly: "$3,200",
    alias: "Technical reviewer · YouTube",
    body: "Long-form reconstitution and COA walkthroughs. Converts on trust, not volume — 6.4k subscribers, steady Creator-tier output.",
    tier: "Creator",
  },
  {
    monthly: "$8,500",
    alias: "Protocol educator · Newsletter",
    body: "Cites primary literature in a research digest. Tracked links in every issue; audience skews independent labs and clinicians.",
    tier: "Pro",
  },
  {
    monthly: "$24,000",
    alias: "Explainer creator · Multi-platform",
    body: "Short-form molecular explainers with a custom landing page. Elite tier, 120-day cookie, dedicated rep.",
    tier: "Elite",
  },
];

export default function PprAffiliateProof() {
  return (
    <section className="px-5 py-14 lg:py-20" style={{ backgroundColor: "var(--ink-2)", borderTop: "1px solid var(--steel)", borderBottom: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
          <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
            Partner snapshots
          </span>
          <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
            What active partners earn
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {CASES.map((c) => (
            <motion.figure
              key={c.monthly}
              variants={fadeInUp}
              className="flex flex-col gap-4 rounded-2xl p-6"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[36px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                  {c.monthly}
                </span>
                <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-3)" }}>
                  /mo · {c.tier}
                </span>
              </div>
              <blockquote className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                {c.body}
              </blockquote>
              <figcaption className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                {c.alias}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
        <p className="mt-5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
          Figures are illustrative composites, not guarantees of earnings. Individual results vary with audience and content. For research use only.
        </p>
      </div>
    </section>
  );
}
