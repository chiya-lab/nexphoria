"use client";

import { useState } from "react";
import { ChevronDown, GitCompare } from "lucide-react";
import { type MockProduct, type SortKey, SORT_OPTIONS } from "@/lib/mock-products";
import PprProductCard from "./PprProductCard";

export default function PprCatalogGrid({
  products,
  sort,
  setSort,
  compareMode,
  setCompareMode,
  selected,
  onToggleCompare,
}: {
  products: MockProduct[];
  sort: SortKey;
  setSort: (s: SortKey) => void;
  compareMode: boolean;
  setCompareMode: (on: boolean) => void;
  selected: string[];
  onToggleCompare: (slug: string) => void;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Bestsellers";

  return (
    <div>
      {/* Toolbar */}
      <div
        className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b pb-4"
        style={{ borderColor: "var(--steel)" }}
      >
        <span
          className="text-[13px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
        >
          {products.length} {products.length === 1 ? "compound" : "compounds"}
        </span>

        <div className="flex items-center gap-3">
          {/* Compare-mode toggle */}
          <button
            type="button"
            onClick={() => setCompareMode(!compareMode)}
            aria-pressed={compareMode}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] uppercase transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
              border: `1px solid ${compareMode ? "var(--accent)" : "var(--steel)"}`,
              color: compareMode ? "var(--accent)" : "var(--silver-2)",
            }}
          >
            <GitCompare size={13} aria-hidden="true" /> Compare
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px]"
              style={{
                fontFamily: "var(--font-mono)",
                border: "1px solid var(--steel)",
                color: "var(--silver-1)",
                backgroundColor: "var(--ink-2)",
              }}
            >
              <span style={{ color: "var(--silver-3)" }}>Sort:</span> {activeSortLabel}
              <ChevronDown size={13} aria-hidden="true" style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {sortOpen && (
              <ul
                role="listbox"
                className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-md py-1"
                style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <li key={o.key} role="option" aria-selected={o.key === sort}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(o.key);
                        setSortOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--ink-3)]"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: o.key === sort ? "var(--accent)" : "var(--silver-1)",
                      }}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div
          className="rounded-lg py-20 text-center"
          style={{ border: "1px dashed var(--steel)" }}
        >
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--platinum)" }}>
            No compounds match these filters
          </p>
          <p className="mt-2 text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
            Try removing a filter or clearing your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3">
          {products.map((p) => (
            <PprProductCard
              key={p.slug}
              product={p}
              compareMode={compareMode}
              selected={selected.includes(p.slug)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}
