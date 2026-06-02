/**
 * Deterministic mock data for the internal admin dashboard (demo / stakeholder
 * review only — no auth, no network). All figures are synthetic. A small seeded
 * PRNG keeps the dataset stable across renders and static builds so charts and
 * tables do not flicker between SSG and hydration.
 */

import { MOCK_PRODUCTS, type MockProduct } from "./mock-products";

// ---- Seeded PRNG (mulberry32) ----------------------------------------------
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x4e455850); // "NEXP"

function pick<T>(arr: readonly T[], r: number): T {
  return arr[Math.floor(r * arr.length) % arr.length];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ---- Revenue: 30 days ------------------------------------------------------
export interface RevenuePoint {
  date: string; // ISO date
  revenue: number;
  orders: number;
  rollingAvg7: number; // 7-day rolling average revenue
}

function buildRevenue(): RevenuePoint[] {
  const days = 30;
  const base = 6800;
  const raw: { date: string; revenue: number; orders: number }[] = [];
  const start = new Date("2026-05-04T00:00:00Z");
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const dow = d.getUTCDay();
    const weekendDrag = dow === 0 || dow === 6 ? 0.78 : 1;
    const trend = 1 + i * 0.012; // slow upward trend
    const noise = 0.82 + rand() * 0.42;
    const revenue = round2(base * weekendDrag * trend * noise);
    const aov = 198 + rand() * 60;
    raw.push({ date: d.toISOString().slice(0, 10), revenue, orders: Math.max(1, Math.round(revenue / aov)) });
  }
  return raw.map((pt, i) => {
    const windowSlice = raw.slice(Math.max(0, i - 6), i + 1);
    const rollingAvg7 = round2(windowSlice.reduce((s, p) => s + p.revenue, 0) / windowSlice.length);
    return { ...pt, rollingAvg7 };
  });
}

export const REVENUE_30D: RevenuePoint[] = buildRevenue();

// ---- KPIs ------------------------------------------------------------------
export interface Kpi {
  id: string;
  label: string;
  value: string;
  deltaPct: number; // vs prior period
  spark: number[]; // sparkline series
  intent: "good" | "bad" | "neutral";
}

function sparkFrom(seedShift: number, len = 14): number[] {
  const r = mulberry32(0x1234 + seedShift);
  let v = 40 + r() * 30;
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    v += (r() - 0.45) * 12;
    v = Math.max(8, Math.min(100, v));
    out.push(round2(v));
  }
  return out;
}

const revToday = REVENUE_30D[REVENUE_30D.length - 1].revenue;
const revWeek = REVENUE_30D.slice(-7).reduce((s, p) => s + p.revenue, 0);
const revMonth = REVENUE_30D.reduce((s, p) => s + p.revenue, 0);

