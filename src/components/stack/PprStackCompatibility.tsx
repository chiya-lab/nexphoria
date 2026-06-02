"use client";

import { useMemo } from "react";
import { useStackStore } from "@/lib/stack-store";
import { evaluateStack, type WarningLevel } from "@/lib/stack-rules";

const LEVEL_STYLE: Record<WarningLevel, { border: string; dot: string; label: string }> = {
  info: { border: "var(--steel)", dot: "var(--accent)", label: "Note" },
  caution: { border: "rgba(224,177,79,0.5)", dot: "var(--warn)", label: "Caution" },
};

/**
 * Live composition advisories. These are presentation-layer research-composition
 * notes derived from the selected compounds — not medical guidance.
 */
export default function PprStackCompatibility() {
  const items = useStackStore((s) => s.items);
  const warnings = useMemo(() => evaluateStack(items.map((i) => i.slug)), [items]);

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[13px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}>
        Composition notes
      </h3>
      {warnings.length === 0 ? (
        <p
          className="rounded-lg px-4 py-3 text-[13px]"
          style={{ fontFamily: "var(--font-body)", background: "var(--ink-2)", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
        >
          No composition flags for this selection.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {warnings.map((w) => {
            const s = LEVEL_STYLE[w.level];
            return (
              <li
                key={w.id}
                className="flex items-start gap-3 rounded-lg px-4 py-3"
                style={{ background: "var(--ink-2)", border: `1px solid ${s.border}` }}
              >
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: s.dot }} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
                    {s.label}
                  </span>
                  <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                    {w.message}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em", color: "var(--silver-3)" }}>
        Research use only. Composition notes are informational and not medical advice.
      </p>
    </section>
  );
}
