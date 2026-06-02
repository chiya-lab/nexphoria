// Shared source of truth for which compounds have a published sample COA,
// plus the independent lab partner attributed to each lot's analysis.
// Lot identifiers use placeholder patterns (Lot 2026-04-XXX) — never fabricate
// a specific real lot number.

export const COA_SLUGS = [
  "bpc-157",
  "semaglutide",
  "tirzepatide",
  "tb-500",
  "ghk-cu",
  "nad-plus",
] as const;

export type CoaSlug = (typeof COA_SLUGS)[number];

export const COA_SLUG_SET = new Set<string>(COA_SLUGS);

export function hasCoa(slug: string): boolean {
  return COA_SLUG_SET.has(slug);
}

// Independent analytical laboratories that issue Nexphoria lot COAs.
export const LAB_PARTNERS = ["Janoshik Analytical", "Freedom Diagnostics"] as const;

// Deterministic partner assignment per slug so the index and document agree.
export function labPartnerFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return LAB_PARTNERS[hash % LAB_PARTNERS.length];
}

// Placeholder lot pattern — illustrative only, not a specific issued lot.
export function lotPatternFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 17 + slug.charCodeAt(i)) >>> 0;
  }
  const month = String((hash % 12) + 1).padStart(2, "0");
  return `Lot 2026-${month}-XXX`;
}
