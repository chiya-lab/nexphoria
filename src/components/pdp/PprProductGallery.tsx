"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { easing } from "@/lib/motion";
import type { Product } from "@/lib/products";

const ANGLES = ["Front", "Label", "Cap", "Profile"];

/**
 * Placeholder vial visual — a void-black card with a hexagonal molecular
 * lattice and a radial-gradient "vial" silhouette. The `angle` index shifts
 * the highlight so the four thumbnails read as four distinct views. Real
 * product photography replaces this later.
 */
function VialVisual({ product, angle, large }: { product: Product; angle: number; large?: boolean }) {
  const accent = product.accentColor || "var(--accent)";
  const shift = ["50%", "38%", "62%", "44%"][angle % 4];
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: "var(--ink)" }}
      aria-hidden="true"
    >
      <div className="ppr-grid-hex absolute inset-0" style={{ opacity: 0.06 }} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${shift} 42%, color-mix(in srgb, ${accent} 22%, transparent), transparent 60%)`,
        }}
      />
      {/* Vial silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: large ? 110 : 48,
            height: large ? 300 : 130,
            borderRadius: large ? 24 : 12,
            background:
              "linear-gradient(160deg, color-mix(in srgb, var(--silver-1) 18%, transparent), color-mix(in srgb, var(--ink-3) 90%, transparent))",
            border: "1px solid var(--steel)",
            boxShadow: `0 0 60px color-mix(in srgb, ${accent} 18%, transparent)`,
            transform: `translateX(calc(${shift} - 50%))`,
          }}
        />
      </div>
    </div>
  );
}

export default function PprProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label="Open image zoom"
        className="relative aspect-square w-full overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2"
        style={{ border: "1px solid var(--steel)", cursor: "zoom-in" }}
      >
        <VialVisual product={product} angle={selected} large />
      </button>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-4 gap-2">
        {ANGLES.map((label, i) => {
          const active = i === selected;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`View ${label}`}
              aria-pressed={active}
              className="relative aspect-square overflow-hidden rounded-md focus:outline-none focus-visible:ring-2"
              style={{ border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}` }}
            >
              <VialVisual product={product} angle={i} />
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easing.easeOut }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ backgroundColor: "color-mix(in srgb, var(--ink) 92%, transparent)" }}
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} image zoom`}
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close zoom"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded focus:outline-none focus-visible:ring-2"
              style={{ color: "var(--silver-1)", border: "1px solid var(--steel)" }}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: easing.easeOut }}
              className="aspect-square w-full max-w-[640px] overflow-hidden rounded-lg"
              style={{ border: "1px solid var(--steel)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <VialVisual product={product} angle={selected} large />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
