/**
 * Deterministic mock data for the affiliate / influencer dashboard and admin
 * queue (demo / stakeholder review only — no auth, no network). All figures are
 * synthetic and illustrative. A seeded PRNG keeps the dataset stable across SSG
 * and hydration so charts and tables do not flicker. Research use only.
 */

import { AFFILIATE_TIERS, type AffiliateTier } from "./affiliateTiers";

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

const rand = mulberry32(0x41464649); // "AFFI"

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ---- Current affiliate user ------------------------------------------------
export interface AffiliateUser {
  handle: string;
  displayName: string;
  tier: AffiliateTier;
  referralCode: string;
  joined: string; // ISO date
  payoutMethod: "ACH" | "PayPal" | "Wire" | "USDC";
  taxDocStatus: "verified" | "pending" | "missing";
}

export const AFFILIATE_USER: AffiliateUser = {
  handle: "researcher-2218",
  displayName: "Your account",
  tier: AFFILIATE_TIERS[1], // Creator
  referralCode: "BENCH20",
  joined: "2026-01-14",
  payoutMethod: "ACH",
  taxDocStatus: "verified",
};

// ---- 90-day daily activity -------------------------------------------------
export interface DailyStat {
  date: string; // ISO date
  clicks: number;
  conversions: number;
  earnings: number;
}

function buildDaily(): DailyStat[] {
  const days = 90;
  const start = new Date("2026-03-04T00:00:00Z");
  const out: DailyStat[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const dow = d.getUTCDay();
    const weekendDrag = dow === 0 || dow === 6 ? 0.7 : 1;
    const trend = 1 + i * 0.006;
    const clicks = Math.max(2, Math.round((14 + rand() * 38) * weekendDrag * trend));
    const cr = 0.04 + rand() * 0.06;
    const conversions = Math.max(0, Math.round(clicks * cr));
    const aov = 188 + rand() * 70;
    const earnings = round2(conversions * aov * (AFFILIATE_USER.tier.commission / 100));
    out.push({ date: d.toISOString().slice(0, 10), clicks, conversions, earnings });
  }
  return out;
}

export const DAILY_90D: DailyStat[] = buildDaily();

// ---- Derived KPIs ----------------------------------------------------------
export interface AffiliateKpis {
  lifetimeEarnings: number;
  mtdEarnings: number;
  clicks30d: number;
  conversions30d: number;
  conversionRate: number; // percent
  aovReferred: number;
  nextPayoutDate: string;
  nextPayoutAmount: number;
}

function buildKpis(): AffiliateKpis {
  const last30 = DAILY_90D.slice(-30);
  const clicks30d = last30.reduce((s, d) => s + d.clicks, 0);
  const conversions30d = last30.reduce((s, d) => s + d.conversions, 0);
  const lifetimeEarnings = round2(DAILY_90D.reduce((s, d) => s + d.earnings, 0) + 1840.5);
  // Month-to-date: entries in the latest calendar month present in the data.
  const lastDate = DAILY_90D[DAILY_90D.length - 1].date;
  const month = lastDate.slice(0, 7);
  const mtdEarnings = round2(
    DAILY_90D.filter((d) => d.date.startsWith(month)).reduce((s, d) => s + d.earnings, 0),
  );
  const referredRevenue = last30.reduce((s, d) => s + d.conversions, 0);
  const aovReferred = round2(206 + rand() * 24);
  return {
    lifetimeEarnings,
    mtdEarnings,
    clicks30d,
    conversions30d,
    conversionRate: clicks30d ? round2((conversions30d / clicks30d) * 100) : 0,
    aovReferred,
    nextPayoutDate: "2026-07-01",
    nextPayoutAmount: round2(mtdEarnings + 142.4 * (referredRevenue > 0 ? 1 : 1)),
  };
}

export const AFFILIATE_KPIS: AffiliateKpis = buildKpis();

// ---- Activity feed ---------------------------------------------------------
export interface ActivityItem {
  id: string;
  kind: "conversion" | "click" | "payout" | "tier";
  label: string;
  detail: string;
  when: string; // relative label
}

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: "a1", kind: "conversion", label: "Conversion", detail: "BPC-157 5mg · $14.40 commission", when: "2h ago" },
  { id: "a2", kind: "conversion", label: "Conversion", detail: "TB-500 signature box · $70.00 commission", when: "6h ago" },
  { id: "a3", kind: "click", label: "Link click", detail: "nxph.io/r/BENCH20 from YouTube", when: "9h ago" },
  { id: "a4", kind: "conversion", label: "Conversion", detail: "GHK-Cu 50mg · $11.20 commission", when: "yesterday" },
  { id: "a5", kind: "payout", label: "Payout sent", detail: "ACH · $612.80 cleared", when: "3 days ago" },
  { id: "a6", kind: "tier", label: "Tier review", detail: "Creator tier maintained (8 sales MTD)", when: "5 days ago" },
  { id: "a7", kind: "click", label: "Link click", detail: "nxph.io/r/BENCH20 from X", when: "6 days ago" },
];