export const KPIS: Kpi[] = [
  { id: "rev-today", label: "Revenue · today", value: `$${revToday.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, deltaPct: 6.4, spark: sparkFrom(1), intent: "good" },
  { id: "rev-week", label: "Revenue · 7-day", value: `$${revWeek.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, deltaPct: 9.1, spark: sparkFrom(2), intent: "good" },
  { id: "rev-month", label: "Revenue · 30-day", value: `$${revMonth.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, deltaPct: 12.7, spark: sparkFrom(3), intent: "good" },
  { id: "aov", label: "Average order value", value: "$216.40", deltaPct: 3.2, spark: sparkFrom(4), intent: "good" },
  { id: "cvr", label: "Conversion rate", value: "2.14%", deltaPct: 0.4, spark: sparkFrom(5), intent: "good" },
  { id: "sub-attach", label: "Subscription attach", value: "34.6%", deltaPct: 2.1, spark: sparkFrom(6), intent: "good" },
  { id: "refund", label: "Refund rate", value: "1.8%", deltaPct: -0.3, spark: sparkFrom(7), intent: "good" },
  { id: "coa-dl", label: "CoA download rate", value: "61.2%", deltaPct: 4.7, spark: sparkFrom(8), intent: "good" },
  { id: "new-cust", label: "New customers · 30-day", value: "418", deltaPct: 8.0, spark: sparkFrom(9), intent: "good" },
  { id: "churn", label: "Subscription churn", value: "4.3%", deltaPct: 0.6, spark: sparkFrom(10), intent: "bad" },
];

// ---- Funnel ----------------------------------------------------------------
export interface FunnelStage {
  id: string;
  label: string;
  count: number;
}

export const FUNNEL: FunnelStage[] = [
  { id: "visitor", label: "Visitors", count: 48200 },
  { id: "pdp", label: "Viewed PDP", count: 21840 },
  { id: "cart", label: "Added to cart", count: 7320 },
  { id: "checkout", label: "Reached checkout", count: 3180 },
  { id: "purchase", label: "Purchased", count: 1032 },
];

// ---- Orders ----------------------------------------------------------------
export type OrderStatus = "Paid" | "Processing" | "Shipped" | "Delivered" | "Refunded" | "Cancelled";

export interface AdminOrder {
  id: string;
  date: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: OrderStatus;
  subscription: boolean;
  channel: "Web" | "Wholesale" | "Phone";
}

const FIRST = ["Ava", "Liam", "Noah", "Mia", "Ethan", "Sofia", "Lucas", "Isla", "Mason", "Aria", "Leo", "Maya", "Owen", "Zoe", "Kai", "Nora", "Eli", "Ivy", "Jude", "Remy"];
const LAST = ["Okafor", "Nguyen", "Park", "Silva", "Haddad", "Kovac", "Mehta", "Larsen", "Rossi", "Tan", "Abara", "Voss", "Cohen", "Diaz", "Ueno", "Khan", "Bauer", "Reyes", "Frost", "Naidu"];
const STATUSES: OrderStatus[] = ["Paid", "Processing", "Shipped", "Delivered", "Refunded", "Cancelled"];
const STATUS_WEIGHTS = [0.18, 0.16, 0.2, 0.34, 0.06, 0.06];

function weightedStatus(r: number): OrderStatus {
  let acc = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    acc += STATUS_WEIGHTS[i];
    if (r <= acc) return STATUSES[i];
  }
  return "Paid";
}

function buildOrders(n: number): AdminOrder[] {
  const out: AdminOrder[] = [];
  for (let i = 0; i < n; i++) {
    const fn = pick(FIRST, rand());
    const ln = pick(LAST, rand());
    const items = 1 + Math.floor(rand() * 4);
    const total = round2(140 + rand() * 380);
    const dayOffset = Math.floor(rand() * 30);
    const d = new Date("2026-06-02T00:00:00Z").getTime() - dayOffset * 86400000;
    out.push({
      id: `NX-${(10248 + i).toString()}`,
      date: new Date(d).toISOString().slice(0, 10),
      customer: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@lab-${100 + i}.research`,
      items,
      total,
      status: weightedStatus(rand()),
      subscription: rand() < 0.35,
      channel: pick(["Web", "Web", "Web", "Wholesale", "Phone"] as const, rand()),
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const ORDERS: AdminOrder[] = buildOrders(50);

// ---- Customers -------------------------------------------------------------
export type CustomerTier = "Standard" | "Pro" | "Lab" | "Wholesale";
export type RuoStatus = "Verified" | "Pending" | "Flagged";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  ltv: number;
  tier: CustomerTier;
  ruo: RuoStatus;
  tags: string[];
  joined: string;
  subscribed: boolean;
}

const TAG_POOL = ["repeat", "high-aov", "subscriber", "wholesale", "at-risk", "new", "cold-chain", "coa-heavy"];
const TIERS: CustomerTier[] = ["Standard", "Pro", "Lab", "Wholesale"];
const RUOS: RuoStatus[] = ["Verified", "Verified", "Verified", "Pending", "Flagged"];

function buildCustomers(n: number): AdminCustomer[] {
  const out: AdminCustomer[] = [];
  for (let i = 0; i < n; i++) {
    const fn = pick(FIRST, rand());
    const ln = pick(LAST, rand());
    const orders = 1 + Math.floor(rand() * 18);
    const ltv = round2(orders * (160 + rand() * 220));
    const tagCount = 1 + Math.floor(rand() * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = pick(TAG_POOL, rand());
      if (!tags.includes(tag)) tags.push(tag);
    }
    const dayOffset = Math.floor(rand() * 400);
    const d = new Date("2026-06-02T00:00:00Z").getTime() - dayOffset * 86400000;
    out.push({
      id: `C-${(2048 + i).toString()}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@lab-${200 + i}.research`,
      orders,
      ltv,
      tier: pick(TIERS, rand()),
      ruo: pick(RUOS, rand()),
      tags,
      joined: new Date(d).toISOString().slice(0, 10),
      subscribed: rand() < 0.4,
    });
  }
  return out.sort((a, b) => b.ltv - a.ltv);
}

export const CUSTOMERS: AdminCustomer[] = buildCustomers(100);

// ---- Product / inventory rows (derived from real catalog) ------------------
export interface InventoryRow {
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderThreshold: number;
  unitsMonth: number; // units sold this month
  daysOfCover: number;
  expiry: string; // nearest lot expiry
  expiryWarn: boolean;
}

function buildInventory(): InventoryRow[] {
  return MOCK_PRODUCTS.map((p: MockProduct, i) => {
    const unitsMonth = 20 + Math.floor(rand() * 220);
    const dailyBurn = Math.max(0.5, unitsMonth / 30);
    const daysOfCover = Math.round(p.stock / dailyBurn);
    const reorderThreshold = Math.round(dailyBurn * 21); // 3-week buffer
    const expiryDays = 60 + Math.floor(rand() * 540);
    const expiryDate = new Date("2026-06-02T00:00:00Z").getTime() + expiryDays * 86400000;
    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      reorderThreshold,
      unitsMonth,
      daysOfCover,
      expiry: new Date(expiryDate).toISOString().slice(0, 10),
      expiryWarn: expiryDays < 120,
    };
  }).sort((a, b) => a.daysOfCover - b.daysOfCover);
}

export const INVENTORY: InventoryRow[] = buildInventory();

// ---- Products table (catalog + MoM units) ----------------------------------
export interface ProductRow {
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unitsMonth: number;
  unitsPrevMonth: number;
  momPct: number;
  rating: number;
}

export const PRODUCT_ROWS: ProductRow[] = MOCK_PRODUCTS.map((p, i) => {
  const unitsMonth = INVENTORY.find((r) => r.slug === p.slug)?.unitsMonth ?? 50;
  const unitsPrevMonth = Math.max(5, Math.round(unitsMonth * (0.7 + rand() * 0.6)));
  const momPct = round2(((unitsMonth - unitsPrevMonth) / unitsPrevMonth) * 100);
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    stock: p.stock,
    unitsMonth,
    unitsPrevMonth,
    momPct,
    rating: p.rating,
  };
}).sort((a, b) => b.unitsMonth - a.unitsMonth);

