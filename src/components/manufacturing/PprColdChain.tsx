"use client";

import { motion } from "framer-motion";
import { Thermometer, Snowflake, Activity } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const POLICY = [
  {
    icon: Snowflake,
    title: "Dry ice for frozen lots",
    desc: "Lyophilized peptides requiring -20°C transit ship insulated with dry ice, sized to the transit window.",
  },
  {
    icon: Thermometer,
    title: "Gel packs for 2–8°C",
    desc: "Refrigerated shipments use conditioned gel packs in qualified insulated mailers to hold the range door-to-door.",
  },
  {
    icon: Activity,
    title: "In-box temperature logger",
    desc: "Each shipment includes a single-use logger. The recorded profile is available on request for your records.",
  },
];

export default function PprColdChain() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex flex-col gap-4">
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
          >
            Cold chain
          </span>
          <h2
            className="text-[28px] font-semibold lg:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Shipped at 2–8°C with a logger in every box
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Peptide integrity is temperature-dependent. We pack to the transit window, monitor the
            full journey, and document the profile so your lot arrives within spec.
          </p>

          <div className="mt-2 flex flex-col gap-4">
            {POLICY.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                  >
                    <Icon size={17} aria-hidden="true" style={{ color: "var(--accent)" }} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                      {p.title}
                    </span>
                    <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                      {p.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Temperature monitoring graphic */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
              Transit temperature log
            </span>
            <span className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--ok)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--ok)" }} aria-hidden="true" />
              In spec
            </span>
          </div>
          <ColdChainChart />
          <p className="mt-3 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            Shaded band = 2–8°C target. Trace held within range across a 48 h transit window.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ColdChainChart() {
  const W = 460;
  const H = 200;
  const pad = { l: 34, r: 12, t: 12, b: 24 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  // temperature range mapped 0–14°C
  const tMin = 0;
  const tMax = 14;
  const yFor = (t: number) => pad.t + plotH - ((t - tMin) / (tMax - tMin)) * plotH;
  const xFor = (i: number, n: number) => pad.l + (i / (n - 1)) * plotW;

  // sample 48h trace, stays in 2-8 band
  const trace = [4.2, 5.1, 4.8, 6.0, 5.5, 4.9, 5.8, 6.3, 5.2, 4.6, 5.0, 5.4, 4.7];
  const pts = trace.map((t, i) => `${xFor(i, trace.length)},${yFor(t)}`).join(" ");

  const bandTop = yFor(8);
  const bandBottom = yFor(2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Transit temperature held within the 2 to 8 degrees Celsius band over 48 hours">
      {/* target band */}
      <rect
        x={pad.l}
        y={bandTop}
        width={plotW}
        height={bandBottom - bandTop}
        fill="color-mix(in srgb, var(--accent) 14%, transparent)"
      />
      <line x1={pad.l} x2={W - pad.r} y1={bandTop} y2={bandTop} stroke="var(--accent-deep)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={pad.l} x2={W - pad.r} y1={bandBottom} y2={bandBottom} stroke="var(--accent-deep)" strokeWidth="1" strokeDasharray="3 3" />

      {/* y ticks */}
      {[0, 4, 8, 12].map((t) => (
        <g key={t}>
          <text x={pad.l - 6} y={yFor(t) + 3} textAnchor="end" fontSize="9" fill="var(--silver-3)" fontFamily="var(--font-mono)">
            {t}°
          </text>
          <line x1={pad.l} x2={W - pad.r} y1={yFor(t)} y2={yFor(t)} stroke="var(--steel)" strokeWidth="0.5" opacity="0.5" />
        </g>
      ))}

      {/* trace */}
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {trace.map((t, i) => (
        <circle key={i} cx={xFor(i, trace.length)} cy={yFor(t)} r="2.5" fill="var(--accent)" />
      ))}

      {/* x labels */}
      <text x={pad.l} y={H - 6} fontSize="9" fill="var(--silver-3)" fontFamily="var(--font-mono)">0h</text>
      <text x={W - pad.r} y={H - 6} textAnchor="end" fontSize="9" fill="var(--silver-3)" fontFamily="var(--font-mono)">48h</text>
    </svg>
  );
}
