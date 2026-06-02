import type { Product } from "./products";

/**
 * Catalog listing model for the PLP. This is a presentation-layer view over the
 * research compound catalog — it carries only the fields the grid, filters, sort,
 * and quick-add need. It is intentionally lighter than the full `Product` record
 * used by the PDP. `toCartProduct` adapts a listing into the minimal `Product`
 * shape the cart store expects so quick-add can resolve a unit price.
 */
export interface MockProduct {
  slug: string;
  name: string;
  category: ProductCategory;
  goal: ResearchGoal[];
  price: number; // single-vial price (USD)
  subPrice: number; // per-shipment price on subscription
  packPrices: { qty: number; price: number }[]; // 1 / 3 / 6 vial packs
  stock: number; // live units on hand
  mw: string; // molecular weight
  purity: string; // HPLC-verified purity
  subscriptionEligible: boolean;
  addedAt: string; // ISO date — drives "Newest" sort
  rating: number; // mean review score (out of 5)
}

export type ProductCategory =
  | "Recovery & Repair"
  | "Metabolic"
  | "Longevity"
  | "Cognition & Neuro"
  | "Growth Factors";

export type ResearchGoal =
  | "Tissue Repair"
  | "Metabolic Research"
  | "Anti-Aging"
  | "Neuroprotection"
  | "GH Secretagogue"
  | "Mitochondrial";

export const CATEGORIES: ProductCategory[] = [
  "Recovery & Repair",
  "Metabolic",
  "Longevity",
  "Cognition & Neuro",
  "Growth Factors",
];

export const GOALS: ResearchGoal[] = [
  "Tissue Repair",
  "Metabolic Research",
  "Anti-Aging",
  "Neuroprotection",
  "GH Secretagogue",
  "Mitochondrial",
];

export interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number; // Infinity for the open-ended top band
}

export const PRICE_BANDS: PriceBand[] = [
  { id: "u50", label: "Under $50", min: 0, max: 50 },
  { id: "50-90", label: "$50 – $90", min: 50, max: 90 },
  { id: "90-150", label: "$90 – $150", min: 90, max: 150 },
  { id: "150p", label: "$150+", min: 150, max: Infinity },
];

