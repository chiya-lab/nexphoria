"use client";

import { useMemo, useState } from "react";
import { Star, Shield, ThumbsUp, ThumbsDown, Camera } from "lucide-react";
import type { Product } from "@/lib/products";
import { getReviewSet, type PdpReview } from "@/lib/mock-reviews";

const SUMMARY = {
  average: 4.8,
  count: 247,
  distribution: [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 0 },
  ],
};

type FilterId =
  | "all"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1"
  | "photo"
  | "credential"
  | "recent"
  | "helpful";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "5", label: "5★" },
  { id: "4", label: "4★" },
  { id: "3", label: "3★" },
  { id: "2", label: "2★" },
  { id: "1", label: "1★" },
  { id: "photo", label: "With photo" },
  { id: "credential", label: "Verified credential" },
  { id: "recent", label: "Most recent" },
  { id: "helpful", label: "Most helpful" },
];

const PAGE = 4;

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? "var(--accent)" : "none"}
          stroke={i < Math.round(rating) ? "var(--accent)" : "var(--steel)"}
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: PdpReview }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const helpful = review.helpful + (vote === "up" ? 1 : 0);

  return (
    <article
      className="flex flex-col gap-3 rounded-lg p-6"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Stars rating={review.rating} />
        {review.verified && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
            }}
          >
            <Shield size={12} aria-hidden="true" />
            Verified researcher
          </span>
        )}
        {review.withPhoto && (
          <span
            className="inline-flex items-center gap-1 text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
          >
            <Camera size={12} aria-hidden="true" />
            Photo
          </span>
        )}
        <span className="ml-auto text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
          {review.date}
        </span>
      </div>

      <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
        {review.credential}
      </span>

      <h3 className="text-[16px] font-semibold leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
        {review.title}
      </h3>

      <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
        {review.body}
      </p>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <span
          className="rounded-md px-2 py-1 text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)", border: "1px solid var(--steel)" }}
        >
          Verified lot {review.lot}
        </span>
        <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
          {helpful} found this helpful
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
            Was this helpful?
          </span>
          <button
            type="button"
            onClick={() => setVote((v) => (v === "up" ? null : "up"))}
            aria-pressed={vote === "up"}
            aria-label="Mark helpful"
            className="rounded-md p-1.5 transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              border: "1px solid var(--steel)",
              color: vote === "up" ? "var(--accent)" : "var(--silver-2)",
            }}
          >
            <ThumbsUp size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setVote((v) => (v === "down" ? null : "down"))}
            aria-pressed={vote === "down"}
            aria-label="Mark not helpful"
            className="rounded-md p-1.5 transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              border: "1px solid var(--steel)",
              color: vote === "down" ? "var(--danger)" : "var(--silver-2)",
            }}
          >
            <ThumbsDown size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function PprReviewsBlock({ product }: { product: Product }) {
  const all = getReviewSet(product.slug);
  const [filter, setFilter] = useState<FilterId>("all");
  const [visible, setVisible] = useState(PAGE * 3);

  const filtered = useMemo(() => {
    let list = [...all];
    if (filter === "5" || filter === "4" || filter === "3" || filter === "2" || filter === "1") {
      const n = Number(filter);
      list = list.filter((r) => Math.round(r.rating) === n);
    } else if (filter === "photo") {
      list = list.filter((r) => r.withPhoto);
    } else if (filter === "credential") {
      list = list.filter((r) => r.verified);
    } else if (filter === "recent") {
      list = list.sort((a, b) => b.date.localeCompare(a.date));
    } else if (filter === "helpful") {
      list = list.sort((a, b) => b.helpful - a.helpful);
    }
    return list;
  }, [all, filter]);

  const shown = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Summary card */}
      <div
        className="grid grid-cols-1 gap-8 rounded-lg p-6 md:grid-cols-[auto_1fr_1.2fr] md:items-center"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <div className="flex flex-col gap-2">
          <span
            className="text-[80px] font-semibold leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
          >
            {SUMMARY.average}
          </span>
          <Stars rating={SUMMARY.average} size={18} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[18px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
            {SUMMARY.count} verified researchers
          </span>
          <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            Verified by lab affiliation + email
          </span>
        </div>

        <dl className="flex flex-col gap-2">
          {SUMMARY.distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3">
              <dt className="w-8 shrink-0 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                {d.stars}★
              </dt>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "var(--steel)" }}>
                <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: "var(--accent)" }} />
              </div>
              <dd className="w-9 shrink-0 text-right text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                {d.pct}%
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                setVisible(PAGE * 3);
              }}
              aria-pressed={active}
              className="rounded-full px-3.5 py-1.5 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                fontFamily: "var(--font-mono)",
                color: active ? "var(--accent)" : "var(--silver-1)",
                border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                backgroundColor: active ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--ink-2)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Review cards */}
      {shown.length > 0 ? (
        <div className="flex flex-col gap-4">
          {shown.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        <p
          className="rounded-lg px-6 py-10 text-center text-[14px]"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
        >
          No reviews match this filter.
        </p>
      )}

      {canLoadMore && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE)}
          className="mx-auto w-fit rounded-md px-5 py-2.5 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2"
          style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
        >
          Load more reviews
        </button>
      )}

      {/* Write a review CTA */}
      <div
        className="flex flex-col items-start gap-3 rounded-lg p-6"
        style={{ backgroundColor: "var(--ink-2)", border: "1px dashed var(--steel)" }}
      >
        <h3 className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
          Write a review
        </h3>
        <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
          Only verified purchasers can review. Sign in to your researcher account to leave one.
        </p>
        <a
          href="/account"
          className="inline-flex w-fit items-center rounded-md px-4 py-2 text-[14px] font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Sign in to review
        </a>
      </div>
    </div>
  );
}
