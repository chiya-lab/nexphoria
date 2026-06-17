"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Minus,
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  RefreshCw,
  FlaskConical,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import { useCart, getItemUnitPrice } from "@/lib/cart";
import { getProductImagePath, hasProductPhoto } from "@/lib/product-images";
import { products, type Product } from "@/lib/products";
import ProductVial from "@/components/ProductVial";
import RUOBanner from "@/components/RUOBanner";

function ProductThumb({
  slug,
  name,
  dosage,
  category,
  accentColor,
}: {
  slug: string;
  name: string;
  dosage?: string;
  category?: string;
  accentColor?: string;
}) {
  if (hasProductPhoto(slug)) {
    return (
      <Image
        src={getProductImagePath(slug)}
        alt={name}
        width={80}
        height={80}
        loading="lazy"
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
      />
    );
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ProductVial
        productName={name}
        dosage={dosage || ""}
        category={category || ""}
        accentColor={accentColor}
        size="thumbnail"
      />
    </div>
  );
}

// Three featured compounds for the empty-cart state. Prefer POPULAR-badged,
// in-stock products; fall back to the first available compounds.
function getFeaturedCompounds(): Product[] {
  const available = products.filter((p) => !p.comingSoon);
  const popular = available.filter((p) => p.badge === "POPULAR");
  const featured = [...popular, ...available.filter((p) => p.badge !== "POPULAR")];
  return featured.slice(0, 3);
}

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-page-bg)" }}>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="h-8 w-48 rounded" style={{ backgroundColor: "#E5E5E5" }} />
        </div>
      </div>
    );
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-page-bg)" }}>
      <RUOBanner />

      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 pb-32 lg:pb-16">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-[10px] uppercase mb-3"
            style={{ letterSpacing: "0.18em", color: "var(--color-gold)", fontWeight: 500 }}
          >
            Your Order
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 300,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your order`}
          </h1>
        </div>

        {totalItems === 0 ? (
          /* Empty State */
          <div className="py-6">
            <div className="text-center mb-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#F5F5F0", border: "1px solid #E5E5E5" }}
              >
                <ShoppingBag className="w-7 h-7" style={{ color: "var(--color-gold)" }} />
              </div>
              <p
                className="text-lg mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  color: "var(--color-text-primary)",
                }}
              >
                No compounds selected yet
              </p>
              <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Every Nexphoria order ships cold-chain with a lot-specific Certificate of
                Analysis. Begin with one of our most-requested research-grade compounds.
              </p>
              <Link
                href="/products"
                className="btn-acid"
                style={{ minHeight: "48px" }}
              >
                View All Compounds
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Featured compound suggestions */}
            <div>
              <p
                className="text-[10px] uppercase mb-4 text-center"
                style={{ letterSpacing: "0.18em", color: "var(--color-text-secondary)", fontWeight: 500 }}
              >
                Frequently ordered
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {getFeaturedCompounds().map((product) => {
                  const price = product.dosages?.[0]?.price ?? product.price;
                  const size = product.dosages?.[0]?.size ?? product.size;
                  return (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="group rounded-2xl p-5 flex flex-col items-center text-center transition-all card-shadow card-shadow-hover"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E5E5",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center mb-4"
                        style={{
                          backgroundColor: `${product.accentColor}10`,
                          border: `1px solid ${product.accentColor}30`,
                        }}
                      >
                        <ProductThumb
                          slug={product.slug}
                          name={product.name}
                          dosage={size}
                          category={product.category}
                          accentColor={product.accentColor}
                        />
                      </div>
                      <h3
                        className="text-sm font-medium mb-1"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-[11px] mb-3 line-clamp-2"
                        style={{ color: "var(--color-text-secondary)", lineHeight: 1.5 }}
                      >
                        {product.category} · {product.purity}
                      </p>
                      <span
                        className="mt-auto inline-flex items-center gap-1 text-xs font-medium uppercase transition-opacity group-hover:opacity-70"
                        style={{ letterSpacing: "0.1em", color: "var(--color-gold-text)" }}
                      >
                        From ${price}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Cart Items */}
            <div>
              {/* Free shipping progress */}
              {remainingForFreeShipping > 0 && (
                <div
                  className="mb-6 p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(184,164,76,0.06)", border: "1px solid rgba(184,164,76,0.2)" }}
                >
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Add{" "}
                    <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
                      ${remainingForFreeShipping.toFixed(2)}
                    </span>{" "}
                    more for free cold-chain shipping
                  </p>
                  <div
                    className="mt-2 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#E5E5E5" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (totalPrice / freeShippingThreshold) * 100)}%`,
                        backgroundColor: "var(--color-gold)",
                      }}
                    />
                  </div>
                </div>
              )}

              {remainingForFreeShipping === 0 && (
                <div
                  className="mb-6 p-3 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: "rgba(184,164,76,0.06)", border: "1px solid rgba(184,164,76,0.2)" }}
                >
                  <Snowflake className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-gold)" }} />
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Free cold-chain shipping included with your order
                  </p>
                </div>
              )}

              {/* Item list */}
              <div style={{ borderTop: "1px solid #E5E5E5" }}>
                {items.map((item, idx) => {
                  const unitPrice = getItemUnitPrice(item);
                  const lineTotal = unitPrice * item.quantity;
                  const isSubscription = item.subscriptionCadence != null;

                  return (
                    <div
                      key={`${item.product.slug}-${item.format}-${idx}`}
                      className="py-5 flex gap-4"
                      style={{ borderBottom: "1px solid #E5E5E5" }}
                    >
                      {/* Product image */}
                      <div
                        className="flex-shrink-0 rounded-lg overflow-hidden"
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#F9F9F9",
                          border: "1px solid #E5E5E5",
                        }}
                      >
                        <ProductThumb
                          slug={item.product.slug}
                          name={item.product.name}
                          dosage={item.selectedDosage?.size || item.product.size}
                          category={item.product.category}
                          accentColor={item.product.accentColor}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-medium text-sm hover:opacity-70 transition-opacity"
                              style={{
                                color: "var(--color-text-primary)",
                                textDecoration: "none",
                                fontFamily: "var(--font-display)",
                                fontSize: "1rem",
                                fontWeight: 400,
                              }}
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                              {item.selectedDosage?.size || item.product.size}
                              {" · "}
                              {item.format === "pen" ? "Pen Format" : "Vial"}
                              {isSubscription && (
                                <span className="ml-1.5 inline-flex items-center gap-1" style={{ color: "var(--color-gold)" }}>
                                  <RefreshCw className="w-2.5 h-2.5" />
                                  Monthly Auto-Ship
                                </span>
                              )}
                            </p>
                            {/* Lot status / COA trust signal */}
                            <p className="text-[11px] mt-1 inline-flex items-center gap-1" style={{ color: "var(--color-gold-text)" }}>
                              <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                              In stock · lot-specific COA included
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.slug, item.format)}
                            className="flex-shrink-0 p-1 transition-opacity hover:opacity-60"
                            aria-label={`Remove ${item.product.name}`}
                            style={{ color: "#999", background: "none", border: "none", cursor: "pointer" }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity + Price */}
                        <div className="mt-3 flex items-center justify-between">
                          <div
                            className="flex items-center gap-0 rounded-full overflow-hidden"
                            style={{ border: "1px solid #E5E5E5" }}
                          >
                            <button
                              onClick={() => updateQuantity(item.product.slug, item.format, Math.max(1, item.quantity - 1))}
                              className="flex items-center justify-center transition-colors hover:bg-gray-100"
                              style={{ width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer" }}
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" style={{ color: item.quantity <= 1 ? "#CCC" : "#666" }} />
                            </button>
                            <span
                              className="text-sm font-medium"
                              style={{ minWidth: "32px", textAlign: "center", color: "var(--color-text-primary)" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.slug, item.format, item.quantity + 1)}
                              className="flex items-center justify-center transition-colors hover:bg-gray-100"
                              style={{ width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer" }}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" style={{ color: "#666" }} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p
                              className="text-sm font-medium"
                              style={{
                                color: "var(--color-text-primary)",
                                fontFamily: "var(--font-display)",
                                fontSize: "1.1rem",
                                fontWeight: 400,
                              }}
                            >
                              ${lineTotal.toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                                ${unitPrice.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue shopping */}
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs uppercase transition-opacity hover:opacity-60"
                  style={{
                    letterSpacing: "0.12em",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{
                  backgroundColor: "#FAFAFA",
                  border: "1px solid #E5E5E5",
                }}
              >
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 300,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Order Summary
                </h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                    </span>
                    <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
                    <span style={{ color: totalPrice >= 200 ? "var(--color-gold)" : "var(--color-text-primary)" }}>
                      {totalPrice >= 200 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                </div>

                <div
                  className="pt-4 mb-6"
                  style={{ borderTop: "1px solid #E5E5E5" }}
                >
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.3rem",
                        fontWeight: 300,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full flex items-center justify-center gap-2 font-medium uppercase transition-all duration-300 active:scale-[0.98]"
                  style={{
                    height: "52px",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    backgroundColor: "#1A1A1A",
                    color: "#F9F9F9",
                    borderRadius: "999px",
                    border: "1px solid #1A1A1A",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#333";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A1A1A";
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust strip */}
                <div className="mt-4 space-y-2">
                  {[
                    { icon: <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />, label: "Independent HPLC / ESI-MS verification" },
                    { icon: <Snowflake className="w-3.5 h-3.5 flex-shrink-0" />, label: "Cold-chain packed every shipment" },
                    { icon: <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />, label: "Lot-specific COA enclosed" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                      <span style={{ color: "var(--color-gold)" }}>{row.icon}</span>
                      {row.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RUO disclaimer */}
        <div
          className="mt-12 pt-6 text-center"
          style={{ borderTop: "1px solid #E5E5E5" }}
        >
          <p className="text-[11px] uppercase" style={{ letterSpacing: "0.12em", color: "#999" }}>
            For qualified research use only — not for human consumption or clinical application
          </p>
        </div>
      </main>

      {/* Mobile sticky checkout bar */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 border-t mobile-sticky-cta" style={{ zIndex: 40 }}>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
              <p
                className="text-xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-text-primary)", lineHeight: 1.2 }}
              >
                ${totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="flex items-center gap-2 flex-shrink-0 font-medium uppercase transition-all active:scale-[0.97]"
              style={{
                height: "48px",
                padding: "0 24px",
                fontSize: "11px",
                letterSpacing: "0.15em",
                backgroundColor: "#1A1A1A",
                color: "#F9F9F9",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
