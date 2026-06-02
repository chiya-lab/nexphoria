"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { easing, duration } from "@/lib/motion";

const STORAGE_KEY = "nex_newsletter_band_dismissed";

export default function PprNewsletterBand() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      dismissed = false;
    }
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitted(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setTimeout(() => setVisible(false), 2200);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="newsletter-band"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: duration.base, ease: easing.easeOut }}
          className="fixed inset-x-0 bottom-0 z-[120]"
          role="region"
          aria-label="Newsletter signup"
          style={{
            backgroundColor: "color-mix(in srgb, var(--ink-2) 96%, transparent)",
            borderTop: "1px solid var(--steel)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            {submitted ? (
              <div className="flex items-center gap-2.5">
                <Check size={18} aria-hidden="true" style={{ color: "var(--accent)" }} />
                <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  Subscribed — the molecular journal lands in your inbox weekly.
                </span>
              </div>
            ) : (
              <>
                <div className="flex flex-1 flex-col pr-4">
                  <span
                    className="text-[15px] font-semibold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                  >
                    Get the molecular journal
                  </span>
                  <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                    Peer-reviewed peptide research, weekly
                  </span>
                </div>
                <form onSubmit={submit} className="flex flex-1 gap-2 sm:max-w-md">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@lab.org"
                    className="flex-1 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus-visible:ring-2"
                    style={{
                      backgroundColor: "var(--ink)",
                      border: "1px solid var(--steel)",
                      color: "var(--platinum)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2"
                    style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                  >
                    Subscribe
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </form>
              </>
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute right-3 top-3 focus:outline-none focus-visible:ring-2 sm:static sm:ml-2"
              style={{ color: "var(--silver-2)" }}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
