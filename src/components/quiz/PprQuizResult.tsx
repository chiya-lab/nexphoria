"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Layers, Mail, RotateCcw, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { toCartProduct, type MockProduct } from "@/lib/mock-products";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { ProtocolResult } from "@/lib/quiz-engine";

interface PprQuizResultProps {
  result: ProtocolResult;
  email: string | null;
  onRestart: () => void;
}

const TAG_LABEL: Record<string, string> = {
  "tissue-repair": "Tissue repair",
  metabolic: "Metabolic",
  "sleep-recovery": "Sleep & recovery",
  performance: "Performance",
  "anti-aging": "Anti-aging",
};

export default function PprQuizResult({ result, email, onRestart }: PprQuizResultProps) {
  const { addItem, openDrawer } = useCart();
  const [added, setAdded] = useState(false);
  const { primary, supporting } = result;

  const all = useMemo(() => [primary, ...supporting], [primary, supporting]);
  const stackTotal = all.reduce((sum, p) => sum + p.price, 0);
  const stackSlugs = all.map((p) => p.slug).join(",");

  const addAll = () => {
    for (const p of all) {
      const real = toCartProduct(p);
      addItem(real, "vial", real.dosages?.[0], 0);
    }
    setAdded(true);
    openDrawer();
  };

  return (
    <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <motion.div variants={staggerItem()} className="flex flex-col gap-2 text-center">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}>
          Your recommended protocol
        </span>
        <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          {primary.name} protocol
        </h2>
        {result.matchedTags.length > 0 && (
          <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
            Matched to {result.matchedTags.map((t) => TAG_LABEL[t] ?? t).join(", ")}.
          </p>
        )}
      </motion.div>

      {/* Primary */}
      <motion.div variants={staggerItem()}>
        <ProtocolCard product={primary} role="Primary compound" highlight />
      </motion.div>

      {/* Supporting */}
      <motion.div variants={staggerItem()} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {supporting.map((p) => (
          <ProtocolCard key={p.slug} product={p} role="Supporting compound" highlight={false} />
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div variants={staggerItem()} className="flex flex-col gap-3">
        <button
          type="button"
          onClick={addAll}
          className="flex items-center justify-center gap-2 rounded-md px-6 py-4 text-[15px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          {added ? <Check size={18} aria-hidden="true" /> : <ShoppingCart size={18} aria-hidden="true" />}
          {added ? "Added to cart" : `Add all 3 to cart — $${stackTotal}`}
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/products/bundles?stack=${encodeURIComponent(stackSlugs)}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            <Layers size={16} aria-hidden="true" />
            View as stack
          </Link>
          <Link
            href={email ? `/account/orders` : `/contact`}
            className="flex flex-1 items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            <Mail size={16} aria-hidden="true" />
            {email ? "Sent to your inbox" : "Email me this result"}
          </Link>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mx-auto flex items-center gap-2 py-2 text-[13px] focus:outline-none focus-visible:ring-2"
          style={{ color: "var(--silver-2)", fontFamily: "var(--font-body)" }}
        >
          <RotateCcw size={14} aria-hidden="true" />
          Retake the quiz
        </button>
      </motion.div>

      <p className="text-center text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Suggestions are catalog matches for research planning. For research use only — not medical guidance.
      </p>
    </motion.div>
  );
}

function ProtocolCard({ product, role, highlight }: { product: MockProduct; role: string; highlight: boolean }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col gap-2 rounded-xl p-5 transition-colors focus:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: "var(--ink)",
        border: `1px solid ${highlight ? "var(--accent)" : "var(--steel)"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: highlight ? "var(--accent)" : "var(--silver-2)" }}>
          {role}
        </span>
        <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
          {product.purity}
        </span>
      </div>
      <span className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
        {product.name}
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
          {product.category}
        </span>
        <span className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}>
          ${product.price}
        </span>
      </div>
    </Link>
  );
}