// ---- Saved links -----------------------------------------------------------
export interface SavedLink {
  id: string;
  label: string;
  sku: string;
  code: string;
  clicks: number;
  conversions: number;
  created: string;
}

const LINK_SKUS: { label: string; sku: string }[] = [
  { label: "BPC-157 5mg", sku: "bpc157-5mg" },
  { label: "TB-500 5mg", sku: "tb500-5mg" },
  { label: "GHK-Cu 50mg", sku: "ghkcu-50mg" },
  { label: "Recovery 90 protocol", sku: "protocol-recovery90" },
  { label: "Semaglutide 5mg", sku: "sema-5mg" },
  { label: "Ipamorelin 5mg", sku: "ipa-5mg" },
  { label: "CJC-1295 5mg", sku: "cjc1295-5mg" },
  { label: "Epithalon 10mg", sku: "epi-10mg" },
  { label: "Catalog — all compounds", sku: "catalog" },
  { label: "Longevity bundle", sku: "bundle-longevity" },
  { label: "Tesamorelin 5mg", sku: "tesa-5mg" },
  { label: "MOTS-c 10mg", sku: "motsc-10mg" },
];

function buildLinks(): SavedLink[] {
  return LINK_SKUS.map((s, i) => {
    const clicks = Math.round(40 + rand() * 460);
    const conversions = Math.round(clicks * (0.03 + rand() * 0.07));
    const day = 4 + Math.floor(rand() * 24);
    return {
      id: `link-${i + 1}`,
      label: s.label,
      sku: s.sku,
      code: AFFILIATE_USER.referralCode,
      clicks,
      conversions,
      created: `2026-0${1 + (i % 5)}-${String(day).padStart(2, "0")}`,
    };
  });
}

export const SAVED_LINKS: SavedLink[] = buildLinks();

export function buildReferralUrl(sku: string, code = AFFILIATE_USER.referralCode): string {
  const base = `https://nxph.io/r/${code}`;
  return sku && sku !== "catalog" ? `${base}?p=${sku}` : base;
}

// ---- Leaderboard (anonymized) ----------------------------------------------
export interface LeaderboardRow {
  rank: number;
  alias: string;
  tier: string;
  mtdSales: number;
  mtdEarnings: number;
  isCurrentUser?: boolean;
}

function buildLeaderboard(): LeaderboardRow[] {
  const rows: LeaderboardRow[] = [];
  let sales = 84;
  for (let i = 0; i < 20; i++) {
    sales = Math.max(6, Math.round(sales * (0.82 + rand() * 0.12)));
    const tier =
      sales >= 50 ? "Elite" : sales >= 20 ? "Pro" : sales >= 5 ? "Creator" : "Researcher";
    const aov = 198 + rand() * 40;
    const commission = tier === "Elite" ? 0.3 : tier === "Pro" ? 0.25 : tier === "Creator" ? 0.2 : 0.15;
    rows.push({
      rank: i + 1,
      alias: `Researcher #${1000 + Math.floor(rand() * 8000)}`,
      tier,
      mtdSales: sales,
      mtdEarnings: round2(sales * aov * commission),
    });
  }
  // Inject current user at rank 7.
  rows[6] = {
    ...rows[6],
    alias: "Researcher #2218 (you)",
    tier: "Creator",
    isCurrentUser: true,
  };
  return rows;
}

export const LEADERBOARD: LeaderboardRow[] = buildLeaderboard();

// ---- Payouts ---------------------------------------------------------------
export interface Payout {
  id: string;
  period: string;
  amount: number;
  method: string;
  status: "paid" | "scheduled" | "processing";
  date: string;
}

