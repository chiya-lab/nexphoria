"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface BlogCardData {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  readMinutes: number;
  publishedAt: string;
  publishedLabel: string;
}

const PAGE_SIZE = 12;

export default function BlogIndexClient({
  articles,
}: {
  articles: BlogCardData[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const counts: Record<string, { name: string; slug: string; count: number }> = {};
    for (const a of articles) {
      if (!counts[a.category]) {
        counts[a.category] = { name: a.category, slug: a.categorySlug, count: 0 };
      }
      counts[a.category].count += 1;
    }
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [articles]);

  const filtered = useMemo(() => {
    if (!activeCategory) return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function selectCategory(name: string | null) {
    setActiveCategory(name);
    setVisible(PAGE_SIZE);
  }

  const chipBase =
    "text-xs px-4 py-2 rounded-full transition-colors cursor-pointer";

  return (
    <>
      {/* Category filter */}
      <section
        className="px-6 py-5"
        style={{
          backgroundColor: "#0e0e0e",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={chipBase}
              style={
                activeCategory === null
                  ? {
                      backgroundColor: "#B8A44C",
                      border: "1px solid #B8A44C",
                      color: "#010101",
                      fontWeight: 600,
                    }
                  : {
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#A0A0A0",
                    }
              }
            >
              All ({articles.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => selectCategory(c.name)}
                className={chipBase}
                style={
                  activeCategory === c.name
                    ? {
                        backgroundColor: "#B8A44C",
                        border: "1px solid #B8A44C",
                        color: "#010101",
                        fontWeight: 600,
                      }
                    : {
                        backgroundColor: "transparent",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#A0A0A0",
                      }
                }
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: "#B8A44C" }}
            >
              {activeCategory ?? "All Articles"}
            </p>
            <span className="text-xs" style={{ color: "#A0A0A0" }}>
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((article) => (
              <article key={article.slug} className="group h-full">
                <div
                  className="rounded-2xl h-full flex flex-col card-shadow card-shadow-hover transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderTop: "2px solid #B8A44C",
                    backgroundColor: "#fff",
                  }}
                >
                  <div className="p-7 flex flex-col h-full">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Link
                        href={`/blog/category/${article.categorySlug}`}
                        className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: "#B8A44C", color: "#010101" }}
                      >
                        {article.category}
                      </Link>
                      <span className="text-xs" style={{ color: "#A0A0A0" }}>
                        {article.readMinutes} min
                      </span>
                    </div>
                    <h3
                      className="text-lg mb-3"
                      style={{
                        fontWeight: 500,
                        color: "#010101",
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:opacity-80 transition-opacity"
                        style={{ color: "inherit" }}
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p
                      className="text-sm mb-5"
                      style={{ color: "#666", lineHeight: 1.65, fontWeight: 300 }}
                    >
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xs" style={{ color: "#A0A0A0" }}>
                        {article.publishedLabel}
                      </span>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-xs inline-flex items-center gap-1"
                        style={{ color: "#B8923A", fontWeight: 500 }}
                      >
                        Read <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn-primary"
              >
                Load more articles
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