export type SortKey = "bestsellers" | "newest" | "price-asc" | "price-desc" | "purity";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "bestsellers", label: "Bestsellers" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "purity", label: "Purity" },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Recovery & Repair",
    goal: ["Tissue Repair"],
    price: 50,
    subPrice: 45,
    packPrices: [{ qty: 1, price: 50 }, { qty: 3, price: 135 }, { qty: 6, price: 240 }],
    stock: 142,
    mw: "1419.53 g/mol",
    purity: "≥99.2%",
    subscriptionEligible: true,
    addedAt: "2025-09-02",
    rating: 4.9,
  },
  {
    slug: "tb-500",
    name: "TB-500",
    category: "Recovery & Repair",
    goal: ["Tissue Repair", "GH Secretagogue"],
    price: 65,
    subPrice: 58,
    packPrices: [{ qty: 1, price: 65 }, { qty: 3, price: 175 }, { qty: 6, price: 312 }],
    stock: 88,
    mw: "4963.44 g/mol",
    purity: "≥98.8%",
    subscriptionEligible: true,
    addedAt: "2025-08-18",
    rating: 4.8,
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    category: "Longevity",
    goal: ["Anti-Aging", "Tissue Repair"],
    price: 45,
    subPrice: 40,
    packPrices: [{ qty: 1, price: 45 }, { qty: 3, price: 122 }, { qty: 6, price: 216 }],
    stock: 203,
    mw: "403.94 g/mol",
    purity: "≥99.0%",
    subscriptionEligible: true,
    addedAt: "2025-07-30",
    rating: 4.7,
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "Metabolic",
    goal: ["Metabolic Research"],
    price: 185,
    subPrice: 166,
    packPrices: [{ qty: 1, price: 185 }, { qty: 3, price: 500 }, { qty: 6, price: 888 }],
    stock: 31,
    mw: "4113.58 g/mol",
    purity: "≥99.4%",
    subscriptionEligible: true,
    addedAt: "2025-11-12",
    rating: 4.9,
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Cognition & Neuro",
    goal: ["Neuroprotection"],
    price: 55,
    subPrice: 49,
    packPrices: [{ qty: 1, price: 55 }, { qty: 3, price: 149 }, { qty: 6, price: 264 }],
    stock: 67,
    mw: "751.90 g/mol",
    purity: "≥98.6%",
    subscriptionEligible: true,
    addedAt: "2025-06-21",
    rating: 4.6,
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    category: "Cognition & Neuro",
    goal: ["Neuroprotection"],
    price: 140,
    subPrice: 126,
    packPrices: [{ qty: 1, price: 140 }, { qty: 3, price: 378 }, { qty: 6, price: 672 }],
    stock: 0,
    mw: "Mixture",
    purity: "≥97.5%",
    subscriptionEligible: false,
    addedAt: "2025-10-05",
    rating: 4.5,
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Recovery & Repair",
    goal: ["Tissue Repair", "Anti-Aging"],
    price: 95,
    subPrice: 85,
    packPrices: [{ qty: 1, price: 95 }, { qty: 3, price: 256 }, { qty: 6, price: 456 }],
    stock: 54,
    mw: "3108.30 g/mol",
    purity: "≥99.1%",
    subscriptionEligible: true,
    addedAt: "2025-09-28",
    rating: 4.8,
  },
  {
    slug: "epitalon",
    name: "Epitalon",
    category: "Longevity",
    goal: ["Anti-Aging"],
    price: 48,
    subPrice: 43,
    packPrices: [{ qty: 1, price: 48 }, { qty: 3, price: 130 }, { qty: 6, price: 230 }],
    stock: 176,
    mw: "390.35 g/mol",
    purity: "≥99.0%",
    subscriptionEligible: true,
    addedAt: "2025-08-09",
    rating: 4.7,
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Growth Factors",
    goal: ["GH Secretagogue", "Metabolic Research"],
    price: 120,
    subPrice: 108,
    packPrices: [{ qty: 1, price: 120 }, { qty: 3, price: 324 }, { qty: 6, price: 576 }],
    stock: 22,
    mw: "5135.83 g/mol",
    purity: "≥98.9%",
    subscriptionEligible: true,
    addedAt: "2025-10-22",
    rating: 4.8,
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295",
    category: "Growth Factors",
    goal: ["GH Secretagogue"],
    price: 70,
    subPrice: 63,
    packPrices: [{ qty: 1, price: 70 }, { qty: 3, price: 189 }, { qty: 6, price: 336 }],
    stock: 91,
    mw: "3367.97 g/mol",
    purity: "≥99.0%",
    subscriptionEligible: true,
    addedAt: "2025-07-14",
    rating: 4.7,
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Metabolic",
    goal: ["Mitochondrial", "Metabolic Research"],
    price: 88,
    subPrice: 79,
    packPrices: [{ qty: 1, price: 88 }, { qty: 3, price: 238 }, { qty: 6, price: 422 }],
    stock: 43,
    mw: "2174.48 g/mol",
    purity: "≥98.7%",
    subscriptionEligible: true,
    addedAt: "2025-11-01",
    rating: 4.6,
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "Growth Factors",
    goal: ["GH Secretagogue"],
    price: 58,
    subPrice: 52,
    packPrices: [{ qty: 1, price: 58 }, { qty: 3, price: 157 }, { qty: 6, price: 278 }],
    stock: 134,
    mw: "711.85 g/mol",
    purity: "≥99.1%",
    subscriptionEligible: true,
    addedAt: "2025-06-30",
    rating: 4.8,
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    category: "Growth Factors",
    goal: ["GH Secretagogue"],
    price: 62,
    subPrice: 56,
    packPrices: [{ qty: 1, price: 62 }, { qty: 3, price: 167 }, { qty: 6, price: 298 }],
    stock: 7,
    mw: "887.04 g/mol",
    purity: "≥98.5%",
    subscriptionEligible: true,
    addedAt: "2025-09-15",
    rating: 4.5,
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Longevity",
    goal: ["Anti-Aging", "Mitochondrial"],
    price: 110,
    subPrice: 99,
    packPrices: [{ qty: 1, price: 110 }, { qty: 3, price: 297 }, { qty: 6, price: 528 }],
    stock: 38,
    mw: "663.43 g/mol",
    purity: "≥99.3%",
    subscriptionEligible: true,
    addedAt: "2025-10-30",
    rating: 4.7,
  },
];

// Lowercase alias consumed by the homepage bestseller rail.
export const mockProducts = MOCK_PRODUCTS;

export function priceBandFor(price: number): PriceBand | undefined {
  return PRICE_BANDS.find((b) => price >= b.min && price < b.max);
}

/**
 * Adapt a catalog listing into the minimal `Product` shape the cart store reads.
 * Only the fields `useCart().addItem` touches (slug, name, price, dosages, etc.)
 * need to be real; the rest are filled with safe defaults so the type checks and
 * the line item renders. The selected pack maps to a dosage so the unit price and
 * cart math stay correct.
 */
export function toCartProduct(p: MockProduct): Product {
  return {
    slug: p.slug,
    name: p.name,
    casNumber: "",
    formula: "",
    molecularWeight: p.mw,
    purity: p.purity,
    category: p.category,
    price: p.price,
    size: "1 vial",
    dosages: p.packPrices.map((pp) => ({
      size: pp.qty === 1 ? "1 vial" : `${pp.qty}-vial pack`,
      price: pp.price,
    })),
    storage: "−20°C, desiccated, protect from light.",
    appearance: "Lyophilized powder",
    solubility: "Reconstitute with bacteriostatic water.",
    tagline: "",
    description: "",
    mechanism: "",
    researchSummary: "",
    dosingProtocol: "",
    reconstitution: "",
    relatedSlugs: [],
    features: [],
    accentColor: "#B8E04F",
    penAvailable: false,
    penPrice: 0,
    forGender: "both",
    researchApplications: [],
  };
}
