"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, Zap, Clock, RefreshCw, CheckCircle2, Lock, FileCheck, Snowflake } from "lucide-react";
import { useCart, getItemUnitPrice, getCadenceLabel } from "@/lib/cart";
import { buildItem, trackBeginCheckout } from "@/lib/analytics";
import { CHECKOUT_URL, CRYPTO_ORDER_URL } from "@/lib/endpoints";
import { getProductImagePath, hasProductPhoto } from "@/lib/product-images";
import ProductVial from "@/components/ProductVial";
import RUOBanner from "@/components/RUOBanner";
import Link from "next/link";
import Image from "next/image";

// 48px product thumbnail: real photo when available, else the SVG vial.
function ProductThumb({
  slug,
  name,
  dosage,
  category,
  accentColor,
}: {
  slug: string;
  name: string;
  dosage: string;
  category: string;
  accentColor: string;
}) {
  if (hasProductPhoto(slug)) {
    return (
      <Image
        src={getProductImagePath(slug)}
        alt={name}
        width={48}
        height={48}
        loading="lazy"
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
      />
    );
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ProductVial
        productName={name}
        dosage={dosage}
        category={category}
        accentColor={accentColor}
        size="thumbnail"
      />
    </div>
  );
}

type ShippingMethod = "standard" | "overnight";

