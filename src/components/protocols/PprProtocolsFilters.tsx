"use client";

import type { ProtocolCategory } from "@/lib/mock-protocols";

export type ProtocolFilter = ProtocolCategory | "All";

interface PprProtocolsFiltersProps {
  categories: ProtocolCategory[];
  active: ProtocolFilter;
  onChange: (filter: ProtocolFilter) => void;
}

export default function PprProtocolsFilters({
  categories,
  active,
  onChange,
}: PprProtocolsFiltersProps) {
  const chips: ProtocolFilter[] = ["All", ...categories];

  return (
    <div
      role="tablist"
      aria-label="Filter protocols by category"
      className="flex flex-wrap gap-2"
    >
      {chips.map((chip) => {
        const isActive = chip === active;
        return (
          <button
            key={chip}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(chip)}
            className="text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              color: isActive ? "var(--ink)" : "var(--silver-2)",
              backgroundColor: isActive ? "var(--accent)" : "transparent",
              border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
            }}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
