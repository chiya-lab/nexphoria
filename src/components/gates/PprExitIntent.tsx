"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { easing, duration } from "@/lib/motion";

const STORAGE_KEY = "nex_exit_intent_fired";
const PROMO_CODE = "REASEARCH10";
const MIN_SESSION_MS = 5000;
const SUPPRESS_PATHS = ["/checkout", "/account"];

export default function PprExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const firedRef = useRef(false);
  const mountedAt = useRef(0);

  const suppressed = SUPPRESS_PATHS.some((p) => pathname?.startsWith(p));

  const trigger = useCallback(() => {
    if (firedRef.current) return;
    if (Date.now() - mountedAt.current < MIN_SESSION_MS) return;
    firedRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (suppressed) return;
    let alreadyFired = false;
    try {
      alreadyFired = sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      alreadyFired = false;
    }
    if (alreadyFired) {
      firedRef.current = true;
      return;
    }
    mountedAt.current = Date.now();

    function onMouseOut(e: MouseEvent) {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    }

    // Mobile: scroll-up burst after some depth, or a quiet idle window.
    let lastY = window.scrollY;
    let idle: ReturnType<typeof setTimeout> | null = null;
    function onScroll() {
      const y = window.scrollY;
      if (lastY - y > 40 && y < 200 && window.scrollY < lastY) trigger();
      lastY = y;
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => {
        if (window.scrollY > 600) trigger();
      }, 12000);
    }

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      if (idle) clearTimeout(idle);
    };
  }, [suppressed, trigger]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="exit-intent"
        className="fixed inset-0 z-[280] flex items-center justify-center px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.base, ease: easing.easeOut }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        style={{ backgroundColor: "color-mix(in srgb, var(--ink) 82%, transparent)", backdropFilter: "blur(3px)" }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: duration.base, ease: easing.easeOut }}
          className="relative w-full max-w-md rounded-lg p-7"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--accent)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--silver-2)" }}
          >
            <X size={18} aria-hidden="true" />
          </button>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 18%, transparent)" }}
              >
                <Check size={26} style={{ color: "var(--accent)" }} aria-hidden="true" />
              </span>
              <h2
                id="exit-intent-title"
                className="text-[22px] font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                Code unlocked
              </h2>
              <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                Apply this at checkout for 10% off your first protocol.
              </p>
              <code
                className="rounded-md px-5 py-3 text-[18px] font-semibold"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.06em",
                }}
              >
                {PROMO_CODE}
              </code>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span
                className="text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
              >
                Before you go
              </span>
              <h2
                id="exit-intent-title"
                className="text-[26px] font-semibold leading-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                10% off your first protocol
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                Join the researcher list and we will send your code, plus new lot releases and
                COA updates.
              </p>
              <form onSubmit={submit} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@lab.org"
                  className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: "var(--ink)",
                    border: "1px solid var(--steel)",
                    color: "var(--platinum)",
                    fontFamily: "var(--font-body)",
                  }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2"
                  style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                >
                  Send my code
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </form>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[12px] uppercase focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}
              >
                No thanks
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
