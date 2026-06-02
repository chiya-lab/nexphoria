"use client";

import type { FaqCategory } from "./faqData";

interface PprFaqCategoryNavProps {
  categories: FaqCategory[];
  counts: Record<string, number>;
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function PprFaqCategoryNav({ categories, counts, activeId, onSelect }: PprFaqCategoryNavProps) {
  return (
    <nav aria-label="FAQ categories">
      {/* Desktop: sticky vertical rail */}
      <ul className="sticky top-24 hidden flex-col gap-1 lg:flex">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelect(cat.id)}
                aria-current={isActive ? "true" : undefined}
                className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-[14px] transition-colors focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 10%, var(--ink-2))" : "transparent",
                  borderLeft: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
                  color: isActive ? "var(--platinum)" : "var(--silver-1)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span>{cat.label}</span>
                <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  {counts[cat.id] ?? 0}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mobile: horizontal chip scroller */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-current={isActive ? "true" : undefined}
              className="flex-shrink-0 rounded-full px-3.5 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: isActive ? "var(--accent)" : "var(--ink-2)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
                color: isActive ? "var(--ink)" : "var(--silver-1)",
                fontFamily: "var(--font-body)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
