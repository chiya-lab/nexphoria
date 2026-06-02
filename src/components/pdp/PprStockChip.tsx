"use client";

import type { PdpStock } from "@/lib/pdp-specs";

const COLOR: Record<PdpStock["level"], string> = {
  "in-stock": "var(--ok)",
  low: "var(--warn)",
  restocking: "var(--danger)",
};

export default function PprStockChip({ stock }: { stock: PdpStock }) {
  const color = COLOR[stock.level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        backgroundColor: "color-mix(in srgb, var(--ink) 60%, transparent)",
        border: `1px solid ${color}`,
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color,
      }}
      role="status"
    >
      <span
        aria-hidden="true"
        style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: color }}
      />
      {stock.label}
    </span>
  );
}
