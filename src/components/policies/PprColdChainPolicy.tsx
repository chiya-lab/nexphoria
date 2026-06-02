"use client";

import { motion } from "framer-motion";
import { Snowflake, Thermometer, Activity } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

interface Threshold {
  icon: typeof Snowflake;
  title: string;
  detail: string;
}

const THRESHOLDS: Threshold[] = [
  {
    icon: Snowflake,
    title: "Dry ice — overnight, ≥48 h transit",
    detail: "Overnight and any route rated beyond 48 hours ships on dry ice, holding sub-zero surface contact through delivery.",
  },
  {
    icon: Thermometer,
    title: "Gel packs — ground, ≤48 h transit",
    detail: "Conditioned phase-change gel packs hold the 2–8°C band for routes inside the 48-hour window, sized to box volume.",
  },
  {
    icon: Activity,
    title: "Logger on request",
    detail: "A single-use temperature logger is enclosed when a documented cold-chain record is required for the protocol or lot.",
  },
];

export default function PprColdChainPolicy() {
  return (
    <section style={{ backgroundColor: "var(--ink-2)", borderBlock: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-5xl px-5 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex flex-col gap-4">
            <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
              Cold chain
            </span>
            <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              How we ship at 2–8°C
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              Lyophilized peptide tolerates brief ambient transit, but heat accelerates hydrolysis and
              oxidation. Cold-chain media is selected per route so the compound you receive matches the
              purity stated on its certificate of analysis.
            </p>
            <p className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
              On arrival, transfer lyophilized vials to −20°C and allow them to reach room temperature before opening.
            </p>
          </motion.div>

          <motion.ul variants={staggerContainer(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="flex flex-col gap-3">
            {THRESHOLDS.map((t) => {
              const Icon = t.icon;
              return (
                <motion.li
                  key={t.title}
                  variants={staggerItem()}
                  className="flex gap-4 rounded-xl p-4"
                  style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
                >
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                  >
                    <Icon size={18} aria-hidden="true" style={{ color: "var(--accent)" }} />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                      {t.title}
                    </span>
                    <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                      {t.detail}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
