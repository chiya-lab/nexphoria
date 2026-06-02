"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { articles } from "@/lib/blog";
import Link from "next/link";
import { trackSearch } from "@/lib/analytics";

interface SearchResult {
  type: "product" | "article" | "page";
  title: string;
  subtitle?: string;
  href: string;
}

const STATIC_PAGES: SearchResult[] = [
  { type: "page", title: "About", href: "/about" },
  { type: "page", title: "Science & Testing", href: "/science" },
  { type: "page", title: "Contact", href: "/contact" },
  { type: "page", title: "Research Hub", href: "/resources" },
  { type: "page", title: "Research Blog", href: "/blog" },
  { type: "page", title: "Compound Index", href: "/compounds" },
  { type: "page", title: "FAQs", href: "/faq" },
  { type: "page", title: "Shipping & Cold-Chain", href: "/shipping" },
  { type: "page", title: "Tools", href: "/tools" },
];

const POPULAR_COMPOUNDS = [
  { label: "BPC-157", href: "/products/bpc-157" },
  { label: "Tirzepatide", href: "/products/tirzepatide" },
  { label: "Semaglutide", href: "/products/semaglutide" },
  { label: "TB-500", href: "/products/tb-500" },
  { label: "Ipamorelin", href: "/products/ipamorelin" },
  { label: "MK-677", href: "/products/mk-677" },
];

