"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStackStore, encodeStack } from "@/lib/stack-store";
import { duration, easing } from "@/lib/motion";

interface PprStackShareModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PprStackShareModal({ open, onClose }: PprStackShareModalProps) {
  const items = useStackStore((s) => s.items);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const encoded = encodeStack(items);
    if (typeof window === "undefined") return `/stack-builder?stack=${encoded}`;
    const base = `${window.location.origin}/stack-builder`;
    return encoded ? `${base}?stack=${encodeURIComponent(encoded)}` : base;
  }, [items]);

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easing.easeOut }}
          style={{ background: "rgba(10,11,13,0.78)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Share protocol link"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: duration.base, ease: easing.easeOut }}
            className="w-full max-w-md rounded-xl p-6"
            style={{ background: "var(--ink-2)", border: "1px solid var(--steel)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  Share this protocol
                </h2>
                <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                  This link encodes your compound selection, pack sizes, doses, and timing. Anyone who opens it loads the same protocol.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded px-2 py-1 text-[16px] leading-none transition-colors focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
              >
                ×
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <label className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
                Protocol link
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="mt-1.5 w-full rounded px-3 py-2 text-[12px] focus:outline-none focus-visible:ring-2"
                  style={{ fontFamily: "var(--font-mono)", background: "var(--ink-3)", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
                />
              </label>
              <button
                type="button"
                onClick={copy}
                className="rounded px-4 py-2.5 text-[13px] font-semibold uppercase transition-colors focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", background: "var(--accent)", color: "var(--ink)" }}
              >
                {copied ? "Copied to clipboard" : "Copy link"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
