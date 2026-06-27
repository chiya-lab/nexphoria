/**
 * Article Tag System
 *
 * Maps compound tags (product slugs) to article slugs.
 * Derived from PRODUCT_ARTICLES (inverted) + additional manual mappings
 * for compounds mentioned in articles but that may not be product pages.
 *
 * Also maps tag slugs to display names for use in UI.
 */

import { PRODUCT_ARTICLES } from './product-articles';
import { getArticleBySlug } from './blog';

/**
 * Human-readable display names for tag slugs.
 * All compound product slugs + a few additional research tags.
 */
export const TAG_DISPLAY_NAMES: Record<string, string> = {
  'bpc-157': 'BPC-157',
  'tb-500': 'TB-500',
  'ipamorelin': 'Ipamorelin',
  'cjc-1295': 'CJC-1295 (DAC)',
  'cjc-1295-ipamorelin': 'CJC-1295 / Ipamorelin',
  'cjc-1295-no-dac': 'CJC-1295 No DAC',
  'sermorelin': 'Sermorelin',
  'mk-677': 'MK-677',
  'semaglutide': 'Semaglutide',
  'tirzepatide': 'Tirzepatide',
  'retatrutide': 'Retatrutide',
  'aod-9604': 'AOD-9604',
  'ghk-cu': 'GHK-Cu',
  'epitalon': 'Epitalon',
  'selank': 'Selank',
  'semax': 'Semax',
  'nad-plus': 'NAD+',
  'pt-141': 'PT-141',
  'melanotan-ii': 'Melanotan II',
  'thymosin-alpha-1': 'Thymosin Alpha-1',
  'll-37': 'LL-37',
  'mots-c': 'MOTS-c',
  'ss-31': 'SS-31 (Elamipretide)',
  'tesamorelin': 'Tesamorelin',
  'dsip': 'DSIP',
  'kisspeptin': 'Kisspeptin',
  'oxytocin': 'Oxytocin',
  'kpv': 'KPV',
  'wolverine-blend': 'Wolverine Blend',
  'glow-blend': 'GLOW Blend',
  'klw-blend': 'KLW Blend',
  'snap-8': 'Snap-8',
  'follistatin-344': 'Follistatin 344',
  'hexarelin': 'Hexarelin',
  'ghrp-2': 'GHRP-2',
  'ghrp-6': 'GHRP-6',
  'cerebrolysin': 'Cerebrolysin',
  'adipotide': 'Adipotide (FTPP)',
  'glutathione': 'Glutathione',
  'igf-1': 'IGF-1',
  'pcsk9': 'PCSK9',
  'nad-precursors': 'NMN / NR / NAD+ Precursors',
};

/**
 * Additional manually defined tag → article mappings beyond PRODUCT_ARTICLES.
 * Used for compounds mentioned prominently in articles but not as a product page.
 */
