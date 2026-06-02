"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { easing } from "@/lib/motion";

const MESSAGES = [
  "Free cold-chain shipping on orders over $150",
  "Third-party HPLC tested · 99%+ purity · Lot-traceable",
  "Research use only. Age verification required at checkout.",
  "New: Recovery 90 protocol — save 18% vs single vials",
];

const STORAGE_KEY = "nxAnnounceClosed";
const ROTATE_MS = 6000;

export default function PprAnnouncementBar() {
  // Start hidden; reveal after mount once we've confirmed it wasn't closed.
  // Avoids an SSR/CSR flash and respects the stored close flag.
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let closed = false;
    try {
      closed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      closed = false;
    }
    if (!closed) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [visible]);

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* localStorage unavailable — bar simply re-shows next load */
    }
  };

  if (!visible) return null;

  return (
    <div
      className="relative w-full"
      style={{
        height: 32,
        backgroundColor: "var(--ink-2)",
        borderBottom: "1px solid var(--steel)",
      }}
      role="region"
      aria-label="Site announcements"
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-center px-8">
        <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easing.easeOut }}
              className="truncate text-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--silver-1)",
                lineHeight: 1,
              }}
              aria-live="polite"
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss announcements"
          className="absolute right-8 flex h-6 w-6 items-center justify-center rounded transition-colors focus:outline-none focus-visible:ring-2"
          style={{ color: "var(--silver-2)" }}
        >
          <X size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
