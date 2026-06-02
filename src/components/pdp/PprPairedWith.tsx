"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { getPackOptions } from "@/lib/pdp-specs";

/**
 * Minimal cross-sell card. A richer shared `PprProductCard` may land from a
 * sibling milestone; this inline version keeps the PDP self-contained.
 */
function PairedCard({ product }: { product: Product }) {
  const base = getPackOptions(product)[0].price;
  const accent = product.accentColor || "var(--accent)";
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex w-[220px] flex-shrink-0 flex-col overflow-hidden rounded-lg transition-colors"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", scrollSnapAlign: "start" }}
    >
      <div className="relative h-[140px] w-full overflow-hidden" style={{ backgroundColor: "var(--ink)" }}>
        <div className="ppr-grid-hex absolute inset-0" style={{ opacity: 0.06 }} />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${accent} 20%, transparent), transparent 62%)`,
          }}
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span
          className="text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
        >
          {product.category}
        </span>
        <span
          className="text-[16px] font-medium"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          {product.name}
        </span>
        <span
          className="text-[13px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
        >
          {product.purity} · from ${base}
        </span>
      </div>
    </Link>
  );
}

export default function PprPairedWith({
  product,
  paired,
}: {
  product: Product;
  paired: Product[];
}) {
  if (paired.length === 0) {
    return (
      <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
        No paired compounds listed for {product.name} yet.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <h3
        className="text-[20px] font-medium"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        Researchers studying {product.name} also stack…
      </h3>
      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {paired.map((p) => (
          <PairedCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
