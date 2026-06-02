"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCart, getItemUnitPrice, getCadenceLabel, formatCartTotal, BAC_WATER_PRICE } from "@/lib/cart";

export const SUBSCRIBE_DISCOUNT = 0.15;
export const TAX_RATE = 0.08;

export interface OrderTotals {
  subtotal: number;
  bacWater: number;
  subscribeDiscount: number;
  taxable: number;
  tax: number;
  shipping: number;
  total: number;
}

export function useOrderTotals(shipping: number, subscribe: boolean): OrderTotals {
  const items = useCart((s) => s.items);
  const bacWaterIncluded = useCart((s) => s.bacWaterIncluded);

  const subtotal = items.reduce((sum, i) => sum + getItemUnitPrice(i) * i.quantity, 0);
  const bacWater = bacWaterIncluded ? BAC_WATER_PRICE : 0;
  const subscribeDiscount = subscribe ? (subtotal + bacWater) * SUBSCRIBE_DISCOUNT : 0;
  const taxable = subtotal + bacWater - subscribeDiscount;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax + shipping;

  return { subtotal, bacWater, subscribeDiscount, taxable, tax, shipping, total };
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>{label}</span>
      <span
        style={{ fontFamily: "var(--font-mono)", color: accent ? "var(--accent)" : "var(--silver-1)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function PprOrderSummary({
  shipping,
  subscribe,
  onToggleSubscribe,
  shippingLabel,
}: {
  shipping: number;
  subscribe: boolean;
  onToggleSubscribe: (next: boolean) => void;
  shippingLabel: string;
}) {
  const items = useCart((s) => s.items);
  const bacWaterIncluded = useCart((s) => s.bacWaterIncluded);
  const toggleBacWater = useCart((s) => s.toggleBacWater);
  const totals = useOrderTotals(shipping, subscribe);
  const [open, setOpen] = useState(false);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  const body = (
    <div className="flex flex-col gap-5">
      {/* Line items */}
      <ul className="flex flex-col gap-4">
        {items.length === 0 && (
          <li className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
            Your cart is empty.
          </li>
        )}
        {items.map((item) => (
          <li key={`${item.product.slug}-${item.format}`} className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-[10px] uppercase"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)", fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
              aria-hidden="true"
            >
              {item.product.name.slice(0, 3)}
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                {item.product.name}
              </span>
              <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                {item.selectedDosage?.size ?? item.product.size} · {getCadenceLabel(item.subscriptionCadence)} · Qty {item.quantity}
              </span>
            </div>
            <span className="text-[14px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
              {formatCartTotal(getItemUnitPrice(item) * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {/* Bac-water upsell */}
      <button
        type="button"
        onClick={toggleBacWater}
        className="flex items-center gap-3 rounded-md px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2"
        style={{ border: "1px solid var(--steel)", backgroundColor: "var(--ink)" }}
        aria-pressed={bacWaterIncluded}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
          style={{
            backgroundColor: bacWaterIncluded ? "var(--accent)" : "transparent",
            border: `1px solid ${bacWaterIncluded ? "var(--accent)" : "var(--steel)"}`,
          }}
          aria-hidden="true"
        >
          {bacWaterIncluded && <Check size={13} style={{ color: "var(--ink)" }} />}
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
            Add lab-grade bacteriostatic water
          </span>
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            Required for reconstitution
          </span>
        </span>
        <span className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
          +{formatCartTotal(BAC_WATER_PRICE)}
        </span>
      </button>

      {/* Subscribe & save */}
      <button
        type="button"
        onClick={() => onToggleSubscribe(!subscribe)}
        className="flex items-center gap-3 rounded-md px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2"
        style={{
          border: `1px solid ${subscribe ? "var(--accent)" : "var(--steel)"}`,
          backgroundColor: subscribe ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--ink)",
        }}
        aria-pressed={subscribe}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
          style={{
            backgroundColor: subscribe ? "var(--accent)" : "transparent",
            border: `1px solid ${subscribe ? "var(--accent)" : "var(--steel)"}`,
          }}
          aria-hidden="true"
        >
          {subscribe && <Check size={13} style={{ color: "var(--ink)" }} />}
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
            Subscribe &amp; save 15%
          </span>
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            Recurring protocol shipment · cancel anytime
          </span>
        </span>
      </button>

      {/* Totals */}
      <div className="flex flex-col gap-2" style={{ borderTop: "1px solid var(--steel)", paddingTop: 16 }}>
        <Row label="Subtotal" value={formatCartTotal(totals.subtotal)} />
        {totals.bacWater > 0 && <Row label="Bacteriostatic water" value={formatCartTotal(totals.bacWater)} />}
        {totals.subscribeDiscount > 0 && (
          <Row label="Subscribe & save (15%)" value={`-${formatCartTotal(totals.subscribeDiscount)}`} accent />
        )}
        <Row label={`Shipping (${shippingLabel})`} value={totals.shipping === 0 ? "FREE" : formatCartTotal(totals.shipping)} />
        <Row label="Tax (8%)" value={formatCartTotal(totals.tax)} />
        <div className="mt-1 flex items-center justify-between" style={{ borderTop: "1px solid var(--steel)", paddingTop: 12 }}>
          <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
            Total
          </span>
          <span className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            {formatCartTotal(totals.total)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="rounded-lg p-5"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      {/* Mobile collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between lg:hidden"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Order summary ({count})
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[16px]" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
            {formatCartTotal(totals.total)}
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            style={{ color: "var(--silver-2)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          />
        </span>
      </button>

      {/* Desktop heading */}
      <h2
        className="mb-4 hidden text-[18px] font-semibold lg:block"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        Order summary
      </h2>

      <div className={`${open ? "mt-5 block" : "hidden"} lg:block`}>{body}</div>
    </div>
  );
}
