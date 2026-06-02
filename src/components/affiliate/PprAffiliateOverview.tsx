"use client";

import { useState } from "react";
import { AFFILIATE_KPIS, DAILY_90D, ACTIVITY_FEED, AFFILIATE_USER } from "@/lib/mock-affiliate";
import PprAffiliateDisclosure from "./PprAffiliateDisclosure";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const KPIS = [
  { label: "Lifetime earnings", value: money(AFFILIATE_KPIS.lifetimeEarnings), accent: true },
  { label: "Month to date", value: money(AFFILIATE_KPIS.mtdEarnings) },
  { label: "Clicks · 30d", value: AFFILIATE_KPIS.clicks30d.toLocaleString("en-US") },
  { label: "Conversions · 30d", value: String(AFFILIATE_KPIS.conversions30d) },
  { label: "Conversion rate", value: `${AFFILIATE_KPIS.conversionRate}%` },
  { label: "AOV referred", value: money(AFFILIATE_KPIS.aovReferred) },
  { label: "Next payout", value: money(AFFILIATE_KPIS.nextPayoutAmount), sub: AFFILIATE_KPIS.nextPayoutDate },
];

const W = 720;
const H = 220;
const PAD_L = 50;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 26;

function EarningsChart() {
  const [hover, setHover] = useState<number | null>(null);
  const data = DAILY_90D;
  const max = Math.max(...data.map((d) => d.earnings));
  const niceMax = Math.ceil(max / 100) * 100 || 100;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const stepX = plotW / (data.length - 1 || 1);
  const x = (i: number) => PAD_L + i * stepX;
  const y = (v: number) => PAD_T + plotH - (v / niceMax) * plotH;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.earnings).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(PAD_T + plotH).toFixed(1)} L${PAD_L.toFixed(1)},${(PAD_T + plotH).toFixed(1)} Z`;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (niceMax / yTicks) * i);
  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className="rounded-xl p-4 lg:p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Earnings · last 90 days
          </h2>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--silver-2)" }}>
            Daily attributed commission
          </p>
        </div>
        {hovered && (
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
            {hovered.date} · {money2(hovered.earnings)}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 520, display: "block" }}
          role="img"
          aria-label="90-day daily commission earnings chart"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="affEarnFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} stroke="var(--steel)" strokeWidth={1} opacity={0.5} />
              <text x={PAD_L - 8} y={y(t) + 3} textAnchor="end" style={{ fill: "var(--silver-3)", fontSize: 9, fontFamily: "var(--font-mono)" }}>
                ${t.toFixed(0)}
              </text>
            </g>
          ))}
          <path d={area} fill="url(#affEarnFill)" />
          <path d={line} fill="none" stroke="var(--accent)" strokeWidth={1.6} />
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={PAD_T} y2={PAD_T + plotH} stroke="var(--accent-glow)" strokeWidth={1} opacity={0.6} />
          )}
          {data.map((_, i) => (
            <rect
              key={i}
              x={x(i) - stepX / 2}
              y={PAD_T}
              width={Math.max(2, stepX)}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function PprAffiliateOverview() {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 6%, var(--ink-2))", border: "1px solid var(--steel)" }}
      >
        <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
          Tier
        </span>
        <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}>
          {AFFILIATE_USER.tier.name} · {AFFILIATE_USER.tier.commission}% · {AFFILIATE_USER.tier.cookieDays}-day cookie
        </span>
        <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
          Code {AFFILIATE_USER.referralCode}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${k.accent ? "var(--accent)" : "var(--steel)"}` }}
          >
            <p className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}>
              {k.label}
            </p>
            <p className="mt-1.5 text-[22px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: k.accent ? "var(--accent)" : "var(--platinum)" }}>
              {k.value}
            </p>
            {k.sub && (
              <p className="mt-1 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                {k.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <EarningsChart />
        <div className="rounded-xl p-4 lg:p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Recent activity
          </h2>
          <ul className="flex flex-col gap-3">
            {ACTIVITY_FEED.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      item.kind === "conversion" ? "var(--accent)" : item.kind === "payout" ? "var(--ok)" : item.kind === "tier" ? "var(--warn)" : "var(--silver-3)",
                  }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                    <span style={{ color: "var(--platinum)" }}>{item.label}</span> — {item.detail}
                  </p>
                  <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                    {item.when}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PprAffiliateDisclosure />
    </div>
  );
}
