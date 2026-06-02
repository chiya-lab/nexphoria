"use client";

import { useMemo, useState } from "react";
import { MOCK_PRODUCTS, toCartProduct } from "@/lib/mock-products";
import { useStackStore, priceStack } from "@/lib/stack-store";
import { useCart } from "@/lib/cart";
import { openDrawer } from "@/lib/cart-store";

interface PprStackSummaryProps {
  onShare: () => void;
}

function dosageForPack(slug: string, qty: number) {
  const p = MOCK_PRODUCTS.find((m) => m.slug === slug);
  if (!p) return undefined;
  const pp = p.packPrices.find((x) => x.qty === qty);
  if (!pp) return undefined;
  return { size: qty === 1 ? "1 vial" : `${qty}-vial pack`, price: pp.price };
}

export default function PprStackSummary({ onShare }: PprStackSummaryProps) {
  const items = useStackStore((s) => s.items);
  const clear = useStackStore((s) => s.clear);
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const pricing = useMemo(() => priceStack(items), [items]);
  const empty = items.length === 0;

  const addAllToCart = () => {
    for (const it of items) {
      const product = MOCK_PRODUCTS.find((m) => m.slug === it.slug);
      if (!product) continue;
      addItem(toCartProduct(product), "vial", dosageForPack(it.slug, it.packQty));
    }
    setAdded(true);
    openDrawer();
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-lg p-5"
      style={{ background: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <h3 className="text-[13px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}>
        Protocol summary
      </h3>

      <dl className="flex flex-col gap-2 text-[13px]" style={{ fontFamily: "var(--font-mono)" }}>
        <div className="flex items-center justify-between">
          <dt style={{ color: "var(--silver-2)" }}>Compounds</dt>
          <dd className="tabular-nums" style={{ color: "var(--silver-1)" }}>{items.length}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt style={{ color: "var(--silver-2)" }}>Subtotal</dt>
          <dd className="tabular-nums" style={{ color: "var(--silver-1)" }}>${pricing.subtotal}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt style={{ color: "var(--silver-2)" }}>
            Bulk discount{pricing.discountRate > 0 ? ` (${Math.round(pricing.discountRate * 100)}%)` : ""}
          </dt>
          <dd className="tabular-nums" style={{ color: pricing.discountAmount > 0 ? "var(--accent)" : "var(--silver-3)" }}>
            {pricing.discountAmount > 0 ? `−$${pricing.discountAmount}` : "—"}
          </dd>
        </div>
        <div className="my-1 h-px" style={{ background: "var(--steel)" }} />
        <div className="flex items-center justify-between">
          <dt className="text-[14px]" style={{ color: "var(--platinum)" }}>Total</dt>
          <dd className="text-[18px] font-semibold tabular-nums" style={{ color: "var(--platinum)" }}>${pricing.total}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt style={{ color: "var(--silver-2)" }}>Est. monthly</dt>
          <dd className="tabular-nums" style={{ color: "var(--silver-1)" }}>${pricing.monthly}/mo</dd>
        </div>
      </dl>

      {!empty && pricing.discountRate === 0 && (
        <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
          Add {3 - items.length > 0 ? 3 - items.length : 0} more for 5% off · 5+ for 10% off.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={empty}
          onClick={addAllToCart}
          className="rounded px-4 py-2.5 text-[13px] font-semibold uppercase transition-opacity focus:outline-none focus-visible:ring-2 disabled:opacity-40"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", background: "var(--accent)", color: "var(--ink)" }}
        >
          {added ? "Added to cart" : "Add all to cart"}
        </button>
        <button
          type="button"
          disabled={empty}
          onClick={onShare}
          className="rounded px-4 py-2.5 text-[13px] font-semibold uppercase transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-40"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
        >
          Save &amp; share link
        </button>
        {!empty && (
          <button
            type="button"
            onClick={clear}
            className="text-[11px] uppercase transition-colors focus:outline-none focus-visible:ring-2"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}
          >
            Clear protocol
          </button>
        )}
      </div>

      <p className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-3)" }}>
        Research use only · United States only
      </p>
    </div>
  );
}
