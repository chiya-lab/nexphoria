"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface Pin {
  id: string;
  // percentage coordinates over the 800x400 viewBox
  x: number;
  y: number;
  kind: "source" | "synthesis" | "distribution";
  label: string;
  detail: string;
}

const PINS: Pin[] = [
  { id: "eu", x: 410, y: 150, kind: "source", label: "Amino acid source — EU", detail: "Fmoc-protected amino acid building blocks from qualified European suppliers." },
  { id: "asia", x: 600, y: 185, kind: "source", label: "Reagent source — Asia", detail: "Coupling reagents and resins from audited suppliers under incoming-lot qualification." },
  { id: "synth", x: 200, y: 165, kind: "synthesis", label: "Synthesis — United States", detail: "Solid-phase synthesis, HPLC purification, and lyophilization performed domestically." },
  { id: "dist", x: 180, y: 195, kind: "distribution", label: "Distribution — United States", detail: "Cold-chain fulfillment and shipping from the US distribution hub." },
];

const KIND_COLOR: Record<Pin["kind"], string> = {
  source: "var(--silver-1)",
  synthesis: "var(--accent)",
  distribution: "var(--warn)",
};

const KIND_LABEL: Record<Pin["kind"], string> = {
  source: "Raw material source",
  synthesis: "Synthesis",
  distribution: "US distribution",
};

export default function PprSourceMap() {
  const [active, setActive] = useState<string | null>(null);
  const activePin = PINS.find((p) => p.id === active) ?? null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8 flex flex-col gap-2">
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
        >
          Supply map
        </span>
        <h2
          className="text-[28px] font-semibold lg:text-[36px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Where each lot comes from
        </h2>
      </motion.div>

      <div
        className="relative overflow-hidden rounded-xl p-4"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <svg viewBox="0 0 800 400" className="w-full" role="img" aria-label="World map showing raw material sources, synthesis, and US distribution">
          <WorldLandmasses />

          {/* connection lines from sources to synthesis */}
          {PINS.filter((p) => p.kind === "source").map((p) => {
            const synth = PINS.find((s) => s.kind === "synthesis")!;
            return (
              <line
                key={`line-${p.id}`}
                x1={p.x}
                y1={p.y}
                x2={synth.x}
                y2={synth.y}
                stroke="var(--steel)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {PINS.map((pin) => {
            const isActive = pin.id === active;
            return (
              <g
                key={pin.id}
                transform={`translate(${pin.x},${pin.y})`}
                onMouseEnter={() => setActive(pin.id)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: "pointer" }}
              >
                {isActive && <circle r="12" fill={KIND_COLOR[pin.kind]} opacity="0.2" />}
                <circle r="5.5" fill={KIND_COLOR[pin.kind]} stroke="var(--ink)" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>

        {/* legend */}
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {(["source", "synthesis", "distribution"] as const).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: KIND_COLOR[k] }} aria-hidden="true" />
              <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}>
                {KIND_LABEL[k]}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* pin detail / list */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PINS.map((pin) => {
          const isActive = pin.id === active;
          return (
            <button
              key={pin.id}
              type="button"
              onMouseEnter={() => setActive(pin.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(pin.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(isActive ? null : pin.id)}
              className="flex flex-col gap-1 rounded-lg p-3 text-left transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 8%, var(--ink-2))" : "var(--ink-2)",
                border: `1px solid ${isActive ? KIND_COLOR[pin.kind] : "var(--steel)"}`,
              }}
            >
              <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {pin.label}
              </span>
              <span className="text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                {pin.detail}
              </span>
            </button>
          );
        })}
      </div>
      {activePin && <span className="sr-only" aria-live="polite">{activePin.label}: {activePin.detail}</span>}
    </section>
  );
}

/** Stylized, abstract landmasses — decorative, not geographically precise. */
function WorldLandmasses() {
  return (
    <g fill="var(--ink-3)" stroke="var(--steel)" strokeWidth="1" aria-hidden="true">
      {/* Americas */}
      <path d="M120 90 Q170 70 210 110 Q230 150 200 200 Q190 260 150 320 Q130 280 140 230 Q120 180 110 140 Z" />
      {/* Europe + Africa */}
      <path d="M380 100 Q430 90 460 120 Q470 160 450 210 Q460 280 420 330 Q390 280 400 220 Q370 160 380 120 Z" />
      {/* Asia + Oceania */}
      <path d="M540 110 Q620 90 690 130 Q720 170 680 210 Q640 230 600 210 Q560 200 540 160 Z" />
      <path d="M650 280 Q690 270 710 300 Q700 330 660 330 Q640 310 650 290 Z" />
    </g>
  );
}
