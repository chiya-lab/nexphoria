"use client";

import { useMemo } from "react";
import type { MockProduct } from "@/lib/mock-products";
import { COMPARE_ROWS, compareCellValue } from "./compareData";

interface PprCompareKeyDiffsProps {
  products: MockProduct[];
}

interface DiffRow {
  label: string;
  values: { name: string; value: string }[];
}

export default function PprCompareKeyDiffs({ products }: PprCompareKeyDiffsProps) {
  const diffs = useMemo<DiffRow[]>(() => {
    if (products.length < 2) return [];
    return COMPARE_ROWS.filter((r) => r.key !== "image")
      .map((row) => {
        const values = products.map((p) => ({ name: p.name, value: compareCellValue(p, row.key) }));
        const distinct = new Set(values.map((v) => v.value));
        // Only surface rows where the compounds actually diverge.
        return distinct.size > 1 ? { label: row.label, values } : null;
      })
      .filter((d): d is DiffRow => d !== null);
  }, [products]);

  if (products.length < 2 || diffs.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12">
      <div className="rounded-xl border p-5 lg:p-6" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
        <h2
          className="mb-1 text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--accent)" }}
        >
          Differences at a glance
        </h2>
        <p className="mb-5 text-sm" style={{ color: "var(--silver-2)" }}>
          Specifications below diverge across the selected compounds.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {diffs.map((d) => (
            <div key={d.label} className="rounded-lg p-4" style={{ backgroundColor: "var(--ink)" }}>
              <p
                className="mb-2 text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
              >
                {d.label}
              </p>
              <ul className="space-y-1.5">
                {d.values.map((v) => (
                  <li key={v.name} className="flex items-baseline justify-between gap-3 text-sm">
                    <span style={{ color: "var(--silver-2)" }}>{v.name}</span>
                    <span className="text-right" style={{ color: "var(--platinum)" }}>
                      {v.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