// ---- CoA approval queue ----------------------------------------------------
export type CoaStatus = "Pending" | "Approved" | "Rejected";

export interface CoaQueueItem {
  id: string;
  product: string;
  slug: string;
  lot: string;
  submitted: string;
  purity: string;
  method: string;
  analyst: string;
  status: CoaStatus;
}

function buildCoaQueue(): CoaQueueItem[] {
  const methods = ["HPLC-UV", "LC-MS", "HPLC-UV + MS", "MALDI-TOF"];
  const analysts = ["R. Okafor", "L. Nguyen", "S. Mehta", "A. Voss"];
  return MOCK_PRODUCTS.slice(0, 12).map((p, i) => {
    const submittedDays = Math.floor(rand() * 14);
    const d = new Date("2026-06-02T00:00:00Z").getTime() - submittedDays * 86400000;
    const purity = `${(98 + rand() * 1.9).toFixed(1)}%`;
    return {
      id: `COA-${(3001 + i).toString()}`,
      product: p.name,
      slug: p.slug,
      lot: `NX${(240500 + i * 37).toString()}`,
      submitted: new Date(d).toISOString().slice(0, 10),
      purity,
      method: pick(methods, rand()),
      analyst: pick(analysts, rand()),
      status: "Pending",
    };
  });
}

