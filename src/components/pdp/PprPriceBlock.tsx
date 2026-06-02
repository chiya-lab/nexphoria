"use client";

import { Minus, Plus } from "lucide-react";
import type { PdpSelection } from "@/lib/use-pdp-selection";

function money(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

export default function PprPriceBlock({ sel }: { sel: PdpSelection }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Pack-size pills */}
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pack size">
        {sel.packs.map((p) => {
          const active = p.key === sel.packKey;
          return (
            <button
              key={p.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => sel.setPackKey(p.key)}
              className="flex flex-col items-start rounded-md px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                backgroundColor: active
                  ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                  : "var(--ink-2)",
              }}
            >
              <span
                className="text-[13px] font-medium"
                style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}
              >
                {p.label}
              </span>
              <span
                className="mt-0.5 text-[13px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}
              >
                {money(p.price)}
              </span>
              {p.savings > 0 && (
                <span
                  className="mt-0.5 text-[11px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                >
                  save {money(p.savings)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subscription toggle */}
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Purchase type">
        <button
          type="button"
          role="radio"
          aria-checked={!sel.subscribe}
          onClick={() => sel.setSubscribe(false)}
          className="rounded-md px-3 py-3 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2"
          style={{
            border: `1px solid ${!sel.subscribe ? "var(--accent)" : "var(--steel)"}`,
            backgroundColor: !sel.subscribe
              ? "color-mix(in srgb, var(--accent) 12%, transparent)"
              : "var(--ink-2)",
            color: "var(--platinum)",
            fontFamily: "var(--font-body)",
          }}
        >
          One-time
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={sel.subscribe}
          onClick={() => sel.setSubscribe(true)}
          className="flex flex-col items-center rounded-md px-3 py-2 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2"
          style={{
            border: `1px solid ${sel.subscribe ? "var(--accent)" : "var(--steel)"}`,
            backgroundColor: sel.subscribe
              ? "color-mix(in srgb, var(--accent) 12%, transparent)"
              : "var(--ink-2)",
            color: "var(--platinum)",
            fontFamily: "var(--font-body)",
          }}
        >
          Subscribe &amp; save 12%
          <span
            className="text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
          >
            -{money(+(sel.pack.price * 0.12).toFixed(2))}
          </span>
        </button>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-3">
        <span
          className="text-[13px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
        >
          Quantity
        </span>
        <div className="flex items-center" style={{ border: "1px solid var(--steel)", borderRadius: 6 }}>
          <button
            type="button"
            onClick={sel.decQty}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 items-center justify-center transition-colors focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--silver-1)" }}
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <span
            className="flex h-8 w-10 items-center justify-center text-[14px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--platinum)",
              borderLeft: "1px solid var(--steel)",
              borderRight: "1px solid var(--steel)",
            }}
            aria-live="polite"
          >
            {sel.qty}
          </span>
          <button
            type="button"
            onClick={sel.incQty}
            aria-label="Increase quantity"
            className="flex h-8 w-8 items-center justify-center transition-colors focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--silver-1)" }}
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Full-width CTA */}
      <button
        type="button"
        onClick={sel.addToCart}
        className="flex w-full items-center justify-center rounded-md text-[15px] font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
        style={{
          height: 56,
          backgroundColor: "var(--accent)",
          color: "var(--ink)",
          fontFamily: "var(--font-display)",
        }}
      >
        Add to cart · {money(sel.total)}
      </button>
    </div>
  );
}