const SHIPPING_OPTIONS: {
  id: ShippingMethod;
  label: string;
  description: string;
  price: number;
  freeOver: number | null;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  {
    id: "standard",
    label: "Standard Cold-Chain",
    description: "2–5 business days · Insulated packaging + ice pack",
    price: 15,
    freeOver: 200,
    icon: <Truck className="w-5 h-5" />,
  },
  {
    id: "overnight",
    label: "Overnight Express",
    description: "Next business day by 12pm · Dry ice packing",
    price: 38,
    freeOver: null,
    icon: <Zap className="w-5 h-5" />,
    badge: "Recommended for temperature-sensitive orders",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({ email: "" });
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  // Payment rail. Stripe is the default (card). Crypto is a documented backup
  // for customers in regions where card processors decline peptide orders.
  // Subscriptions cannot be charged on-chain, so the UI hides the crypto
  // option when the cart contains any subscription cycle.
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "crypto">(
    "stripe",
  );
  const [cryptoAsset, setCryptoAsset] = useState<"BTC" | "ETH">("BTC");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // RUO acknowledgement must be checked before an order can be placed.
  const [ruoAcknowledged, setRuoAcknowledged] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/products");
    }
  }, [mounted, items, router]);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const hasSubscription = items.some((item) => item.subscriptionCadence != null);
  const subscriptionItems = items.filter((item) => item.subscriptionCadence != null);
  const oneTimeItems = items.filter((item) => item.subscriptionCadence == null);

  const handlePromoApply = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  // Included supplies by order value (matches CartDrawer thresholds)
  const includedSupplies: string[] = [];
  if (totalPrice >= 100) includedSupplies.push("Bacteriostatic water");
  if (totalPrice >= 200) includedSupplies.push("Free standard shipping");
  if (totalPrice >= 300) includedSupplies.push("Cold-pack upgrade");

  // Shipping cost calculation
  const selectedShipping = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)!;
  const shippingCost =
    shippingMethod === "standard" && totalPrice >= 200
      ? 0
      : selectedShipping.price;

  // Crypto cannot service recurring subscriptions. Force Stripe in that case.
  const cryptoDisabled = hasSubscription;
  // Derive the effective rail at render time — if the cart turned into a
  // subscription cart after the user picked crypto, we silently treat them as
  // Stripe without writing to state inside an effect.
  const effectivePaymentMethod: "stripe" | "crypto" =
    cryptoDisabled ? "stripe" : paymentMethod;

  const handleCheckout = async () => {
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    if (!ruoAcknowledged) {
      setError("Please confirm the research-use-only acknowledgement to continue.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const ga4Items = items.map((item) =>
      buildItem({
        slug: item.product.slug,
        name: item.product.name,
        category: item.product.category,
        price: getItemUnitPrice(item),
        quantity: item.quantity,
        format: item.format,
      })
    );
    trackBeginCheckout(ga4Items, getTotalPrice());

    try {
      const checkoutItems = items.map((item) => ({
        productSlug: item.product.slug,
        name: item.product.name,
        price: getItemUnitPrice(item),
        quantity: item.quantity,
        size: item.selectedDosage?.size || item.product.size,
        format: item.format,
        subscriptionMonths: item.subscriptionMonths,
      }));

      if (effectivePaymentMethod === "crypto") {
        const response = await fetch(CRYPTO_ORDER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: checkoutItems,
            customerEmail: formData.email,
            shippingMethod,
            asset: cryptoAsset,
          }),
        });

        if (!response.ok) {
          let message = "We could not start a crypto order. Please try card checkout.";
          try {
            const payload = await response.json();
            if (payload?.message) message = payload.message;
          } catch {
            /* swallow */
          }
          throw new Error(message);
        }

        const data = await response.json();
        const qs = new URLSearchParams({
          ref: String(data.reference || ""),
          asset: String(data.asset || cryptoAsset),
        });
        if (data.walletAddress) qs.set("address", String(data.walletAddress));
        if (data.totalUsd != null) qs.set("total", String(data.totalUsd));
        window.location.href = `/checkout/crypto?${qs.toString()}`;
        return;
      }

      const response = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          customerEmail: formData.email,
          shippingMethod,
        }),
      });

      if (!response.ok) {
        let message = "We could not start checkout. Please try again or contact support.";
        try {
          const payload = await response.json();
          if (payload?.message) message = payload.message;
        } catch {
          /* swallow */
        }
        throw new Error(message);
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error("We could not start checkout. Please try again or contact support.");
      }

      window.location.href = url;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Checkout error:", err);
      }
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "We could not start checkout. Please try again.";
      setError(msg);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckout();
  };

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fffff3", paddingTop: "80px" }}>
      {/* ── 3-Step Progress Bar ── */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "rgba(255,255,243,0.97)", borderColor: "#ECEAE4", backdropFilter: "blur(8px)" }}
      >
        <div className="container-nex py-4">
          <div className="flex items-center justify-center gap-0 max-w-xs mx-auto">
            {(["Cart", "Details", "Payment"] as const).map((label, idx) => {
              const stepState = idx === 0 ? "done" : idx === 1 ? "active" : "pending";
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: stepState === "done" ? "#C4A265" : stepState === "active" ? "#C4A265" : "transparent",
                        color: stepState === "pending" ? "#999" : "#fff",
                        border: stepState === "pending" ? "1.5px solid #D8D4CC" : "1.5px solid #C4A265",
                      }}
                    >
                      {stepState === "done" ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : idx + 1}
                    </div>
                    <span
                      className="text-[10px] font-medium uppercase tracking-wide"
                      style={{ color: stepState === "pending" ? "#999" : "#C4A265", letterSpacing: "0.08em" }}
                    >
                      {label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      className="h-px w-12 mx-2 mb-4"
                      style={{ backgroundColor: idx === 0 ? "#C4A265" : "#D8D4CC" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-nex py-12 md:py-16 pb-32 lg:pb-16">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-60 transition-opacity"
          style={{ color: "#3A3A3A" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#010101", fontFamily: "var(--font-display)" }}
        >
          Checkout
        </h1>
        <p className="text-sm mb-12" style={{ color: "#8A8075" }}>
          {totalItems} item{totalItems !== 1 ? "s" : ""} · Secure checkout via Stripe
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Left Column – Form ── */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <section>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "#010101" }}>
                  1 · Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#3A3A3A" }}>
                    Email Address
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-luxury w-full"
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs mt-2" style={{ color: "#8A8075" }}>
                    Order confirmation, tracking, and COA references are sent here.
                  </p>
                </div>
              </section>

              {/* ── Shipping Method ── */}
              <section>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "#010101" }}>
                  2 · Shipping Method
                </h2>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((option) => {
                    const isFree = option.freeOver !== null && totalPrice >= option.freeOver;
                    const isSelected = shippingMethod === option.id;
                    return (
                      <label
                        key={option.id}
                        className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4 rounded-lg border cursor-pointer transition-all"
                        style={{
                          borderColor: isSelected ? "#B8A44C" : "#D8D4CC",
                          backgroundColor: isSelected ? "#B8A44C10" : "#F7F5F0",
                          outline: isSelected ? "1px solid #B8A44C" : "none",
                        }}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setShippingMethod(option.id)}
                          className="sr-only"
                        />
                        {/* Custom radio circle */}
                        <div
                          className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: isSelected ? "#B8A44C" : "#A09890" }}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#B8A44C" }} />
                          )}
                        </div>

                        <div
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded"
                          style={{ color: isSelected ? "#B8A44C" : "#8A8075", backgroundColor: isSelected ? "#B8A44C18" : "#EAE6DF" }}
                        >
                          {option.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold" style={{ color: "#010101" }}>
                              {option.label}
                            </span>
                            {option.badge && (
                              <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full self-start"
                                style={{ backgroundColor: "#B8A44C20", color: "#8A7030" }}
                              >
                                {option.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: "#8A8075" }}>
                            {option.description}
                          </p>
                          {option.freeOver !== null && (
                            <p className="text-xs mt-1" style={{ color: "#B8A44C" }}>
                              Free on orders over ${option.freeOver}
                            </p>
                          )}
                        </div>

                        <div className="flex-shrink-0 text-sm font-bold text-right" style={{ color: "#010101" }}>
                          {isFree ? (
                            <span style={{ color: "#B8A44C" }}>Free</span>
                          ) : (
                            `$${option.price.toFixed(2)}`
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs mt-3" style={{ color: "#8A8075" }}>
                  Shipping address is collected securely on the Stripe payment page. US addresses only.
                </p>
              </section>

              {/* ── Subscription Details ── */}
              {hasSubscription && (
                <section>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: "#010101" }}>
                    3 · Subscription Details
                  </h2>
                  <div
                    className="p-5 rounded-lg border"
                    style={{ backgroundColor: "#B8A44C08", borderColor: "#B8A44C40" }}
                  >
                    {/* Subscription header */}
                    <div className="flex items-center gap-2 mb-4">
                      <RefreshCw className="w-4 h-4" style={{ color: "#B8A44C" }} />
                      <span className="text-sm font-semibold" style={{ color: "#010101" }}>
                        Recurring Research Cycle
                      </span>
                    </div>

                    {/* Subscription items */}
                    <div className="space-y-3 mb-4">
                      {subscriptionItems.map((item) => {
                        const dosageLabel = item.selectedDosage?.size || item.product.size;
                        const unitPrice = getItemUnitPrice(item);
                        const cycleLabel = "Monthly Auto-Ship";
                        return (
                          <div
                            key={`sub-${item.product.slug}`}
                            className="flex items-start gap-3 p-3 rounded"
                            style={{ backgroundColor: "#ffffff60" }}
                          >
                            <div
                              className="flex-shrink-0 w-10 h-10 rounded overflow-hidden flex items-center justify-center"
                              style={{ backgroundColor: `${item.product.accentColor}12`, border: `1px solid ${item.product.accentColor}30` }}
                            >
                              <ProductThumb
                                slug={item.product.slug}
                                name={item.product.name}
                                dosage={dosageLabel}
                                category={item.product.category}
                                accentColor={item.product.accentColor}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: "#010101" }}>
                                {item.product.name}
                              </p>
                              <p className="text-xs" style={{ color: "#8A8075" }}>
                                {dosageLabel} · {cycleLabel}
                              </p>
                            </div>
                            <div className="text-sm font-semibold" style={{ color: "#010101" }}>
                              ${(unitPrice * item.quantity).toFixed(2)}
                              <span className="text-[10px] font-normal block text-right" style={{ color: "#8A8075" }}>
                                /month
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* What's included bullets */}
                    <div className="border-t pt-4" style={{ borderColor: "#B8A44C30" }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: "#3A3A3A" }}>
                        What&apos;s included in your research cycle:
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          "Monthly shipment with fresh cold-chain delivery",
                          "COA included with every batch",
                          "Cancel or pause anytime — no commitment",
                          "Locked-in pricing for the duration of your cycle",
                          "Priority processing and dispatch",
                        ].map((point) => (
                          <li key={point} className="flex items-start gap-2 text-xs" style={{ color: "#555" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#B8A44C" }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Billing note */}
                    <div
                      className="mt-4 p-3 rounded text-xs"
                      style={{ backgroundColor: "#fffff3", color: "#8A8075" }}
                    >
                      <Clock className="w-3.5 h-3.5 inline-block mr-1.5 mb-0.5" />
                      Subscriptions are billed monthly via Stripe. Your first charge is today, then
                      automatically on the same date each month. Manage or cancel from your Stripe
                      customer portal (link sent with confirmation email).
                    </div>
                  </div>
                </section>
              )}

              {/* ── Payment Method ── */}
              <section>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "#010101" }}>
                  {hasSubscription ? "4" : "3"} · Payment
                </h2>

                {/* Rail selector: Card (Stripe) vs Crypto. Hidden for
                    subscription carts — only one-time orders can settle on-chain. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className="text-left p-4 rounded-lg border transition-all"
                    style={{
                      backgroundColor:
                        effectivePaymentMethod === "stripe" ? "#FFFFFF" : "#F7F5F0",
                      borderColor:
                        effectivePaymentMethod === "stripe" ? "#B8A44C" : "#D8D4CC",
                      boxShadow:
                        effectivePaymentMethod === "stripe"
                          ? "0 0 0 2px rgba(184,164,76,0.2)"
                          : "none",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#010101" }}
                      >
                        Card · Apple Pay · Google Pay
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-wide"
                        style={{ color: "#8A8075" }}
                      >
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#8A8075" }}>
                      Instant authorization via Stripe. Includes Visa, Mastercard,
                      AMEX, Apple Pay, and Google Pay.
                    </p>
                  </button>

                  <button
                    type="button"
                    disabled={cryptoDisabled}
                    onClick={() => !cryptoDisabled && setPaymentMethod("crypto")}
                    className="text-left p-4 rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor:
                        effectivePaymentMethod === "crypto" ? "#FFFFFF" : "#F7F5F0",
                      borderColor:
                        effectivePaymentMethod === "crypto" ? "#B8A44C" : "#D8D4CC",
                      boxShadow:
                        effectivePaymentMethod === "crypto"
                          ? "0 0 0 2px rgba(184,164,76,0.2)"
                          : "none",
                    }}
                    aria-disabled={cryptoDisabled}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#010101" }}
                      >
                        Bitcoin or Ethereum
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-wide"
                        style={{ color: "#8A8075" }}
                      >
                        On-chain
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#8A8075" }}>
                      {cryptoDisabled
                        ? "Subscriptions require a card. Remove the subscription cycle to pay on-chain."
                        : "Pay from any wallet. Order ships once your transaction confirms on-chain (≈10 min BTC, ≈2 min ETH)."}
                    </p>
                  </button>
                </div>

                {effectivePaymentMethod === "crypto" && !cryptoDisabled && (
                  <div
                    className="p-5 rounded-lg border mb-4"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D8D4CC" }}
                  >
                    <p
                      className="text-xs uppercase tracking-wide mb-3"
                      style={{ color: "#8A8075" }}
                    >
                      Choose asset
                    </p>
                    <div className="flex gap-3">
                      {(["BTC", "ETH"] as const).map((asset) => {
                        const selected = cryptoAsset === asset;
                        return (
                          <button
                            type="button"
                            key={asset}
                            onClick={() => setCryptoAsset(asset)}
                            className="px-4 py-2 rounded-md border text-sm font-medium transition"
                            style={{
                              backgroundColor: selected ? "#010101" : "#FFFFFF",
                              color: selected ? "#FFFFFF" : "#010101",
                              borderColor: selected ? "#010101" : "#D8D4CC",
                            }}
                          >
                            {asset === "BTC" ? "Bitcoin (BTC)" : "Ethereum (ETH)"}
                          </button>
                        );
                      })}
                    </div>
                    <p
                      className="text-xs mt-3 leading-relaxed"
                      style={{ color: "#8A8075" }}
                    >
                      You’ll see the receiving address and order reference on the
                      next screen. Send the exact USD-equivalent amount in {cryptoAsset}.
                      Cold-chain shipment is scheduled once the network confirms
                      your transfer.
                    </p>
                  </div>
                )}

                {effectivePaymentMethod === "stripe" && (
                <div
                  className="p-6 rounded-lg border flex items-start gap-4"
                  style={{ backgroundColor: "#EAE6DF", borderColor: "#D8D4CC" }}
                >
                  <ShieldCheck className="w-8 h-8 flex-shrink-0" style={{ color: "#B8A44C" }} />
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "#3A3A3A" }}>
                      Secure payment via Stripe
                    </p>
                    <p className="text-xs" style={{ color: "#8A8075" }}>
                      Card details are processed directly by Stripe and encrypted end-to-end using
                      TLS 1.3. Nexphoria never stores your payment information.
                    </p>
                    {/* Payment icons */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {/* Visa */}
                      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Visa" className="opacity-70">
                        <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                        <path d="M14.5 16.5H12.2L10.7 10.1C10.64 9.86 10.5 9.65 10.27 9.53C9.71 9.22 9.09 8.97 8.44 8.83V8.58H12.06C12.56 8.58 12.94 8.97 13 9.47L13.85 14.07L16.12 8.58H18.37L14.5 16.5Z" fill="white"/>
                        <path d="M19.5 16.5H17.32L19.07 8.58H21.25L19.5 16.5Z" fill="white"/>
                        <path d="M24.3 10.8C24.37 10.3 24.8 10 25.3 10C26.05 10 26.63 10.3 27 10.55L27.38 8.83C26.95 8.67 26.3 8.5 25.5 8.5C23.37 8.5 21.87 9.67 21.87 11.3C21.87 12.55 22.95 13.2 23.75 13.57C24.55 13.95 24.83 14.2 24.8 14.55C24.8 15.08 24.18 15.33 23.57 15.33C22.72 15.33 22.27 15.12 21.75 14.87L21.37 16.62C21.93 16.87 22.93 17.12 23.95 17.12C26.27 17.12 27.68 15.97 27.68 14.22C27.68 11.97 24.3 11.85 24.3 10.8Z" fill="white"/>
                        <path d="M31.43 8.58H29.68C29.26 8.58 28.93 8.83 28.77 9.2L25.65 16.5H27.9L28.35 15.27H31.1L31.35 16.5H33.35L31.43 8.58ZM28.95 13.57L30.08 10.55L30.72 13.57H28.95Z" fill="white"/>
                      </svg>
                      {/* Mastercard */}
                      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Mastercard" className="opacity-70">
                        <rect width="38" height="24" rx="4" fill="#252525"/>
                        <circle cx="14" cy="12" r="6" fill="#EB001B"/>
                        <circle cx="24" cy="12" r="6" fill="#F79E1B"/>
                        <path d="M19 7.2C20.5 8.3 21.5 9.9 21.5 12C21.5 14.1 20.5 15.7 19 16.8C17.5 15.7 16.5 14.1 16.5 12C16.5 9.9 17.5 8.3 19 7.2Z" fill="#FF5F00"/>
                      </svg>
                      {/* Amex */}
                      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="American Express" className="opacity-70">
                        <rect width="38" height="24" rx="4" fill="#2557D6"/>
                        <text x="6" y="16" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">AMEX</text>
                      </svg>
                      {/* Apple Pay / Google Pay hint */}
                      <span className="text-[10px]" style={{ color: "#A09890" }}>+ more via Stripe</span>
                    </div>
                  </div>
                </div>
                )}
              </section>
            </form>
          </div>

          {/* ── Right Column – Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div
                className="p-6 rounded-lg border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D8D4CC" }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: "#010101", fontFamily: "var(--font-display)" }}>
                  Order Summary
                </h2>

                {/* One-time items */}
                {oneTimeItems.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {hasSubscription && (
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8A8075" }}>
                        One-time items
                      </p>
                    )}
                    {oneTimeItems.map((item) => {
                      const dosageLabel = item.selectedDosage?.size || item.product.size;
                      const unitPrice = getItemUnitPrice(item);
                      return (
                        <div
                          key={`${item.product.slug}-${item.format}-ot`}
                          className="flex items-start gap-3 pb-3 border-b"
                          style={{ borderColor: "#EAE6DF" }}
                        >
                          <div
                            className="flex-shrink-0 flex items-center justify-center rounded overflow-hidden"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: `${item.product.accentColor}12`,
                              border: `1px solid ${item.product.accentColor}30`,
                            }}
                          >
                            <ProductThumb
                              slug={item.product.slug}
                              name={item.product.name}
                              dosage={dosageLabel}
                              category={item.product.category}
                              accentColor={item.product.accentColor}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate" style={{ color: "#010101" }}>
                              {item.product.name}
                            </h4>
                            <p className="text-xs" style={{ color: "#8A8075" }}>
                              {dosageLabel} · {item.format === "pen" ? "Pen" : "Vial"} · Qty {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-bold text-right" style={{ color: "#010101" }}>
                            ${(unitPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subscription items summary */}
                {subscriptionItems.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {hasSubscription && (
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8A8075" }}>
                        Monthly subscriptions
                      </p>
                    )}
                    {subscriptionItems.map((item) => {
                      const dosageLabel = item.selectedDosage?.size || item.product.size;
                      const cadenceLabel = getCadenceLabel(item.subscriptionCadence);
                      const unitPrice = getItemUnitPrice(item);
                      return (
                        <div
                          key={`${item.product.slug}-${item.format}-sub`}
                          className="flex items-start gap-3 pb-3 border-b"
                          style={{ borderColor: "#EAE6DF" }}
                        >
                          <div
                            className="flex-shrink-0 flex items-center justify-center rounded overflow-hidden"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: `${item.product.accentColor}12`,
                              border: `1px solid ${item.product.accentColor}30`,
                            }}
                          >
                            <ProductThumb
                              slug={item.product.slug}
                              name={item.product.name}
                              dosage={dosageLabel}
                              category={item.product.category}
                              accentColor={item.product.accentColor}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate" style={{ color: "#010101" }}>
                              {item.product.name}
                            </h4>
                            <p className="text-xs" style={{ color: "#8A8075" }}>
                              {dosageLabel} · {item.format === "pen" ? "Pen" : "Vial"} · Qty {item.quantity}
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: "#B8A44C" }}>
                              {cadenceLabel} · billed monthly
                            </p>
                          </div>
                          <div className="text-sm font-bold text-right" style={{ color: "#010101" }}>
                            ${(unitPrice * item.quantity).toFixed(2)}
                            <span className="block text-[10px] font-normal" style={{ color: "#8A8075" }}>
                              per month
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Included supplies */}
                {includedSupplies.length > 0 && (
                  <div className="mb-5 p-3 rounded" style={{ backgroundColor: "#B8A44C20" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#3A3A3A" }}>
                      Included with your order
                    </p>
                    <ul className="text-xs space-y-0.5" style={{ color: "#8A8075" }}>
                      {includedSupplies.map((gift, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="M8.5 2.5L3.75 7.5L1.5 5.25" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {gift}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Promo code */}
                <div className="mb-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="nex-input flex-1"
                      disabled={promoApplied}
                    />
                    <button
                      type="button"
                      onClick={handlePromoApply}
                      disabled={promoApplied || !promoCode.trim()}
                      className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-40"
                      style={{ borderColor: "#ECEAE4", color: "#555" }}
                    >
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-xs mt-1.5" style={{ color: "#B8A44C" }}>
                      Promo code applied — adjustment reflected at Stripe checkout.
                    </p>
                  )}
                </div>

                {/* Totals — dark panel */}
                <div
                  className="rounded-lg p-4 mb-5 space-y-2"
                  style={{ backgroundColor: "#1A1A18", border: "1px solid #2A2A28" }}
                >
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#8A8075" }}>Subtotal</span>
                    <span style={{ color: "#D8D4CC" }}>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#8A8075" }}>
                      Shipping
                      <span className="text-[11px] ml-1" style={{ color: "#666" }}>
                        ({selectedShipping.label})
                      </span>
                    </span>
                    <span style={{ color: shippingCost === 0 ? "#C4A265" : "#D8D4CC" }}>
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {hasSubscription && (
                    <p className="text-xs" style={{ color: "#666" }}>
                      * Subscription items billed monthly · one-time items billed today
                    </p>
                  )}
                  <div
                    className="pt-2 border-t flex justify-between items-end"
                    style={{ borderColor: "#2A2A28" }}
                  >
                    <span className="font-semibold" style={{ color: "#F9F9F9", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                      {hasSubscription ? "Billed today" : "Total"}
                    </span>
                    <span className="text-xl font-bold" style={{ color: "#C4A265", fontFamily: "var(--font-display)" }}>
                      ${(totalPrice + shippingCost).toFixed(2)}
                      {hasSubscription && (
                        <span className="block text-[11px] font-normal text-right" style={{ color: "#8A8075" }}>
                          then monthly per subscription
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { label: "TLS 1.3 Encrypted", icon: <Lock className="w-3.5 h-3.5" /> },
                    { label: "Lot-specific COA", icon: <FileCheck className="w-3.5 h-3.5" /> },
                    { label: "Cold-chain shipped", icon: <Snowflake className="w-3.5 h-3.5" /> },
                    { label: "Cancel anytime", icon: <RefreshCw className="w-3.5 h-3.5" /> },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px]"
                      style={{ backgroundColor: "#F5F3F0", color: "#555" }}
                    >
                      <span style={{ color: "#B8A44C" }} className="flex-shrink-0">{badge.icon}</span>
                      {badge.label}
                    </div>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 rounded text-sm" style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}>
                    {error}
                  </div>
                )}

                {/* RUO acknowledgement — required before placing an order */}
                <label
                  id="ruo-ack"
                  className="flex items-start gap-3 mb-4 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    backgroundColor: ruoAcknowledged ? "#B8A44C12" : "#F5F3F0",
                    border: `1px solid ${ruoAcknowledged ? "#B8A44C" : "#E5E2DB"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={ruoAcknowledged}
                    onChange={(e) => {
                      setRuoAcknowledged(e.target.checked);
                      if (e.target.checked) setError(null);
                    }}
                    className="mt-0.5 flex-shrink-0 w-4 h-4 cursor-pointer"
                    style={{ accentColor: "#B8A44C" }}
                  />
                  <span className="text-xs leading-relaxed" style={{ color: "#555" }}>
                    I confirm these compounds are purchased for qualified research use only,
                    and not for human consumption, therapeutic, or clinical use.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isProcessing || !formData.email || !ruoAcknowledged}
                  className="btn-acid w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Place Order · $${(totalPrice + shippingCost).toFixed(2)}`}
                </button>
                <p className="text-xs text-center mt-3" style={{ color: "#8A8075" }}>
                  {effectivePaymentMethod === "crypto"
                    ? `You’ll get a ${cryptoAsset} receiving address and order reference on the next screen.`
                    : "You’ll be redirected to Stripe to complete payment securely."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Use Only disclaimer above sticky checkout */}
      <div className="max-w-6xl mx-auto px-4 pb-24 lg:pb-12">
        <RUOBanner variant="card" />
      </div>

      {/* Mobile Sticky Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 border-t mobile-sticky-cta">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "#8A8075" }}>
              {hasSubscription ? "Billed today" : "Total"}
            </p>
            <p className="text-xl font-bold" style={{ color: "#010101" }}>
              ${(totalPrice + shippingCost).toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!formData.email) {
                const el = document.getElementById("checkout-email");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                el?.focus();
                return;
              }
              if (!ruoAcknowledged) {
                document
                  .getElementById("ruo-ack")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                setError("Please confirm the research-use-only acknowledgement to continue.");
                return;
              }
              handleCheckout();
            }}
            disabled={isProcessing}
            className="btn-acid flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