export const COA_QUEUE: CoaQueueItem[] = buildCoaQueue();

// ---- Cohort retention grid (12 weekly cohorts × 12 weeks) ------------------
export interface CohortRow {
  cohort: string; // e.g. "Wk of Mar 09"
  size: number;
  retention: (number | null)[]; // retention % by week index (null = future)
}

function buildCohorts(): CohortRow[] {
  const out: CohortRow[] = [];
  const weeks = 12;
  const start = new Date("2026-03-09T00:00:00Z");
  for (let c = 0; c < weeks; c++) {
    const cohortDate = new Date(start.getTime() + c * 7 * 86400000);
    const label = `Wk of ${cohortDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" })}`;
    const size = 220 + Math.floor(rand() * 180);
    const retention: (number | null)[] = [];
    const maxObservable = weeks - c; // later cohorts have fewer observed weeks
    let r = 100;
    for (let w = 0; w < weeks; w++) {
      if (w >= maxObservable) {
        retention.push(null);
        continue;
      }
      if (w === 0) {
        retention.push(100);
        continue;
      }
      // decay with mild floor and noise
      const decay = w === 1 ? 0.52 : 0.86 + rand() * 0.08;
      r = Math.max(14, round2(r * decay));
      retention.push(r);
    }
    out.push({ cohort: label, size, retention });
  }
  return out;
}

export const COHORTS: CohortRow[] = buildCohorts();

// ---- Reports list ----------------------------------------------------------
export interface ReportDef {
  id: string;
  name: string;
  description: string;
  rows: () => Record<string, string | number>[];
}

export const REPORTS: ReportDef[] = [
  {
    id: "orders",
    name: "Orders export",
    description: "All orders in the current window with status, channel, and totals.",
    rows: () => ORDERS.map((o) => ({ id: o.id, date: o.date, customer: o.customer, email: o.email, items: o.items, total: o.total, status: o.status, channel: o.channel, subscription: o.subscription ? "yes" : "no" })),
  },
  {
    id: "customers",
    name: "Customers (LTV) export",
    description: "Customer roster with lifetime value, tier, RUO status, and tags.",
    rows: () => CUSTOMERS.map((c) => ({ id: c.id, name: c.name, email: c.email, orders: c.orders, ltv: c.ltv, tier: c.tier, ruo: c.ruo, joined: c.joined, tags: c.tags.join("|") })),
  },
  {
    id: "inventory",
    name: "Inventory & reorder export",
    description: "Per-SKU stock, days of cover, reorder threshold, and nearest expiry.",
    rows: () => INVENTORY.map((r) => ({ slug: r.slug, name: r.name, category: r.category, stock: r.stock, reorderThreshold: r.reorderThreshold, daysOfCover: r.daysOfCover, unitsMonth: r.unitsMonth, expiry: r.expiry })),
  },
  {
    id: "revenue",
    name: "Revenue (30-day) export",
    description: "Daily revenue, order count, and 7-day rolling average.",
    rows: () => REVENUE_30D.map((p) => ({ date: p.date, revenue: p.revenue, orders: p.orders, rollingAvg7: p.rollingAvg7 })),
  },
  {
    id: "products",
    name: "Product performance export",
    description: "Catalog with month-over-month unit movement and rating.",
    rows: () => PRODUCT_ROWS.map((p) => ({ slug: p.slug, name: p.name, category: p.category, price: p.price, unitsMonth: p.unitsMonth, unitsPrevMonth: p.unitsPrevMonth, momPct: p.momPct, rating: p.rating })),
  },
];

/** Serialize report rows to a CSV string (RFC-4180-ish: quotes escaped). */
export function rowsToCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

// ---- Aggregate helpers -----------------------------------------------------
export function orderStatusCounts(): Record<OrderStatus, number> {
  const counts = { Paid: 0, Processing: 0, Shipped: 0, Delivered: 0, Refunded: 0, Cancelled: 0 } as Record<OrderStatus, number>;
  for (const o of ORDERS) counts[o.status]++;
  return counts;
}
