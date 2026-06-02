import type { StackItem } from "@/lib/stack-store";

/**
 * One-click starting protocols. Each preset is a plain data record so it can be
 * imported by both client components and (if needed) a server page without
 * crossing the "use client" boundary. Slugs map onto MOCK_PRODUCTS.
 */
export interface StackPreset {
  id: string;
  name: string;
  blurb: string;
  items: StackItem[];
}

export const STACK_PRESETS: StackPreset[] = [
  {
    id: "recovery",
    name: "Recovery & repair",
    blurb: "Tissue-repair compounds for a soft-tissue recovery research protocol.",
    items: [
      { slug: "bpc-157", packQty: 3, dosePerDay: 250, slot: "PWO" },
      { slug: "tb-500", packQty: 3, dosePerDay: 500, slot: "PWO" },
      { slug: "ghk-cu", packQty: 1, dosePerDay: 200, slot: "AM" },
    ],
  },
  {
    id: "metabolic",
    name: "Metabolic",
    blurb: "Metabolic-research compounds spanning GLP-1 and mitochondrial pathways.",
    items: [
      { slug: "semaglutide", packQty: 1, dosePerDay: 250, slot: "AM" },
      { slug: "mots-c", packQty: 1, dosePerDay: 500, slot: "AM" },
    ],
  },
  {
    id: "anti-aging",
    name: "Longevity",
    blurb: "Anti-aging and mitochondrial compounds for a longevity research protocol.",
    items: [
      { slug: "epitalon", packQty: 1, dosePerDay: 100, slot: "PM" },
      { slug: "nad-plus", packQty: 1, dosePerDay: 500, slot: "AM" },
      { slug: "ghk-cu", packQty: 1, dosePerDay: 200, slot: "AM" },
    ],
  },
];
