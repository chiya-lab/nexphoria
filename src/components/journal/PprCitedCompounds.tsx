"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";

/**
 * Journal-to-product conversion rail. Article compound tags are product slugs;
 * we resolve them to live catalog entries and surface an add-to-cart CTA. Tags
 * with no matching product page (blends, precursor groups) are dropped upstream.
 */
export default function PprCitedCompounds({ slugs }: { slugs: string[] }) {
  const { addItem, openDrawer } = useCart();

  const products = slugs
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => Boolean(p) && !p!.comingSoon);

  if (products.length === 0) return null;

  return (
    <div>
      <p
        className="mb-5 text-[12px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
      >
        Cited compounds
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const basePrice =
            product.dosages && product.dosages.length > 0
              ? Math.min(...product.dosages.map((d) => d.price))
              : product.price;

          return (
            <div
              key={product.slug}
              className="flex flex-col rounded-lg p-5"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="text-[17px] font-medium transition-colors hover:text-[color:var(--accent)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                {product.name}
              </Link>
              <div
                className="mt-1.5 flex flex-wrap gap-x-3 text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
              >
                <span>{product.molecularWeight}</span>
                <span style={{ color: "var(--accent)" }}>{product.purity}</span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-5">
                <span
                  className="text-[14px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}
                >
                  ${basePrice}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    addItem(product, "vial", product.dosages?.[0], 0);
                    openDrawer();
                  }}
                  className="rounded-md px-3 py-1.5 text-[12px] font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
