"use client";

import { motion } from "framer-motion";
import { Inbox, UserCheck, FileCheck2, LucideIcon } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Sla {
  id: string;
  icon: LucideIcon;
  label: string;
  detail: string;
}

const SLAS: Sla[] = [
  { id: "ack", icon: Inbox, label: "Acknowledged same day", detail: "Every message sent on a business day is logged and acknowledged before close." },
  { id: "route", icon: UserCheck, label: "Routed to a specialist", detail: "Your inquiry reaches the desk that owns it — support, accounts, or press." },
  { id: "resolve", icon: FileCheck2, label: "Documented resolution", detail: "Analytical answers arrive with the COA or method reference behind them." },
];

export default function PprResponseSla() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-6">
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
        >
          What you can expect
        </span>
        <h2 className="mt-2 text-[24px] font-semibold lg:text-[30px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Our response commitment
        </h2>
      </motion.div>
      <motion.ol
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {SLAS.map((sla) => {
          const Icon = sla.icon;
          return (
            <motion.li
              key={sla.id}
              variants={fadeInUp}
              className="flex flex-col gap-3 rounded-xl p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <Icon size={22} aria-hidden="true" style={{ color: "var(--accent)" }} />
              <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {sla.label}
              </span>
              <span className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                {sla.detail}
              </span>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}
