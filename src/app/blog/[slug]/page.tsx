import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticleBySlug, type BlogSection } from "@/lib/blog";
import { categoryToSlug } from "../category/[category]/page";
import { getTagsForArticle } from "@/lib/article-tags";
import { buildToc, estimateCitations, headingId } from "@/lib/journal-meta";
import { EmailCapture } from "@/components/email-capture";
import PprArticleToc from "@/components/journal/PprArticleToc";
import PprCitedCompounds from "@/components/journal/PprCitedCompounds";
import PprShareRow from "@/components/journal/PprShareRow";

interface Props {
  params: Promise<{ slug: string }>;
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
  return new Date(iso).toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function RenderSection({ section, index }: { section: BlogSection; index: number }) {
  switch (section.type) {
    case "paragraph":
      return (
        <p
          className="mb-6"
          style={{ color: "var(--silver-1)", fontSize: 17, lineHeight: 1.65, fontWeight: 400 }}
        >
          {section.text}
        </p>
      );

    case "heading":
      return (
        <h2
          id={headingId(section.text ?? "", index)}
          className="mt-12 mb-4 inline-block scroll-mt-28 pb-1.5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 600,
            color: "var(--platinum)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            borderBottom: "2px solid var(--accent)",
          }}
        >
          {section.text}
        </h2>
      );

