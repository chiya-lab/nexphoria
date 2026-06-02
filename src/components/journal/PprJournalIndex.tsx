"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export interface JournalCard {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  readMinutes: number;
  publishedAt: string;
  citations: number;
}

const PAGE_SIZE = 12;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA"); // YYYY-MM-DD
}

export default function PprJournalIndex({
  articles,
  categories,
}: {
  articles: JournalCard[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = activeCategory === "All" || a.category === activeCategory;
      const matchesQuery = q === "" || a.title.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [articles, activeCategory, query]);

  // Reset the visible window whenever the filter or search changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeCategory, query]);

  // Infinite scroll: reveal another page when the sentinel enters the viewport.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length]);

  const shown = filtered.slice(0, visible);
  const chips = ["All", ...categories];

  return (
    <div>
      {/* Filter + search controls */}
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const active = chip === activeCategory;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveCategory(chip)}
                  className="rounded-full px-4 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.04em",
                    backgroundColor: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--ink)" : "var(--silver-2)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-[320px]">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--silver-3)" }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search article titles"
              aria-label="Search article titles"
              className="w-full rounded-md py-2.5 pl-9 pr-3 text-[14px] focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: "var(--ink-2)",
                border: "1px solid var(--steel)",
                color: "var(--platinum)",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        </div>

        <p
          className="mt-5 text-[12px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
        >
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      {/* Card grid */}
      <div className="mx-auto mt-8 max-w-[1200px] px-6">
        {shown.length === 0 ? (
          <p
            className="py-20 text-center text-[15px]"
            style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
          >
            No entries match that search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col rounded-lg p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--steel)")}
              >
                <span
                  className="text-[11px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--accent)" }}
                >
                  {a.category}
                </span>
                <h3
                  className="mt-3 transition-colors group-hover:text-[color:var(--accent)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "var(--platinum)",
                    lineHeight: 1.22,
                  }}
                >
                  {a.title}
                </h3>
                <p
                  className="mt-3 text-[14px]"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--silver-2)",
                    lineHeight: 1.55,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {a.description}
                </p>
                <div
                  className="mt-auto flex items-center gap-2 pt-6 text-[12px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                >
                  <span>{a.readMinutes} min read</span>
                  <span style={{ color: "var(--steel)" }}>·</span>
                  <span>{a.citations} citations</span>
                  <span style={{ color: "var(--steel)" }}>·</span>
                  <span>{formatDate(a.publishedAt)}</span>
                </div>
                <span
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium"
                  style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
                >
                  Read <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        )}

        {visible < filtered.length && (
          <div ref={sentinelRef} className="h-12" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
