"use client";

import { useMemo } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { useStackStore, TIMING_SLOTS, TIMING_LABEL, type TimingSlot } from "@/lib/stack-store";

function nameFor(slug: string): string {
  return MOCK_PRODUCTS.find((m) => m.slug === slug)?.name ?? slug;
}

/**
 * Daily scheduling view. Three slots (AM / PM / post-workout); each chip cycles
 * to the next slot on click so a protocol's timing can be laid out at a glance.
 */
export default function PprStackTimingChart() {
  const items = useStackStore((s) => s.items);
  const setSlot = useStackStore((s) => s.setSlot);

  const bySlot = useMemo(() => {
    const map: Record<TimingSlot, string[]> = { AM: [], PM: [], PWO: [] };
    for (const it of items) map[it.slot].push(it.slug);
    return map;
  }, [items]);

  const cycle = (current: TimingSlot): TimingSlot => {
    const idx = TIMING_SLOTS.indexOf(current);
    return TIMING_SLOTS[(idx + 1) % TIMING_SLOTS.length];
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[13px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}>
          Daily timing
        </h3>
        <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-3)" }}>
          Click a compound to move it to the next slot. Timing reflects research-protocol planning, not medical guidance.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TIMING_SLOTS.map((slot) => (
          <div
            key={slot}
            className="flex min-h-[140px] flex-col gap-2 rounded-lg p-3"
            style={{ background: "var(--ink-2)", border: "1px solid var(--steel)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                {slot}
              </span>
              <span className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-3)" }}>
                {TIMING_LABEL[slot]}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {bySlot[slot].length === 0 ? (
                <span className="text-[11px] italic" style={{ fontFamily: "var(--font-body)", color: "var(--silver-3)" }}>
                  None scheduled
                </span>
              ) : (
                bySlot[slot].map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setSlot(slug, cycle(slot))}
                    className="rounded px-2.5 py-1.5 text-left text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                    style={{ fontFamily: "var(--font-body)", background: "var(--ink-3)", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
                    title={`Move ${nameFor(slug)} to ${cycle(slot)}`}
                  >
                    {nameFor(slug)}
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