export const PAYOUTS: Payout[] = [
  { id: "po-8", period: "Jun 2026 (MTD)", amount: round2(AFFILIATE_KPIS.mtdEarnings), method: "ACH", status: "scheduled", date: "2026-07-01" },
  { id: "po-7", period: "May 2026", amount: 612.8, method: "ACH", status: "paid", date: "2026-06-01" },
  { id: "po-6", period: "Apr 2026", amount: 489.2, method: "ACH", status: "paid", date: "2026-05-01" },
  { id: "po-5", period: "Mar 2026", amount: 731.5, method: "ACH", status: "paid", date: "2026-04-01" },
  { id: "po-4", period: "Feb 2026", amount: 358.0, method: "PayPal", status: "paid", date: "2026-03-01" },
  { id: "po-3", period: "Jan 2026", amount: 204.6, method: "PayPal", status: "paid", date: "2026-02-01" },
  { id: "po-2", period: "Dec 2025", amount: 142.4, method: "PayPal", status: "paid", date: "2026-01-01" },
  { id: "po-1", period: "Nov 2025", amount: 96.0, method: "PayPal", status: "paid", date: "2025-12-01" },
];

// ---- Admin: applicants -----------------------------------------------------
export interface Applicant {
  id: string;
  name: string;
  platform: string;
  audience: string;
  focus: string;
  submitted: string;
  status: "pending" | "approved" | "rejected" | "suspended";
}

export const APPLICANTS: Applicant[] = [
  { id: "ap-101", name: "lab.notes", platform: "YouTube", audience: "42.1k", focus: "Technical reviews", submitted: "2026-05-29", status: "pending" },
  { id: "ap-102", name: "peptide.protocols", platform: "Instagram", audience: "18.6k", focus: "Reconstitution guides", submitted: "2026-05-28", status: "pending" },
  { id: "ap-103", name: "the_bench_files", platform: "X", audience: "9.3k", focus: "Research literature", submitted: "2026-05-27", status: "pending" },
  { id: "ap-104", name: "longevity.log", platform: "Podcast", audience: "6.0k", focus: "Longevity science", submitted: "2026-05-25", status: "approved" },
  { id: "ap-105", name: "molcast", platform: "TikTok", audience: "120k", focus: "Explainer content", submitted: "2026-05-24", status: "approved" },
  { id: "ap-106", name: "rawgains", platform: "Instagram", audience: "55k", focus: "Fitness (off-brand)", submitted: "2026-05-22", status: "rejected" },
  { id: "ap-107", name: "coa.reader", platform: "Blog", audience: "3.4k", focus: "COA breakdowns", submitted: "2026-05-20", status: "approved" },
  { id: "ap-108", name: "fastclaims", platform: "TikTok", audience: "210k", focus: "Medical claims (flagged)", submitted: "2026-05-18", status: "suspended" },
];

// ---- Admin: active affiliates ----------------------------------------------
export interface ActiveAffiliate {
  id: string;
  alias: string;
  tier: string;
  customCode: string;
  mtd: number;
  lifetime: number;
}

export const ACTIVE_AFFILIATES: ActiveAffiliate[] = [
  { id: "af-1", alias: "molcast", tier: "Elite", customCode: "MOLCAST", mtd: 4820.5, lifetime: 38210.0 },
  { id: "af-2", alias: "lab.notes", tier: "Pro", customCode: "LABNOTES", mtd: 2140.0, lifetime: 18950.4 },
  { id: "af-3", alias: "longevity.log", tier: "Pro", customCode: "LONGLOG", mtd: 1880.2, lifetime: 12400.0 },
  { id: "af-4", alias: "peptide.protocols", tier: "Creator", customCode: "PROTOCOL", mtd: 940.0, lifetime: 6120.8 },
  { id: "af-5", alias: "coa.reader", tier: "Creator", customCode: "COAREAD", mtd: 612.8, lifetime: 4180.0 },
  { id: "af-6", alias: "the_bench_files", tier: "Researcher", customCode: "—", mtd: 204.6, lifetime: 880.0 },
];

// ---- Admin: fraud signals --------------------------------------------------
export interface FraudSignal {
  id: string;
  affiliate: string;
  signal: string;
  severity: "low" | "medium" | "high";
  detected: string;
}

export const FRAUD_SIGNALS: FraudSignal[] = [
  { id: "fr-1", affiliate: "fastclaims", signal: "Repeated self-referral from single IP block", severity: "high", detected: "2026-05-30" },
  { id: "fr-2", affiliate: "rawgains", signal: "Promotion used prohibited before/after imagery", severity: "high", detected: "2026-05-29" },
  { id: "fr-3", affiliate: "the_bench_files", signal: "Click velocity spike with 0% conversion", severity: "medium", detected: "2026-05-28" },
  { id: "fr-4", affiliate: "peptide.protocols", signal: "Coupon stacking with expired promo", severity: "low", detected: "2026-05-26" },
  { id: "fr-5", affiliate: "coa.reader", signal: "Cookie-stuffing pattern flagged for review", severity: "medium", detected: "2026-05-24" },
];
