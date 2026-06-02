import { products } from "./products";

export type Bundle = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  synergy: string; // How the peptides work together
  mechanism: string; // Why this combination is effective
  timeline: string; // Expected timeline for results
  productSlugs: string[];
  totalPrice: number;
  monthlyPrice: number; // Monthly price with 6-month discount
  savings: number;
  tags: string[];
};

export const bundles: Bundle[] = [
  {
    slug: "recovery-stack",
    name: "Recovery Stack",
    eyebrow: "MOST POPULAR",
    description:
      "Accelerate tissue repair, reduce inflammation, and support cellular regeneration",
    synergy: "BPC-157 repairs tissue damage while TB-500 promotes new blood vessel formation. GHK-Cu provides copper peptide signaling for collagen synthesis — together they accelerate recovery 3x faster than individual use.",
    mechanism: "Triple-pathway repair: BPC-157 activates angiogenic factors, TB-500 upregulates actin binding proteins for cell migration, and GHK-Cu stimulates collagen I & III production for structural integrity.",
    timeline: "Week 1-2: Reduced inflammation and pain. Week 3-4: Accelerated tissue repair. Week 6-8: Full structural recovery and enhanced durability.",
    productSlugs: ["bpc-157", "tb-500", "ghk-cu"],
    totalPrice: 289,
    monthlyPrice: 69, // ~$289 * 0.72 / 3 products
    savings: 81, // 289 * 0.28 (6-month discount)
    tags: ["Post-Surgery", "Sports Recovery", "Joint Health"],
  },
  {
    slug: "longevity-stack",
    name: "Longevity Stack",
    eyebrow: "BEST VALUE",
    description:
      "Turn back the clock with telomere support, cellular energy, and skin rejuvenation",
    synergy: "Epitalon lengthens telomeres while NAD+ restores cellular energy production. GHK-Cu rebuilds skin matrix — a complete cellular rejuvenation protocol targeting aging at the molecular level.",
    mechanism: "Multi-pathway anti-aging: Epitalon activates telomerase to extend cellular lifespan, NAD+ fuels sirtuins for DNA repair, and GHK-Cu triggers matrix remodeling for skin regeneration.",
    timeline: "Week 1-3: Improved energy and sleep quality. Week 4-8: Visible skin improvement. Week 12+: Enhanced cellular function and longevity markers.",
    productSlugs: ["epitalon", "nad-plus", "ghk-cu"],
    totalPrice: 279,
    monthlyPrice: 67, // ~$279 * 0.72 / 3 products
    savings: 78, // 279 * 0.28
    tags: ["Anti-Aging", "Cellular Health", "Skin"],
  },
  {
    slug: "cognitive-stack",
    name: "Cognitive Stack",
    eyebrow: "RESEARCH-BACKED",
    description:
      "Molecular precision for neuropeptide research — Selank, Semax, and NAD+ for reproducible research outcomes",
    synergy: "Selank and Semax are studied for distinct neuropeptide signaling pathways; NAD+ is investigated for neuronal energy metabolism. A combined protocol for receptor pharmacology and neuroplasticity research.",
    mechanism: "Neuropeptide signaling: Selank modulates GABA and enkephalin systems, Semax is studied for BDNF and neuroplasticity endpoints, NAD+ supports mitochondrial function in neurons.",
    timeline: "Week 1: baseline behavioral assays. Week 2-4: neuroplasticity endpoints. Week 6-8: extended protocol observation windows.",
    productSlugs: ["selank", "semax", "nad-plus"],
    totalPrice: 237,
    monthlyPrice: 57, // ~$237 * 0.72 / 3 products
    savings: 66, // 237 * 0.28
    tags: ["Focus", "Memory", "Anxiety Relief"],
  },
  {
    slug: "performance-stack",
    name: "Performance Stack",
    eyebrow: "ELITE PROTOCOL",
    description:
      "Maximize growth hormone, recovery, and lean muscle development",
    synergy: "CJC-1295/Ipamorelin stimulates natural GH release while TB-500 enhances muscle fiber recruitment and BPC-157 accelerates recovery. This creates an anabolic environment for maximum performance gains.",
    mechanism: "GH-pathway optimization: CJC/Ipa increases pulsatile GH release, TB-500 promotes satellite cell activation and muscle repair, BPC-157 enhances tendon strength and joint health for injury prevention.",
    timeline: "Week 2-4: Improved recovery and sleep quality. Week 6-8: Increased lean mass and strength. Week 12+: Peak performance and body composition changes.",
    productSlugs: ["cjc-1295-ipamorelin", "tb-500", "bpc-157"],
    totalPrice: 333,
    monthlyPrice: 80, // ~$333 * 0.72 / 3 products
    savings: 93, // 333 * 0.28
    tags: ["Muscle", "Recovery", "GH Optimization"],
  },
];

export function getBundleProducts(bundle: Bundle) {
  return bundle.productSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean);
}

export function getBundlesForProduct(productSlug: string): Bundle[] {
  return bundles.filter((b) => b.productSlugs.includes(productSlug));
}
