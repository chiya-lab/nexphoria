import type { BlogArticle, BlogSection } from "./blog-types";

/**
 * The article data model carries no explicit citation count, so we derive a
 * stable presentational figure from the slug + length. Deterministic per slug,
 * so the index card and the article header always agree.
 */
export function estimateCitations(slug: string, readMinutes: number): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const base = 6 + Math.round(readMinutes * 0.6);
  return base + (hash % 9); // ~8-30 range
}

/** URL-/anchor-safe id for a heading string. */
export function headingId(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug ? `${slug}-${index}` : `section-${index}`;
}

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Walk the structured article body and emit a table-of-contents from heading
 * (H2) and subheading (H3) sections. The returned ids match the ids assigned
 * by the renderer, which keys off the section's position in `body`.
 */
export function buildToc(body: BlogSection[]): TocEntry[] {
  const toc: TocEntry[] = [];
  body.forEach((section, i) => {
    if (section.type === "heading" && section.text) {
      toc.push({ id: headingId(section.text, i), text: section.text, level: 2 });
    } else if (section.type === "subheading" && section.text) {
      toc.push({ id: headingId(section.text, i), text: section.text, level: 3 });
    }
  });
  return toc;
}

export function articleReferenceUrl(article: BlogArticle): string {
  return `https://nexphoria.com/blog/${article.slug}`;
}
