"use client";

import Link from "next/link";
import { mockProducts } from "@/lib/mock-products";
import PprProductCard from "@/components/PprProductCard";

export default function PprBestsellerRail() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
            >
              Most ordered
            </p>
            <h2
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              Bestsellers
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[14px] transition-colors hover:text-[color:var(--accent)]"
            style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
          >
            View all <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px]">
        <div
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {mockProducts.map((product) => (
            <div key={product.slug} className="snap-start">
              <PprProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
