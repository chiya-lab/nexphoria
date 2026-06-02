"use client";

import { create } from "zustand";
import { MOCK_PRODUCTS, type MockProduct } from "./mock-products";

export type TimingSlot = "AM" | "PM" | "PWO";
export const TIMING_SLOTS: TimingSlot[] = ["AM", "PM", "PWO"];

export const TIMING_LABEL: Record<TimingSlot, string> = {
  AM: "Morning",
  PM: "Evening",
  PWO: "Post-workout",
};

export interface StackItem {
  slug: string;
  packQty: number; // 1 | 3 | 6
  dosePerDay: number; // µg/day, research-protocol planning figure
  slot: TimingSlot;
}

interface StackState {
  items: StackItem[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  reorder: (slugs: string[]) => void;
  setPackQty: (slug: string, qty: number) => void;
  setDose: (slug: string, dose: number) => void;
  setSlot: (slug: string, slot: TimingSlot) => void;
  clear: () => void;
  loadFromItems: (items: StackItem[]) => void;
}

const DEFAULT_DOSE = 250;

function defaultSlotFor(p: MockProduct | undefined): TimingSlot {
  if (!p) return "AM";
  if (p.goal.includes("GH Secretagogue")) return "PM";
  if (p.goal.includes("Tissue Repair")) return "PWO";
  return "AM";
}

export const useStackStore = create<StackState>((set, get) => ({
  items: [],
  add: (slug) => {
    if (get().items.some((i) => i.slug === slug)) return;
    const p = MOCK_PRODUCTS.find((m) => m.slug === slug);
    if (!p) return;
    set((s) => ({
      items: [...s.items, { slug, packQty: 1, dosePerDay: DEFAULT_DOSE, slot: defaultSlotFor(p) }],
    }));
  },
  remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
  has: (slug) => get().items.some((i) => i.slug === slug),
  reorder: (slugs) =>
    set((s) => {
      const bySlug = new Map(s.items.map((i) => [i.slug, i]));
      const next = slugs.map((sl) => bySlug.get(sl)).filter((i): i is StackItem => Boolean(i));
      return { items: next };
    }),
  setPackQty: (slug, qty) => set((s) => ({ items: s.items.map((i) => (i.slug === slug ? { ...i, packQty: qty } : i)) })),
  setDose: (slug, dose) =>
    set((s) => ({ items: s.items.map((i) => (i.slug === slug ? { ...i, dosePerDay: Math.max(0, dose) } : i)) })),
  setSlot: (slug, slot) => set((s) => ({ items: s.items.map((i) => (i.slug === slug ? { ...i, slot } : i)) })),
  clear: () => set({ items: [] }),
  loadFromItems: (items) => set({ items }),
}));

// ─── Pricing ────────────────────────────────────────────────────────────────

export interface StackPricing {
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  monthly: number;
}

function packPrice(p: MockProduct, qty: number): number {
  return p.packPrices.find((pp) => pp.qty === qty)?.price ?? p.price * qty;
}

/** 5% off at 3+ distinct compounds, 10% off at 5+. */
export function discountRateFor(itemCount: number): number {
  if (itemCount >= 5) return 0.1;
  if (itemCount >= 3) return 0.05;
  return 0;
}

export function priceStack(items: StackItem[]): StackPricing {
  const subtotal = items.reduce((sum, it) => {
    const p = MOCK_PRODUCTS.find((m) => m.slug === it.slug);
    return p ? sum + packPrice(p, it.packQty) : sum;
  }, 0);
  const discountRate = discountRateFor(items.length);
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;
  // Monthly estimate: a 1-vial pack ≈ 1 month of protocol; multi-vial packs amortize.
  const monthly = items.reduce((sum, it) => {
    const p = MOCK_PRODUCTS.find((m) => m.slug === it.slug);
    if (!p) return sum;
    return sum + packPrice(p, it.packQty) / it.packQty;
  }, 0);
  return {
    subtotal,
    discountRate,
    discountAmount,
    total,
    monthly: Math.round(monthly * (1 - discountRate)),
  };
}

// ─── URL serialization ────────────────────────────────────────────────────────
// Encodes each item as slug:packQty:dose:slot, joined by commas, under ?stack=

export function encodeStack(items: StackItem[]): string {
  return items.map((i) => `${i.slug}:${i.packQty}:${i.dosePerDay}:${i.slot}`).join(",");
}

export function decodeStack(raw: string | null): StackItem[] {
  if (!raw) return [];
  const out: StackItem[] = [];
  for (const token of raw.split(",")) {
    const [slug, qtyStr, doseStr, slotStr] = token.split(":");
    if (!slug || !MOCK_PRODUCTS.some((m) => m.slug === slug)) continue;
    if (out.some((i) => i.slug === slug)) continue;
    const packQty = [1, 3, 6].includes(Number(qtyStr)) ? Number(qtyStr) : 1;
    const dosePerDay = Number.isFinite(Number(doseStr)) ? Math.max(0, Number(doseStr)) : DEFAULT_DOSE;
    const slot = (TIMING_SLOTS as string[]).includes(slotStr) ? (slotStr as TimingSlot) : "AM";
    out.push({ slug, packQty, dosePerDay, slot });
  }
  return out;
}
