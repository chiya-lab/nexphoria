"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface Segment {
  id: string;
  text: string;
  label: string;
  detail: string;
}

const SEGMENTS: Segment[] = [
  { id: "prod", text: "NX", label: "Product family", detail: "Two-letter prefix identifying the compound class within the Nexphoria catalog." },
  { id: "synth", text: "240118", label: "Synthesis date", detail: "YYMMDD the lot completed solid-phase synthesis — here, 18 January 2024." },
  { id: "qc", text: "Q3", label: "QC release", detail: "Quality-control disposition code: the release analyst and review cycle that cleared the lot." },
  { id: "exp", text: "E2601", label: "Expiry", detail: "YYMM the lot's retest/expiry window opens under recommended -20°C storage." },
];

export default function PprBatchTraceability() {
  const [active, setActive] = useState<string | null>(SEGMENTS[0].id);
  const activeSeg = SEGMENTS.find((s) => s.id === active) ?? null;

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex flex-col gap-2">
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
        >
          Batch traceability
        </span>
        <h2
          className="text-[28px] font-semibold lg:text-[36px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Every vial is traceable
        </h2>
        <p className="max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          The lot number stamped on each vial is not cosmetic — it decodes to the exact synthesis,
          release, and storage record behind that unit. Hover or tap a segment to read it.
        </p>
      </motion.div>

      {/* Lot anatomy */}
      <div className="mt-10 flex flex-wrap items-stretch justify-center gap-2">
        {SEGMENTS.map((seg) => {
          const isActive = seg.id === active;
          return (
            <button
              key={seg.id}
              type="button"
              onMouseEnter={() => setActive(seg.id)}
              onFocus={() => setActive(seg.id)}
              onClick={() => setActive(seg.id)}
              className="flex flex-col items-center gap-2 rounded-lg px-4 py-4 transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 10%, var(--ink-2))" : "var(--ink-2)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
              }}
              aria-pressed={isActive}
            >
              <span
                className="text-[22px] font-semibold lg:text-[28px]"
                style={{ fontFamily: "var(--font-mono)", color: isActive ? "var(--accent)" : "var(--platinum)", letterSpacing: "0.04em" }}
              >
                {seg.text}
              </span>
              <span
                className="text-[10px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
              >
                {seg.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div
        className="mx-auto mt-5 max-w-2xl rounded-lg p-5"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        aria-live="polite"
      >
        {activeSeg ? (
          <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            <span className="font-semibold" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              {activeSeg.text}
            </span>{" "}
            — {activeSeg.detail}
          </p>
        ) : (
          <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
            Select a segment to decode it.
          </p>
        )}
      </div>
    </section>
  );
}
