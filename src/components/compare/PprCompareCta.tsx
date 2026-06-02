"use client";

import Link from "next/link";
import { toCartProduct, type MockProduct } from "@/lib/mock-products";
import { useCart } from "@/lib/cart";
import { openDrawer } from "@/lib/cart-store";

interface PprCompareCtaProps {
  products: MockProduct[];
}

export default function PprCompareCta({ products }: PprCompareCtaProps) {
  const addItem = useCart((s) => s.addItem);
  const inStock = products.filter((p) => p.stock > 0);

  function addAll() {
    if (inStock.length === 0) return;
    inStock.forEach((p) => {
      const product = toCartProduct(p);
      const dosage = product.dosages && product.dosages.length > 0 ? product.dosages[0] : undefined;
      addItem(product, "vial", dosage);
    });
    openDrawer();
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div
        className="flex flex-col items-start gap-5 rounded-2xl border p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8"
        style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
      >
        <div>
          <h2
            className="text-xl font-semibold tracking-tight lg:text-2xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Ready to requisition?
          </h2>
          <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--silver-2)" }}>
            Add the in-stock compounds from this matrix to your order, or refine your
            selection. All compounds are supplied for research use only.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={addAll}
            disabled={inStock.length === 0}
            className="rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
          >
            {inStock.length > 0 ? `Add all to cart (${inStock.length})` : "Nothing in stock"}
          </button>
          <Link
            href="/quiz"
            className="rounded-md border px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", borderColor: "var(--steel)", color: "var(--silver-1)" }}
          >
            Try the quiz
          </Link>
          <Link
            href="/products"
            className="rounded-md border px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", borderColor: "var(--steel)", color: "var(--silver-1)" }}
          >
            Browse all peptides
          </Link>
        </div>
      </div>
    </section>
  );
}
