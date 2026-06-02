"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { openDrawer } from "@/lib/cart-store";
import { MOCK_PRODUCTS, toCartProduct } from "@/lib/mock-products";
import {
  getOrder,
  getAddress,
  getCoa,
  orderTotal,
  type Order,
} from "@/lib/mock-account";
import { ORDER_STATUS_COLOR } from "./statusBadge";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function downloadCoa(fileLabel: string) {
  // Mock CoA: generate a small text blob so the download is functional offline.
  const blob = new Blob([`Nexphoria Certificate of Analysis\n${fileLabel}\nFor research use only.`], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileLabel;
  a.click();
  URL.revokeObjectURL(url);
}

function ReorderButton({ order }: { order: Order }) {
  const addItem = useCart((s) => s.addItem);
  const bySlug = new Map(MOCK_PRODUCTS.map((p) => [p.slug, p]));

  function reorder() {
    let added = 0;
    order.items.forEach((it) => {
      const mp = bySlug.get(it.productSlug);
      if (!mp) return;
      const product = toCartProduct(mp);
      const dosage = product.dosages && product.dosages.length > 0 ? product.dosages[0] : undefined;
      addItem(product, "vial", dosage);
      added += 1;
    });
    if (added > 0) openDrawer();
  }

  return (
    <button
      type="button"
      onClick={reorder}
      className="rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
    >
      Reorder
    </button>
  );
}

export default function PprOrderDetail({ orderId }: { orderId: string }) {
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-16 text-center" style={{ borderColor: "var(--steel)" }}>
        <p className="text-sm" style={{ color: "var(--silver-2)" }}>
          Order not found.{" "}
          <Link href="/account/orders" className="underline" style={{ color: "var(--accent)" }}>
            Back to orders
          </Link>
        </p>
      </div>
    );
  }

  const shipTo = getAddress(order.shipToId);
  const total = orderTotal(order);
  const statusColor = ORDER_STATUS_COLOR[order.status];

  return (
    <div>
      <Link href="/account/orders" className="text-[12px] uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
        ← All orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-semibold" style={{ color: "var(--platinum)" }}>{order.id}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--silver-2)" }}>Placed {fmtDate(order.date)}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--silver-1)" }}>
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }} />
          {order.status}
        </span>
      </div>

      {/* Line items */}
      <div className="mt-6 overflow-hidden rounded-xl border" style={{ borderColor: "var(--steel)" }}>
        {order.items.map((it, i) => {
          const coa = getCoa(it.coaId);
          return (
            <div
              key={`${it.productSlug}-${i}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--steel)", backgroundColor: "var(--ink-2)" }}
            >
              <div className="min-w-0">
                <Link
                  href={`/products/${it.productSlug}`}
                  className="text-sm font-semibold transition-colors"
                  style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                >
                  {it.name}
                </Link>
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>
                  {it.packQty} vial · Lot {it.lot}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {coa ? (
                  <button
                    type="button"
                    onClick={() => downloadCoa(coa.fileLabel)}
                    className="text-[12px] uppercase tracking-wide transition-colors focus:outline-none focus-visible:underline"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                  >
                    Download CoA
                  </button>
                ) : (
                  <span className="text-[12px]" style={{ color: "var(--silver-3)", fontFamily: "var(--font-mono)" }}>
                    CoA on request
                  </span>
                )}
                <span className="text-sm font-semibold" style={{ color: "var(--platinum)" }}>
                  ${it.unitPrice * it.packQty}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping + totals */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
          <p className="mb-2 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}>
            Ship to
          </p>
          {shipTo ? (
            <address className="not-italic text-sm leading-relaxed" style={{ color: "var(--silver-1)" }}>
              {shipTo.recipient}<br />
              {shipTo.organization && <>{shipTo.organization}<br /></>}
              {shipTo.line1}{shipTo.line2 ? `, ${shipTo.line2}` : ""}<br />
              {shipTo.city}, {shipTo.state} {shipTo.postalCode}<br />
              {shipTo.country}
            </address>
          ) : (
            <p className="text-sm" style={{ color: "var(--silver-2)" }}>—</p>
          )}
          {order.tracking && (
            <p className="mt-3 text-[12px]" style={{ color: "var(--silver-2)" }}>
              {order.carrier} · <span className="font-mono" style={{ color: "var(--silver-1)" }}>{order.tracking}</span>
            </p>
          )}
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
          <p className="mb-2 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}>
            Summary
          </p>
          <div className="space-y-1.5 text-sm" style={{ color: "var(--silver-1)" }}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total - order.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : `$${order.shipping}`}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold" style={{ color: "var(--platinum)", borderTop: "1px solid var(--steel)" }}>
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>

      {order.status !== "Cancelled" && (
        <div className="mt-6">
          <ReorderButton order={order} />
        </div>
      )}
    </div>
  );
}
