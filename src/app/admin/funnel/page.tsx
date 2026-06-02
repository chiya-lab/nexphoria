"use client";

import { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  ArrowDown,
  BarChart2,
  RefreshCw,
  Calendar,
  Zap,
  Award,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelStage {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  count: number;
  prev: number | null;
  target: number;
  color: string;
  bgColor: string;
}

interface TopProduct {
  name: string;
  views: number;
  cartRate: number;
  convRate: number;
}

// ─── Data Sets ────────────────────────────────────────────────────────────────

const PERIODS = ["Today", "7 Days", "30 Days", "90 Days"] as const;
type Period = (typeof PERIODS)[number];

const DATA: Record<Period, FunnelStage[]> = {
  Today: [
    { id: "visit", label: "Site Visits", sublabel: "Unique sessions", icon: <Users size={18} />, count: 412, prev: null, target: 500, color: "#7A6B2A", bgColor: "#FAF6F0" },
    { id: "product_view", label: "Product Views", sublabel: "Catalog & detail pages", icon: <Eye size={18} />, count: 198, prev: 412, target: 250, color: "#7A9E87", bgColor: "#F0F5F1" },
    { id: "add_to_cart", label: "Add to Cart", sublabel: "Items added", icon: <ShoppingCart size={18} />, count: 74, prev: 198, target: 90, color: "#5B8FA8", bgColor: "#F0F4F7" },
    { id: "checkout", label: "Checkout Started", sublabel: "Checkout sessions", icon: <CreditCard size={18} />, count: 38, prev: 74, target: 45, color: "#8B6BB1", bgColor: "#F4F1F8" },
    { id: "purchase", label: "Purchase", sublabel: "Completed orders", icon: <CheckCircle size={18} />, count: 21, prev: 38, target: 28, color: "#4CAF7D", bgColor: "#F0F8F3" },
  ],
  "7 Days": [
    { id: "visit", label: "Site Visits", sublabel: "Unique sessions", icon: <Users size={18} />, count: 2941, prev: null, target: 3500, color: "#7A6B2A", bgColor: "#FAF6F0" },
    { id: "product_view", label: "Product Views", sublabel: "Catalog & detail pages", icon: <Eye size={18} />, count: 1389, prev: 2941, target: 1750, color: "#7A9E87", bgColor: "#F0F5F1" },
    { id: "add_to_cart", label: "Add to Cart", sublabel: "Items added", icon: <ShoppingCart size={18} />, count: 521, prev: 1389, target: 630, color: "#5B8FA8", bgColor: "#F0F4F7" },
    { id: "checkout", label: "Checkout Started", sublabel: "Checkout sessions", icon: <CreditCard size={18} />, count: 267, prev: 521, target: 315, color: "#8B6BB1", bgColor: "#F4F1F8" },
    { id: "purchase", label: "Purchase", sublabel: "Completed orders", icon: <CheckCircle size={18} />, count: 148, prev: 267, target: 196, color: "#4CAF7D", bgColor: "#F0F8F3" },
  ],
  "30 Days": [
    { id: "visit", label: "Site Visits", sublabel: "Unique sessions", icon: <Users size={18} />, count: 12804, prev: null, target: 15000, color: "#7A6B2A", bgColor: "#FAF6F0" },
    { id: "product_view", label: "Product Views", sublabel: "Catalog & detail pages", icon: <Eye size={18} />, count: 6102, prev: 12804, target: 7500, color: "#7A9E87", bgColor: "#F0F5F1" },
    { id: "add_to_cart", label: "Add to Cart", sublabel: "Items added", icon: <ShoppingCart size={18} />, count: 2287, prev: 6102, target: 2700, color: "#5B8FA8", bgColor: "#F0F4F7" },
    { id: "checkout", label: "Checkout Started", sublabel: "Checkout sessions", icon: <CreditCard size={18} />, count: 1171, prev: 2287, target: 1350, color: "#8B6BB1", bgColor: "#F4F1F8" },
    { id: "purchase", label: "Purchase", sublabel: "Completed orders", icon: <CheckCircle size={18} />, count: 648, prev: 1171, target: 810, color: "#4CAF7D", bgColor: "#F0F8F3" },
  ],
  "90 Days": [
    { id: "visit", label: "Site Visits", sublabel: "Unique sessions", icon: <Users size={18} />, count: 38210, prev: null, target: 45000, color: "#7A6B2A", bgColor: "#FAF6F0" },
    { id: "product_view", label: "Product Views", sublabel: "Catalog & detail pages", icon: <Eye size={18} />, count: 18340, prev: 38210, target: 22500, color: "#7A9E87", bgColor: "#F0F5F1" },
    { id: "add_to_cart", label: "Add to Cart", sublabel: "Items added", icon: <ShoppingCart size={18} />, count: 6874, prev: 18340, target: 8100, color: "#5B8FA8", bgColor: "#F0F4F7" },
    { id: "checkout", label: "Checkout Started", sublabel: "Checkout sessions", icon: <CreditCard size={18} />, count: 3519, prev: 6874, target: 4050, color: "#8B6BB1", bgColor: "#F4F1F8" },
    { id: "purchase", label: "Purchase", sublabel: "Completed orders", icon: <CheckCircle size={18} />, count: 1944, prev: 3519, target: 2430, color: "#4CAF7D", bgColor: "#F0F8F3" },
  ],
};

const TOP_PRODUCTS: TopProduct[] = [
  { name: "BPC-157", views: 3847, cartRate: 18.4, convRate: 9.2 },
  { name: "Tirzepatide", views: 2901, cartRate: 22.1, convRate: 11.7 },
  { name: "Semaglutide", views: 2714, cartRate: 20.8, convRate: 10.4 },
  { name: "TB-500", views: 1983, cartRate: 15.6, convRate: 7.8 },
  { name: "CJC-1295", views: 1647, cartRate: 14.2, convRate: 6.9 },
  { name: "Ipamorelin", views: 1429, cartRate: 13.1, convRate: 6.2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function pct(n: number, of: number) {
  return ((n / of) * 100).toFixed(1) + "%";
}

function dropPct(n: number, of: number) {
  return (((of - n) / of) * 100).toFixed(1) + "%";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  trend,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down" | "neutral";
  color: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #EBEBEB",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#737373" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.75rem", fontWeight: 600, color: "#111", fontFamily: "var(--font-display)" }}>
          {value}
        </span>
        {trend === "up" && <TrendingUp size={16} color="#4CAF7D" />}
        {trend === "down" && <TrendingDown size={16} color="#E05252" />}
      </div>
      <span style={{ fontSize: "0.78rem", color: "#666666" }}>{sub}</span>
      <div style={{ height: 3, background: "#F0F0F0", borderRadius: 2, marginTop: 4 }}>
        <div style={{ height: "100%", width: "60%", background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function FunnelBar({
  stage,
  topCount,
  isLast,
}: {
  stage: FunnelStage;
  topCount: number;
  isLast: boolean;
}) {
  const width = Math.max(20, (stage.count / topCount) * 100);
  const convFromTop = pct(stage.count, topCount);
  const dropFromPrev = stage.prev !== null ? dropPct(stage.count, stage.prev) : null;
  const stageConv = stage.prev !== null ? pct(stage.count, stage.prev) : null;
  const targetPct = Math.min(100, (stage.count / stage.target) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Stage row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr auto",
          alignItems: "center",
          gap: 16,
          padding: "14px 20px",
          background: stage.bgColor,
          borderRadius: 10,
          border: `1px solid ${stage.color}22`,
        }}
      >
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: stage.color + "18",
              color: stage.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {stage.icon}
          </span>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111" }}>{stage.label}</div>
            <div style={{ fontSize: "0.7rem", color: "#999", marginTop: 1 }}>{stage.sublabel}</div>
          </div>
        </div>

        {/* Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                flex: 1,
                height: 10,
                background: "#E8E5DF",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${width}%`,
                  background: stage.color,
                  borderRadius: 99,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "#666666", minWidth: 38 }}>{convFromTop}</span>
          </div>
          {/* Target progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                flex: 1,
                height: 3,
                background: "#E8E5DF",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${targetPct}%`,
                  background: targetPct >= 100 ? "#4CAF7D" : stage.color + "88",
                  borderRadius: 99,
                }}
              />
            </div>
            <span style={{ fontSize: "0.65rem", color: "#BBB", minWidth: 38 }}>
              {targetPct.toFixed(0)}% goal
            </span>
          </div>
        </div>

        {/* Count */}
        <div style={{ textAlign: "right", minWidth: 80 }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", fontFamily: "var(--font-display)" }}>
            {fmt(stage.count)}
          </div>
          {stageConv && (
            <div style={{ fontSize: "0.7rem", color: stage.color, fontWeight: 500 }}>
              {stageConv} pass-through
            </div>
          )}
        </div>
      </div>

      {/* Drop connector */}
      {!isLast && dropFromPrev && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 20px 6px 36px",
            color: "#E05252",
          }}
        >
          <ArrowDown size={14} />
          <span style={{ fontSize: "0.72rem", color: "#E05252", fontWeight: 500 }}>
            {dropFromPrev} drop-off
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FunnelDashboardPage() {
  const [period, setPeriod] = useState<Period>("30 Days");
  const stages = DATA[period];
  const visits = stages[0].count;
  const purchases = stages[4].count;
  const cartAdds = stages[2].count;
  const checkouts = stages[3].count;

  const overallConv = ((purchases / visits) * 100).toFixed(2) + "%";
  const cartAbandon = (((checkouts - purchases) / checkouts) * 100).toFixed(1) + "%";
  const avgOrderValue = "$248";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: "var(--font-inter, sans-serif)" }}>
      {/* Header */}
      <div style={{ background: "#0A0A0A", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BarChart2 size={20} color="#B8A44C" />
          <span style={{ color: "#FFFFFF", fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, letterSpacing: "0.04em" }}>
            Nexphoria / Conversion Funnel
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCw size={14} color="#666" />
          <span style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em" }}>
            LIVE · Updated just now
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Period picker */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 600, fontFamily: "var(--font-display)", color: "#111", marginBottom: 4 }}>
              Conversion Funnel
            </h1>
            <p style={{ fontSize: "0.8rem", color: "#999" }}>End-to-end visitor → purchase journey</p>
          </div>
          <div style={{ display: "flex", gap: 6, background: "#FFFFFF", border: "1px solid #E8E5DF", borderRadius: 10, padding: 4 }}>
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: period === p ? 600 : 400,
                  background: period === p ? "#0A0A0A" : "transparent",
                  color: period === p ? "#FFFFFF" : "#666",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {p === period && <Calendar size={11} />}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard
            label="Overall Conversion"
            value={overallConv}
            sub={`${fmt(visits)} visits → ${fmt(purchases)} orders`}
            trend="up"
            color="#4CAF7D"
          />
          <StatCard
            label="Cart Abandonment"
            value={cartAbandon}
            sub={`${fmt(checkouts - purchases)} abandoned at checkout`}
            trend="down"
            color="#E05252"
          />
          <StatCard
            label="Avg Order Value"
            value={avgOrderValue}
            sub="Per completed purchase"
            trend="up"
            color="#B8A44C"
          />
          <StatCard
            label="Cart-to-Checkout"
            value={pct(checkouts, cartAdds)}
            sub={`${fmt(cartAdds)} carts → ${fmt(checkouts)} checkouts`}
            trend="neutral"
            color="#5B8FA8"
          />
        </div>

        {/* Main funnel */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E5DF",
            borderRadius: 14,
            padding: "28px",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111", letterSpacing: "0.04em" }}>
              Funnel Stages
            </h2>
            <span style={{ fontSize: "0.7rem", color: "#737373", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {period}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stages.map((stage, i) => (
              <FunnelBar
                key={stage.id}
                stage={stage}
                topCount={visits}
                isLast={i === stages.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Bottom row: Products + Insights */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

          {/* Top products by conversion */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E5DF",
              borderRadius: 14,
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111", marginBottom: 16, letterSpacing: "0.04em" }}>
              Top Products by Conversion
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 80px 80px",
                  gap: 8,
                  paddingBottom: 8,
                  borderBottom: "1px solid #F0EDEA",
                }}
              >
                {["Product", "Views", "→ Cart", "→ Buy"].map((h) => (
                  <span key={h} style={{ fontSize: "0.65rem", color: "#737373", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    {h}
                  </span>
                ))}
              </div>
              {TOP_PRODUCTS.map((p) => (
                <div
                  key={p.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 80px 80px",
                    gap: 8,
                    alignItems: "center",
                    padding: "6px 0",
                  }}
                >
                  <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#222" }}>{p.name}</span>
                  <span style={{ fontSize: "0.78rem", color: "#666" }}>{fmt(p.views)}</span>
                  <span style={{ fontSize: "0.78rem", color: "#5B8FA8", fontWeight: 500 }}>
                    {p.cartRate.toFixed(1)}%
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#4CAF7D", fontWeight: 600 }}>
                    {p.convRate.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E5DF",
              borderRadius: 14,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111", letterSpacing: "0.04em" }}>
              Funnel Insights
            </h2>
            {[
              {
                icon: <TrendingDown size={16} />,
                color: "#E05252",
                bg: "#FEF2F2",
                title: "Biggest drop: Product View → Cart",
                body: `Only ${pct(stages[2].count, stages[1].count)} of product viewers add to cart. A/B test the vial product page CTA.`,
              },
              {
                icon: <Zap size={16} />,
                color: "#7A6B2A",
                bg: "#FAF6F0",
                title: "Checkout abandonment opportunity",
                body: `${cartAbandon} of initiated checkouts don't complete. Consider exit-intent + abandoned cart email sequence.`,
              },
              {
                icon: <Award size={16} />,
                color: "#4CAF7D",
                bg: "#F0F8F3",
                title: "Tirzepatide leads in conversion",
                body: "22.1% cart rate, 11.7% purchase rate — highest of all compounds. Prioritize in ads and homepage.",
              },
              {
                icon: <TrendingUp size={16} />,
                color: "#5B8FA8",
                bg: "#F0F4F7",
                title: "Visit → Product view is healthy",
                body: `${pct(stages[1].count, visits)} of visitors browse products. SEO and content strategy working.`,
              },
            ].map((ins) => (
              <div
                key={ins.title}
                style={{
                  background: ins.bg,
                  borderRadius: 10,
                  padding: "12px 14px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ flexShrink: 0, color: ins.color, marginTop: 1 }}>{ins.icon}</span>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: ins.color, marginBottom: 3 }}>
                    {ins.title}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#666", lineHeight: 1.5 }}>{ins.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", color: "#737373", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Internal analytics — not for customer view · Nexphoria Admin
          </p>
        </div>
      </div>
    </div>
  );
}
