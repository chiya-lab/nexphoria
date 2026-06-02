import type { MockProduct } from "@/lib/mock-products";

/**
 * Row definitions for the comparison matrix. Kept in a plain (non-client)
 * module so both the client table and the server page (JSON-LD) read one
 * source — exporting arrays from a "use client" file and importing them into
 * a server component breaks at build collect time.
 */
export interface CompareRow {
  key: string;
  label: string;
  /** Render the cell value as a mono badge chip. */
  badge?: boolean;
  /** Emphasize the value (used for price). */
  strong?: boolean;
}

export const COMPARE_ROWS: CompareRow[] = [
  { key: "image", label: "Compound" },
  { key: "purity", label: "Purity", badge: true },
  { key: "packSizes", label: "Pack sizes" },
  { key: "pricePerMg", label: "Price per vial (from)", strong: true },
  { key: "halfLife", label: "Half-life" },
  { key: "solubility", label: "Solubility" },
  { key: "storage", label: "Storage temp" },
  { key: "reconstitution", label: "Reconstitution" },
  { key: "postReconStability", label: "Stability post-recon" },
  { key: "typicalResearchDose", label: "Typical research dose" },
  { key: "category", label: "Category" },
  { key: "citations", label: "Citations" },
];

const FIXED_STORAGE = "−20°C, desiccated";
const FIXED_RECON = "Bacteriostatic water";

/** Resolve the lowest single-vial / pack price as the "from" price. */
export function fromPrice(p: MockProduct): number {
  if (p.packPrices && p.packPrices.length > 0) {
    return Math.min(...p.packPrices.map((pp) => pp.price));
  }
  return p.price;
}

/** Compact pack-size descriptor, e.g. "1 / 3 / 6 vial". */
export function packSizeLabel(p: MockProduct): string {
  if (!p.packPrices || p.packPrices.length === 0) return "1 vial";
  return `${p.packPrices.map((pp) => pp.qty).join(" / ")} vial`;
}

/**
 * Resolve a comparison cell's display value for a given row key.
 * Returns an em dash for missing data so columns stay aligned.
 */
export function compareCellValue(p: MockProduct, key: string): string {
  switch (key) {
    case "purity":
      return p.purity;
    case "packSizes":
      return packSizeLabel(p);
    case "pricePerMg":
      return `$${fromPrice(p)}`;
    case "halfLife":
      return p.halfLife ?? "—";
    case "solubility":
      return p.solubility ?? FIXED_RECON;
    case "storage":
      return FIXED_STORAGE;
    case "reconstitution":
      return FIXED_RECON;
    case "postReconStability":
      return p.postReconStability ?? "—";
    case "typicalResearchDose":
      return p.typicalResearchDose ?? "—";
    case "category":
      return p.category;
    case "citations":
      return p.citationsCount != null ? `${p.citationsCount} indexed` : "—";
    default:
      return "—";
  }
}
