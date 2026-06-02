"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { POLICY_FAQ } from "./policyFaqData";

export default function PprPolicyFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8 flex flex-col gap-2">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Common questions
        </span>
        <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Shipping &amp; returns FAQ
        </h2>
      </motion.div>

      <ul className="flex flex-col gap-2">
        {POLICY_FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={item.q}
              className="overflow-hidden rounded-lg"
              style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}` }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
              >
                <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  style={{ color: isOpen ? "var(--accent)" : "var(--silver-2)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.28s ease", flexShrink: 0 }}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="px-5 pb-5 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
