"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface QA {
  id: string;
  q: string;
  a: string;
}

const QAS: QA[] = [
  {
    id: "net-terms",
    q: "Do you offer net terms?",
    a: "Net-30 terms are available to approved Tier 2 and Tier 3 accounts after a credit and eligibility review. New accounts typically begin on prepayment and transition to terms as order history is established.",
  },
  {
    id: "minimums",
    q: "Are there minimum order requirements?",
    a: "Tier pricing is keyed to indicative monthly volume rather than a single minimum order. There is no hard per-order minimum for an active account, though tier discounts apply once the corresponding monthly commitment is met.",
  },
  {
    id: "custom",
    q: "Can you produce custom peptides?",
    a: "Yes. Custom solid-phase synthesis is available for many sequences, quoted per project by purity, scale, and modifications. Tier 3 accounts receive priority placement in the synthesis queue.",
  },
  {
    id: "international",
    q: "Do you ship internationally?",
    a: "Wholesale fulfillment is US-only. We do not currently ship wholesale orders outside the United States, and accounts must ship to a US address.",
  },
  {
    id: "dropship",
    q: "Do you support drop-shipping?",
    a: "Blind drop-shipping to a research end-point is available for qualifying distributor accounts, with discreet outer packaging and your lot reference on the documentation. Discuss requirements with your account representative.",
  },
  {
    id: "samples",
    q: "Is there a sample program?",
    a: "Qualified prospective accounts can request reference-grade samples of select catalog items for in-house qualification before committing to a tier. Sample availability is confirmed during account review.",
  },
];

export default function PprWholesaleFaq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-6">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Wholesale FAQ
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Account questions, answered
        </h2>
      </motion.div>

      <ul className="flex flex-col gap-2">
        {QAS.map((item) => {
          const isOpen = item.id === open;
          return (
            <li
              key={item.id}
              className="overflow-hidden rounded-lg"
              style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}` }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
              >
                <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  style={{
                    color: isOpen ? "var(--accent)" : "var(--silver-2)",
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.28s ease",
                    flexShrink: 0,
                  }}
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