const CATEGORY_JUMPS = [
  { label: "Recovery & Healing", href: "/products?cat=Recovery+%26+Healing" },
  { label: "Weight Management", href: "/products?cat=Weight+Management" },
  { label: "Growth Hormone", href: "/products?cat=Growth+Hormone" },
  { label: "Cognitive", href: "/products?cat=Cognitive" },
];

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Open with Cmd+K or Ctrl+K, or custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    const handleOpenSearch = () => {
      setIsOpen(true);
    };
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fire search event after 600ms idle (debounced)
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      trackSearch(query.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  // Search logic — 5 products + 3 articles max
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const q = query.toLowerCase();
    const productResults: SearchResult[] = [];
    const articleResults: SearchResult[] = [];

    // Search products (max 5)
    products
      .filter((p) => !p.comingSoon)
      .forEach((p) => {
        if (
          productResults.length < 5 &&
          (p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tagline?.toLowerCase().includes(q))
        ) {
          productResults.push({
            type: "product",
            title: p.name,
            subtitle: p.category,
            href: `/products/${p.slug}`,
          });
        }
      });

    // Search articles (max 3)
    articles.forEach((a) => {
      if (
        articleResults.length < 3 &&
        (a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q))
      ) {
        articleResults.push({
          type: "article",
          title: a.title,
          subtitle: a.category,
          href: `/blog/${a.slug}`,
        });
      }
    });

    // Pages (fill remaining up to 2 extra)
    const pageResults: SearchResult[] = [];
    STATIC_PAGES.forEach((page) => {
      if (page.title.toLowerCase().includes(q)) {
        pageResults.push(page);
      }
    });

    setResults([...productResults, ...articleResults, ...pageResults.slice(0, 2)]);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleNavigate(results[selectedIndex].href);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-overlay fixed inset-0 z-[60] flex items-start justify-center sm:pt-[10vh] sm:px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          {/* Panel — full-screen on mobile, centered modal on desktop */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ opacity: 0, scale: 0.96, y: -24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full sm:h-auto flex flex-col sm:block border-0 sm:border sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{
              maxWidth: "600px",
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E5E5",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b"
              style={{ borderColor: "#E5E5E5" }}
            >
              <Search
                className="w-5 h-5 flex-shrink-0"
                aria-hidden="true"
                style={{ color: "#999999" }}
              />
              <label htmlFor="search-input" className="sr-only">
                Search products, articles, and pages
              </label>
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search compounds, articles, guides…"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-[#AAAAAA]"
                style={{
                  color: "#1A1A1A",
                  caretColor: "#B8A44C",
                  // gold focus ring handled via CSS below
                }}
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-activedescendant={
                  results.length > 0 ? `search-result-${selectedIndex}` : undefined
                }
              />
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-[#F5F5F5] flex-shrink-0"
                aria-label="Close search"
              >
                <X className="w-4 h-4" style={{ color: "#666666" }} />
              </button>
            </div>

            {/* Results */}
            <div
              id="search-results"
              role="listbox"
              aria-label="Search results"
              className="flex-1 sm:flex-none sm:max-h-[420px] overflow-y-auto"
            >
              {/* Live region for screen readers */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {query && results.length === 0 && "No results found"}
                {results.length > 0 &&
                  `${results.length} result${results.length !== 1 ? "s" : ""} found`}
              </div>

              {query && results.length === 0 && (
                <div className="px-5 py-10 text-center text-sm" style={{ color: "#666666" }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {!query && (
                <div className="px-5 py-6">
                  <div className="mb-6">
                    <p
                      className="text-[10px] uppercase tracking-widest font-medium mb-3"
                      style={{ color: "#B8A44C", letterSpacing: "0.2em" }}
                    >
                      Popular Compounds
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_COMPOUNDS.map((c) => (
                        <button
                          key={c.href}
                          onClick={() => handleNavigate(c.href)}
                          className="px-3 py-1.5 text-xs font-medium rounded-full border transition-colors hover:bg-[#FBF9F5]"
                          style={{ borderColor: "#E5E5E5", color: "#1A1A1A" }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase tracking-widest font-medium mb-3"
                      style={{ color: "#B8A44C", letterSpacing: "0.2em" }}
                    >
                      Jump to a Category
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORY_JUMPS.map((cat) => (
                        <button
                          key={cat.href}
                          onClick={() => handleNavigate(cat.href)}
                          className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border text-left transition-colors hover:bg-[#FBF9F5]"
                          style={{ borderColor: "#E5E5E5", color: "#1A1A1A" }}
                        >
                          <span className="truncate">{cat.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#B8A44C" }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs mt-6 text-center" style={{ color: "#CCCCCC" }}>
                    Or type to search compounds, guides, and pages
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {/* Section label for products */}
                  {results.some((r) => r.type === "product") && (
                    <div
                      className="px-5 py-2 text-[10px] uppercase tracking-widest font-medium"
                      style={{ color: "#B8A44C", letterSpacing: "0.2em" }}
                    >
                      Compounds
                    </div>
                  )}
                  {results
                    .filter((r) => r.type === "product")
                    .map((result, i) => {
                      const absIndex = results.indexOf(result);
                      return (
                        <button
                          key={`product-${result.href}`}
                          id={`search-result-${absIndex}`}
                          role="option"
                          aria-selected={absIndex === selectedIndex}
                          onClick={() => handleNavigate(result.href)}
                          onMouseEnter={() => setSelectedIndex(absIndex)}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                          style={{
                            backgroundColor:
                              absIndex === selectedIndex ? "#FBF9F5" : "transparent",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-semibold uppercase"
                            style={{ backgroundColor: "rgba(196,162,101,0.12)", color: "#B8A44C" }}
                          >
                            {result.title.slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium truncate"
                              style={{ color: "#1A1A1A" }}
                            >
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs truncate" style={{ color: "#999999" }}>
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          {absIndex === selectedIndex && (
                            <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "#B8A44C" }} />
                          )}
                        </button>
                      );
                    })}

                  {/* Section label for articles */}
                  {results.some((r) => r.type === "article") && (
                    <div
                      className="px-5 pt-3 pb-2 text-[10px] uppercase tracking-widest font-medium"
                      style={{ color: "#B8A44C", letterSpacing: "0.2em", borderTop: "1px solid #F0EDE7" }}
                    >
                      Articles
                    </div>
                  )}
                  {results
                    .filter((r) => r.type === "article")
                    .map((result) => {
                      const absIndex = results.indexOf(result);
                      return (
                        <button
                          key={`article-${result.href}`}
                          id={`search-result-${absIndex}`}
                          role="option"
                          aria-selected={absIndex === selectedIndex}
                          onClick={() => handleNavigate(result.href)}
                          onMouseEnter={() => setSelectedIndex(absIndex)}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                          style={{
                            backgroundColor:
                              absIndex === selectedIndex ? "#FBF9F5" : "transparent",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-medium"
                            style={{ backgroundColor: "rgba(100,100,100,0.08)", color: "#888" }}
                          >
                            A
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium truncate"
                              style={{ color: "#1A1A1A" }}
                            >
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs truncate" style={{ color: "#999999" }}>
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          {absIndex === selectedIndex && (
                            <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "#B8A44C" }} />
                          )}
                        </button>
                      );
                    })}

                  {/* Pages */}
                  {results
                    .filter((r) => r.type === "page")
                    .map((result) => {
                      const absIndex = results.indexOf(result);
                      return (
                        <button
                          key={`page-${result.href}`}
                          id={`search-result-${absIndex}`}
                          role="option"
                          aria-selected={absIndex === selectedIndex}
                          onClick={() => handleNavigate(result.href)}
                          onMouseEnter={() => setSelectedIndex(absIndex)}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                          style={{
                            backgroundColor:
                              absIndex === selectedIndex ? "#FBF9F5" : "transparent",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-medium"
                            style={{ backgroundColor: "rgba(196,162,101,0.06)", color: "#B8A44C" }}
                          >
                            Pg
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium truncate"
                              style={{ color: "#1A1A1A" }}
                            >
                              {result.title}
                            </div>
                          </div>
                          {absIndex === selectedIndex && (
                            <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "#B8A44C" }} />
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div
              className="px-5 py-2.5 border-t flex items-center gap-4 text-[10px]"
              style={{ borderColor: "#F0EDE7", color: "#AAAAAA", letterSpacing: "0.05em" }}
            >
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
              <span className="ml-auto opacity-60">⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Trigger button component to be used in header
export function SearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors hover:bg-[#F5F5F5]"
      style={{ borderColor: "#E5E5E5", color: "#666666" }}
      aria-label="Open search (⌘K)"
    >
      <Search className="w-3.5 h-3.5" />
      <span className="hidden lg:inline">Search</span>
    </button>
  );
}
