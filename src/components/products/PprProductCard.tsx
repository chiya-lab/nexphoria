"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { type MockProduct, toCartProduct } from "@/lib/mock-products";

function stockLabel(stock: number): { text: string; color: string } {
  if (stock === 0) return { text: "Out of stock", color: "var(--danger)" };
  if (stock <= 10) return { text: `Only ${stock} left`, color: "var(--warn)" };
  return { text: "In stock", color: "var(--ok)" };
}

/** Dark line-art lyophilized vial — accent cap, faint glass body. */
function VialMark({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 80 140"
      width="64"
      height="112"
      aria-hidden="true"
      style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", transform: active ? "translateY(-4px)" : "none" }}
    >
      <rect x="30" y="6" width="20" height="12" rx="2" fill="var(--accent)" />
      <rect x="26" y="18" width="28" height="8" rx="1.5" fill="var(--steel)" />
      <rect x="29" y="26" width="22" height="9" rx="1" fill="var(--silver-3)" opacity="0.5" />
      <rect
        x="24"
        y="35"
        width="32"
        height="95"
        rx="4"
        fill="var(--ink-3)"
        stroke="var(--steel)"
        strokeWidth="1.2"
      />
      <line x1="29" y1="42" x2="29" y2="122" stroke="var(--silver-3)" strokeWidth="1" opacity="0.4" />
      <rect x="24" y="110" width="32" height="20" rx="4" fill="var(--steel)" opacity="0.55" />
      <ellipse cx="40" cy="110" rx="16" ry="3" fill="var(--silver-3)" opacity="0.4" />
    </svg>
  );
}

export default function PprProductCard({
  product,
  compareMode = false,
  selected = false,
  onToggleCompare,
}: {
  product: MockProduct;
  compareMode?: boolean;
  selected?: boolean;
  onToggleCompare?: (slug: string) => void;
}) {
  const { addItem, openDrawer } = useCart();
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const stock = stockLabel(product.stock);
  const outOfStock = product.stock === 0;

  function quickAdd(qty: number) {
    if (outOfStock) return;
    const cartProduct = toCartProduct(product);
    const dosage = cartProduct.dosages?.find((d) =>
      qty === 1 ? d.size === "1 vial" : d.size === `${qty}-vial pack`
    );
    addItem(cartProduct, "vial", dosage, 0);
    openDrawer();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col rounded-lg overflow-hidden"
      style={{
        width: "100%",
        maxWidth: 320,
        minHeight: 440,
        backgroundColor: "var(--ink-2)",
        border: `1px solid ${selected ? "var(--accent)" : "var(--steel)"}`,
        transition: "border-color 0.3s ease, transform 0.3s ease",
        transform: hover && !compareMode ? "translateY(-3px)" : "none",
      }}
    >
      {/* Compare checkbox (compare mode) */}
      {compareMode && (
        <button
          type="button"
          onClick={() => onToggleCompare?.(product.slug)}
          aria-pressed={selected}
          aria-label={`${selected ? "Remove" : "Add"} ${product.name} ${selected ? "from" : "to"} comparison`}
          className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded"
          style={{
            border: `1px solid ${selected ? "var(--accent)" : "var(--steel)"}`,
            backgroundColor: selected ? "var(--accent)" : "transparent",
          }}
        >
          {selected && <Check size={14} color="var(--ink)" strokeWidth={3} />}
        </button>
      )}

      {/* Visual + stock chip */}
      <Link
        href={`/products/${product.slug}`}
        className="ppr-grid-hex relative flex h-[180px] items-center justify-center"
        style={{ borderBottom: "1px solid var(--steel)" }}
        aria-label={`View ${product.name}`}
      >
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.1em",
            color: stock.color,
            border: `1px solid ${stock.color}`,
            backgroundColor: "color-mix(in srgb, var(--ink) 70%, transparent)",
          }}
        >
          {stock.text}
        </span>
        <VialMark active={hover} />
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span
          className="text-[10px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--accent)" }}
        >
          {product.category}
        </span>

        <Link
          href={`/products/${product.slug}`}
          className="mt-1.5 transition-colors hover:text-[color:var(--accent)]"
          style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.15 }}
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <Star size={13} fill="var(--accent)" color="var(--accent)" aria-hidden="true" />
          <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div
          className="mt-3 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
        >
          <span>{product.mw}</span>
          <span style={{ color: "var(--accent)" }}>{product.purity}</span>
        </div>

        {/* Price block / quick-add */}
        <div className="mt-auto pt-5">
          {/* Default price row — fades out on hover to reveal quick-add */}
          <div
            className="flex items-baseline justify-between"
            style={{
              opacity: hover && !compareMode && !outOfStock ? 0 : 1,
              height: hover && !compareMode && !outOfStock ? 0 : "auto",
              overflow: "hidden",
              transition: "opacity 0.2s ease",
            }}
          >
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--platinum)" }}>
                ${product.price}
              </span>
              {product.subscriptionEligible && (
                <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                  / ${product.subPrice} sub
                </span>
              )}
            </div>
            <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
              RUO
            </span>
          </div>

          {/* Quick add — revealed on hover */}
          {hover && !compareMode && !outOfStock && (
            <div>
              <p
                className="mb-2 text-[10px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-3)" }}
              >
                {added ? "Added to cart" : "Quick add"}
              </p>
              <div className="flex gap-2">
                {product.packPrices.map((pp) => (
                  <button
                    key={pp.qty}
                    type="button"
                    onClick={() => quickAdd(pp.qty)}
                    className="flex flex-1 flex-col items-center rounded-md py-1.5 transition-colors hover:border-[color:var(--accent)]"
                    style={{
                      border: "1px solid var(--steel)",
                      backgroundColor: "var(--ink-3)",
                    }}
                    aria-label={`Add ${pp.qty} ${pp.qty === 1 ? "vial" : "vials"} of ${product.name} to cart for $${pp.price}`}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--platinum)" }}>
                      {pp.qty}x
                    </span>
                    <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                      ${pp.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {outOfStock && (
            <Link
              href={`/products/${product.slug}`}
              className="mt-3 block rounded-md py-2 text-center text-[12px] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.12em",
                border: "1px solid var(--steel)",
                color: "var(--silver-2)",
              }}
            >
              Notify when restocked
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
