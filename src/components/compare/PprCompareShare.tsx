"use client";

import { useEffect, useState } from "react";
import type { MockProduct } from "@/lib/mock-products";

interface PprCompareShareProps {
  products: MockProduct[];
}

export default function PprCompareShare({ products }: PprCompareShareProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = products.map((p) => p.slug).join(",");
    const base = `${window.location.origin}${window.location.pathname}`;
    setShareUrl(ids ? `${base}?ids=${ids}` : base);
  }, [products]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  if (products.length === 0) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-10">
      <div
        className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
      >
        <div className="min-w-0">
          <p
            className="text-[11px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
          >
            Share this comparison
          </p>
          <p className="mt-1 truncate text-sm" style={{ color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}>
            {shareUrl}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            backgroundColor: copied ? "var(--ok)" : "var(--accent)",
            color: "var(--ink)",
          }}
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
