"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { mockReviews } from "@/lib/mock-reviews";
import { easing, duration } from "@/lib/motion";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = rating - i >= 1;
        const half = !filled && rating - i >= 0.5;
        return (
          <Star
            key={i}
            size={16}
            aria-hidden="true"
            style={{ color: "var(--accent)" }}
            fill={filled || half ? "var(--accent)" : "none"}
            fillOpacity={half ? 0.5 : 1}
          />
        );
      })}
    </div>
  );
}

export default function PprReviewCarousel() {
  const [index, setIndex] = useState(0);
  const total = mockReviews.length;
  const review = mockReviews[index];

  const go = (next: number) => setIndex((next + total) % total);

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-[820px]">
        <p
          className="text-center text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          From the bench
        </p>

        <div className="relative mt-8 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: duration.base, ease: easing.easeOut }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <Stars rating={review.rating} />
                <span className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  {review.rating.toFixed(1)}
                </span>
              </div>

              <blockquote
                className="mx-auto mt-6 max-w-[680px]"
                style={{ fontFamily: "var(--font-body)", fontSize: 21, color: "var(--platinum)", lineHeight: 1.5, fontWeight: 400 }}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
                  {review.credential}
                </span>
                <span style={{ color: "var(--steel)" }}>·</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", border: "1px solid var(--steel)", color: "var(--accent)" }}
                >
                  {review.compound}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous review"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-[color:var(--accent)]"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {mockReviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className="h-2 w-2 rounded-full transition-colors"
                style={{ backgroundColor: i === index ? "var(--accent)" : "var(--steel)" }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next review"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-[color:var(--accent)]"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
