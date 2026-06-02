"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";
import type { MockProduct } from "@/lib/mock-products";

export default function PprProductCard({ product }: { product: MockProduct }) {
  const { addItem, openDrawer } = useCart();
  const lowStock = product.stock <= 12;

  function handleAdd() {
    const real = getProduct(product.slug);
    if (!real) return;
    addItem(real, "vial", real.dosages?.[0], 0);
    openDrawer();
  }

  return (
    <div
      className="flex h-[400px] w-[280px] flex-shrink-0 flex-col rounded-lg p-5"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      {/* Glyph + RUO badge */}
      <div className="relative mb-4 flex h-[120px] items-center justify-center">
        <span
          className="absolute right-0 top-0 rounded-full px-2 py-0.5 text-[9px] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.14em",
            border: "1px solid var(--steel)",
            color: "var(--silver-3)",
          }}
        >
          RUO
        </span>
        <svg width="44" height="92" viewBox="0 0 44 92" fill="none" aria-hidden="true">
          <rect x="13" y="2" width="18" height="6" rx="1" fill="var(--accent)" />
          <rect x="15" y="8" width="14" height="5" fill="var(--ink-3)" stroke="var(--steel)" strokeWidth="1" />
          <path
            d="M11 17c0-1.105.895-2 2-2h18c1.105 0 2 .895 2 2v67c0 3.314-2.686 6-6 6H17c-3.314 0-6-2.686-6-6V17z"
            fill="var(--ink-3)"
            stroke="var(--steel)"
            strokeWidth="1.2"
          />
          <path
            d="M11 58h22v26c0 3.314-2.686 6-6 6H17c-3.314 0-6-2.686-6-6V58z"
            fill="var(--accent)"
            fillOpacity="0.18"
          />
        </svg>
      </div>

      <p
        className="mb-1.5 text-[10px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
      >
        {product.category}
      </p>

      <Link
        href={`/products/${product.slug}`}
        className="text-[20px] font-semibold transition-colors hover:text-[color:var(--accent)]"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", lineHeight: 1.15 }}
      >
        {product.name}
      </Link>

      <div
        className="mt-1.5 flex flex-wrap gap-x-3 text-[11px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
      >
        <span>{product.mw}</span>
        <span style={{ color: "var(--accent)" }}>{product.purity}</span>
      </div>

      {/* Stock chip */}
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: lowStock ? "var(--warn)" : "var(--ok)" }}
          aria-hidden="true"
        />
        <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
          {lowStock ? `Low stock · ${product.stock} vials` : `In stock · ${product.stock} vials`}
        </span>
      </div>

      {/* 3-tier price grid */}
      <div className="mt-auto grid grid-cols-3 gap-1.5 pt-4">
        {[
          { label: "1 vial", value: product.packPrices[0]?.price },
          { label: "3-pack", value: product.packPrices[1]?.price },
          { label: "6-pack", value: product.packPrices[2]?.price },
        ].map((tier) => (
          <div
            key={tier.label}
            className="rounded-md px-2 py-2 text-center"
            style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--steel)" }}
          >
            <div className="text-[14px]" style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}>
              ${tier.value}
            </div>
            <div className="text-[9px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-3)" }}>
              {tier.label}
            </div>
          </div>
        ))}
      </div>

      <p
        className="mt-2 text-[11px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
      >
        Subscribe ${product.subPrice}/shipment
      </p>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 w-full rounded-md py-2 text-[13px] font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
        style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
      >
        Add to cart
      </button>
    </div>
  );
}
