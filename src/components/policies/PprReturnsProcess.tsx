"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

interface Step {
  number: string;
  title: string;
  detail: string;
}

const STEPS: Step[] = [
  { number: "01", title: "Initiate", detail: "Contact research support with your order number, lot number, and the reason for return within the eligible window." },
  { number: "02", title: "Authorize", detail: "We verify eligibility, confirm seal and lot, and issue a return authorization with prepaid instructions where applicable." },
  { number: "03", title: "Ship back", detail: "Return the unopened, sealed vials in protective packaging using the authorization reference. Cold-chain media is not required for unopened lyophilized lots." },
  { number: "04", title: "Refund", detail: "On receipt and inspection, the refund is issued to the original payment method, or a replacement is dispatched for damage and error cases." },
];

export default function PprReturnsProcess() {
  return (
    <section style={{ backgroundColor: "var(--ink-2)", borderBlock: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-5xl px-5 py-16 lg:py-20">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8 flex flex-col gap-2">
          <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
            Process
          </span>
          <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Four steps to a resolution
          </h2>
        </motion.div>

        <motion.ol variants={staggerContainer(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <motion.li
              key={step.number}
              variants={staggerItem()}
              className="flex flex-col gap-3 rounded-xl p-5"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
            >
              <span className="text-[28px] font-semibold" style={{ fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--accent) 60%, transparent)" }}>
                {step.number}
              </span>
              <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {step.title}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                {step.detail}
              </span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
