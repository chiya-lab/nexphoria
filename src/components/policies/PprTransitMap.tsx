"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface Region {
  id: string;
  x: number;
  y: number;
  label: string;
  ground: string;
}

const REGIONS: Region[] = [
  { id: "west", x: 120, y: 170, label: "West", ground: "4–5 business days" },
  { id: "mountain", x: 230, y: 175, label: "Mountain", ground: "3–4 business days" },
  { id: "central", x: 330, y: 185, label: "Central", ground: "2–3 business days" },
  { id: "south", x: 360, y: 250, label: "South", ground: "2–3 business days" },
  { id: "northeast", x: 450, y: 140, label: "Northeast", ground: "1–2 business days" },
];

export default function PprTransitMap() {
  const [active, setActive] = useState<string | null>("northeast");
  const activeRegion = REGIONS.find((r) => r.id === active) ?? null;

  return (
    <section style={{ backgroundColor: "var(--ink-2)", borderBlock: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-5xl px-5 py-16 lg:py-20">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8 flex flex-col gap-2">
          <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
            Transit
          </span>
          <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Ground transit by region
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            We ship within the contiguous United States only. Estimates below are for Standard ground from
            our distribution hub; Overnight reaches all regions next business day.
          </p>
        </motion.div>

        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}>
          <svg viewBox="0 0 560 360" className="w-full" role="img" aria-label="Contiguous US map with ground transit times by region">
            {/* Stylized, abstract contiguous-US outline — decorative, not geographically precise */}
            <path
              d="M70 130 Q90 110 140 115 L300 100 Q360 95 420 110 L500 120 Q520 140 505 175 L480 230 Q460 270 410 280 L320 285 Q250 290 200 275 L120 250 Q80 235 72 195 Z"
              fill="var(--ink-3)"
              stroke="var(--steel)"
              strokeWidth="1.5"
              aria-hidden="true"
            />
            {REGIONS.map((r) => {
              const isActive = r.id === active;
              return (
                <g
                  key={r.id}
                  transform={`translate(${r.x},${r.y})`}
                  onMouseEnter={() => setActive(r.id)}
                  onFocus={() => setActive(r.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${r.label}: ${r.ground}`}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  {isActive && <circle r="13" fill="var(--accent)" opacity="0.2" />}
                  <circle r="6" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.5" />
                  <text x="0" y="-14" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fill: "var(--silver-1)" }}>
                    {r.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {REGIONS.map((r) => {
            const isActive = r.id === active;
            return (
              <button
                key={r.id}
                type="button"
                onMouseEnter={() => setActive(r.id)}
                onFocus={() => setActive(r.id)}
                onClick={() => setActive(r.id)}
                className="flex flex-col gap-1 rounded-lg p-3 text-left transition-colors focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 10%, var(--ink-2))" : "var(--ink-2)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
                }}
                aria-pressed={isActive}
              >
                <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  {r.label}
                </span>
                <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  {r.ground}
                </span>
              </button>
            );
          })}
        </div>
        {activeRegion && (
          <span className="sr-only" aria-live="polite">
            {activeRegion.label}: {activeRegion.ground} by ground
          </span>
        )}
      </div>
    </section>
  );
}
