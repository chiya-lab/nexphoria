"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil } from "lucide-react";
import { easing, duration } from "@/lib/motion";

export type StepId = "contact" | "shipping" | "payment";

export interface StepDef {
  id: StepId;
  index: number;
  title: string;
  summary?: string;
}

export default function PprCheckoutShell({
  steps,
  active,
  completed,
  onEdit,
  children,
}: {
  steps: StepDef[];
  active: StepId;
  completed: Set<StepId>;
  onEdit: (id: StepId) => void;
  children: (id: StepId) => ReactNode;
}) {
  const total = steps.length;
  const activeIndex = steps.find((s) => s.id === active)?.index ?? 0;
  const progress = (completed.size / total) * 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
          >
            Step {activeIndex + 1} of {total}
          </span>
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--accent)" }}
          >
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--steel)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: duration.base, ease: easing.easeOut }}
          />
        </div>
      </div>

      {/* Accordion steps */}
      {steps.map((step) => {
        const isActive = step.id === active;
        const isDone = completed.has(step.id);
        return (
          <div
            key={step.id}
            className="rounded-lg"
            style={{
              backgroundColor: "var(--ink-2)",
              border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
            }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{
                    backgroundColor: isDone || isActive ? "var(--accent)" : "var(--steel)",
                    color: isDone || isActive ? "var(--ink)" : "var(--silver-2)",
                    fontFamily: "var(--font-mono)",
                  }}
                  aria-hidden="true"
                >
                  {isDone && !isActive ? <Check size={13} /> : step.index + 1}
                </span>
                <div className="flex flex-col">
                  <span
                    className="text-[15px] font-semibold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                  >
                    {step.title}
                  </span>
                  {!isActive && isDone && step.summary && (
                    <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                      {step.summary}
                    </span>
                  )}
                </div>
              </div>
              {!isActive && isDone && (
                <button
                  type="button"
                  onClick={() => onEdit(step.id)}
                  className="flex items-center gap-1.5 text-[12px] uppercase focus:outline-none focus-visible:ring-2"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--accent)" }}
                >
                  <Pencil size={12} aria-hidden="true" />
                  Edit
                </button>
              )}
            </div>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: duration.base, ease: easing.easeOut }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-5 pb-5">{children(step.id)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