    case "subheading":
      return (
        <h3
          id={headingId(section.text ?? "", index)}
          className="mt-8 mb-3 scroll-mt-28"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--platinum)",
            lineHeight: 1.3,
          }}
        >
          {section.text}
        </h3>
      );

    case "list":
      return (
        <ul className="mb-7 space-y-2.5 pl-5">
          {(section.items || []).map((item, i) => (
            <li
              key={i}
              className="relative"
              style={{ color: "var(--silver-1)", fontSize: 17, lineHeight: 1.6, fontWeight: 400 }}
            >
              <span
                className="absolute -left-4 top-2.5 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <div
          className="my-8 rounded-md px-6 py-5"
          style={{ backgroundColor: "var(--ink-2)", borderLeft: "3px solid var(--accent)" }}
        >
          <p style={{ color: "var(--silver-1)", fontSize: 16, lineHeight: 1.65, fontWeight: 400 }}>
            {section.text}
          </p>
        </div>
      );

    case "divider":
      return <hr className="my-10" style={{ border: "none", borderTop: "1px solid var(--steel)" }} />;

    case "table":
      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            {section.headers && (
              <thead>
                <tr style={{ backgroundColor: "var(--ink-2)" }}>
                  {section.headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2.5 text-left"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        color: "var(--platinum)",
                        border: "1px solid var(--steel)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(section.rows || []).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-2.5"
                      style={{
                        color: ci === 0 ? "var(--platinum)" : "var(--silver-1)",
                        fontFamily: ci === 0 ? "var(--font-body)" : "var(--font-mono)",
                        fontWeight: ci === 0 ? 500 : 400,
                        border: "1px solid var(--steel)",
                        lineHeight: 1.55,
                        verticalAlign: "top",
                      }}
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
          className="my-8 rounded-md px-5 py-4 text-[14px]"
          style={{ backgroundColor: "var(--ink-2)", borderLeft: "3px solid var(--accent)", color: "var(--silver-2)", lineHeight: 1.65 }}
        >
          <strong style={{ color: "var(--platinum)" }}>Research Use Only: </strong>
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

  const citations = estimateCitations(article.slug, article.readMinutes);
  const toc = buildToc(article.body);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: article.title,
    description: article.description,
    image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { "@type": "Organization", name: "Nexphoria Research Team", url: "https://nexphoria.com" },
    publisher: {
      "@type": "Organization",
      name: "Nexphoria",
      url: "https://nexphoria.com",
      logo: { "@type": "ImageObject", url: "https://nexphoria.com/logo.png", width: 200, height: 60 },
    },
    url: canonicalUrl,
    articleSection: article.category,
    keywords: article.category,
    wordCount: article.readMinutes * 200,
    timeRequired: `PT${article.readMinutes}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: { "@type": "Blog", name: "Nexphoria Journal", url: "https://nexphoria.com/blog" },
  };

  const sameCategory = articles.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  );
  const otherCategory = articles.filter(
    (a) => a.slug !== article.slug && a.category !== article.category
  );
  const related = [...sameCategory, ...otherCategory].slice(0, 3);

  const compoundTags = getTagsForArticle(article.slug);
  const citedSlugs = compoundTags.map((t) => t.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main style={{ backgroundColor: "var(--ink)" }}>
        {/* Article header */}
        <section className="ppr-grid-hex px-6 pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-[1120px]">
            <Link
              href={`/blog/category/${categoryToSlug(article.category)}`}
              className="text-[11px] uppercase transition-colors hover:text-[color:var(--accent-glow)]"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
            >
              {article.category}
            </Link>
            <h1
              className="mt-4 max-w-[900px]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(34px, 6vw, 56px)",
                fontWeight: 600,
                color: "var(--platinum)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              {article.title}
            </h1>
            <div
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
            >
              <span>Nexphoria Research Team</span>
              <span style={{ color: "var(--steel)" }}>·</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span style={{ color: "var(--steel)" }}>·</span>
              <span>{article.readMinutes} min read</span>
              <span style={{ color: "var(--steel)" }}>·</span>
              <span>{citations} citations</span>
            </div>
          </div>
        </section>

        {/* Featured image placeholder */}
        <section className="px-6">
          <div className="mx-auto max-w-[1120px]">
            <div
              className="ppr-grid-hex flex h-[260px] items-end rounded-lg p-6 md:h-[360px]"
              style={{ border: "1px solid var(--steel)" }}
            >
              <span
                className="text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-3)" }}
              >
                {article.category}
              </span>
            </div>
          </div>
        </section>

        {/* Body + sticky TOC */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto flex max-w-[1120px] gap-12">
            <article className="min-w-0 flex-1" style={{ maxWidth: 800 }}>
              {article.body.map((section, i) => (
                <RenderSection key={i} section={section} index={i} />
              ))}

              {/* References note (Vancouver-style placeholder) */}
              <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--steel)" }}>
                <p
                  className="mb-2 text-[12px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-3)" }}
                >
                  References
                </p>
                <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.6 }}>
                  Primary-literature citations for this review are catalogued in the Nexphoria research
                  library. Contact research@nexphoria.com for the full Vancouver-format reference list.
                </p>
              </div>

              {/* Share */}
              <div className="mt-10">
                <PprShareRow url={canonicalUrl} title={article.title} />
              </div>
            </article>

            <aside className="hidden w-[240px] flex-shrink-0 lg:block">
              <PprArticleToc entries={toc} />
            </aside>
          </div>
        </section>

        {/* Footer: author bio + tags + cited compounds */}
        <section className="px-6 pb-4">
          <div className="mx-auto max-w-[1120px]">
            {/* Author bio card */}
            <div
              className="flex flex-col gap-4 rounded-lg p-6 sm:flex-row sm:items-center"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-[18px]"
                style={{ backgroundColor: "var(--ink-3)", color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 600 }}
                aria-hidden="true"
              >
                NX
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--platinum)" }}>
                  Nexphoria Research Team
                </p>
                <p className="mt-1 text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}>
                  Peptide chemists and assay scientists writing methods-grade reviews for the bench.
                </p>
              </div>
            </div>

            {/* Tags */}
            {compoundTags.length > 0 && (
              <div className="mt-8">
                <p
                  className="mb-3 text-[12px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-3)" }}
                >
                  Tagged
                </p>
                <div className="flex flex-wrap gap-2">
                  {compoundTags.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/blog/tag/${t.slug}`}
                      className="rounded-full px-3 py-1.5 text-[12px] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        border: "1px solid var(--steel)",
                        color: "var(--silver-2)",
                      }}
                    >
                      {t.displayName}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cited compounds conversion rail */}
            {citedSlugs.length > 0 && (
              <div className="mt-12">
                <PprCitedCompounds slugs={citedSlugs} />
              </div>
            )}
          </div>
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="px-6 py-16 md:py-20">
            <div className="mx-auto max-w-[1120px]">
              <div className="mb-7 flex items-baseline justify-between">
                <p
                  className="text-[12px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
                >
                  Related articles
                </p>
                <Link
                  href="/blog"
                  className="text-[13px] transition-colors hover:text-[color:var(--platinum)]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
                >
                  All articles &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group flex h-full flex-col rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
                  >
                    <span
                      className="text-[11px] uppercase"
                      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--accent)" }}
                    >
                      {rel.category}
                    </span>
                    <h3
                      className="mt-3 transition-colors group-hover:text-[color:var(--accent)]"
                      style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.3 }}
                    >
                      {rel.title}
                    </h3>
                    <span
                      className="mt-auto pt-5 text-[12px]"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                    >
                      {rel.readMinutes} min read &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter band */}
        <section className="px-6 py-24" style={{ backgroundColor: "var(--ink-2)" }}>
          <div className="mx-auto max-w-[640px] text-center">
            <p
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
            >
              Lab notes, monthly
            </p>
            <h2
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
            >
              Keep reading the literature.
            </h2>
            <p
              className="mx-auto mt-4 max-w-[520px] text-[15px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}
            >
              New compound reviews and methodology notes, first Monday of every month. No promotions.
            </p>
            <div className="mx-auto mt-8 max-w-[480px]">
              <EmailCapture variant="dark" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
