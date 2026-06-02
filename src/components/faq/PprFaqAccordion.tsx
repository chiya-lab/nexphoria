"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import type { FaqCategory, FaqItem } from "./faqData";

interface PprFaqAccordionProps {
  categories: FaqCategory[];
  itemsByCategory: Record<string, FaqItem[]>;
  openId: string | null;
  onToggle: (id: string) => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

export default function PprFaqAccordion({
  categories,
  itemsByCategory,
  openId,
  onToggle,
  registerRef,
}: PprFaqAccordionProps) {
  return (
    <div className="flex flex-col gap-12">
      {categories.map((cat) => {
        const items = itemsByCategory[cat.id] ?? [];
        if (items.length === 0) return null;
        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            aria-labelledby={`cat-heading-${cat.id}`}
            style={{ scrollMarginTop: "6rem" }}
          >
            <h2
              id={`cat-heading-${cat.id}`}
              className="mb-4 text-[20px] font-semibold lg:text-[24px]"
              style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
            >
              {cat.label}
            </h2>
            <ul className="flex flex-col gap-2">
              {items.map((item) => {
                const isOpen = item.id === openId;
                return (
                  <li
                    key={item.id}
                    id={`faq-${item.id}`}
                    ref={(el) => registerRef(item.id, el)}
                    className="overflow-hidden rounded-lg"
                    style={{
                      backgroundColor: "var(--ink-2)",
                      border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}`,
                      scrollMarginTop: "6rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(item.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
                    >
                      <span
                        className="text-[15px] font-medium"
                        style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}
                      >
                        {item.question}
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
                          <div className="px-5 pb-5">
                            <p
                              className="text-[14px] leading-relaxed"
                              style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                            >
                              {item.answer}
                            </p>
                            {item.related && item.related.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {item.related.map((link) => (
                                  <Link
                                    key={`${item.id}-${link.href}-${link.label}`}
                                    href={link.href}
                                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                                    style={{
                                      border: "1px solid var(--steel)",
                                      color: "var(--accent)",
                                      fontFamily: "var(--font-mono)",
                                    }}
                                  >
                                    {link.label}
                                    <ArrowRight size={12} aria-hidden="true" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
