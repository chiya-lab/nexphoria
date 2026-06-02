"use client";

import { useState } from "react";
import { ShoppingCart, FlaskConical, RefreshCw } from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  Product,
  ProductDosage,
  SubscriptionCadence,
  SUBSCRIPTION_CADENCE_CONFIG,
} from "@/lib/products";
import { buildItem, trackAddToCart } from "@/lib/analytics";

interface BuyBoxProps {
  product: Product;
  className?: string;
  selectedFormat?: 'vial' | 'pen';
  onFormatChange?: (format: 'vial' | 'pen') => void;
  onDosageChange?: (dosage: ProductDosage | undefined) => void;
}

type PurchaseMode = 'one-time' | 'subscribe';

export default function BuyBox({
  product,
  className = "",
  selectedFormat: externalFormat,
  onFormatChange,
  onDosageChange,
}: BuyBoxProps) {
  const { addItem, openDrawer } = useCart();
  const [internalFormat, setInternalFormat] = useState<'vial' | 'pen'>('vial');
  const selectedFormat = externalFormat !== undefined ? externalFormat : internalFormat;
  const setSelectedFormat = onFormatChange || setInternalFormat;

  const [selectedDosage, setSelectedDosage] = useState<ProductDosage | undefined>(
    product.dosages?.[0] || undefined
  );
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('one-time');

  // Monthly Auto-Ship cadence — always 'monthly', no other cadences
  const selectedCadence: SubscriptionCadence = 'monthly';

  const handleDosageChange = (d: ProductDosage | undefined) => {
    setSelectedDosage(d);
    onDosageChange?.(d);
  };

  // Price is identical for one-time and Monthly Auto-Ship. No discounts.
  const getBasePrice = () => {
    if (selectedFormat === 'pen' && product.penAvailable) return product.penPrice;
    return selectedDosage?.price ?? product.price;
  };

  const unitPrice = getBasePrice();

  const handleAddToOrder = () => {
    const cadence = purchaseMode === 'subscribe' ? selectedCadence : undefined;
    const intervalDays = cadence ? SUBSCRIPTION_CADENCE_CONFIG[cadence].intervalDays : 0;
    addItem(product, selectedFormat, selectedDosage, intervalDays, 0, cadence);
    trackAddToCart(buildItem({
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: unitPrice,
      quantity: 1,
      format: selectedFormat,
      discount: 0,
    }));
    openDrawer();
  };

  return (
    <div className={className}>
      {/* Price */}
      <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "1.25rem", marginBottom: "1.25rem" }}>
        <div className="flex items-baseline gap-2">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.25rem",
              fontWeight: 300,
              color: "#7A6B2A",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            ${unitPrice.toFixed(2)}
          </span>
          <span className="text-sm" style={{ color: "#666666" }}>
            {selectedFormat === 'pen' ? 'per pen' : 'per vial'}
          </span>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #E5E5E5", marginBottom: "1.5rem" }} />

      {/* Purchase Mode Toggle — one-time vs Monthly Auto-Ship, SAME PRICE */}
      <div className="mb-5">
        <p
          className="text-[10px] uppercase mb-3"
          style={{ letterSpacing: "0.12em", color: "#666666", fontWeight: 500 }}
        >
          Purchase Type
        </p>

        {/* Prominent segmented control — rounded-full */}
        <div
          className="flex p-1 gap-1"
          style={{
            border: "1px solid #E5E5E5",
            borderRadius: "999px",
            backgroundColor: "#F5F3F0",
          }}
          role="radiogroup"
          aria-label="Purchase type"
        >
          {(['one-time', 'subscribe'] as const).map((mode) => {
            const active = purchaseMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setPurchaseMode(mode)}
                className="flex-1 flex flex-col items-center justify-center py-2.5 px-3 transition-all duration-250"
                style={{
                  borderRadius: "999px",
                  backgroundColor: active ? "#C4A265" : "transparent",
                  color: active ? "#FFFFFF" : "#666",
                  border: active ? "none" : "none",
                  minHeight: "56px",
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 4px rgba(196,162,101,0.35)" : "none",
                }}
                aria-pressed={active}
                aria-label={mode === 'one-time' ? 'One-time purchase' : 'Monthly Auto-Ship'}
              >
                <span
                  className="text-[11px] uppercase font-semibold"
                  style={{ letterSpacing: "0.12em" }}
                >
                  {mode === 'one-time' ? 'One-Time' : 'Monthly Auto-Ship'}
                </span>
                <span
                  className="text-[10px] mt-0.5"
                  style={{ color: active ? "rgba(255,255,255,0.75)" : "#999" }}
                >
                  ${unitPrice.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Delivery tag — always visible below toggle */}
        <p className="mt-2 text-center text-[11px]" style={{ color: "#8A8075" }}>
          Fresh cold-chain delivery every 30 days
        </p>

        {/* Monthly Auto-Ship descriptor — shown when subscribe active */}
        {purchaseMode === 'subscribe' && (
          <div
            className="mt-3 flex items-start gap-2.5 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(196,162,101,0.06)", border: "1px solid rgba(196,162,101,0.2)" }}
          >
            <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#7A6B2A" }} />
            <div>
              <p className="text-[11px] font-medium" style={{ color: "#1A1A1A" }}>
                Delivered every 30 days. Cancel anytime.
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#666" }}>
                Same price. Cold-chain shipped. No commitment required.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dosage Selection */}
      {selectedFormat === 'vial' && product.dosages && product.dosages.length > 1 && (
        <div className="mb-5">
          <p
            className="text-[10px] uppercase mb-2.5"
            style={{ letterSpacing: "0.12em", color: "#666666", fontWeight: 500 }}
          >
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {product.dosages.map((dosage) => {
              const active = selectedDosage?.size === dosage.size;
              return (
                <button
                  key={dosage.size}
                  onClick={() => handleDosageChange(dosage)}
                  className="flex-1 py-3 px-3 text-sm text-center transition-all duration-300"
                  style={{
                    minHeight: "44px",
                    borderRadius: "999px",
                    border: active ? "1px solid #B8A44C" : "1px solid #E5E5E5",
                    backgroundColor: "transparent",
                    fontWeight: active ? 500 : 400,
                    color: active ? "#1A1A1A" : "#666",
                    cursor: "pointer",
                  }}
                  aria-pressed={active}
                >
                  {dosage.size}{" "}
                  <span style={{ color: "#666666", fontWeight: 400 }}>· ${dosage.price}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Format Toggle (only when pen available) */}
      {product.penAvailable && (
        <div className="mb-5">
          <p
            className="text-[10px] uppercase mb-3"
            style={{ letterSpacing: "0.12em", color: "#666666", fontWeight: 500 }}
          >
            Format
          </p>
          <div className="flex gap-6">
            {(['vial', 'pen'] as const).map((fmt) => {
              const active = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className="text-[11px] uppercase transition-all"
                  style={{
                    letterSpacing: "0.14em",
                    color: active ? "#1A1A1A" : "#888",
                    background: "none",
                    border: "none",
                    borderBottom: active ? "1px solid #B8A44C" : "1px solid transparent",
                    fontWeight: active ? 500 : 400,
                    cursor: "pointer",
                    padding: "0 0 3px 0",
                    minHeight: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  aria-pressed={active}
                >
                  {fmt === 'vial' ? 'Vial' : `Pen · $${product.penPrice}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to Order button — primary CTA */}
      <button
        onClick={handleAddToOrder}
        className="w-full flex items-center justify-center gap-2 font-semibold uppercase transition-all duration-300 active:scale-[0.98]"
        style={{
          height: "54px",
          fontSize: "11.5px",
          letterSpacing: "0.16em",
          backgroundColor: "#1A1A1A",
          color: "#F9F9F9",
          borderRadius: "999px",
          border: "1px solid #1A1A1A",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(26,26,26,0.18)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#333";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A1A1A";
        }}
        aria-label={`Add ${product.name} to order`}
      >
        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
        Add to Order
      </button>

      {/* Inline assurance line — sits directly under the CTA, replaces the duplicated trust strip */}
      <p
        className="mt-3 text-center text-[11px]"
        style={{ color: "#7A6B2A", letterSpacing: "0.02em" }}
      >
        <FlaskConical className="w-3 h-3 inline-block mr-1.5 align-[-1px]" aria-hidden="true" />
        {product.purity} · HPLC-verified · Cold-chain shipped
      </p>
    </div>
  );
}
