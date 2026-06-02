import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticleBySlug, type BlogSection } from "@/lib/blog";
import Breadcrumb from "@/components/Breadcrumb";
import ShareButtons from "@/components/ShareButtons";
import { categoryToSlug } from "../category/[category]/page";
import { getTagsForArticle } from "@/lib/article-tags";
import { getProduct } from "@/lib/products";
import ArticleToc, { type TocItem } from "./ArticleToc";

interface Props {
  params: Promise<{ slug: string }>;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://nexphoria.com/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.ogImage
        ? [{ url: article.ogImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.ogImage ? [article.ogImage] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function RenderSection({ section, id }: { section: BlogSection; id?: string }) {
  switch (section.type) {
    case "paragraph":
      return (
        <p
          className="text-base md:text-[17px] mb-6"
          style={{ color: "#2a2a2a", lineHeight: 1.85, fontWeight: 300 }}
        >
          {section.text}
        </p>
      );

    case "heading":
      return (
        <h2
          id={id}
          className="text-xl md:text-[1.7rem] mt-14 mb-4 scroll-mt-28"
          style={{
            fontWeight: 500,
            color: "#010101",
            letterSpacing: "-0.015em",
            lineHeight: 1.25,
          }}
        >
          {section.text}
        </h2>
      );

    case "subheading":
      return (
        <h3
          id={id}
          className="text-base md:text-lg mt-9 mb-3 scroll-mt-28"
          style={{ fontWeight: 600, color: "#010101", lineHeight: 1.35 }}
        >
          {section.text}
        </h3>
      );

    case "list":
      return (
        <ul className="mb-7 space-y-2 pl-5">
          {(section.items || []).map((item, i) => (
            <li
              key={i}
              className="text-base relative"
              style={{ color: "#2a2a2a", lineHeight: 1.75, fontWeight: 300 }}
            >
              <span
                className="absolute -left-4 top-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#B8A44C" }}
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <div
          className="rounded-lg px-6 py-5 my-8"
          style={{
            backgroundColor: "#F5F3EE",
            borderLeft: "3px solid #B8A44C",
          }}
        >
          <p
            className="text-sm md:text-base"
            style={{ color: "#333", lineHeight: 1.75, fontWeight: 300 }}
          >
            {section.text}
          </p>
        </div>
      );

    case "divider":
      return (
        <hr
          className="my-10"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        />
      );

    case "table":
      return (
        <div className="overflow-x-auto my-8">
          <table className="w-full text-sm border-collapse">
            {section.headers && (
              <thead>
                <tr style={{ borderBottom: "2px solid #d4af37" }}>
                  {section.headers.map((h, i) => (
                    <th
                      key={i}
                      className="py-2 px-3 text-left"
                      style={{ fontWeight: 600, color: "#010101", whiteSpace: "nowrap" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(section.rows || []).map((row, ri) => (
                <tr
                  key={ri}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: ri % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="py-2 px-3"
                      style={{ color: ci === 0 ? "#010101" : "#2a2a2a", fontWeight: ci === 0 ? 500 : 300, lineHeight: 1.6, verticalAlign: "top" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "disclaimer":
      return (
        <div
          className="my-8 px-5 py-4 rounded-lg text-sm"
          style={{ background: "rgba(0,0,0,0.04)", borderLeft: "3px solid #d4af37", color: "#555", lineHeight: 1.7 }}
        >
          <strong style={{ color: "#010101" }}>Research Use Only Disclaimer: </strong>
          {section.text}
        </div>
      );

    default:
      return null;
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const canonicalUrl = `https://nexphoria.com/blog/${article.slug}`;
  const imageUrl = article.ogImage
    ? article.ogImage.startsWith("http")
      ? article.ogImage
      : `https://nexphoria.com${article.ogImage}`
    : "https://nexphoria.com/og-image.jpg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: article.title,
    description: article.description,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Nexphoria Research Team",
      url: "https://nexphoria.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Nexphoria",
      url: "https://nexphoria.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nexphoria.com/logo.png",
        width: 200,
        height: 60,
      },
    },
    url: canonicalUrl,
    articleSection: article.category,
    keywords: article.category,
    wordCount: article.readMinutes * 200,
    timeRequired: `PT${article.readMinutes}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Blog",
      name: "Nexphoria Research Journal",
      url: "https://nexphoria.com/blog",
    },
  };

  // Related articles: same category first, then fill with others — up to 3
  const sameCategory = articles.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  );
  const otherCategory = articles.filter(
    (a) => a.slug !== article.slug && a.category !== article.category
  );
  const related = [...sameCategory, ...otherCategory].slice(0, 3);

  // Compound tags for this article
  const compoundTags = getTagsForArticle(article.slug);

  // Compounds referenced that map to an actual product page
  const referencedProducts = compoundTags
    .map((t) => ({ tag: t, product: getProduct(t.slug) }))
    .filter((x): x is { tag: typeof x.tag; product: NonNullable<typeof x.product> } =>
      Boolean(x.product)
    );

  // Build a unique-id'd list of headings for the sticky table of contents
  const usedIds = new Set<string>();
  const headingIds: (string | undefined)[] = [];
  const tocItems: TocItem[] = [];
  for (const section of article.body) {
    if (
      (section.type === "heading" || section.type === "subheading") &&
      section.text
    ) {
      const base = slugifyHeading(section.text) || "section";
      let unique = base;
      let n = 2;
      while (usedIds.has(unique)) {
        unique = `${base}-${n++}`;
      }
      usedIds.add(unique);
      headingIds.push(unique);
      tocItems.push({
        id: unique,
        text: section.text,
        level: section.type === "heading" ? 2 : 3,
      });
    } else {
      headingIds.push(undefined);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div style={{ backgroundColor: "#F9F9F9" }}>
        {/* Hero */}
        <section
          className="relative px-6 pt-32 pb-14 md:pt-40 md:pb-16"
          style={{ backgroundColor: "#010101" }}
        >
          <div className="max-w-3xl mx-auto">
            <Breadcrumb
              variant="dark"
              className="mb-8"
              items={[
                { label: "Home", href: "/" },
                { label: "Journal", href: "/blog" },
                { label: article.title },
              ]}
            />

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                href={`/blog/category/${categoryToSlug(article.category)}`}
                className="text-xs uppercase tracking-widest px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#B8A44C", color: "#010101" }}
              >
                {article.category}
              </Link>
              <span className="text-xs" style={{ color: "#666" }}>
                {formatDate(article.publishedAt)}
              </span>
              <span className="text-xs" style={{ color: "#666" }}>
                {article.readMinutes} min read
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl mb-6"
              style={{
                fontWeight: 500,
                color: "#F9F9F9",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {article.title}
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl"
              style={{ fontWeight: 300, lineHeight: 1.6, color: "#A0A0A0" }}
            >
              {article.description}
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            {/* Reading column */}
            <div className="mx-auto w-full" style={{ maxWidth: "720px" }}>
              <article>
                {article.body.map((section, i) => (
                  <RenderSection key={i} section={section} id={headingIds[i]} />
                ))}
              </article>

              {/* Share buttons */}
              <ShareButtons
                url={canonicalUrl}
                title={article.title}
              />

              {/* Compounds referenced — links to product pages */}
              {referencedProducts.length > 0 && (
                <div
                  className="mt-12 rounded-2xl px-6 py-6"
                  style={{
                    backgroundColor: "#F0EDE8",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-4"
                    style={{ color: "#B8A44C" }}
                  >
                    Compounds Referenced
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {referencedProducts.map(({ tag, product }) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="group flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
                        style={{
                          backgroundColor: "#F9F9F9",
                          border: "1px solid rgba(0,0,0,0.07)",
                        }}
                      >
                        <span
                          className="text-sm"
                          style={{ color: "#010101", fontWeight: 500 }}
                        >
                          {tag.displayName}
                        </span>
                        <span
                          className="text-xs inline-flex items-center gap-1"
                          style={{ color: "#B8923A" }}
                        >
                          View <span aria-hidden>→</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Explore by topic — tag pills */}
              {compoundTags.length > 0 && (
                <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                  <p
                    className="text-xs uppercase tracking-widest mb-3"
                    style={{ color: "#A0A0A0" }}
                  >
                    Explore by Topic
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {compoundTags.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/blog/tag/${t.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
                        style={{
                          backgroundColor: "#F0EDE8",
                          border: "1px solid rgba(0,0,0,0.10)",
                          color: "#555",
                        }}
                      >
                        <span style={{ color: "#B8A44C" }}>#</span>{t.displayName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="mt-12 rounded-2xl px-6 py-5"
                style={{
                  backgroundColor: "#F0EDE8",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#B8A44C" }}>
                  Research Use Only
                </p>
                <p className="text-xs" style={{ color: "#777", lineHeight: 1.7 }}>
                  All content on this site is for educational and research
                  purposes only. Nexphoria compounds are sold exclusively for
                  qualified research use. They are not intended for human
                  consumption, therapeutic use, or diagnostic purposes. Nothing on
                  this site constitutes medical advice.
                </p>
              </div>
            </div>

            {/* Sticky table of contents — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ArticleToc items={tocItems} />
              </div>
            </aside>
          </div>
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section
            className="px-6 py-20 md:py-28"
            style={{ backgroundColor: "#EAE7E3" }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-baseline justify-between mb-7">
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: "#B8A44C" }}
              >
                Related Articles
              </p>
              <Link
                href="/blog"
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: "#B8A44C" }}
              >
                All articles →
              </Link>
            </div>
              <div className={`grid gap-5 ${
                related.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
              }`}>
                {related.map((rel) => (
                  <div
                    key={rel.slug}
                    className="group rounded-lg p-6"
                    style={{
                      backgroundColor: "#F9F9F9",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Link
                        href={`/blog/category/${categoryToSlug(rel.category)}`}
                        className="text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
                        style={{ color: "#B8A44C" }}
                      >
                        {rel.category}
                      </Link>
                      {rel.category === article.category && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: "#B8A44C", color: "#010101", fontSize: "0.6rem", letterSpacing: "0.05em" }}
                        >
                          RELATED
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-base mb-2"
                      style={{
                        fontWeight: 400,
                        color: "#010101",
                        lineHeight: 1.3,
                      }}
                    >
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="hover:opacity-70 transition-opacity"
                        style={{ color: "inherit" }}
                      >
                        {rel.title}
                      </Link>
                    </h3>
                    <p
                      className="text-xs mb-3 line-clamp-2"
                      style={{ color: "#777", lineHeight: 1.6 }}
                    >
                      {rel.description}
                    </p>
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="text-xs inline-flex items-center gap-1"
                      style={{ color: "#B8A44C" }}
                    >
                      {rel.readMinutes} min read <span aria-hidden>→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "#B8A44C" }}
            >
              Research Catalog
            </p>
            <h2
              className="text-3xl md:text-4xl mb-5 font-medium tracking-tight"
              style={{
                color: "#010101",
              }}
            >
              Browse the compounds.
            </h2>
            <Link
              href="/products"
              className="btn-primary"
            >
              View Catalog
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
