// Centralized image-prompt registry for Nexphoria visual assets.
//
// This is a presentation-agnostic catalog of every image *slot* in the
// storefront — hero backdrops, per-SKU vial shots, editorial lab crops, and
// social/banner crops. Each slot carries the recommended generation prompt,
// the negative prompt, a camera/lens spec, and the intended aspect ratio so the
// prompt library (NEXPHORIA_IMAGE_PROMPTS.md) and the in-app admin viewer stay
// in sync from a single source.
//
// Nothing here is wired into existing components: shipping product photography
// already lives in `product-images.ts`. This registry exists so the brief is
// queryable in-app and the placeholder SVG generator can stand in wherever a
// real asset has not yet been produced. Mock/static data only — no fetching.

import { MOCK_PRODUCTS } from "./mock-products";

// Brand palette — mirrors the tokens in globals.css / NEXPHORIA_BRAND_SPEC.md.
export const BRAND_PALETTE = {
  ink: "#0A0B0D",
  ink2: "#111317",
  ink3: "#1A1D22",
  steel: "#2A2F36",
  silver: "#C8CDD3",
  silver2: "#8B9099",
  platinum: "#F3F5F7",
  accent: "#B8E04F",
  accentGlow: "#D4F08A",
} as const;

export type ImageAspect = "1:1" | "4:5" | "9:16" | "16:9" | "3:2" | "2:3" | "21:9";

// Tracks whether a real asset exists, an SVG placeholder stands in, or the slot
// is still unscoped (prompt drafted, asset not yet commissioned).
export type ImageState = "svg" | "real" | "tbd";

export type ImageSlotKind =
  | "hero"
  | "product"
  | "editorial"
  | "banner"
  | "social";

export interface ImageSlot {
  id: string;
  // Human-readable location, e.g. "Homepage hero" or "PDP — BPC-157 primary".
  location: string;
  kind: ImageSlotKind;
  aspect: ImageAspect;
  state: ImageState;
  // One-line creative intent — what the frame must communicate.
  intent: string;
  // The full generation prompt (positive).
  prompt: string;
  // What to suppress — keeps RUO/brand guardrails enforced at the prompt level.
  negativePrompt: string;
  // Camera + lens spec that pushes the model toward photographic realism.
  cameraSpec: string;
  // SKU slug when the slot is a product shot; undefined otherwise.
  slug?: string;
}

// ---------------------------------------------------------------------------
// Shared prompt fragments. Centralized so every slot inherits the same palette,
// lighting, and negative-prompt guardrails. Editing one fragment updates the
// whole library.
// ---------------------------------------------------------------------------

const PALETTE_CLAUSE =
  "strict palette near-black #0A0B0D background, cool steel #2A2F36 mid-tones, " +
  "silver #C8CDD3 detail, single acid-green #B8E04F accent used once in frame";

const LIGHTING_CLAUSE =
  "cold-tone clinical lighting, single hard key light from top-left, deep falloff " +
  "into shadow, no warm color cast, controlled specular highlights on glass and foil";

// RUO / brand guardrails expressed as suppressed concepts. Every slot reuses this.
const NEGATIVE_BASE =
  "warm tones, orange/amber cast, golden hour, lifestyle, people consuming product, " +
  "hands holding vial to mouth, before/after, fitness imagery, gym, syringe in skin, " +
  "medical cross, stethoscope, Rx symbol, pills, capsules, text artifacts, watermark, " +
  "logo distortion, low resolution, blurry, oversaturated, HDR halo, decorative hexagons, " +
  "faces, smiling models, stock-photo look, plastic toy appearance";

const VIAL_COMPOSITION =
  "matte-black PET research vial, silver hot-foil wordmark catching the key light, " +
  "crimped aluminum cap, lyophilized powder visible through glass, centered on a pure " +
  "black void, no props, no surface reflection beyond a faint floor gradient";

// ---------------------------------------------------------------------------
// Static (non-product) slots.
// ---------------------------------------------------------------------------

