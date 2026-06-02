/**
 * Supplemental PDP spec + stock data.
 *
 * The canonical `Product` (src/lib/products.ts) carries MW, sequence, CAS,
 * purity, storage, etc. The PDP also surfaces lot number, manufactured /
 * expiration dates, and a live-stock figure that the base record does not
 * model. Rather than invent these at render time (which would shift between
 * builds and break static export determinism), they are derived from the slug
 * so every build produces identical, stable output.
 */
import type { Product } from "./products";

export type StockLevel = "in-stock" | "low" | "restocking";

export interface PdpStock {
  level: StockLevel;
  units: number;
  label: string;
  restockDate?: string;
}

export interface PdpSupplement {
  lot: string;
  manufactured: string;
  expiration: string;
  form: string;
  packSize: string;
  stock: PdpStock;
}

// Small deterministic hash so derived values are stable per slug.
function slugSeed(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function deriveStock(seed: number): PdpStock {
  const bucket = seed % 10;
  if (bucket === 0) {
    return { level: "restocking", units: 0, label: "Restocking 6/12", restockDate: "6/12" };
  }
  if (bucket <= 2) {
    const units = 4 + (seed % 4); // 4–7
    return { level: "low", units, label: `Low — ${units} left` };
  }
  const units = 18 + (seed % 18); // 18–35
  return { level: "in-stock", units, label: `In stock — ${units} units` };
}

export function getPdpSupplement(product: Product): PdpSupplement {
  const seed = slugSeed(product.slug);
  const lotSuffix = (seed % 9000) + 1000;
  const mfgMonth = (seed % 6) + 1; // Jan–Jun 2026
  const expYear = 2028;
  return {
    lot: `NX-${product.slug.slice(0, 3).toUpperCase()}-${lotSuffix}`,
    manufactured: `2026-0${mfgMonth}-15`,
    expiration: `${expYear}-0${mfgMonth}-15`,
    form: "Lyophilized powder",
    packSize: product.size,
    stock: deriveStock(seed),
  };
}

export type PackKey = "single" | "three" | "six";

export interface PackOption {
  key: PackKey;
  label: string;
  vials: number;
  price: number;
  savings: number;
}

/**
 * Pack pricing derived from the product's base single-vial price.
 * 3-pack ~10% off, 6-pack ~15% off, rounded to whole dollars.
 */
export function getPackOptions(product: Product): PackOption[] {
  const base = product.dosages?.[0]?.price ?? product.price;
  const single = base;
  const three = Math.round(base * 3 * 0.9);
  const six = Math.round(base * 6 * 0.85);
  return [
    { key: "single", label: "1 vial", vials: 1, price: single, savings: 0 },
    { key: "three", label: "3-vial", vials: 3, price: three, savings: single * 3 - three },
    { key: "six", label: "6-vial", vials: 6, price: six, savings: single * 6 - six },
  ];
}

/** Subscription discount applied on the PDP toggle (12%). */
export const PDP_SUBSCRIPTION_DISCOUNT = 0.12;
