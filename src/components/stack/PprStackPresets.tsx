"use client";

import { useStackStore } from "@/lib/stack-store";
import { STACK_PRESETS } from "./stackPresets";

/**
 * One-click protocol starters. Loading a preset replaces the current selection.
 */
export default function PprStackPresets() {
  const loadFromItems = useStackStore((s) => s.loadFromItems);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[13px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}>
        Start from a preset
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STACK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => loadFromItems(preset.items.map((i) => ({ ...i })))}
            className="flex flex-col gap-1.5 rounded-lg p-4 text-left transition-colors focus:outline-none focus-visible:ring-2"
            style={{ background: "var(--ink-2)", border: "1px solid var(--steel)" }}
          >
            <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              {preset.name}
            </span>
            <span className="text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
              {preset.blurb}
            </span>
            <span className="mt-1 text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--accent)" }}>
              {preset.items.length} compounds · Load
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
