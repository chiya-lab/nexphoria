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
    id: "payment",
    q: "How and when do I get paid?",
    a: "Commissions accrue per attributed conversion and are released monthly, on the first of the month, for the prior period. You choose ACH, PayPal, wire, or USDC in your dashboard. Researcher through Pro tiers have a $50 minimum balance; Elite has no minimum.",
  },
  {
    id: "tax",
    q: "What tax forms do I need to submit?",
    a: "US partners complete a W-9; international partners complete a W-8BEN. You add this in the application and can update it later under Payouts. Payouts are held until tax documentation is on file. This is a demo and no real documents are collected.",
  },
  {
    id: "cookie",
    q: "How long is the attribution window?",
    a: "The cookie window depends on your tier: 30 days for Researcher, 60 for Creator, 90 for Pro, and 120 for Elite. The last Nexphoria referral link a customer clicks within that window receives credit on a qualifying order.",
  },
  {
    id: "ads",
    q: "Can I run paid ads?",
    a: "Paid social and content placements are allowed within our promotion guidelines. You may not bid on Nexphoria trademark terms in paid search, run misleading creative, or make medical claims. All paid placements must carry the FTC affiliate disclosure.",
  },
  {
    id: "codes",
    q: "Can I get a custom discount code?",
    a: "Creator tier and above receive a custom code for your audience in addition to tracked links. Codes are issued from your dashboard once you reach the qualifying tier and are reviewed for compliance before activation.",
  },
  {
    id: "approval",
    q: "What does approval require?",
    a: "We review applications for research-content fit and FTC compliance — typically within two business days. We approve technical reviewers, educators, and research-focused creators. We decline accounts whose primary framing is consumer health or fitness outcomes.",
  },
  {
    id: "tracking",
    q: "How is tracking handled?",
    a: "Each link carries your referral code and optional product SKU. Clicks and conversions report in near-real-time in your dashboard, with a 90-day activity history. All figures shown in this demo are synthetic.",
  },
  {
    id: "claims",
    q: "What can I say about the compounds?",
    a: "Speak peer-to-peer with researchers: specifications, purity, citations, reconstitution. Never make medical, therapeutic, or personal-outcome claims, and always include research-use-only framing. This protects your standing in the program and ours.",
  },
];

export default function PprAffiliateFaq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-6">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Partner FAQ
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Program questions, answered
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
