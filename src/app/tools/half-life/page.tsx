"use client";

import { useMemo, useState } from "react";
import PprToolHero from "@/components/tools/PprToolHero";
import PprToolFooter from "@/components/tools/PprToolFooter";

interface Compound {
  name: string;
  halfLifeHours: number;
}

const COMPOUNDS: Compound[] = [
  { name: "BPC-157", halfLifeHours: 4 },
  { name: "TB-500", halfLifeHours: 60 },
  { name: "GHK-Cu", halfLifeHours: 1 },
  { name: "Semaglutide", halfLifeHours: 165 },
  { name: "Tirzepatide", halfLifeHours: 120 },
  { name: "Ipamorelin", halfLifeHours: 2 },
  { name: "CJC-1295 (DAC)", halfLifeHours: 168 },
  { name: "Selank", halfLifeHours: 0.5 },
  { name: "Epitalon", halfLifeHours: 1.5 },
  { name: "Retatrutide", halfLifeHours: 150 },
];

const CHART_W = 600;
const CHART_H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };
const DAYS = 30;
const SAMPLES_PER_DAY = 8;

export default function HalfLifePage() {
  const [compoundName, setCompoundName] = useState(COMPOUNDS[0].name);
  const [doseMg, setDoseMg] = useState(1);
  const [frequencyDays, setFrequencyDays] = useState(1);

  const compound = COMPOUNDS.find((c) => c.name === compoundName) ?? COMPOUNDS[0];

  const { points, peak, steadyState } = useMemo(() => {
    const tHalfDays = compound.halfLifeHours / 24;
    const k = Math.LN2 / tHalfDays; // elimination rate constant per day
    const totalSamples = DAYS * SAMPLES_PER_DAY;
    const series: number[] = [];

    for (let i = 0; i <= totalSamples; i++) {
      const t = i / SAMPLES_PER_DAY; // days
      // Superpose decay from every dose administered at multiples of frequencyDays.
      let conc = 0;
      for (let doseT = 0; doseT <= t + 1e-9; doseT += frequencyDays) {
        conc += doseMg * Math.pow(2, -(t - doseT) / tHalfDays);
      }
      series.push(conc);
    }

    const peakVal = Math.max(...series, doseMg);
    // Steady-state average concentration for repeated dosing: Dose / (k * tau).
    const ss = frequencyDays > 0 ? doseMg / (k * frequencyDays) : doseMg;

    const plotW = CHART_W - PAD.left - PAD.right;
    const plotH = CHART_H - PAD.top - PAD.bottom;
    const yMax = Math.max(peakVal, ss) * 1.1;

    const pts = series
      .map((c, i) => {
        const x = PAD.left + (i / (series.length - 1)) * plotW;
        const y = PAD.top + plotH - (c / yMax) * plotH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    const ssY = PAD.top + plotH - (ss / yMax) * plotH;

    return { points: pts, peak: peakVal, steadyState: { value: ss, y: ssY } };
  }, [compound, doseMg, frequencyDays]);

  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;

  return (
    <div style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      <PprToolHero
        eyebrow="Half-life timeline"
        title="Plasma half-life timeline."
        sub="Pick a compound, set a dose and dosing interval, and see modeled plasma concentration accumulate and decay across 30 days."
      />

      <div className="mx-auto max-w-[760px] px-6">
        <div
          className="rounded-lg p-7"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          {/* Controls */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span
                className="text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
              >
                Compound
              </span>
              <select
                value={compoundName}
                onChange={(e) => setCompoundName(e.target.value)}
                className="rounded-md px-3 py-2 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {COMPOUNDS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({formatHalfLife(c.halfLifeHours)})
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span
                className="text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
              >
                Dose (mg)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={Number.isFinite(doseMg) ? doseMg : ""}
                onChange={(e) => setDoseMg(parseFloat(e.target.value) || 0)}
                className="rounded-md px-3 py-2 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span
                className="text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
              >
                Frequency (days)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0.5}
                step={0.5}
                value={Number.isFinite(frequencyDays) ? frequencyDays : ""}
                onChange={(e) => setFrequencyDays(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                className="rounded-md px-3 py-2 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
          </div>

          {/* Chart */}
          <div className="mt-6 overflow-x-auto">
            <svg
              width={CHART_W}
              height={CHART_H}
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              role="img"
              aria-label={`Modeled plasma concentration of ${compound.name} over ${DAYS} days`}
              style={{ backgroundColor: "var(--ink-2)", maxWidth: "100%" }}
            >
              {/* Grid lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = PAD.top + (i / 4) * plotH;
                return (
                  <line
                    key={`h${i}`}
                    x1={PAD.left}
                    y1={y}
                    x2={PAD.left + plotW}
                    y2={y}
                    stroke="var(--steel)"
                    strokeWidth={1}
                  />
                );
              })}
              {Array.from({ length: 7 }).map((_, i) => {
                const x = PAD.left + (i / 6) * plotW;
                const dayLabel = Math.round((i / 6) * DAYS);
                return (
                  <g key={`v${i}`}>
                    <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + plotH} stroke="var(--steel)" strokeWidth={1} opacity={0.5} />
                    <text
                      x={x}
                      y={CHART_H - 10}
                      textAnchor="middle"
                      fill="var(--silver-3)"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                    >
                      {dayLabel}d
                    </text>
                  </g>
                );
              })}

              {/* Steady-state line */}
              <line
                x1={PAD.left}
                y1={steadyState.y}
                x2={PAD.left + plotW}
                y2={steadyState.y}
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                opacity={0.8}
              />
              <text
                x={PAD.left + plotW}
                y={steadyState.y - 5}
                textAnchor="end"
                fill="var(--accent)"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              >
                steady state {steadyState.value.toFixed(2)} mg
              </text>

              {/* Concentration curve */}
              <polyline points={points} fill="none" stroke="var(--platinum)" strokeWidth={2} strokeLinejoin="round" />

              {/* Y axis label */}
              <text
                x={12}
                y={PAD.top + plotH / 2}
                textAnchor="middle"
                fill="var(--silver-3)"
                transform={`rotate(-90 12 ${PAD.top + plotH / 2})`}
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              >
                plasma (mg)
              </text>
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
            <Legend swatch="var(--platinum)" label="Modeled concentration" />
            <Legend swatch="var(--accent)" label="Steady-state average" dashed />
            <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
              Peak {peak.toFixed(2)} mg · t½ {formatHalfLife(compound.halfLifeHours)}
            </span>
          </div>
        </div>

        <p
          className="mt-4 text-[12px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)", lineHeight: 1.6 }}
        >
          Half-life data is approximate, from peer-reviewed peptide PK research. Modeled with first-order
          elimination C = C&#8320; &times; 2^(&minus;t/t½) and dose superposition. For research use only (RUO).
        </p>
      </div>

      <PprToolFooter compound={compound.name} />
    </div>
  );
}

function Legend({ swatch, label, dashed }: { swatch: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
      <span
        style={{
          display: "inline-block",
          width: 16,
          height: 0,
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${swatch}`,
        }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function formatHalfLife(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours % 1 === 0 ? hours : hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(hours / 24 % 1 === 0 ? 0 : 1)} d`;
}
