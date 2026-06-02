"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type LookupState = "idle" | "loading" | "found" | "not_found" | "error";

interface OrderStatus {
  id: string;
  email: string;
  status: string;
  created: number;
  amount_total: number;
  currency: string;
  shipping?: {
    name?: string;
    address?: {
      line1?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
  payment_status?: string;
  items?: { name: string; qty: number; amount: number }[];
}

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  paid: { label: "Payment Confirmed", color: "#166534", bg: "#dcfce7", dot: "#22c55e" },
  complete: { label: "Fulfilled", color: "#1e3a5f", bg: "#dbeafe", dot: "#3b82f6" },
  open: { label: "Pending Payment", color: "#92400e", bg: "#fef3c7", dot: "#f59e0b" },
  expired: { label: "Expired", color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  unpaid: { label: "Unpaid", color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? { label: status, color: "#374151", bg: "#f3f4f6", dot: "#6b7280" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------
function fmtCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function fmtDate(unix: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(unix * 1000));
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [state, setState] = useState<LookupState>("idle");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !orderId.trim()) return;

    setState("loading");
    setOrder(null);
    setErrorMsg("");

    try {
      const res = await fetch(
        `https://nexphoria-checkout.chiya-b60.workers.dev/order?email=${encodeURIComponent(email.trim())}&session_id=${encodeURIComponent(orderId.trim())}`,
        { method: "GET" }
      );

      if (res.ok) {
        const data = (await res.json()) as OrderStatus;
        setOrder(data);
        setState("found");
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else if (res.status === 404) {
        setState("not_found");
      } else {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setErrorMsg(body.error || "Something went wrong");
        setState("error");
      }
    } catch {
      // Worker endpoint may not have /order yet — show the informational fallback
      setState("not_found");
    }
  }

  const ready = email.includes("@") && orderId.trim().length > 4;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAE7E3" }}>
      {/* ------------------------------------------------------------------ */}
      {/* Header band                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ backgroundColor: "#010101", paddingTop: "120px", paddingBottom: "56px" }}>
        <div className="max-w-3xl mx-auto px-6">
          <Breadcrumb items={[{label:"Home",href:"/"},{label:"My Orders"}]} variant="dark" className="mb-6" />
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
              style={{ backgroundColor: "rgba(164,176,138,0.15)" }}
            >
              {/* Package icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10" />
                <path d="M23 3H1l2 7h18l2-7z" />
                <path d="M12 3v7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-light mb-1.5" style={{ color: "#F9F9F9", letterSpacing: "-0.01em" }}>
                Order Lookup
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Track your research order status and shipment details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Lookup form card */}
        <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: "#F9F9F9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h2 className="text-base font-semibold mb-1.5" style={{ color: "#010101" }}>Look Up Your Order</h2>
          <p className="text-sm mb-7 leading-relaxed" style={{ color: "#7F7F7D" }}>
            Enter the email address used at checkout and your Stripe order confirmation ID. Both can be found in your confirmation email.
          </p>

          <form onSubmit={handleLookup} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "#7F7F7D" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="researcher@institution.edu"
                className="w-full px-4 py-3 text-sm rounded-lg border transition-colors"
                style={{
                  backgroundColor: "#F7F6F1",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#010101",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8A44C")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
              />
            </div>

            <div>
              <label htmlFor="orderId" className="block text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "#7F7F7D" }}>
                Order / Session ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="cs_live_..."
                className="w-full px-4 py-3 text-sm rounded-lg border transition-colors font-mono"
                style={{
                  backgroundColor: "#F7F6F1",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#010101",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8A44C")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
              />
              <p className="text-xs mt-1.5" style={{ color: "#B0ADA8" }}>
                Found in your confirmation email — starts with <code className="font-mono" style={{ color: "#7F7F7D" }}>cs_live_</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={!ready || state === "loading"}
              className="w-full py-3 px-6 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: ready && state !== "loading" ? "#010101" : "rgba(0,0,0,0.12)",
                color: ready && state !== "loading" ? "#F9F9F9" : "#9ca3af",
                cursor: ready && state !== "loading" ? "pointer" : "not-allowed",
              }}
            >
              {state === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: "#9ca3af", borderTopColor: "transparent" }} />
                  Looking up order...
                </span>
              ) : (
                "Look Up Order"
              )}
            </button>
          </form>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Result states                                                        */}
        {/* ------------------------------------------------------------------ */}
        <div ref={resultRef}>

          {/* NOT FOUND */}
          {state === "not_found" && (
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#F9F9F9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#fef3c7" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M11 8v3M11 15h.01" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#010101" }}>Order Not Found</h3>
              <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "#7F7F7D" }}>
                We couldn&apos;t find an order matching that email and ID. Double-check your confirmation email, or contact us and we&apos;ll track it down for you.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => { setState("idle"); setEmail(""); setOrderId(""); }}
                  className="px-5 py-2.5 text-sm rounded-lg font-medium border"
                  style={{ border: "1px solid rgba(0,0,0,0.15)", color: "#010101", backgroundColor: "transparent" }}
                >
                  Try Again
                </button>
                <Link href="/contact" className="px-5 py-2.5 text-sm rounded-lg font-medium" style={{ backgroundColor: "#010101", color: "#F9F9F9" }}>
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* ERROR */}
          {state === "error" && (
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: "#fff5f5", borderColor: "#fecaca" }}>
              <p className="text-sm font-medium" style={{ color: "#991b1b" }}>
                Something went wrong: {errorMsg}
              </p>
              <button
                onClick={() => setState("idle")}
                className="mt-3 text-sm underline"
                style={{ color: "#7F7F7D" }}
              >
                Try again
              </button>
            </div>
          )}

          {/* FOUND */}
          {state === "found" && order && (
            <OrderCard order={order} />
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Info strip                                                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ),
              title: "Check your email",
              desc: "Order confirmations, tracking numbers, and shipping updates come from Stripe and our fulfillment team.",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                </svg>
              ),
              title: "Cold-chain shipping",
              desc: "Peptide orders ship in insulated packaging with cold packs. Most orders are fulfilled within 1-2 business days.",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              ),
              title: "Need more help?",
              desc: (
                <>
                  Email{" "}
                  <a href="mailto:research@nexphoria.com" style={{ color: "#010101", fontWeight: 500 }}>
                    research@nexphoria.com
                  </a>{" "}
                  or use our{" "}
                  <Link href="/contact" style={{ color: "#010101", fontWeight: 500 }}>
                    contact form
                  </Link>
                  . We reply within 24 hours.
                </>
              ),
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-5" style={{ backgroundColor: "#F9F9F9", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(164,176,138,0.12)" }}>
                {item.icon}
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#010101", letterSpacing: "0.08em" }}>
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "#7F7F7D" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order result card
// ---------------------------------------------------------------------------
function OrderCard({ order }: { order: OrderStatus }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#F9F9F9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      {/* Top bar */}
      <div className="px-8 py-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div>
          <p className="text-xs uppercase tracking-widest mb-0.5 font-medium" style={{ color: "#B0ADA8", letterSpacing: "0.1em" }}>Order ID</p>
          <p className="text-sm font-mono font-medium" style={{ color: "#010101" }}>{order.id}</p>
        </div>
        <StatusBadge status={order.payment_status ?? order.status ?? "open"} />
      </div>

      <div className="px-8 py-6 grid sm:grid-cols-3 gap-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div>
          <p className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: "#B0ADA8", letterSpacing: "0.1em" }}>Order Date</p>
          <p className="text-sm font-medium" style={{ color: "#010101" }}>{fmtDate(order.created)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: "#B0ADA8", letterSpacing: "0.1em" }}>Total</p>
          <p className="text-sm font-medium" style={{ color: "#010101" }}>
            {order.amount_total != null ? fmtCurrency(order.amount_total, order.currency || "usd") : "—"}
          </p>
        </div>
        {order.shipping?.address && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: "#B0ADA8", letterSpacing: "0.1em" }}>Ship To</p>
            <p className="text-sm leading-snug" style={{ color: "#010101" }}>
              {order.shipping.name && <span className="block font-medium">{order.shipping.name}</span>}
              {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: "#B0ADA8", letterSpacing: "0.1em" }}>Items Ordered</p>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: "#F7F6F1" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: "#B8A44C", color: "#fff" }}>
                    {item.qty}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "#010101" }}>{item.name}</span>
                </div>
                <span className="text-sm tabular-nums" style={{ color: "#7F7F7D" }}>
                  {fmtCurrency(item.amount, "usd")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status notice */}
      <div className="px-8 py-5">
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(164,176,138,0.1)" }}>
          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "#7F7F7D" }}>
            Shipping updates and tracking numbers are sent to <strong style={{ color: "#010101" }}>{order.email}</strong> as your order is fulfilled. Cold-chain orders typically ship within 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
