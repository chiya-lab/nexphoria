"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

// Months 0,3,6,9,12,18,24 → remaining intact peptide (%)
const MONTHS = [0, 3, 6, 9, 12, 18, 24];
const SERIES = [
  { label: "−20 °C", color: "var(--accent)", data: [100, 99.8, 99.5, 99.2, 99.0, 98.4, 97.9] },
  { label: "4 °C", color: "var(--silver-1)", data: [100, 99.0, 98.1, 97.0, 95.8, 92.9, 90.0] },
  { label: "25 °C", color: "var(--danger)", data: [100, 96.5, 92.0, 87.5, 82.0, 71.0, 60.0] },
];

const W = 520;
const H = 280;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 40;
const Y_MIN = 55;
const Y_MAX = 100;

function x(month: number): number {
  const max = MONTHS[MONTHS.length - 1];
  return PAD_L + (month / max) * (W - PAD_L - PAD_R);
}
function y(pct: number): number {
  return PAD_T + (1 - (pct - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD_T - PAD_B);
}
function path(data: number[]): string {
  return data.map((d, i) => `${i === 0 ? "M" : "L"}${x(MONTHS[i]).toFixed(1)} ${y(d).toFixed(1)}`).join(" ");
}

export default function PprStabilityData() {
  return (
    <section className="px-5 py-16 md:px-10 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Peptide stability over 24 months at three storage temperatures">
            {/* y gridlines + labels */}
            {[60, 70, 80, 90, 100].map((v) => (
              <g key={v}>
                <line x1={PAD_L} y1={y(v)} x2={W - PAD_R} y2={y(v)} stroke="var(--steel)" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.6" />
                <text x={PAD_L - 8} y={y(v) + 3} textAnchor="end" fill="var(--silver-2)" fontSize="9" fontFamily="var(--font-mono)">
                  {v}
                </text>
              </g>
            ))}
            {/* x labels */}
            {MONTHS.map((m) => (
              <text key={m} x={x(m)} y={H - PAD_B + 18} textAnchor="middle" fill="var(--silver-2)" fontSize="9" fontFamily="var(--font-mono)">
                {m}
              </text>
            ))}
            <text x={(W + PAD_L) / 2} y={H - 4} textAnchor="middle" fill="var(--silver-2)" fontSize="10" fontFamily="var(--font-mono)">
              Months
            </text>
            {/* series */}
            {SERIES.map((s) => (
              <g key={s.label}>
                <motion.path
                  d={path(s.data)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
                {s.data.map((d, i) => (
                  <circle key={i} cx={x(MONTHS[i])} cy={y(d)} r="2.5" fill={s.color} />
                ))}
              </g>
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {SERIES.map((s) => (
              <span key={s.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
                  {s.label}
                </span>
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
          <p
            className="mb-3 text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Stability data
          </p>
          <h2
            className="mb-4 text-[28px] font-semibold md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Why cold-chain matters
          </h2>
          <p className="mb-4 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Lyophilized peptide retains essentially full integrity at −20 °C across 24 months. At
            ambient 25 °C, degradation is measurable within the first quarter and accelerates
            thereafter.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Shipments move in insulated cold packaging, and the recommended storage is −20 °C for
            long-term holding, with reconstituted material kept at 4 °C and used promptly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
