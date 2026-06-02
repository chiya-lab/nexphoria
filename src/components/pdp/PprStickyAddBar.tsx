"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easing } from "@/lib/motion";
import type { Product } from "@/lib/products";
import type { PdpSelection } from "@/lib/use-pdp-selection";

function money(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

/**
 * Slides up once the primary CTA scrolls out of view. `sentinelRef` should
 * wrap the main price-block CTA; when it leaves the viewport the bar appears.
 */
export default function PprStickyAddBar({
  product,
  sel,
  sentinel,
}: {
  product: Product;
  sel: PdpSelection;
  sentinel: React.RefObject<HTMLElement | null>;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [sentinel]);

  const accent = product.accentColor || "var(--accent)";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.28, ease: easing.easeOut }}
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            backgroundColor: "color-mix(in srgb, var(--ink-2) 92%, transparent)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid var(--steel)",
          }}
        >
          <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 md:px-8">
            {/* Thumb */}
            <div
              className="hidden h-12 w-12 flex-shrink-0 overflow-hidden rounded-md sm:block"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
              aria-hidden="true"
            >
              <div
                className="h-full w-full"
                style={{
                  background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${accent} 24%, transparent), transparent 65%)`,
                }}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className="truncate text-[14px] font-medium"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                {product.name}
              </span>
              <span
                className="text-[12px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
              >
                {sel.subscribe ? "Subscribe & save 12%" : "One-time"} · {money(sel.total)}
              </span>
            </div>

            {/* Compact sub toggle */}
            <button
              type="button"
              onClick={() => sel.setSubscribe(!sel.subscribe)}
              className="hidden rounded-md px-3 py-2 text-[12px] font-medium transition-colors focus:outline-none focus-visible:ring-2 md:block"
              style={{
                border: `1px solid ${sel.subscribe ? "var(--accent)" : "var(--steel)"}`,
                color: sel.subscribe ? "var(--accent)" : "var(--silver-1)",
                fontFamily: "var(--font-mono)",
              }}
              aria-pressed={sel.subscribe}
            >
              {sel.subscribe ? "Subscribed" : "Subscribe"}
            </button>

            <button
              type="button"
              onClick={sel.addToCart}
              className="flex-shrink-0 rounded-md px-5 text-[14px] font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
              style={{
                height: 44,
                backgroundColor: "var(--accent)",
                color: "var(--ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              Add to cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
