"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS, type MockProduct, type ResearchGoal } from "@/lib/mock-products";
import { useStackStore } from "@/lib/stack-store";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Library filter chips, mapped onto the real ResearchGoal taxonomy. "Other"
 * catches compounds whose goals fall outside the four named research lanes.
 */
interface LibraryFilter {
  id: string;
  label: string;
  match: (p: MockProduct) => boolean;
}

const NAMED_GOALS: ResearchGoal[] = ["Tissue Repair", "Metabolic Research", "GH Secretagogue", "Anti-Aging"];

const FILTERS: LibraryFilter[] = [
  { id: "all", label: "All", match: () => true },
  { id: "repair", label: "Repair", match: (p) => p.goal.includes("Tissue Repair") },
  { id: "metabolic", label: "Metabolic", match: (p) => p.goal.includes("Metabolic Research") },
  { id: "gh", label: "GH secretagogue", match: (p) => p.goal.includes("GH Secretagogue") },
  { id: "anti-aging", label: "Anti-aging", match: (p) => p.goal.includes("Anti-Aging") },
  { id: "other", label: "Other", match: (p) => !p.goal.some((g) => NAMED_GOALS.includes(g)) },
];

export default function PprStackLibrary() {
  const [active, setActive] = useState("all");
  const add = useStackStore((s) => s.add);
  const remove = useStackStore((s) => s.remove);
  const items = useStackStore((s) => s.items);
  const inStack = useMemo(() => new Set(items.map((i) => i.slug)), [items]);

  const filter = FILTERS.find((f) => f.id === active) ?? FILTERS[0];
  const products = MOCK_PRODUCTS.filter(filter.match);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2
          className="text-[13px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
        >
          Compound library
        </h2>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter compounds by research goal">
          {FILTERS.map((f) => {
            const isActive = f.id === active;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f.id)}
                className="rounded-full px-3 py-1.5 text-[12px] uppercase transition-colors focus:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.08em",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
                  background: isActive ? "rgba(184,224,79,0.12)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--silver-2)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={active}
        variants={staggerContainer(0.04)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {products.map((p) => {
          const added = inStack.has(p.slug);
          return (
            <motion.div
              key={p.slug}
              variants={staggerItem(6)}
              className="flex flex-col gap-2 rounded-lg p-4"
              style={{ background: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                    {p.name}
                  </span>
                  <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-3)" }}>
                    {p.category}
                  </span>
                </div>
                <span className="text-[13px] tabular-nums" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
                  ${p.price}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.goal.map((g) => (
                  <span
                    key={g}
                    className="rounded px-1.5 py-0.5 text-[10px] uppercase"
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em", background: "var(--ink-3)", color: "var(--silver-2)" }}
                  >
                    {g}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-[11px] tabular-nums" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                  {p.purity} · {p.mw}
                </span>
                <button
                  type="button"
                  onClick={() => (added ? remove(p.slug) : add(p.slug))}
                  className="rounded px-3 py-1.5 text-[12px] font-semibold uppercase transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    border: `1px solid ${added ? "var(--steel)" : "var(--accent)"}`,
                    background: added ? "transparent" : "var(--accent)",
                    color: added ? "var(--silver-2)" : "var(--ink)",
                  }}
                  aria-pressed={added}
                >
                  {added ? "Remove" : "+ Add"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
