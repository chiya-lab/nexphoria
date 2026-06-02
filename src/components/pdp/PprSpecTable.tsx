"use client";

import type { Product } from "@/lib/products";
import { getPdpSupplement } from "@/lib/pdp-specs";

export default function PprSpecTable({ product }: { product: Product }) {
  const sup = getPdpSupplement(product);

  const rows: { label: string; value: string }[] = [
    { label: "Molecular Weight", value: product.molecularWeight },
    { label: "Sequence", value: product.sequence || "—" },
    { label: "CAS Number", value: product.casNumber },
    { label: "Purity", value: product.purity },
    { label: "Lot Number", value: sup.lot },
    { label: "Manufactured", value: sup.manufactured },
    { label: "Expiration", value: sup.expiration },
    { label: "Storage", value: product.storage },
    { label: "Form", value: sup.form },
    { label: "Standard pack size", value: sup.packSize },
  ];

  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <dl className="grid grid-cols-1 lg:grid-cols-2">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="flex flex-col gap-1 px-5 py-4"
            style={{
              borderBottom: "1px solid var(--steel)",
              borderRight: i % 2 === 0 ? "1px solid var(--steel)" : "none",
            }}
          >
            <dt
              className="text-[13px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
            >
              {r.label}
            </dt>
            <dd
              className="text-[15px] break-words"
              style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
