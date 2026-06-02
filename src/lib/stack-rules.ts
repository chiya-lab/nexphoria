/**
 * Compatibility heuristics for the stack builder. These are presentation-layer
 * research-composition notes — not medical guidance. Each rule inspects the set of
 * selected product slugs and returns an advisory when its condition holds.
 */
import { MOCK_PRODUCTS } from "./mock-products";

export type WarningLevel = "info" | "caution";

export interface StackWarning {
  id: string;
  level: WarningLevel;
  message: string;
  /** Slugs the warning relates to — used to highlight canvas items. */
  slugs: string[];
}

/** Pairs that are not commonly co-administered in the same protocol. */
const UNCOMMON_PAIRS: { a: string; b: string; note: string }[] = [
  {
    a: "semaglutide",
    b: "tesamorelin",
    note: "Semaglutide and Tesamorelin target overlapping metabolic pathways and are not commonly stacked together.",
  },
  {
    a: "cjc-1295",
    b: "tesamorelin",
    note: "CJC-1295 and Tesamorelin both act on the GH axis; combining two GHRH-class compounds is uncommon.",
  },
];

/** Single-compound handling notes keyed by slug. */
const HANDLING_NOTES: { slug: string; level: WarningLevel; note: string }[] = [
  {
    slug: "semaglutide",
    level: "info",
    note: "Semaglutide research protocols are typically run in a fasted-state window.",
  },
  {
    slug: "ipamorelin",
    level: "info",
    note: "Ipamorelin is commonly administered fasted to minimize blunting of the GH pulse.",
  },
  {
    slug: "cjc-1295",
    level: "info",
    note: "CJC-1295 pairs conventionally with a GHRP and is dosed away from meals.",
  },
];

/** Goal-tag pairs that are frequently co-administered — surfaced as a positive note. */
const SYNERGY_GOAL = "Tissue Repair";

/**
 * Evaluate the current selection against the rule set.
 * @param slugs ordered list of selected product slugs
 */
export function evaluateStack(slugs: string[]): StackWarning[] {
  const set = new Set(slugs);
  const warnings: StackWarning[] = [];

  for (const pair of UNCOMMON_PAIRS) {
    if (set.has(pair.a) && set.has(pair.b)) {
      warnings.push({
        id: `pair-${pair.a}-${pair.b}`,
        level: "caution",
        message: pair.note,
        slugs: [pair.a, pair.b],
      });
    }
  }

  for (const note of HANDLING_NOTES) {
    if (set.has(note.slug)) {
      warnings.push({
        id: `handling-${note.slug}`,
        level: note.level,
        message: note.note,
        slugs: [note.slug],
      });
    }
  }

  // GH-secretagogue density check.
  const ghCount = slugs.filter((s) => {
    const p = MOCK_PRODUCTS.find((m) => m.slug === s);
    return p?.goal.includes("GH Secretagogue");
  });
  if (ghCount.length >= 3) {
    warnings.push({
      id: "gh-density",
      level: "caution",
      message: "Three or more GH-secretagogue compounds in one stack is unusually dense for a single protocol.",
      slugs: ghCount,
    });
  }

  // Synergy note for repair-class pairs.
  const repair = slugs.filter((s) => {
    const p = MOCK_PRODUCTS.find((m) => m.slug === s);
    return p?.goal.includes(SYNERGY_GOAL);
  });
  if (repair.length >= 2) {
    warnings.push({
      id: "repair-synergy",
      level: "info",
      message: "Tissue-repair compounds are frequently co-administered in recovery research protocols.",
      slugs: repair,
    });
  }

  return warnings;
}
