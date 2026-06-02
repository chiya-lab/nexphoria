"use client";

import Link from "next/link";
import { ChevronDown, ArrowRight, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqCategory, FaqItem } from "./faqData";

interface PprFaqSearchResultsProps {
  query: string;
  results: FaqItem[];
  categories: FaqCategory[];
  openId: string | null;
  onToggle: (id: string) => void;
}

function categoryLabel(categories: FaqCategory[], id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export default function PprFaqSearchResults({
  query,
  results,
  categories,
  openId,
  onToggle,
}: PprFaqSearchResultsProps) {
  return (
    <div>
      <p
        className="mb-4 text-[13px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
        aria-live="polite"
      >
        {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
      </p>

      {results.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-lg px-6 py-12 text-center"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <SearchX size={28} aria-hidden="true" style={{ color: "var(--silver-2)" }} />
          <p className="text-[15px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            No matches found. Try a different term, or reach out to research support.
          </p>
          <Link
            href="/contact"
            className="mt-1 inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Contact research support
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {results.map((item) => {
            const isOpen = item.id === openId;
            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-lg"
                style={{
                  backgroundColor: "var(--ink-2)",
                  border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                      {item.question}
                    </span>
                    <span
                      className="text-[10px] uppercase"
                      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--accent)" }}
                    >
                      {categoryLabel(categories, item.category)}
                    </span>
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
                        <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                          {item.answer}
                        </p>
                        {item.related && item.related.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.related.map((link) => (
                              <Link
                                key={`${item.id}-${link.href}-${link.label}`}
                                href={link.href}
                                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                                style={{ border: "1px solid var(--steel)", color: "var(--accent)", fontFamily: "var(--font-mono)" }}
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
      )}
    </div>
  );
}
