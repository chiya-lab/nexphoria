"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  MOCK_PRODUCTS,
  PRICE_BANDS,
  type MockProduct,
  type SortKey,
} from "@/lib/mock-products";
import { EMPTY_FILTERS, type FilterState } from "@/components/products/filter-types";
import PprFilterRail from "@/components/products/PprFilterRail";
import PprCatalogGrid from "@/components/products/PprCatalogGrid";
import PprCompareBar, { MAX_COMPARE } from "@/components/products/PprCompareBar";

function matchesPriceBands(price: number, bandIds: string[]): boolean {
  if (bandIds.length === 0) return true;
  return bandIds.some((id) => {
    const band = PRICE_BANDS.find((b) => b.id === id);
    return band ? price >= band.min && price < band.max : false;
  });
}

function applyFilters(items: MockProduct[], f: FilterState): MockProduct[] {
  const q = f.search.trim().toLowerCase();
  return items.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (f.categories.length > 0 && !f.categories.includes(p.category)) return false;
    if (f.goals.length > 0 && !f.goals.some((g) => p.goal.includes(g))) return false;
    if (!matchesPriceBands(p.price, f.priceBands)) return false;
    if (f.inStockOnly && p.stock === 0) return false;
    if (f.subscriptionOnly && !p.subscriptionEligible) return false;
    return true;
  });
}

function parsePurity(p: string): number {
  const m = p.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function applySort(items: MockProduct[], sort: SortKey): MockProduct[] {
  const copy = [...items];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt));
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "purity":
      return copy.sort((a, b) => parsePurity(b.purity) - parsePurity(a.purity));
    case "bestsellers":
    default:
      // Bestseller proxy: rating, then live stock depth as a popularity signal.
      return copy.sort((a, b) => b.rating - a.rating || b.stock - a.stock);
  }
}

export default function ProductsClient() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("bestsellers");
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(() => applySort(applyFilters(MOCK_PRODUCTS, filters), sort), [filters, sort]);

  function toggleCompare(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }

  function handleSetCompareMode(on: boolean) {
    setCompareMode(on);
    if (!on) setSelected([]);
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 pb-32">
      {/* Mobile filter trigger */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px]"
          style={{ fontFamily: "var(--font-mono)", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
        >
          <SlidersHorizontal size={14} aria-hidden="true" /> Filters
        </button>
      </div>

      <div className="flex gap-10">
        {/* Sticky filter rail (desktop) */}
        <aside className="hidden w-[260px] flex-shrink-0 lg:block">
          <div className="sticky top-28">
            <PprFilterRail filters={filters} setFilters={setFilters} resultCount={results.length} />
          </div>
        </aside>

        {/* Main grid */}
        <div className="min-w-0 flex-1">
          <PprCatalogGrid
            products={results}
            sort={sort}
            setSort={setSort}
            compareMode={compareMode}
            setCompareMode={handleSetCompareMode}
            selected={selected}
            onToggleCompare={toggleCompare}
          />
        </div>
      </div>

      {/* Mobile slide-in filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          />
          <div
            className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] overflow-y-auto p-6"
            style={{ backgroundColor: "var(--ink)", borderRight: "1px solid var(--steel)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <span
                className="text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-3)" }}
              >
                Filters
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="transition-colors hover:text-[color:var(--accent)]"
                style={{ color: "var(--silver-2)" }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <PprFilterRail filters={filters} setFilters={setFilters} resultCount={results.length} />
          </div>
        </div>
      )}

      {/* Compare bar */}
      <PprCompareBar
        selected={selected}
        products={MOCK_PRODUCTS}
        onRemove={toggleCompare}
        onClear={() => setSelected([])}
      />
    </div>
  );
}
