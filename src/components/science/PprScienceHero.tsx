"use client";

import { motion } from "framer-motion";
import { fadeInUp, baseTransition } from "@/lib/motion";

export default function PprScienceHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-32 md:px-10 lg:pb-24 lg:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <p
            className="mb-5 text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "var(--accent)" }}
          >
            Analytical transparency
          </p>
          <h1
            className="mb-6 text-[38px] font-semibold leading-[1.05] md:text-[52px] lg:text-[60px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
          >
            The data behind every vial
          </h1>
          <p
            className="max-w-xl text-[16px] leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
          >
            Every lot is characterized by HPLC, confirmed by mass spectrometry, and screened for
            endotoxin and residual solvents before release. No batch ships without an independent
            Certificate of Analysis. The methods, detection limits, and raw chromatograms are
            documented here.
          </p>
          <dl className="mt-9 grid grid-cols-3 gap-4">
            {[
              { v: "99%+", k: "Reference purity" },
              { v: "<0.5", k: "EU/mg endotoxin" },
              { v: "100%", k: "Third-party tested" },
            ].map((s) => (
              <div key={s.k} className="flex flex-col">
                <span
                  className="text-[28px] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
                >
                  {s.v}
                </span>
                <span
                  className="text-[11px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
                >
                  {s.k}
                </span>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...baseTransition, delay: 0.12 }}
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <ChromatogramSvg />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
              HPLC trace · 214 nm
            </span>
            <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              Main peak 99.47%
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChromatogramSvg() {
  return (
    <svg viewBox="0 0 480 240" className="h-auto w-full" role="img" aria-label="HPLC chromatogram showing a dominant peak">
      <defs>
        <linearGradient id="ppr-chroma-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* axes */}
      <line x1="40" y1="200" x2="460" y2="200" stroke="var(--steel)" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="200" stroke="var(--steel)" strokeWidth="1" />
      {/* gridlines */}
      {[60, 110, 160].map((y) => (
        <line key={y} x1="40" y1={y} x2="460" y2={y} stroke="var(--steel)" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.5" />
      ))}
      {/* baseline with one dominant peak + minor impurity peaks */}
      <path
        d="M40 198 L150 197 L168 196 L182 60 L196 196 L240 197 L300 196 L312 178 L320 196 L360 197 L400 196 L420 188 L432 196 L460 197"
        fill="url(#ppr-chroma-fill)"
        stroke="none"
      />
      <path
        d="M40 198 L150 197 L168 196 L182 60 L196 196 L240 197 L300 196 L312 178 L320 196 L360 197 L400 196 L420 188 L432 196 L460 197"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* main peak label */}
      <text x="182" y="50" textAnchor="middle" fill="var(--platinum)" fontSize="10" fontFamily="var(--font-mono)">
        tR 8.2
      </text>
      <text x="316" y="170" textAnchor="middle" fill="var(--silver-2)" fontSize="9" fontFamily="var(--font-mono)">
        0.31%
      </text>
      {/* axis labels */}
      <text x="250" y="222" textAnchor="middle" fill="var(--silver-2)" fontSize="10" fontFamily="var(--font-mono)">
        Retention time (min)
      </text>
      <text x="16" y="110" textAnchor="middle" fill="var(--silver-2)" fontSize="10" fontFamily="var(--font-mono)" transform="rotate(-90 16 110)">
        mAU
      </text>
    </svg>
  );
}
