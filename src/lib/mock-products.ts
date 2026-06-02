// Bestseller-rail display data. `slug` aligns with the live catalog (src/lib/products.ts)
// where a matching entry exists, so the add-to-cart action can resolve a real Product
// via getProduct(slug). Pricing/stock here drive the rail card display only.

export interface MockProduct {
  slug: string;
  name: string;
  molecularWeight: string;
  purity: string;
  price: number;
  packPrices: { one: number; three: number; six: number };
  subPrice: number;
  stock: number;
  category: string;
}

export const mockProducts: MockProduct[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    molecularWeight: "1419.53 g/mol",
    purity: "≥99.2%",
    price: 50,
    packPrices: { one: 50, three: 135, six: 240 },
    subPrice: 45,
    stock: 38,
    category: "Recovery",
  },
  {
    slug: "tb-500",
    name: "TB-500",
    molecularWeight: "4963.50 g/mol",
    purity: "≥98.5%",
    price: 54,
    packPrices: { one: 54, three: 146, six: 259 },
    subPrice: 49,
    stock: 24,
    category: "Recovery",
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    molecularWeight: "403.93 g/mol",
    purity: "≥99.0%",
    price: 48,
    packPrices: { one: 48, three: 130, six: 230 },
    subPrice: 43,
    stock: 51,
    category: "Dermal",
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    molecularWeight: "4113.58 g/mol",
    purity: "≥99.0%",
    price: 89,
    packPrices: { one: 89, three: 240, six: 427 },
    subPrice: 80,
    stock: 17,
    category: "Metabolic",
  },
  {
    slug: "selank",
    name: "Selank",
    molecularWeight: "751.91 g/mol",
    purity: "≥98.8%",
    price: 42,
    packPrices: { one: 42, three: 113, six: 201 },
    subPrice: 38,
    stock: 33,
    category: "Cognitive",
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    molecularWeight: "Peptide complex",
    purity: "≥98.0%",
    price: 72,
    packPrices: { one: 72, three: 194, six: 345 },
    subPrice: 65,
    stock: 9,
    category: "Cognitive",
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    molecularWeight: "3108.30 g/mol",
    purity: "≥98.6%",
    price: 64,
    packPrices: { one: 64, three: 173, six: 307 },
    subPrice: 58,
    stock: 28,
    category: "Longevity",
  },
  {
    slug: "epitalon",
    name: "Epitalon",
    molecularWeight: "390.35 g/mol",
    purity: "≥99.1%",
    price: 46,
    packPrices: { one: 46, three: 124, six: 220 },
    subPrice: 41,
    stock: 44,
    category: "Longevity",
  },
];