const EXTRA_TAG_ARTICLES: Record<string, string[]> = {
  'hexarelin': [
    'hexarelin-forgotten-ghrp-cardiac-effects',
    'ipamorelin-vs-ghrp2-vs-ghrp6-growth-hormone-secretagogue-comparison',
    'igf-1-peptide-research-key-biomarker',
    'mk-677-vs-ipamorelin-vs-cjc-1295-which-gh-secretagogue-research',
    'peptide-water-retention-electrolyte-research-study-design',
  ],
  'ghrp-2': [
    'ipamorelin-vs-ghrp2-vs-ghrp6-growth-hormone-secretagogue-comparison',
    'ghrp-2-pralmorelin-growth-hormone-releasing-peptide-research-guide',
    'cjc-1295-ipamorelin-gh-axis-stack-deep-dive',
    'ipamorelin-dosing-timing-protocol-design-researchers-reference',
  ],
  'ghrp-6': [
    'ipamorelin-vs-ghrp2-vs-ghrp6-growth-hormone-secretagogue-comparison',
    'ghrp-6-original-ghrelin-mimetic-research-guide',
    'cjc-1295-ipamorelin-gh-axis-stack-deep-dive',
  ],
  'follistatin-344': [
    'follistatin-344-igf-1-independent-muscle-research-guide',
    'follistatin-myostatin-inhibition-peptide-research-protocols',
    'bpc-157-tb-500-recovery-stack-deep-dive',
  ],
  'cerebrolysin': [
    'cerebrolysin-neurotrophic-peptide-research-review',
    'selank-semax-nootropic-peptide-research-overview',
    'adamax-dsip-selank-nad-nootropic-stack-protocol-deep-dive',
  ],
  'adipotide': [
    'adipotide-ftpp-experimental-adipose-targeted-research-peptide',
  ],
  'glutathione': [
    'glutathione-peptides-oxidative-stress-research-overview',
    'peptide-stacking-longevity-nad-epitalon-ss31-ghk-cu',
  ],
  'igf-1': [
    'igf-1-peptide-research-key-biomarker',
    'igf-1-vs-growth-hormone-downstream-mediator-explained',
    'mk-677-ibutamoren-oral-gh-secretagogue-guide',
    'sermorelin-ghrh-analog-anti-aging-research',
    'cjc-1295-ipamorelin-gh-axis-stack-deep-dive',
    'ipamorelin-dosing-timing-protocol-design-researchers-reference',
    'mk-677-vs-ipamorelin-vs-cjc-1295-which-gh-secretagogue-research',
    'complete-blood-panel-guide-peptide-researchers',
  ],
  'pcsk9': [
    'pcsk9-peptides-cardiovascular-research-targets',
    'glp1-agonists-cardiovascular-research-select-leader-trials',
  ],
  'nad-precursors': [
    'nad-precursors-nmn-nr-vs-direct-nad-injection-research',
    'nad-plus-research-protocols-dosing-routes-study-design',
    'nad-plus-cellular-energy-sirtuins-longevity-research',
    'peptide-stacking-longevity-nad-epitalon-ss31-ghk-cu',
  ],
};

/**
 * Build the inverted tag → article map from PRODUCT_ARTICLES.
 * Returns: Record<tagSlug, articleSlug[]>
 */
function buildTagMap(): Record<string, string[]> {
  const map: Record<string, Set<string>> = {};

  // Invert PRODUCT_ARTICLES: for each product, register it as a tag on each linked article
  for (const [productSlug, articleSlugs] of Object.entries(PRODUCT_ARTICLES)) {
    if (!map[productSlug]) map[productSlug] = new Set();
    for (const articleSlug of articleSlugs) {
      map[productSlug].add(articleSlug);
    }
  }

  // Add extra manual mappings
  for (const [tag, articleSlugs] of Object.entries(EXTRA_TAG_ARTICLES)) {
    if (!map[tag]) map[tag] = new Set();
    for (const slug of articleSlugs) {
      map[tag].add(slug);
    }
  }

  // Convert sets to arrays
  const result: Record<string, string[]> = {};
  for (const [tag, slugSet] of Object.entries(map)) {
    result[tag] = Array.from(slugSet);
  }
  return result;
}

/** Cached tag → article slugs map */
const _tagMap = buildTagMap();

/**
 * All valid tag slugs (tags that have at least 1 article).
 */
export function getAllTagSlugs(): string[] {
  return Object.keys(_tagMap).filter((tag) => _tagMap[tag].length > 0);
}

/**
 * Get articles for a given tag slug.
 * Returns articles sorted by publishedAt (newest first).
 */
export function getArticlesByTag(tagSlug: string) {
  const articleSlugs = _tagMap[tagSlug] ?? [];
  return articleSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b!.publishedAt).getTime() - new Date(a!.publishedAt).getTime()
    );
}

/**
 * Get display name for a tag slug.
 */
export function getTagDisplayName(tagSlug: string): string {
  return TAG_DISPLAY_NAMES[tagSlug] ?? tagSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Get all tags for an article (derived from the inverted map).
 * Returns: Array of { slug, displayName } for UI rendering.
 */
export function getTagsForArticle(articleSlug: string): Array<{ slug: string; displayName: string }> {
  return Object.entries(_tagMap)
    .filter(([, articleSlugs]) => articleSlugs.includes(articleSlug))
    .map(([tagSlug]) => ({
      slug: tagSlug,
      displayName: getTagDisplayName(tagSlug),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}