const HERO_SLOTS: ImageSlot[] = [
  {
    id: "hero-home",
    location: "Homepage hero",
    kind: "hero",
    aspect: "16:9",
    state: "tbd",
    intent: "Establish the molecular-lab register the instant the page loads.",
    prompt:
      "Wide cinematic shot of a single matte-black research vial rising from a dark " +
      "void, a faint hexagonal molecular lattice etched in the background at 6% opacity, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, premium boutique research-lab mood, ` +
      "spec-forward and restrained, generous negative space on the right for headline type.",
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Phase One IQ4, 80mm lens, f/8, focus-stacked, studio strobe",
  },
  {
    id: "hero-about",
    location: "About page hero",
    kind: "hero",
    aspect: "16:9",
    state: "tbd",
    intent: "Quiet, founder-note tone — discipline over hype.",
    prompt:
      "Minimal still life of an empty clean-room bench, brushed-steel surface, a closed " +
      "logbook and a capped vial in soft focus at the edge of frame, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, contemplative and understated.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Hasselblad H6D, 100mm, f/5.6, shallow depth, tripod",
  },
  {
    id: "hero-science",
    location: "Science page hero",
    kind: "hero",
    aspect: "16:9",
    state: "tbd",
    intent: "Signal HPLC-grade rigor and primary-literature density.",
    prompt:
      "Macro detail of an HPLC chromatogram trace rendered as fine silver lines on a " +
      "near-black screen, a glass sample vial in a chromatography autosampler tray " +
      `softly out of focus behind, ${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, analytical and precise.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Canon R5, RF 100mm Macro, f/11, focus-stacked",
  },
  {
    id: "hero-manufacturing",
    location: "Manufacturing page hero",
    kind: "hero",
    aspect: "16:9",
    state: "tbd",
    intent: "Cold-chain, lot-traceable, US-fulfilled credibility.",
    prompt:
      "Wide shot of a stainless lyophilizer door reflecting cold light, frost on a " +
      "cold-chain transit case in the foreground, rack of capped vials in racks behind, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, industrial-clinical, no operators visible.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Sony A7R V, 35mm, f/9, deep depth of field",
  },
  {
    id: "hero-protocols",
    location: "Protocols page hero",
    kind: "hero",
    aspect: "16:9",
    state: "tbd",
    intent: "A protocol as a precise, multi-vial regimen.",
    prompt:
      "Three matte-black vials arranged in a precise row at staggered depth, faint " +
      "calibration-grid backdrop, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, ${VIAL_COMPOSITION}, ordered and methodical.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Phase One IQ4, 120mm, f/11, focus-stacked",
  },
  {
    id: "hero-affiliates",
    location: "Affiliates landing hero",
    kind: "hero",
    aspect: "16:9",
    state: "tbd",
    intent: "Peer-to-peer, professional partner program — not a sales pitch.",
    prompt:
      "Editorial flat-lay from above of a vial, a printed spec sheet, and a brushed-metal " +
      "pen on dark slate, single acid-green accent on a small tab marker, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, confident and businesslike.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Fujifilm GFX 100, 63mm, f/8, overhead rig",
  },
];

const EDITORIAL_SLOTS: ImageSlot[] = [
  {
    id: "editorial-gloved-pipette",
    location: "Editorial — reconstitution detail",
    kind: "editorial",
    aspect: "3:2",
    state: "tbd",
    intent: "Show technique without showing a person or consumption.",
    prompt:
      "Macro crop of nitrile-gloved hands drawing bacteriostatic water into a precision " +
      "micropipette above an open vial, sterile field, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, no face, wrists-down framing only.`,
    negativePrompt: NEGATIVE_BASE + ", injection into body, mouth, ingestion",
    cameraSpec: "Shot on Nikon Z9, 105mm Macro, f/8, ring-light fill",
  },
  {
    id: "editorial-vial-rack",
    location: "Editorial — vials in rack",
    kind: "editorial",
    aspect: "3:2",
    state: "tbd",
    intent: "Inventory depth and batch consistency.",
    prompt:
      "Receding row of identical capped vials in a black anodized rack, sharp focus on " +
      "the front vial's silver foil label, progressive bokeh down the line, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Sony A1, 90mm Macro, f/4, focus on front rank",
  },
  {
    id: "editorial-chromatography",
    location: "Editorial — analytical instrument",
    kind: "editorial",
    aspect: "3:2",
    state: "tbd",
    intent: "Third-party HPLC verification, told visually.",
    prompt:
      "Close detail of an HPLC autosampler arm poised over a tray of capped vials, fine " +
      "tubing and a glowing acid-green status LED as the single accent, " +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, instrument-grade realism.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Canon R5, RF 100mm Macro, f/9",
  },
];

