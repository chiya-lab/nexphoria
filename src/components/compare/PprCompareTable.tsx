"use client";

import { useState } from "react";
import { hasProductPhoto, getProductImagePath } from "@/lib/product-images";
import { toCartProduct, type MockProduct } from "@/lib/mock-products";
import { useCart } from "@/lib/cart";
import { openDrawer } from "@/lib/cart-store";
import { COMPARE_ROWS, compareCellValue, fromPrice } from "./compareData";

interface PprCompareTableProps {
  products: MockProduct[];
  onRemove: (slug: string) => void;
}

function Thumb({ p }: { p: MockProduct }) {
  return (
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg"
      style={{ backgroundColor: "var(--ink-3, #16181C)", border: "1px solid var(--steel)" }}
    >
      {hasProductPhoto(p.slug) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getProductImagePath(p.slug)}
          alt={p.name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          className="px-1 text-center text-[10px] font-semibold leading-tight"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          {p.name}
        </span>
      )}
    </div>
  );
}

function AddToCartButton({ p }: { p: MockProduct }) {
  const addItem = useCart((s) => s.addItem);
  const inStock = p.stock > 0;

  function handleAdd() {
    if (!inStock) return;
    const product = toCartProduct(p);
    const dosage = product.dosages && product.dosages.length > 0 ? product.dosages[0] : undefined;
    addItem(product, "vial", dosage);
    openDrawer();
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!inStock}
      className="w-full rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.08em",
        backgroundColor: inStock ? "var(--accent)" : "var(--steel)",
        color: inStock ? "var(--ink)" : "var(--silver-2)",
      }}
    >
      {inStock ? `Add · $${fromPrice(p)}` : "Out of stock"}
    </button>
  );
}

export default function PprCompareTable({ products, onRemove }: PprCompareTableProps) {
  // Mobile shows a single column at a time, cycled with prev/next.
  const [mobileIndex, setMobileIndex] = useState(0);
  const safeIndex = Math.min(mobileIndex, Math.max(0, products.length - 1));

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div
          className="rounded-xl border border-dashed px-6 py-16 text-center"
          style={{ borderColor: "var(--steel)" }}
        >
          <p className="text-sm" style={{ color: "var(--silver-2)" }}>
            Add compounds above to build the comparison matrix.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12">
      {/* Desktop / tablet: full matrix */}
      <div className="hidden overflow-x-auto rounded-xl border md:block" style={{ borderColor: "var(--steel)" }}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th
                className="sticky left-0 top-0 z-10 w-44 px-4 py-4 align-bottom text-[11px] uppercase"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  color: "var(--silver-2)",
                  backgroundColor: "var(--ink-2)",
                  borderBottom: "1px solid var(--steel)",
                }}
              >
                Specification
              </th>
              {products.map((p) => (
                <th
                  key={p.slug}
                  className="px-4 py-4 align-bottom"
                  style={{ backgroundColor: "var(--ink-2)", borderBottom: "1px solid var(--steel)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                    >
                      {p.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(p.slug)}
                      aria-label={`Remove ${p.name} from comparison`}
                      className="shrink-0 rounded px-1.5 text-[11px] transition-colors focus:outline-none focus-visible:ring-1"
                      style={{ color: "var(--silver-3)" }}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row, rowIdx) => (
              <tr key={row.key} style={{ backgroundColor: rowIdx % 2 === 0 ? "transparent" : "var(--ink-2)" }}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 px-4 py-3 text-[12px] font-medium uppercase"
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    color: "var(--silver-2)",
                    backgroundColor: rowIdx % 2 === 0 ? "var(--ink)" : "var(--ink-2)",
                    borderTop: "1px solid var(--steel)",
                  }}
                >
                  {row.label}
                </th>
                {products.map((p) => (
                  <td
                    key={p.slug}
                    className="px-4 py-3 align-top text-sm"
                    style={{ borderTop: "1px solid var(--steel)", color: "var(--silver-1)" }}
                  >
                    {row.key === "image" ? (
                      <Thumb p={p} />
                    ) : row.badge ? (
                      <span
                        className="inline-block rounded px-2 py-0.5 text-[12px]"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--accent)",
                          border: "1px solid var(--steel)",
                        }}
                      >
                        {compareCellValue(p, row.key)}
                      </span>
                    ) : (
                      <span style={row.strong ? { color: "var(--platinum)", fontWeight: 600 } : undefined}>
                        {compareCellValue(p, row.key)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 px-4 py-4 text-[12px] font-medium uppercase"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.06em",
                  color: "var(--silver-2)",
                  backgroundColor: "var(--ink)",
                  borderTop: "1px solid var(--steel)",
                }}
              >
                Acquire
              </th>
              {products.map((p) => (
                <td key={p.slug} className="px-4 py-4 align-top" style={{ borderTop: "1px solid var(--steel)" }}>
                  <AddToCartButton p={p} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: single column with prev/next cycling */}
      <div className="md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileIndex((i) => Math.max(0, i - 1))}
            disabled={safeIndex === 0}
            className="rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-opacity focus:outline-none focus-visible:ring-1 disabled:opacity-30"
            style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
          >
            Prev
          </button>
          <span className="text-[12px]" style={{ color: "var(--silver-2)" }}>
            {safeIndex + 1} / {products.length}
          </span>
          <button
            type="button"
            onClick={() => setMobileIndex((i) => Math.min(products.length - 1, i + 1))}
            disabled={safeIndex >= products.length - 1}
            className="rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-opacity focus:outline-none focus-visible:ring-1 disabled:opacity-30"
            style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
          >
            Next
          </button>
        </div>

        {(() => {
          const p = products[safeIndex];
          return (
            <div className="rounded-xl border" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
              <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
                <span className="text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  {p.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(p.slug);
                    setMobileIndex(0);
                  }}
                  className="rounded px-2 text-[11px]"
                  style={{ color: "var(--silver-3)" }}
                >
                  Remove
                </button>
              </div>
              <dl>
                {COMPARE_ROWS.map((row, rowIdx) => (
                  <div
                    key={row.key}
                    className="flex items-start justify-between gap-4 px-4 py-2.5"
                    style={{ borderTop: rowIdx === 0 ? "none" : "1px solid var(--steel)" }}
                  >
                    <dt
                      className="shrink-0 text-[11px] uppercase"
                      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}
                    >
                      {row.label}
                    </dt>
                    <dd className="text-right text-sm" style={{ color: "var(--silver-1)" }}>
                      {row.key === "image" ? <Thumb p={p} /> : compareCellValue(p, row.key)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="px-4 py-4" style={{ borderTop: "1px solid var(--steel)" }}>
                <AddToCartButton p={p} />
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
