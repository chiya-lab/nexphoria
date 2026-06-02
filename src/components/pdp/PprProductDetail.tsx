"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star, FileDown, Clock, Snowflake, Shield } from "lucide-react";
import type { Product } from "@/lib/products";
import { getPdpSupplement } from "@/lib/pdp-specs";
import { usePdpSelection } from "@/lib/use-pdp-selection";
import PprProductGallery from "./PprProductGallery";
import PprPriceBlock from "./PprPriceBlock";
import PprStockChip from "./PprStockChip";
import PprSpecTable from "./PprSpecTable";
import PprPairedWith from "./PprPairedWith";
import PprStickyAddBar from "./PprStickyAddBar";
import PprReviewsBlock from "./PprReviewsBlock";

const TABS = [
  "Specifications",
  "COA & Data",
  "Reconstitution",
  "Citations",
  "Reviews",
  "Paired with",
] as const;
type Tab = (typeof TABS)[number];

const COA_AVAILABLE = new Set([
  "bpc-157",
  "semaglutide",
  "tirzepatide",
  "tb-500",
  "ghk-cu",
  "nad-plus",
]);

// Countdown to the 4pm ET (20:00 UTC) same-day ship cutoff.
function useShipCountdown(): string {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setUTCHours(20, 0, 0, 0);
      if (cutoff.getTime() <= now.getTime()) {
        setLabel("Ships next business day");
        return;
      }
      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setLabel(`Ships today if ordered in ${h}h ${m}m`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

export default function PprProductDetail({
  product,
  paired,
}: {
  product: Product;
  paired: Product[];
}) {
  const sel = usePdpSelection(product);
  const sup = getPdpSupplement(product);
  const ship = useShipCountdown();
  const [tab, setTab] = useState<Tab>("Specifications");
  const ctaSentinel = useRef<HTMLDivElement | null>(null);

  const hasCoa = COA_AVAILABLE.has(product.slug);

  return (
    <div style={{ backgroundColor: "var(--ink)" }}>
      {/* Above the fold */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[60fr_40fr]">
          {/* LEFT — gallery */}
          <PprProductGallery product={product} />

          {/* RIGHT — conversion block */}
          <div className="flex flex-col gap-5">
            {/* Eyebrow row */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-2.5 py-1 text-[11px] uppercase"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  color: "var(--silver-1)",
                  border: "1px solid var(--steel)",
                }}
              >
                {product.category}
              </span>
              <PprStockChip stock={sup.stock} />
            </div>

            <h1
              className="text-[40px] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
            >
              {product.name}
            </h1>

            {/* Aggregate review */}
            <a
              href="#pdp-tabs"
              onClick={() => setTab("Reviews")}
              className="flex items-center gap-2"
              style={{ color: "var(--silver-1)" }}
            >
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} fill="var(--accent)" strokeWidth={0} />
                ))}
              </span>
              <span className="text-[14px]" style={{ fontFamily: "var(--font-body)" }}>
                4.8 · 247 verified researchers
              </span>
            </a>

            {/* Spec micro-row */}
            <p
              className="text-[13px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
            >
              MW {product.molecularWeight} · Purity {product.purity} · CAS {product.casNumber}
            </p>

            {/* COA download */}
            <Link
              href={hasCoa ? `/coa#${product.slug}` : "/coa"}
              className="inline-flex w-fit items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-2"
              style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
            >
              <FileDown size={15} aria-hidden="true" />
              Download COA
            </Link>

            {/* Price block (sentinel wraps the CTA inside) */}
            <div ref={ctaSentinel}>
              <PprPriceBlock sel={sel} />
            </div>

            {/* Micro-row */}
            <div className="flex flex-col gap-2">
              <span
                className="flex items-center gap-2 text-[12px]"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
              >
                <Clock size={14} aria-hidden="true" style={{ color: "var(--accent)" }} />
                {ship}
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <span
                  className="flex items-center gap-2 text-[12px]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
                >
                  <Snowflake size={14} aria-hidden="true" style={{ color: "var(--accent)" }} />
                  Cold-chain
                </span>
                <span
                  className="flex items-center gap-2 text-[12px]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
                >
                  <Shield size={14} aria-hidden="true" style={{ color: "var(--accent)" }} />
                  30-day satisfaction
                </span>
              </div>
            </div>

            {/* Trust strip */}
            <p
              className="text-[12px] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
                color: "var(--silver-2)",
                borderTop: "1px solid var(--steel)",
                paddingTop: 16,
              }}
            >
              Third-party HPLC tested · Lot-traceable · RUO
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        id="pdp-tabs"
        className="sticky top-[64px] z-30"
        style={{
          backgroundColor: "color-mix(in srgb, var(--ink) 92%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--steel)",
          borderBottom: "1px solid var(--steel)",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Product details">
            {TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className="relative whitespace-nowrap px-4 py-4 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: active ? "var(--platinum)" : "var(--silver-2)",
                  }}
                >
                  {t}
                  {active && (
                    <span
                      className="absolute bottom-0 left-2 right-2"
                      style={{ height: 2, backgroundColor: "var(--accent)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab panels */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8" role="tabpanel">
        {tab === "Specifications" && <PprSpecTable product={product} />}
        {tab === "Paired with" && <PprPairedWith product={product} paired={paired} />}
        {tab === "COA & Data" && <TabStub agent="06" name="COA & Data" />}
        {tab === "Reconstitution" && <TabStub agent="06" name="Reconstitution" />}
        {tab === "Citations" && <TabStub agent="07" name="Citations" />}
        {tab === "Reviews" && <PprReviewsBlock product={product} />}
      </div>

      {/* Sticky add bar */}
      <PprStickyAddBar product={product} sel={sel} sentinel={ctaSentinel} />
    </div>
  );
}

function TabStub({ agent, name }: { agent: string; name: string }) {
  return (
    <div
      className="rounded-lg px-6 py-12 text-center"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <p className="text-[14px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
        {name} — loaded by agent {agent}
      </p>
    </div>
  );
}
