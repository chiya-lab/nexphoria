"use client";

import { useState } from "react";
import { REVENUE_30D } from "@/lib/mock-admin";

const W = 720;
const H = 240;
const PAD_L = 48;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 28;

export default function PprAdminRevenueChart() {
  const [hover, setHover] = useState<number | null>(null);

  const data = REVENUE_30D;
  const max = Math.max(...data.map((d) => Math.max(d.revenue, d.rollingAvg7)));
  const niceMax = Math.ceil(max / 1000) * 1000;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const stepX = plotW / (data.length - 1 || 1);

  const x = (i: number) => PAD_L + i * stepX;
  const y = (v: number) => PAD_T + plotH - (v / niceMax) * plotH;

  const avgPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.rollingAvg7).toFixed(1)}`).join(" ");
  const barW = Math.max(3, stepX * 0.55);

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (niceMax / yTicks) * i);

  return (
    <div className="rounded-xl p-4 lg:p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Revenue · last 30 days
          </h2>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--silver-2)" }}>
            Daily gross with 7-day rolling average
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--silver-2)" }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--accent)", opacity: 0.85 }} />
            Daily
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: "var(--accent-glow)" }} />
            7-day avg
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 520, display: "block" }}
          role="img"
          aria-label="30-day revenue chart with 7-day rolling average"
          onMouseLeave={() => setHover(null)}
        >
          {/* gridlines + y labels */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} stroke="var(--steel)" strokeWidth={1} opacity={0.5} />
              <text x={PAD_L - 8} y={y(t) + 3} textAnchor="end" style={{ fill: "var(--silver-3)", fontSize: 9, fontFamily: "var(--font-mono)" }}>
                ${(t / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* bars */}
          {data.map((d, i) => {
            const bh = (d.revenue / niceMax) * plotH;
            const active = hover === i;
            return (
              <rect
                key={d.date}
                x={x(i) - barW / 2}
                y={y(d.revenue)}
                width={barW}
                height={bh}
                rx={1}
                fill="var(--accent)"
                opacity={active ? 1 : 0.7}
                onMouseEnter={() => setHover(i)}
              />
            );
          })}

          {/* rolling avg line */}
          <path d={avgPath} fill="none" stroke="var(--accent-glow)" strokeWidth={2} strokeLinejoin="round" />

          {/* x labels (every 5th day) */}
          {data.map((d, i) =>
            i % 5 === 0 ? (
              <text key={`xl-${i}`} x={x(i)} y={H - 8} textAnchor="middle" style={{ fill: "var(--silver-3)", fontSize: 9, fontFamily: "var(--font-mono)" }}>
                {d.date.slice(5)}
              </text>
            ) : null,
          )}

          {/* hover marker + tooltip */}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD_T} y2={PAD_T + plotH} stroke="var(--silver-3)" strokeDasharray="3 3" />
              <circle cx={x(hover)} cy={y(data[hover].rollingAvg7)} r={3} fill="var(--accent-glow)" />
              <g transform={`translate(${Math.min(x(hover) + 8, W - 132)}, ${PAD_T + 4})`}>
                <rect width={124} height={46} rx={4} fill="var(--ink-3)" stroke="var(--steel)" />
                <text x={8} y={16} style={{ fill: "var(--silver-1)", fontSize: 10, fontFamily: "var(--font-mono)" }}>
                  {data[hover].date}
                </text>
                <text x={8} y={30} style={{ fill: "var(--platinum)", fontSize: 11, fontWeight: 600 }}>
                  ${data[hover].revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </text>
                <text x={8} y={42} style={{ fill: "var(--silver-2)", fontSize: 9 }}>
                  {data[hover].orders} orders · avg ${data[hover].rollingAvg7.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
