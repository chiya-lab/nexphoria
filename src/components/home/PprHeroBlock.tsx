"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { X, Play } from "lucide-react";
import { easing } from "@/lib/motion";

type FeaturedSku = {
  name: string;
  mw: string;
  purity: string;
  price: number;
  accent: string;
};

// Three rotating hero SKUs. Specs mirror the catalog entries in src/lib/products.ts.
const FEATURED: FeaturedSku[] = [
  { name: "BPC-157", mw: "1419.53 g/mol", purity: "≥99.2%", price: 50, accent: "#B8E04F" },
  { name: "TB-500", mw: "4963.50 g/mol", purity: "≥98.5%", price: 54, accent: "#7FE0C8" },
  { name: "GHK-Cu", mw: "403.92 g/mol", purity: "≥99.0%", price: 66, accent: "#9FC4FF" },
];

const ROTATE_MS = 5000;

// A dark molecular card: hex lattice + a vial silhouette suggested by a
// circular gradient core under a tall rounded-rect overlay.
function VialCard({ sku }: { sku: FeaturedSku }) {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-8"
      style={{
        backgroundColor: "var(--ink-2)",
        border: "1px solid var(--steel)",
      }}
    >
      {/* Hexagonal molecular pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 480"
      >
        <defs>
          <pattern id={`hex-${sku.name}`} width="56" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <polygon
              points="28,2 52,16 52,40 28,54 4,40 4,16"
              fill="none"
              stroke="rgba(200,205,211,0.10)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id={`core-${sku.name}`} cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={sku.accent} stopOpacity="0.42" />
            <stop offset="45%" stopColor={sku.accent} stopOpacity="0.14" />
            <stop offset="100%" stopColor={sku.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="480" fill={`url(#hex-${sku.name})`} />
        {/* Glow core */}
        <circle cx="200" cy="210" r="150" fill={`url(#core-${sku.name})`} />
        {/* Vial silhouette — tall rounded rect with a cap */}
        <g opacity="0.92">
          <rect x="170" y="120" width="60" height="20" rx="4" fill="rgba(243,245,247,0.16)" />
          <rect
            x="174"
            y="140"
            width="52"
            height="220"
            rx="22"
            fill="rgba(17,19,23,0.6)"
            stroke="rgba(243,245,247,0.22)"
            strokeWidth="1.5"
          />
          {/* Liquid fill */}
          <rect x="178" y="250" width="44" height="106" rx="18" fill={sku.accent} opacity="0.22" />
          {/* Highlight */}
          <rect x="184" y="156" width="6" height="180" rx="3" fill="rgba(243,245,247,0.18)" />
        </g>
      </svg>

      {/* Spec block */}
      <div className="relative mt-auto">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--platinum)",
            letterSpacing: "-0.01em",
          }}
        >
          {sku.name}
        </p>
        <div
          className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--silver-2)" }}
        >
          <span>MW {sku.mw}</span>
          <span style={{ color: "var(--steel)" }}>·</span>
          <span>HPLC {sku.purity}</span>
          <span style={{ color: "var(--steel)" }}>·</span>
          <span style={{ color: "var(--accent)" }}>${sku.price}</span>
        </div>
      </div>
    </div>
  );
}

export default function PprHeroBlock() {
  const [index, setIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: translate the right-column visual as the hero scrolls past.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % FEATURED.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden ppr-noise"
      style={{ backgroundColor: "var(--ink)", minHeight: "calc(100vh - 72px)" }}
    >
      {/* Hex grid overlay at ~8% */}
      <div
        className="ppr-grid-hex pointer-events-none absolute inset-0"
        style={{ opacity: 0.08 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1440px] items-center px-8 py-16">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[60%_40%]">
          {/* LEFT */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easing.easeOut }}
              className="uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "var(--accent)",
              }}
            >
              RESEARCH COMPOUNDS · LOT-TRACEABLE · COLD-CHAIN
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.05 }}
              className="mt-5"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--platinum)",
              }}
            >
              Research-grade peptides.{" "}
              <span style={{ color: "var(--accent)" }}>Pharmaceutical discipline.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.1 }}
              className="mt-6"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--silver-1)",
                maxWidth: 540,
              }}
            >
              Third-party HPLC tested, lot-traceable, cold-chain logistics. Built for
              working researchers, priced for serious protocols.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easing.easeOut, delay: 0.15 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md px-7 font-semibold transition-colors"
                style={{
                  height: 56,
                  backgroundColor: "var(--accent)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Browse the catalog &rarr;
              </Link>

              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md px-7 transition-colors"
                style={{
                  height: 56,
                  border: "1px solid var(--silver-2)",
                  color: "var(--silver-1)",
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  backgroundColor: "transparent",
                }}
              >
                <Play size={16} strokeWidth={2} aria-hidden="true" />
                How we test (60s)
              </button>
            </motion.div>
          </div>

          {/* RIGHT — rotating featured SKU with parallax */}
          <motion.div
            style={{ y: visualY }}
            className="relative h-[420px] w-full sm:h-[480px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={FEATURED[index].name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.5, ease: easing.easeOut }}
                className="absolute inset-0"
              >
                <VialCard sku={FEATURED[index]} />
              </motion.div>
            </AnimatePresence>

            {/* Rotation indicators */}
            <div className="absolute -bottom-7 left-0 flex items-center gap-2">
              {FEATURED.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  aria-label={`Show ${s.name}`}
                  onClick={() => setIndex(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? 20 : 6,
                    height: 6,
                    backgroundColor: i === index ? "var(--accent)" : "var(--steel)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video drawer placeholder */}
      <AnimatePresence>
        {videoOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[70]"
              style={{ backgroundColor: "rgba(10,11,13,0.7)" }}
              onClick={() => setVideoOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="How we test"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: easing.easeInOutQuart }}
              className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-[560px] flex-col"
              style={{ backgroundColor: "var(--ink-2)", borderLeft: "1px solid var(--steel)" }}
            >
              <div
                className="flex items-center justify-between px-8"
                style={{ height: 72, borderBottom: "1px solid var(--steel)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "var(--platinum)",
                  }}
                >
                  How we test
                </span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setVideoOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded focus:outline-none focus-visible:ring-2"
                  style={{ color: "var(--silver-1)" }}
                >
                  <X size={20} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-1 items-center justify-center p-8">
                <div
                  className="flex aspect-video w-full items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
                >
                  <span
                    style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--silver-2)" }}
                  >
                    Walkthrough video coming soon
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
