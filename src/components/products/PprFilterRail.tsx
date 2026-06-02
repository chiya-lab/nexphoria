"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES, GOALS, PRICE_BANDS } from "@/lib/mock-products";
import { type FilterState, filtersActive } from "./filter-types";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-3 text-[11px] uppercase"
      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-3)" }}
    >
      {children}
    </p>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1">
      <span
        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm"
        style={{
          border: `1px solid ${checked ? "var(--accent)" : "var(--steel)"}`,
          backgroundColor: checked ? "var(--accent)" : "transparent",
        }}
        aria-hidden="true"
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5L5 9L9.5 3.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className="text-[13px]"
        style={{ fontFamily: "var(--font-body)", color: checked ? "var(--platinum)" : "var(--silver-1)" }}
      >
        {label}
      </span>
    </label>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5">
      <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onChange}
        className="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors"
        style={{ backgroundColor: on ? "var(--accent)" : "var(--steel)" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full transition-transform"
          style={{
            backgroundColor: on ? "var(--ink)" : "var(--silver-2)",
            transform: on ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </button>
    </label>
  );
}

export default function PprFilterRail({
  filters,
  setFilters,
  resultCount,
}: {
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  resultCount: number;
}) {
  const toggleIn = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={15}
          aria-hidden="true"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--silver-3)" }}
        />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search compounds"
          aria-label="Search compounds by name"
          className="w-full rounded-md py-2.5 pl-9 pr-3 text-[14px] focus:outline-none focus-visible:ring-1"
          style={{
            backgroundColor: "var(--ink)",
            border: "1px solid var(--steel)",
            color: "var(--platinum)",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Category */}
      <div className="mb-8">
        <SectionLabel>Category</SectionLabel>
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={filters.categories.includes(c)}
            onChange={() => setFilters({ ...filters, categories: toggleIn(filters.categories, c) })}
          />
        ))}
      </div>

      {/* Research goal */}
      <div className="mb-8">
        <SectionLabel>Research goal</SectionLabel>
        {GOALS.map((g) => (
          <CheckRow
            key={g}
            label={g}
            checked={filters.goals.includes(g)}
            onChange={() => setFilters({ ...filters, goals: toggleIn(filters.goals, g) })}
          />
        ))}
      </div>

      {/* Price band (radio-style — single select, click again to clear) */}
      <div className="mb-8">
        <SectionLabel>Price</SectionLabel>
        {PRICE_BANDS.map((b) => {
          const active = filters.priceBands.includes(b.id);
          return (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 py-1">
              <span
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                style={{ border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}` }}
                aria-hidden="true"
              >
                {active && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />}
              </span>
              <input
                type="radio"
                name="price-band"
                checked={active}
                onChange={() => setFilters({ ...filters, priceBands: active ? [] : [b.id] })}
                onClick={() => {
                  if (active) setFilters({ ...filters, priceBands: [] });
                }}
                className="sr-only"
              />
              <span
                className="text-[13px]"
                style={{ fontFamily: "var(--font-body)", color: active ? "var(--platinum)" : "var(--silver-1)" }}
              >
                {b.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Toggles */}
      <div className="mb-8 border-t pt-5" style={{ borderColor: "var(--steel)" }}>
        <Toggle
          label="In stock only"
          on={filters.inStockOnly}
          onChange={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
        <Toggle
          label="Subscription eligible"
          on={filters.subscriptionOnly}
          onChange={() => setFilters({ ...filters, subscriptionOnly: !filters.subscriptionOnly })}
        />
      </div>

      {/* Clear */}
      {filtersActive(filters) && (
        <button
          type="button"
          onClick={() => setFilters({ search: "", categories: [], goals: [], priceBands: [], inStockOnly: false, subscriptionOnly: false })}
          className="inline-flex items-center gap-1.5 text-[12px] uppercase transition-colors hover:text-[color:var(--accent)]"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
        >
          <X size={13} aria-hidden="true" /> Clear all ({resultCount})
        </button>
      )}
    </div>
  );
}