// ---------------------------------------------------------------------------
// Per-SKU product slots — generated from MOCK_PRODUCTS so all 14 are covered.
// ---------------------------------------------------------------------------

const PRODUCT_SLOTS: ImageSlot[] = MOCK_PRODUCTS.map((p) => ({
  id: `product-${p.slug}`,
  location: `PDP — ${p.name} primary`,
  kind: "product" as const,
  aspect: "2:3" as const,
  state: "svg" as const,
  slug: p.slug,
  intent: `Hero vial shot for ${p.name} (${p.category}); MW ${p.mw}, purity ${p.purity}.`,
  prompt:
    `Product photograph of the ${p.name} research vial. ${VIAL_COMPOSITION}. ` +
    `${LIGHTING_CLAUSE}. ${PALETTE_CLAUSE}. The label reads "${p.name}" in clean mono ` +
    `type with the molecular weight ${p.mw} set small beneath; pharmaceutical discipline, ` +
    `catalog-grade clarity suitable for a PDP gallery, four-angle set (front, three-quarter, ` +
    `cap detail macro, label macro).`,
  negativePrompt: NEGATIVE_BASE + ", dosage instructions on label, human-use directions",
  cameraSpec: "Shot on Phase One IQ4 150MP, 120mm Macro, f/11, focus-stacked, black void sweep",
}));

// ---------------------------------------------------------------------------
// Banner + social crops.
// ---------------------------------------------------------------------------

