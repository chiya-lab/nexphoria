"use client";

import { useState } from "react";
import type { ProtocolFaqItem } from "@/lib/mock-protocols";

interface PprProtocolFaqProps {
  faq: ProtocolFaqItem[];
}

export default function PprProtocolFaq({ faq }: PprProtocolFaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            FAQ
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)" }}>
          Common questions.
        </h2>

        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--steel)" }}>
          {faq.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={item.q} style={{ borderTop: idx === 0 ? "none" : "1px solid var(--steel)" }}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                    style={{ backgroundColor: isOpen ? "var(--ink-2)" : "transparent" }}
                  >
                    <span className="text-base" style={{ color: "var(--platinum)", fontWeight: 400 }}>
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 transition-transform"
                      style={{ color: "var(--accent)", transform: isOpen ? "rotate(45deg)" : "none", fontFamily: "var(--font-mono)" }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div className="px-6 pb-5" style={{ backgroundColor: "var(--ink-2)" }}>
                    <p className="text-sm" style={{ color: "var(--silver-2)", lineHeight: 1.7 }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
