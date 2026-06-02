"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Tier {
  id: string;
  name: string;
  commitment: string;
  discount: string;
  featured?: boolean;
  perks: string[];
}

const TIERS: Tier[] = [
  {
    id: "t1",
    name: "Tier 1",
    commitment: "$5k / month",
    discount: "15%",
    perks: ["Volume pricing on catalog lots", "Per-lot COA with every shipment", "Standard cold-chain handling", "Email research support"],
  },
  {
    id: "t2",
    name: "Tier 2",
    commitment: "$15k / month",
    discount: "25%",
    featured: true,
    perks: ["Everything in Tier 1", "Net-30 terms on approval", "Dedicated account representative", "Priority cold-chain fulfillment", "COA delivered pre-shipment"],
  },
  {
    id: "t3",
    name: "Tier 3",
    commitment: "$50k / month",
    discount: "35%",
    perks: ["Everything in Tier 2", "Custom labeling on request", "Custom synthesis priority queue", "Quarterly business reviews", "Standing supply agreements"],
  },
];

export default function PprWholesaleTiers() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Account tiers
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Pricing that scales with volume
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {TIERS.map((tier) => (
          <motion.div
            key={tier.id}
            variants={fadeInUp}
            className="flex flex-col gap-5 rounded-2xl p-6 lg:p-7"
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
                  Most chosen
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[40px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                {tier.discount}
              </span>
              <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                off catalog · {tier.commitment} commitment
              </span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-[14px] leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  <Check size={16} aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Commitments are indicative monthly volumes. Final pricing is set per account after review. For research use only.
      </p>
    </section>
  );
}