const BANNER_SLOTS: ImageSlot[] = [
  {
    id: "banner-leaderboard-728x90",
    location: "Banner — 728x90 leaderboard",
    kind: "banner",
    aspect: "21:9",
    state: "tbd",
    intent: "Horizontal display unit, vial left, headline space right.",
    prompt:
      "Ultra-wide composition, a single vial pinned to the left third, vast black negative " +
      `space to the right for type, faint hex lattice, ${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Phase One IQ4, 80mm, f/9, wide crop",
  },
  {
    id: "social-1x1",
    location: "Social — 1:1 feed",
    kind: "social",
    aspect: "1:1",
    state: "tbd",
    intent: "Square feed post, centered vial, balanced margins.",
    prompt:
      `Centered single vial on black void, ${VIAL_COMPOSITION}, ${LIGHTING_CLAUSE}, ` +
      `${PALETTE_CLAUSE}, even margins for caption overlay.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Hasselblad H6D, 100mm, f/11, square crop",
  },
  {
    id: "social-4x5",
    location: "Social — 4:5 portrait",
    kind: "social",
    aspect: "4:5",
    state: "tbd",
    intent: "Portrait feed unit maximizing vertical screen real estate.",
    prompt:
      `Tall portrait of a single vial slightly low in frame, headroom above for type, ` +
      `${VIAL_COMPOSITION}, ${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Fujifilm GFX 100, 110mm, f/8, 4:5 crop",
  },
  {
    id: "social-9x16",
    location: "Social — 9:16 story",
    kind: "social",
    aspect: "9:16",
    state: "tbd",
    intent: "Full-bleed vertical story / reel cover.",
    prompt:
      `Full-bleed vertical of a vial rising from the lower third, hex lattice faint above, ` +
      `${LIGHTING_CLAUSE}, ${PALETTE_CLAUSE}, safe zones top and bottom for UI overlays.`,
    negativePrompt: NEGATIVE_BASE,
    cameraSpec: "Shot on Sony A7R V, 50mm, f/8, 9:16 crop",
  },
];

export const IMAGE_SLOTS: ImageSlot[] = [
  ...HERO_SLOTS,
  ...PRODUCT_SLOTS,
  ...EDITORIAL_SLOTS,
  ...BANNER_SLOTS,
];

export function getSlotsByKind(kind: ImageSlotKind): ImageSlot[] {
  return IMAGE_SLOTS.filter((s) => s.kind === kind);
}

export function getSlot(id: string): ImageSlot | undefined {
  return IMAGE_SLOTS.find((s) => s.id === id);
}

// Aspect-ratio → width/height in viewBox units, used by the SVG generator.
const ASPECT_DIMS: Record<ImageAspect, { w: number; h: number }> = {
  "1:1": { w: 600, h: 600 },
  "4:5": { w: 480, h: 600 },
  "9:16": { w: 360, h: 640 },
  "16:9": { w: 960, h: 540 },
  "3:2": { w: 720, h: 480 },
  "2:3": { w: 480, h: 720 },
  "21:9": { w: 980, h: 420 },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Deterministic placeholder SVG for a slot. Renders the brand gradient, a faint
 * hex node, the slot location, its aspect ratio, and a "PLACEHOLDER" tag in the
 * acid-green accent. Pure string output so it works in server or client code and
 * can be inlined, base64-encoded, or downloaded as a Blob.
 */
export function placeholderSvg(slot: ImageSlot): string {
  const { w, h } = ASPECT_DIMS[slot.aspect];
  const cx = w / 2;
  const cy = h / 2;
  const hexR = Math.min(w, h) * 0.16;
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + hexR * Math.cos(a)).toFixed(1)},${(cy + hexR * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(slot.location)} placeholder">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND_PALETTE.ink}"/>
      <stop offset="60%" stop-color="${BRAND_PALETTE.ink2}"/>
      <stop offset="100%" stop-color="${BRAND_PALETTE.ink3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="12%" r="55%">
      <stop offset="0%" stop-color="${BRAND_PALETTE.accent}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${BRAND_PALETTE.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect x="8" y="8" width="${w - 16}" height="${h - 16}" fill="none" stroke="${BRAND_PALETTE.steel}" stroke-width="1"/>
  <polygon points="${hexPoints}" fill="none" stroke="${BRAND_PALETTE.steel}" stroke-width="1.5"/>
  <circle cx="${cx.toFixed(1)}" cy="${(cy - hexR).toFixed(1)}" r="4" fill="${BRAND_PALETTE.accent}"/>
  <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="monospace" font-size="13" fill="${BRAND_PALETTE.silver}">${escapeXml(slot.location)}</text>
  <text x="${cx}" y="${cy + 26}" text-anchor="middle" font-family="monospace" font-size="11" fill="${BRAND_PALETTE.silver2}">${slot.aspect} · ${slot.kind}</text>
  <text x="${cx}" y="${h - 18}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="${BRAND_PALETTE.accent}">PLACEHOLDER</text>
</svg>`;
}

/** Base64 data URI for inline use in <img src> or CSS background. */
export function placeholderDataUri(slot: ImageSlot): string {
  const svg = placeholderSvg(slot);
  const encoded = typeof btoa === "function"
    ? btoa(unescape(encodeURIComponent(svg)))
    : Buffer.from(svg, "utf-8").toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}

export interface ImageSlotCounts {
  total: number;
  real: number;
  svg: number;
  tbd: number;
}

export function slotCounts(): ImageSlotCounts {
  return IMAGE_SLOTS.reduce<ImageSlotCounts>(
    (acc, s) => {
      acc.total += 1;
      acc[s.state] += 1;
      return acc;
    },
    { total: 0, real: 0, svg: 0, tbd: 0 },
  );
}
