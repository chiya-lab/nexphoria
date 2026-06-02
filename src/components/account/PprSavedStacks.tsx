"use client";

import { useRouter } from "next/navigation";
import { encodeStack } from "@/lib/stack-store";
import { MOCK_PRODUCTS, toCartProduct } from "@/lib/mock-products";
import { useCart } from "@/lib/cart";
import { openDrawer } from "@/lib/cart-store";
import { MOCK_SAVED_STACKS } from "@/lib/mock-account";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function slugName(slug: string): string {
  return MOCK_PRODUCTS.find((p) => p.slug === slug)?.name ?? slug;
}

export default function PprSavedStacks() {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const bySlug = new Map(MOCK_PRODUCTS.map((p) => [p.slug, p]));

  function load(stackId: string) {
    const stack = MOCK_SAVED_STACKS.find((s) => s.id === stackId);
    if (!stack) return;
    router.push(`/stack-builder?stack=${encodeStack(stack.items)}`);
  }

  function reorderAll(stackId: string) {
    const stack = MOCK_SAVED_STACKS.find((s) => s.id === stackId);
    if (!stack) return;
    let added = 0;
    stack.items.forEach((it) => {
      const mp = bySlug.get(it.slug);
      if (!mp) return;
      const product = toCartProduct(mp);
      const dosage = product.dosages && product.dosages.length > 0 ? product.dosages[0] : undefined;
      addItem(product, "vial", dosage);
      added += 1;
    });
    if (added > 0) openDrawer();
  }

  if (MOCK_SAVED_STACKS.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-16 text-center" style={{ borderColor: "var(--steel)" }}>
        <p className="text-sm" style={{ color: "var(--silver-2)" }}>No saved protocols yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {MOCK_SAVED_STACKS.map((stack) => (
        <div key={stack.id} className="rounded-xl border p-5" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{stack.name}</h3>
              <p className="mt-1 text-[12px]" style={{ color: "var(--silver-2)" }}>
                {stack.items.length} compounds · Saved {fmtDate(stack.savedDate)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => load(stack.id)}
                className="rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-1"
                style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
              >
                Load
              </button>
              <button
                type="button"
                onClick={() => reorderAll(stack.id)}
                className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-mono)", backgroundColor: "var(--accent)", color: "var(--ink)" }}
              >
                Reorder all
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stack.items.map((it) => (
              <span
                key={it.slug}
                className="rounded px-2 py-0.5 text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)", border: "1px solid var(--steel)" }}
              >
                {slugName(it.slug)} · {it.slot}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
