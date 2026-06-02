"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { AFFILIATE_TIERS } from "@/lib/affiliateTiers";

export default function PprAffiliateTiers() {
  return (
    <section id="tiers" className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-8"
      >
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Commission tiers
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Commission that scales with your reach
        </h2>
        <p className="mt-2 max-w-2xl text-[15px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
          Every partner starts at Researcher. Tiers advance automatically based on monthly referred sales —
          no negotiation, no minimums to chase.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {AFFILIATE_TIERS.map((tier) => (
          <motion.div
            key={tier.id}
            variants={fadeInUp}
            className="flex flex-col gap-5 rounded-2xl p-6"
            style={{
              backgroundColor: tier.featured ? "color-mix(in srgb, var(--accent) 6%, var(--ink-2))" : "var(--ink-2)",
              border: `1px solid ${tier.featured ? "var(--accent)" : "var(--steel)"}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
                {tier.name}
              </span>
              {tier.featured && (
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] uppercase"
                  style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}
                >
                  Popular
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[44px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                {tier.commission}%
              </span>
              <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                {tier.qualifies}
              </span>
            </div>
            <dl className="flex flex-col gap-1.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
              <div className="flex justify-between">
                <dt>Min payout</dt>
                <dd style={{ color: "var(--silver-1)" }}>{tier.minPayout === 0 ? "None" : `$${tier.minPayout}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Cookie window</dt>
                <dd style={{ color: "var(--silver-1)" }}>{tier.cookieDays} days</dd>
              </div>
            </dl>
            <ul className="flex flex-col gap-2.5">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-[13px] leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  <Check size={15} aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Tier qualification is reviewed monthly on trailing 30-day referred sales. For research use only.
      </p>
    </section>
  );
}
