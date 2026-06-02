"use client";

import { motion } from "framer-motion";
import { CalendarClock, UserCog, FileCheck2, Tags, Snowflake, LineChart, LucideIcon } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Benefit {
  id: string;
  icon: LucideIcon;
  title: string;
  detail: string;
}

const BENEFITS: Benefit[] = [
  { id: "net30", icon: CalendarClock, title: "Net-30 terms", detail: "Approved accounts invoice on net-30, with higher limits as history builds." },
  { id: "rep", icon: UserCog, title: "Dedicated representative", detail: "A single point of contact who knows your catalog, cadence, and documentation needs." },
  { id: "coa", icon: FileCheck2, title: "COA pre-shipment", detail: "Receive the per-lot certificate of analysis before the lot leaves the facility." },
  { id: "label", icon: Tags, title: "Custom labeling on request", detail: "Private labeling and custom lot references available for qualifying volumes." },
  { id: "cold", icon: Snowflake, title: "Priority cold-chain", detail: "Front-of-queue cold-chain fulfillment with logger documentation where required." },
  { id: "qbr", icon: LineChart, title: "Quarterly business reviews", detail: "Structured reviews of volume, lead times, and upcoming research needs." },
];

export default function PprWholesaleBenefits() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Account benefits
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          What a lab account includes
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {BENEFITS.map((b) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.id}
              variants={fadeInUp}
              className="flex flex-col gap-3 rounded-xl p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
              >
                <Icon size={20} aria-hidden="true" style={{ color: "var(--accent)" }} />
              </span>
              <span className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {b.title}
              </span>
              <span className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                {b.detail}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
