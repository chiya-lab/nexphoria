"use client";

import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, Clock, FlaskConical } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface PprQuizIntroProps {
  onStart: () => void;
  hasSavedProgress: boolean;
  onResume: () => void;
}

const POINTS = [
  { icon: ClipboardList, label: "6 questions" },
  { icon: Clock, label: "~60 seconds" },
  { icon: FlaskConical, label: "Peer-reviewed result" },
];

export default function PprQuizIntro({ onStart, hasSavedProgress, onResume }: PprQuizIntroProps) {
  return (
    <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="flex flex-col items-center gap-6 text-center">
      <motion.span
        variants={staggerItem()}
        className="text-[12px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
      >
        Guided protocol finder
      </motion.span>
      <motion.h1
        variants={staggerItem()}
        className="text-[32px] font-semibold leading-[1.05] lg:text-[46px]"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        Find your research protocol
      </motion.h1>
      <motion.p
        variants={staggerItem()}
        className="max-w-xl text-[16px] leading-relaxed"
        style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
      >
        Answer a short, spec-forward questionnaire and we&apos;ll match a primary compound and two
        supporting compounds from the catalog to your research focus, experience, and budget.
      </motion.p>

      <motion.div variants={staggerItem()} className="flex flex-wrap items-center justify-center gap-3">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <span
              key={p.label}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px]"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
            >
              <Icon size={15} aria-hidden="true" style={{ color: "var(--accent)" }} />
              {p.label}
            </span>
          );
        })}
      </motion.div>

      <motion.div variants={staggerItem()} className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2 sm:w-auto"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Start the quiz
          <ArrowRight size={16} aria-hidden="true" />
        </button>
        {hasSavedProgress && (
          <button
            type="button"
            onClick={onResume}
            className="flex w-full items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2 sm:w-auto"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            Resume where you left off
          </button>
        )}
      </motion.div>

      <motion.p
        variants={staggerItem()}
        className="mt-2 text-[11px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
      >
        For research use only. Results are catalog suggestions, not medical guidance.
      </motion.p>
    </motion.div>
  );
}
