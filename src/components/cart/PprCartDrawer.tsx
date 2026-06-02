"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, FlaskConical, Plus, Minus, ArrowRight } from "lucide-react";
import {
  useCart,
  getItemUnitPrice,
  getCadenceLabel,
  type CartItem,
  BAC_WATER_PRICE,
} from "@/lib/cart";
import { freeShippingThreshold } from "@/lib/cart-store";
import { products, getRelatedProducts, type Product } from "@/lib/products";
import ProductVial from "@/components/ProductVial";

// easeOutQuart — drawer slide, 0.32s.
const EASE_OUT_QUART: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PACK_SIZES = [1, 3, 6] as const;

function lineLabel(item: CartItem): string {
  return item.selectedDosage?.size || item.product.size;
}

export default function PprCartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    addItem,
    bacWaterIncluded,
    toggleBacWater,
  } = useCart();

  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsSubtotal = items.reduce((sum, i) => sum + getItemUnitPrice(i) * i.quantity, 0);
  const subscriptionSavings = items.reduce((total, item) => {
    if (item.discount <= 0) return total;
    const listPrice = getItemUnitPrice(item) / (1 - item.discount);
    return total + (listPrice - getItemUnitPrice(item)) * item.quantity;
  }, 0);

  const bacWaterCharge = items.length > 0 && bacWaterIncluded ? BAC_WATER_PRICE : 0;
  const subtotal = itemsSubtotal + bacWaterCharge;

  const shippingMet = subtotal >= freeShippingThreshold;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Cross-sell: related compounds for what's in the cart, falling back to the
  // first few catalog SKUs, excluding anything already in the cart.
  const crossSell: Product[] = (() => {
    const inCart = new Set(items.map((i) => i.product.slug));
    const seeds = items.flatMap((i) => i.product.relatedSlugs.slice(0, 2)).slice(0, 6);
    const pool = seeds.length > 0 ? getRelatedProducts(seeds) : products;
    return pool.filter((p) => !inCart.has(p.slug)).slice(0, 3);
  })();
  const crossSellSeedName = items[0]?.product.name;

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeDrawer]);

  // Body scroll lock while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ppr-cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT_QUART }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: "rgba(10, 11, 13, 0.7)" }}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="ppr-cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: EASE_OUT_QUART }}
            className="fixed right-0 top-0 z-[61] flex h-screen w-full flex-col md:w-[420px]"
            style={{ backgroundColor: "var(--ink-2)", borderLeft: "1px solid var(--steel)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--steel)" }}
            >
              <h2
                className="flex items-center gap-2 text-[22px] font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                Your cart
                {itemCount > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[12px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink)",
                      backgroundColor: "var(--accent)",
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2"
                style={{ color: "var(--silver-2)" }}
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <EmptyState onBrowse={closeDrawer} router={router} />
            ) : (
              <>
                {/* Free-shipping progress */}
                <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--steel)" }}>
                  <div className="mb-2 flex items-center gap-2">
                    {shippingMet && (
                      <Check size={15} style={{ color: "var(--accent)" }} aria-hidden="true" />
                    )}
                    <span
                      className="text-[12px]"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: shippingMet ? "var(--accent)" : "var(--silver-1)",
                      }}
                    >
                      {shippingMet
                        ? "Free cold-chain unlocked"
                        : `Add $${remainingForShipping.toFixed(2)} for free cold-chain`}
                    </span>
                  </div>
                  <div
                    className="relative h-1.5 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--steel)" }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                      initial={false}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.32, ease: EASE_OUT_QUART }}
                    />
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">
                  {/* Line items */}
                  <ul className="px-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map((item, idx) => (
                        <motion.li
                          key={`${item.product.slug}-${item.format}`}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.04 } }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 px-4 py-4"
                          style={{ borderBottom: "1px solid var(--steel)", backgroundColor: "var(--ink)" }}
                        >
                          {/* Thumbnail */}
                          <div
                            className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md"
                            style={{ border: "1px solid var(--steel)" }}
                          >
                            <ProductVial
                              productName={item.product.name}
                              dosage={lineLabel(item)}
                              category={item.product.category}
                              accentColor={item.product.accentColor}
                              size="thumbnail"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className="truncate text-[14px] font-medium"
                                style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}
                              >
                                {item.product.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeItem(item.product.slug, item.format)}
                                aria-label={`Remove ${item.product.name}`}
                                className="flex-shrink-0 transition-colors"
                                style={{ color: "var(--silver-2)" }}
                              >
                                <X size={15} />
                              </button>
                            </div>

                            {/* Pack-size pills */}
                            <div className="flex items-center gap-1.5">
                              {PACK_SIZES.map((pk) => {
                                const active = item.quantity === pk;
                                return (
                                  <button
                                    key={pk}
                                    type="button"
                                    onClick={() => updateQuantity(item.product.slug, item.format, pk)}
                                    className="rounded-full px-2 py-0.5 text-[11px] transition-colors"
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      border: "1px solid var(--steel)",
                                      color: active ? "var(--ink)" : "var(--silver-2)",
                                      backgroundColor: active ? "var(--accent)" : "transparent",
                                    }}
                                  >
                                    {pk}-pack
                                  </button>
                                );
                              })}
                            </div>

                            {/* Subscription toggle + cadence */}
                            <span
                              className="text-[11px]"
                              style={{
                                fontFamily: "var(--font-mono)",
                                color: item.subscriptionCadence != null ? "var(--accent)" : "var(--silver-2)",
                              }}
                            >
                              {getCadenceLabel(item.subscriptionCadence)}
                              {item.subscriptionCadence != null ? " · subscription" : ""}
                            </span>

                            {/* Qty stepper + line price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.slug, item.format, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                  className="flex h-7 w-7 items-center justify-center rounded-md"
                                  style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
                                >
                                  <Minus size={13} />
                                </button>
                                <span
                                  className="w-6 text-center text-[13px]"
                                  style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.slug, item.format, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                  className="flex h-7 w-7 items-center justify-center rounded-md"
                                  style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <span
                                className="text-[14px] font-medium"
                                style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}
                              >
                                ${(getItemUnitPrice(item) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* Bac-water upsell */}
                  <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--steel)" }}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={bacWaterIncluded}
                        onClick={toggleBacWater}
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
                        style={{
                          border: "1px solid var(--steel)",
                          backgroundColor: bacWaterIncluded ? "var(--accent)" : "transparent",
                        }}
                      >
                        {bacWaterIncluded && <Check size={13} style={{ color: "var(--ink)" }} />}
                      </button>
                      <span className="flex flex-1 flex-col" onClick={toggleBacWater}>
                        <span
                          className="text-[13px]"
                          style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}
                        >
                          Bacteriostatic water 30 mL · ${BAC_WATER_PRICE}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                        >
                          Recommended for reconstitution
                        </span>
                      </span>
                    </label>
                  </div>

                  {/* Cross-sell rail */}
                  {crossSell.length > 0 && (
                    <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--steel)" }}>
                      <p
                        className="mb-3 text-[11px] uppercase"
                        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
                      >
                        {crossSellSeedName
                          ? `Researchers who added ${crossSellSeedName} also added`
                          : "Frequently added together"}
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {crossSell.map((p) => (
                          <div
                            key={p.slug}
                            className="flex w-[140px] flex-shrink-0 flex-col gap-2 rounded-md p-3"
                            style={{ border: "1px solid var(--steel)", backgroundColor: "var(--ink)" }}
                          >
                            <div
                              className="flex h-14 items-center justify-center overflow-hidden rounded"
                              style={{ border: "1px solid var(--steel)" }}
                            >
                              <ProductVial
                                productName={p.name}
                                dosage={p.size}
                                category={p.category}
                                accentColor={p.accentColor}
                                size="thumbnail"
                              />
                            </div>
                            <span
                              className="truncate text-[12px]"
                              style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}
                            >
                              {p.name}
                            </span>
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[12px]"
                                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                              >
                                ${p.price}
                              </span>
                              <button
                                type="button"
                                onClick={() => addItem(p)}
                                className="rounded px-2 py-1 text-[11px] transition-colors"
                                style={{
                                  fontFamily: "var(--font-body)",
                                  color: "var(--accent)",
                                  border: "1px solid var(--steel)",
                                }}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coupon */}
                  <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--steel)" }}>
                    {couponOpen ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Code"
                          className="flex-1 rounded-md px-3 py-2 text-[13px] focus:outline-none focus-visible:ring-2"
                          style={{
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "var(--ink)",
                            border: "1px solid var(--steel)",
                            color: "var(--platinum)",
                          }}
                        />
                        <button
                          type="button"
                          className="rounded-md px-3 py-2 text-[13px]"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: "var(--silver-1)",
                            border: "1px solid var(--steel)",
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCouponOpen(true)}
                        className="text-[12px] transition-colors"
                        style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                      >
                        Have a code?
                      </button>
                    )}
                  </div>

                  {/* Trust row */}
                  <p
                    className="px-4 py-4 text-[11px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                  >
                    Cold-chain · HPLC tested · 30-day satisfaction
                  </p>
                </div>

                {/* Footer */}
                <div
                  className="flex-shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
                  style={{ borderTop: "1px solid var(--steel)" }}
                >
                  {subscriptionSavings > 0 && (
                    <p
                      className="mb-2 text-[12px]"
                      style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
                    >
                      You save ${subscriptionSavings.toFixed(2)} with subscription this shipment
                    </p>
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="text-[14px]"
                      style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="text-[20px] font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                    >
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      router.push("/checkout");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md text-[15px] font-semibold transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                      height: 56,
                      fontFamily: "var(--font-body)",
                      backgroundColor: "var(--accent)",
                      color: "var(--ink)",
                    }}
                  >
                    Checkout · ${subtotal.toFixed(2)}
                    <ArrowRight size={17} />
                  </button>
                  <p
                    className="mt-2 text-center text-[11px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                  >
                    Shipping calculated at checkout · Tax included where applicable
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({
  onBrowse,
  router,
}: {
  onBrowse: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <FlaskConical size={64} style={{ color: "var(--silver-2)" }} aria-hidden="true" />
      <p
        className="mt-4 text-[18px] font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        Your cart is empty
      </p>
      <button
        type="button"
        onClick={() => {
          onBrowse();
          router.push("/products");
        }}
        className="mt-4 inline-flex items-center gap-1 text-[14px] transition-colors"
        style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
      >
        Browse the catalog
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
