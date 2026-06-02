"use client";

import { useMemo, useRef, useState } from "react";
import { MOCK_PRODUCTS, type MockProduct } from "@/lib/mock-products";

const MAX_SLOTS = 4;

interface PprCompareSelectorProps {
  selected: MockProduct[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}

export default function PprCompareSelector({ selected, onAdd, onRemove }: PprCompareSelectorProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedSlugs = useMemo(() => new Set(selected.map((p) => p.slug)), [selected]);
  const slotsFull = selected.length >= MAX_SLOTS;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = MOCK_PRODUCTS.filter((p) => !selectedSlugs.has(p.slug));
    if (!q) return pool.slice(0, 8);
    return pool
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, selectedSlugs]);

  function commit(slug: string) {
    if (slotsFull) return;
    onAdd(slug);
    setQuery("");
    setActiveIndex(0);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const m = matches[activeIndex];
      if (m) commit(m.slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          className="text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--silver-2)" }}
        >
          Selected compounds · {selected.length}/{MAX_SLOTS}
        </h2>
      </div>

      {/* Slot chips */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: MAX_SLOTS }).map((_, i) => {
          const p = selected[i];
          if (p) {
            return (
              <div
                key={p.slug}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5"
                style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
              >
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                  >
                    {p.name}
                  </p>
                  <p className="truncate text-[11px]" style={{ color: "var(--silver-2)" }}>
                    {p.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(p.slug)}
                  aria-label={`Remove ${p.name}`}
                  className="shrink-0 rounded-md px-2 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-1"
                  style={{ color: "var(--silver-2)", borderColor: "var(--steel)" }}
                >
                  Remove
                </button>
              </div>
            );
          }
          return (
            <div
              key={`empty-${i}`}
              className="flex items-center rounded-lg border border-dashed px-3 py-2.5 text-[12px]"
              style={{ borderColor: "var(--steel)", color: "var(--silver-3)" }}
            >
              Empty slot {i + 1}
            </div>
          );
        })}
      </div>

      {/* Search autocomplete */}
      <div className="relative mt-4 max-w-md">
        <label htmlFor="compare-search" className="sr-only">
          Search research compounds to compare
        </label>
        <input
          id="compare-search"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="compare-search-list"
          autoComplete="off"
          disabled={slotsFull}
          value={query}
          placeholder={slotsFull ? "Matrix full — remove a compound to add another" : "Search compounds by name or category"}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-1 disabled:opacity-50"
          style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }}
        />
        {open && !slotsFull && matches.length > 0 && (
          <ul
            id="compare-search-list"
            role="listbox"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border shadow-lg"
            style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
          >
            {matches.map((m, i) => (
              <li key={m.slug} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (blurTimer.current) clearTimeout(blurTimer.current);
                    commit(m.slug);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors"
                  style={{
                    color: "var(--platinum)",
                    backgroundColor: i === activeIndex ? "var(--steel)" : "transparent",
                  }}
                >
                  <span className="truncate font-medium">{m.name}</span>
                  <span className="shrink-0 text-[11px]" style={{ color: "var(--silver-2)" }}>
                    {m.purity}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
