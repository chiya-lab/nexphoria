"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PprQuizProgress from "./PprQuizProgress";

interface PprQuizShellProps {
  /** Unique key for the active card — drives the slide transition. */
  stepKey: string;
  current: number;
  total: number;
  canBack: boolean;
  canNext: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
  children: ReactNode;
}

export default function PprQuizShell({
  stepKey,
  current,
  total,
  canBack,
  canNext,
  nextLabel = "Continue",
  onBack,
  onNext,
  children,
}: PprQuizShellProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <PprQuizProgress current={current} total={total} />
      </div>

      <div
        className="relative overflow-hidden rounded-2xl p-6 lg:p-8"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          className="flex items-center gap-2 rounded-md px-4 py-3 text-[14px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="flex items-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          {nextLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
