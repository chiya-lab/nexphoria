"use client";

import { useState } from "react";
import { FileDown, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/products";

type Lot = {
  id: string;
  manufactured: string;
  expiration: string;
  operator: string;
  purity: string;
  rt: string;
  water: string;
  acetate: string;
  microbial: string;
};

const LOTS: Lot[] = [
  {
    id: "NX-241-A",
    manufactured: "2024-11-08",
    expiration: "2026-11-08",
    operator: "K.R.",
    purity: "99.4%",
    rt: "8.42",
    water: "1.8%",
    acetate: "4.2%",
    microbial: "<10 CFU/g",
  },
  {
    id: "NX-241-B",
    manufactured: "2024-11-22",
    expiration: "2026-11-22",
    operator: "D.M.",
    purity: "99.1%",
    rt: "8.39",
    water: "2.1%",
    acetate: "4.4%",
    microbial: "<10 CFU/g",
  },
  {
    id: "NX-240-C",
    manufactured: "2024-08-14",
    expiration: "2026-08-14",
    operator: "S.V.",
    purity: "98.9%",
    rt: "8.45",
    water: "2.4%",
    acetate: "4.6%",
    microbial: "<20 CFU/g",
  },
];

type MsRow = { mz: string; intensity: string; assignment: string; parent?: boolean };

const MS_ROWS: MsRow[] = [
  { mz: "1420.54", intensity: "100.0", assignment: "[M+H]+", parent: true },
  { mz: "710.77", intensity: "62.3", assignment: "[M+2H]2+" },
  { mz: "1442.52", intensity: "18.7", assignment: "[M+Na]+" },
  { mz: "474.19", intensity: "9.4", assignment: "[M+3H]3+" },
  { mz: "1402.53", intensity: "4.1", assignment: "[M+H−H2O]+" },
];

function Chromatogram({ rt }: { rt: string }) {
  const W = 600;
  const H = 240;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const baseline = padT + plotH;

  // Main bell at 60% of the x-axis; small baseline noise peaks.
  const peaks = [
    { c: 0.18, w: 0.025, h: 0.1 },
    { c: 0.34, w: 0.03, h: 0.07 },
    { c: 0.6, w: 0.05, h: 0.94 },
    { c: 0.78, w: 0.022, h: 0.06 },
  ];

  const N = 220;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    let y = 0.012; // baseline drift
    for (const p of peaks) {
      const d = (x - p.c) / p.w;
      y += p.h * Math.exp(-0.5 * d * d);
    }
    if (y > 1) y = 1;
    const px = padL + x * plotW;
    const py = baseline - y * plotH;
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const line = `M ${pts.join(" L ")}`;
  const area = `M ${padL},${baseline} L ${pts.join(" L ")} L ${(padL + plotW).toFixed(1)},${baseline} Z`;

  const gridX = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const gridY = [0, 0.25, 0.5, 0.75, 1];
  const mainPx = padL + 0.6 * plotW;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`HPLC chromatogram, main peak retention time ${rt} minutes`}
      style={{ backgroundColor: "var(--ink-2)", borderRadius: 8, border: "1px solid var(--steel)" }}
    >
      {/* grid */}
      {gridX.map((g) => (
        <line
          key={`gx${g}`}
          x1={padL + g * plotW}
          y1={padT}
          x2={padL + g * plotW}
          y2={baseline}
          stroke="var(--steel)"
          strokeWidth={1}
        />
      ))}
      {gridY.map((g) => (
        <line
          key={`gy${g}`}
          x1={padL}
          y1={baseline - g * plotH}
          x2={padL + plotW}
          y2={baseline - g * plotH}
          stroke="var(--steel)"
          strokeWidth={1}
        />
      ))}

      {/* axes labels */}
      {gridY.map((g) => (
        <text
          key={`yl${g}`}
          x={padL - 8}
          y={baseline - g * plotH + 3}
          textAnchor="end"
          fontSize="9"
          fontFamily="var(--font-mono)"
          fill="var(--silver-2)"
        >
          {Math.round(g * 1000)}
        </text>
      ))}
      <text
        x={12}
        y={padT + plotH / 2}
        fontSize="10"
        fontFamily="var(--font-mono)"
        fill="var(--silver-2)"
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
        textAnchor="middle"
      >
        mAU
      </text>
      {gridX.map((g, i) => (
        <text
          key={`xl${g}`}
          x={padL + g * plotW}
          y={H - 18}
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-mono)"
          fill="var(--silver-2)"
        >
          {i * 4}
        </text>
      ))}
      <text
        x={padL + plotW / 2}
        y={H - 4}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--font-mono)"
        fill="var(--silver-2)"
      >
        Retention time (min)
      </text>

      {/* trace */}
      <path d={area} fill="color-mix(in srgb, var(--accent) 14%, transparent)" stroke="none" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinejoin="round" />

      {/* main peak marker */}
      <line x1={mainPx} y1={padT} x2={mainPx} y2={baseline} stroke="var(--accent-glow)" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
    </svg>
  );
}

