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
    id: "qualify",
    q: "What counts as a qualifying order?",
    a: "Your friend's first order of $100 or more, after any other discounts, qualifies. Their $20 discount applies at checkout; your $20 credit posts once the order ships.",
  },
  {
    id: "credit",
    q: "How do I use my credit?",
    a: "Credits apply automatically to your next order in checkout. They stack toward the order total and never expire while your account is active.",
  },
  {
    id: "limit",
    q: "Is there a referral limit?",
    a: "You can refer as many colleagues as you like. Self-referrals and orders that are later cancelled or refunded do not earn credit.",
  },
  {
    id: "who",
    q: "Who can I refer?",
    a: "Refer fellow researchers and qualified buyers. All Nexphoria compounds are research use only — please share accordingly and never imply medical use.",
  },
  {
    id: "affiliate",
    q: "How is this different from the affiliate program?",
    a: "This is a customer give-and-get credit program. If you publish content and want percentage commissions and payouts, apply to the affiliate program at /affiliates.",
  },
];

export default function PprReferFaq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-6">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Referral FAQ
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Questions, answered
        </h2>
      </motion.div>
      <ul className="flex flex-col gap-2">
        {QAS.map((item) => {
          const isOpen = item.id === open;
          return (
            <li key={item.id} className="overflow-hidden rounded-lg" style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}` }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
              >
                <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{item.q}</span>
                <ChevronDown size={18} aria-hidden="true" style={{ color: isOpen ? "var(--accent)" : "var(--silver-2)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.28s ease", flexShrink: 0 }} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                    <p className="px-5 pb-5 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>{item.a}</p>
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
