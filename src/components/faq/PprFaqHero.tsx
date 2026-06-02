"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import type { FaqItem } from "./faqData";

interface PprFaqHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  popular: FaqItem[];
  onJump: (id: string) => void;
}

export default function PprFaqHero({ query, onQueryChange, popular, onJump }: PprFaqHeroProps) {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-16 pb-10 text-center lg:pt-24">
      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="flex flex-col items-center gap-5">
        <motion.span
          variants={staggerItem()}
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
        >
          Research support
        </motion.span>
        <motion.h1
          variants={staggerItem()}
          className="text-[34px] font-semibold leading-[1.05] lg:text-[52px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Questions, answered like a peer
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="max-w-2xl text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Purity testing, COA documentation, reconstitution, cold-chain storage, compliance, and
          wholesale — searchable and written for the bench.
        </motion.p>

        <motion.div variants={staggerItem()} className="relative mt-2 w-full max-w-xl">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--silver-2)" }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search the FAQ — purity, COA, storage, TFA…"
            aria-label="Search frequently asked questions"
            className="w-full rounded-lg py-3.5 pl-11 pr-11 text-[15px] focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: "var(--ink-2)",
              border: "1px solid var(--steel)",
              color: "var(--platinum)",
              fontFamily: "var(--font-body)",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 focus:outline-none focus-visible:ring-2"
              style={{ color: "var(--silver-2)" }}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </motion.div>

        {!query && popular.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span
              className="text-[11px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
            >
              Most asked
            </span>
            {popular.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJump(item.id)}
                className="rounded-full px-3 py-1.5 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink-2)",
                  border: "1px solid var(--steel)",
                  color: "var(--silver-1)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.question}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
