/**
 * Quiz scoring engine for the "Find your research protocol" finder.
 *
 * Maps a researcher's focus tags to candidate compounds, scores every catalog
 * item by tag overlap (with the focus weighting favoring the primary interest),
 * applies the budget ceiling as a soft preference, then returns one primary
 * compound plus two supporting compounds drawn from the same or complementary
 * focus areas. Pure functions — no React, no side effects.
 */
import { MOCK_PRODUCTS, type MockProduct } from "./mock-products";
import type { ProtocolTag } from "./quizQuestions";

export interface QuizAnswers {
  focus: string[]; // option ids from Q1 (multi)
  experience?: string;
  complexity?: string;
  cycle?: string;
  budget?: string; // upper bound, USD, as string
  storage?: string;
}

export interface ProtocolResult {
  primary: MockProduct;
  supporting: MockProduct[];
  /** Focus tags that drove the recommendation, for the result copy. */
  matchedTags: ProtocolTag[];
}

/** Q1 option id -> matching tag. */
const FOCUS_OPTION_TAG: Record<string, ProtocolTag> = {
  tissue: "tissue-repair",
  metabolic: "metabolic",
  sleep: "sleep-recovery",
  performance: "performance",
  "anti-aging": "anti-aging",
};

/**
 * Tag -> preferred compound slugs, in priority order. These reflect the
 * canonical mapping from the brief; the engine intersects them with the live
 * catalog so a missing slug never breaks the result.
 */
const TAG_SLUGS: Record<ProtocolTag, string[]> = {
  "tissue-repair": ["bpc-157", "tb-500", "thymosin-alpha-1", "ghk-cu"],
  metabolic: ["semaglutide", "tesamorelin", "mots-c"],
  "sleep-recovery": ["ipamorelin", "cjc-1295", "hexarelin"],
  performance: ["cjc-1295", "ipamorelin", "hexarelin", "tesamorelin"],
  "anti-aging": ["epitalon", "ghk-cu", "nad-plus"],
};

function bySlug(slug: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

/** Map selected Q1 option ids to tags, preserving selection order (priority). */
export function tagsFromAnswers(answers: QuizAnswers): ProtocolTag[] {
  const tags: ProtocolTag[] = [];
  for (const id of answers.focus) {
    const tag = FOCUS_OPTION_TAG[id];
    if (tag && !tags.includes(tag)) tags.push(tag);
  }
  return tags;
}

function budgetCeiling(answers: QuizAnswers): number {
  const n = Number(answers.budget);
  return Number.isFinite(n) && n > 0 ? n : Infinity;
}

/**
 * Build an ordered candidate list of slugs from the matched tags. The first tag
 * (primary focus) contributes first, so its compounds rank highest.
 */
function candidateSlugs(tags: ProtocolTag[]): string[] {
  const ordered: string[] = [];
  for (const tag of tags) {
    for (const slug of TAG_SLUGS[tag]) {
      if (!ordered.includes(slug)) ordered.push(slug);
    }
  }
  return ordered;
}

/**
 * Resolve the answer set to a primary + two supporting compounds. Always
 * returns three distinct in-stock-agnostic products; falls back to catalog
 * order if the answers are empty so the result card never renders blank.
 */
export function recommendProtocol(answers: QuizAnswers): ProtocolResult {
  const matchedTags = tagsFromAnswers(answers);
  const ceiling = budgetCeiling(answers);

  let ordered = candidateSlugs(matchedTags)
    .map(bySlug)
    .filter((p): p is MockProduct => Boolean(p));

  // Prefer within-budget compounds, but keep over-budget ones as a tail so we
  // always have enough to fill three slots.
  const withinBudget = ordered.filter((p) => p.price <= ceiling);
  const overBudget = ordered.filter((p) => p.price > ceiling);
  ordered = [...withinBudget, ...overBudget];

  // Fallback: nothing matched (no focus chosen) — use catalog order.
  if (ordered.length === 0) {
    ordered = [...MOCK_PRODUCTS];
  }

  // Top up to at least three from the broader catalog if a narrow focus
  // produced fewer than three candidates.
  if (ordered.length < 3) {
    for (const p of MOCK_PRODUCTS) {
      if (ordered.length >= 3) break;
      if (!ordered.some((o) => o.slug === p.slug)) ordered.push(p);
    }
  }

  const [primary, ...rest] = ordered;
  return {
    primary,
    supporting: rest.slice(0, 2),
    matchedTags,
  };
}
