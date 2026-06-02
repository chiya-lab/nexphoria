"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, ShieldAlert, Check } from "lucide-react";
import { easing, duration } from "@/lib/motion";

const STORAGE_KEY = "nex_ruo_gate_accepted";

export default function PprRuoGate() {
  const [open, setOpen] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      accepted = false;
    }
    if (!accepted) setOpen(true);
  }, []);

  function accept() {
    if (!confirmed) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // storage unavailable — still dismiss for this view
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ruo-gate"
        className="fixed inset-0 z-[300] flex items-center justify-center px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.base, ease: easing.easeOut }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ruo-gate-title"
        style={{ backgroundColor: "color-mix(in srgb, var(--ink) 88%, transparent)", backdropFilter: "blur(4px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: duration.base, ease: easing.easeOut }}
          className="w-full max-w-md rounded-lg p-7"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          {declined ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--danger) 16%, transparent)" }}
              >
                <ShieldAlert size={26} style={{ color: "var(--danger)" }} aria-hidden="true" />
              </span>
              <h2
                id="ruo-gate-title"
                className="text-[22px] font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                Access restricted
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                These materials are available only to qualified researchers for in-vitro and
                laboratory research use. You may not proceed.
              </p>
              <button
                type="button"
                onClick={() => setDeclined(false)}
                className="mt-1 text-[13px] uppercase focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--accent)" }}
              >
                Return
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-md"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
                >
                  <FlaskConical size={22} style={{ color: "var(--accent)" }} aria-hidden="true" />
                </span>
                <h2
                  id="ruo-gate-title"
                  className="text-[22px] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                >
                  Research-use verification
                </h2>
              </div>

              <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                All compounds are sold strictly for laboratory and in-vitro research use only.
                They are not for human or veterinary consumption, diagnostic, or therapeutic use.
              </p>

              <button
                type="button"
                onClick={() => setConfirmed((c) => !c)}
                className="flex items-start gap-3 text-left focus:outline-none focus-visible:ring-2"
                aria-pressed={confirmed}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded"
                  style={{
                    backgroundColor: confirmed ? "var(--accent)" : "transparent",
                    border: `1px solid ${confirmed ? "var(--accent)" : "var(--steel)"}`,
                  }}
                  aria-hidden="true"
                >
                  {confirmed && <Check size={13} style={{ color: "var(--ink)" }} />}
                </span>
                <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  I confirm I am 21 or older and a qualified researcher acquiring these materials
                  for research use only, not for human consumption.
                </span>
              </button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={!confirmed}
                  onClick={accept}
                  className="rounded-md py-3.5 text-[15px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                >
                  Enter — I accept
                </button>
                <button
                  type="button"
                  onClick={() => setDeclined(true)}
                  className="rounded-md py-3 text-[14px] focus:outline-none focus-visible:ring-2"
                  style={{ border: "1px solid var(--steel)", color: "var(--silver-2)", fontFamily: "var(--font-body)" }}
                >
                  Decline
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
