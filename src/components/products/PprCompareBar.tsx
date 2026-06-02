"use client";

import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import type { MockProduct } from "@/lib/mock-products";

const MAX_COMPARE = 4;

export default function PprCompareBar({
  selected,
  products,
  onRemove,
  onClear,
}: {
  selected: string[];
  products: MockProduct[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  const show = selected.length >= 2;
  const chosen = selected
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is MockProduct => Boolean(p));
  const compareHref = `/compare?ids=${selected.join(",")}`;

  return (
    <div
      aria-hidden={!show}
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
      style={{
        transform: show ? "translateY(0)" : "translateY(140%)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div
        className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-4 rounded-lg px-5 py-4"
        style={{
          backgroundColor: "var(--ink-2)",
          border: "1px solid var(--steel)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
        }}
      >
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-3)" }}
        >
          Compare {selected.length}/{MAX_COMPARE}
        </span>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {chosen.map((p) => (
            <span
              key={p.slug}
              className="inline-flex items-center gap-2 rounded-full py-1 pl-3 pr-1.5 text-[12px]"
              style={{ fontFamily: "var(--font-mono)", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
            >
              {p.name}
              <button
                type="button"
                onClick={() => onRemove(p.slug)}
                aria-label={`Remove ${p.name} from comparison`}
                className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:text-[color:var(--accent)]"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] uppercase transition-colors hover:text-[color:var(--platinum)]"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-3)" }}
          >
            Clear
          </button>
          <Link
            href={compareHref}
            className="inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 text-[13px] font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
          >
            Compare <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export { MAX_COMPARE };