export default function PprCoaViewer({ product }: { product: Product }) {
  const [lotId, setLotId] = useState(LOTS[0].id);
  const lot = LOTS.find((l) => l.id === lotId) ?? LOTS[0];

  const mono = { fontFamily: "var(--font-mono)" } as const;
  const body = { fontFamily: "var(--font-body)" } as const;

  return (
    <div className="flex flex-col gap-6">
      {/* Lot selector + meta row */}
      <div
        className="flex flex-col gap-4 rounded-lg px-5 py-4 md:flex-row md:items-end md:justify-between"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase" style={{ ...mono, letterSpacing: "0.1em", color: "var(--silver-2)" }}>
            Lot number
          </span>
          <select
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            className="rounded-md px-3 py-2 text-[14px] focus:outline-none focus-visible:ring-2"
            style={{ ...mono, backgroundColor: "var(--ink)", color: "var(--platinum)", border: "1px solid var(--steel)" }}
          >
            {LOTS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]" style={{ ...mono, color: "var(--silver-2)" }}>
          <span>
            Manufactured <span style={{ color: "var(--silver-1)" }}>{lot.manufactured}</span>
          </span>
          <span>
            Expiration <span style={{ color: "var(--silver-1)" }}>{lot.expiration}</span>
          </span>
          <span>
            QC operator <span style={{ color: "var(--silver-1)" }}>{lot.operator}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* HPLC chromatogram */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
            HPLC chromatogram
          </h3>
          <Chromatogram rt={lot.rt} />
          <p className="text-[12px]" style={{ ...mono, color: "var(--silver-1)" }}>
            {product.name} · RT {lot.rt} min · {lot.purity} area
          </p>
        </div>

        {/* Purity card */}
        <div
          className="flex flex-col gap-4 rounded-lg px-5 py-6"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <div className="text-[64px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
            {lot.purity}
          </div>
          <div className="text-[12px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
            Total purity (HPLC, 220nm)
          </div>
          <dl className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid var(--steel)" }}>
            {[
              { k: "Water content", v: lot.water },
              { k: "Acetate", v: lot.acetate },
              { k: "Microbial", v: lot.microbial },
            ].map((s) => (
              <div key={s.k} className="flex items-center justify-between text-[13px]" style={mono}>
                <dt style={{ color: "var(--silver-2)" }}>{s.k}</dt>
                <dd style={{ color: "var(--silver-1)" }}>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Mass spec table */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[13px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
          ESI-MS identity confirmation
        </h3>
        <div className="overflow-hidden rounded-lg" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <table className="w-full text-[13px]" style={mono}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--steel)" }}>
                {["m/z", "Intensity %", "Assignment"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] uppercase"
                    style={{ letterSpacing: "0.08em", color: "var(--silver-2)", fontWeight: 500 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MS_ROWS.map((r) => (
                <tr
                  key={r.mz}
                  style={{
                    borderBottom: "1px solid var(--steel)",
                    backgroundColor: r.parent ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
                  }}
                >
                  <td className="px-5 py-3" style={{ color: "var(--platinum)" }}>{r.mz}</td>
                  <td className="px-5 py-3" style={{ color: "var(--silver-1)" }}>{r.intensity}</td>
                  <td className="px-5 py-3" style={{ color: r.parent ? "var(--accent)" : "var(--silver-1)" }}>{r.assignment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={`/coa#${product.slug}`}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
          style={{ ...body, backgroundColor: "var(--accent)", color: "var(--ink)" }}
        >
          <FileDown size={16} aria-hidden="true" />
          Download full COA PDF (1.2 MB)
        </a>
        <a
          href={`/coa#${product.slug}`}
          className="inline-flex items-center gap-1.5 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
          style={{ ...mono, color: "var(--silver-2)" }}
        >
          Verify lot on blockchain
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
