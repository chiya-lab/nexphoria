"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { SAVED_LINKS, buildReferralUrl, AFFILIATE_USER } from "@/lib/mock-affiliate";

const PRODUCTS = [
  { label: "BPC-157 5mg", sku: "bpc157-5mg" },
  { label: "TB-500 5mg", sku: "tb500-5mg" },
  { label: "GHK-Cu 50mg", sku: "ghkcu-50mg" },
  { label: "Semaglutide 5mg", sku: "sema-5mg" },
  { label: "Recovery 90 protocol", sku: "protocol-recovery90" },
  { label: "Entire catalog", sku: "catalog" },
];

const inputStyle = {
  backgroundColor: "var(--ink)",
  border: "1px solid var(--steel)",
  color: "var(--platinum)",
  fontFamily: "var(--font-mono)",
} as const;

const labelStyle = { fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" } as const;

/** Deterministic decorative QR-style matrix (illustrative, not scannable). */
function QrMock({ seed, size = 116 }: { seed: string; size?: number }) {
  const cells = 21;
  const grid = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(h, 31) + seed.charCodeAt(i)) | 0;
    const out: boolean[] = [];
    let x = h >>> 0;
    for (let i = 0; i < cells * cells; i++) {
      x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
      out.push((x & 0xff) > 128);
    }
    return out;
  }, [seed]);

  const u = size / cells;
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, cells - 7) || inBox(cells - 7, 0);
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Referral link QR code (illustrative)" style={{ borderRadius: 4 }}>
      <rect width={size} height={size} fill="var(--platinum)" />
      {grid.map((on, i) => {
        const r = Math.floor(i / cells);
        const c = i % cells;
        if (isFinder(r, c) || !on) return null;
        return <rect key={i} x={c * u} y={r * u} width={u} height={u} fill="var(--ink)" />;
      })}
      {[[0, 0], [0, cells - 7], [cells - 7, 0]].map(([r, c], k) => (
        <g key={k}>
          <rect x={c * u} y={r * u} width={7 * u} height={7 * u} fill="var(--ink)" />
          <rect x={(c + 1) * u} y={(r + 1) * u} width={5 * u} height={5 * u} fill="var(--platinum)" />
          <rect x={(c + 2) * u} y={(r + 2) * u} width={3 * u} height={3 * u} fill="var(--ink)" />
        </g>
      ))}
    </svg>
  );
}

export default function PprAffiliateLinkGenerator() {
  const [sku, setSku] = useState(PRODUCTS[0].sku);
  const [custom, setCustom] = useState("");
  const [source, setSource] = useState("youtube");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("");
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const trimmed = custom.trim();
    let base: string;
    if (trimmed) {
      try {
        const u = new URL(trimmed);
        u.searchParams.set("ref", AFFILIATE_USER.referralCode);
        base = u.toString();
      } catch {
        base = buildReferralUrl(sku);
      }
    } else {
      base = buildReferralUrl(sku);
    }
    const u = new URL(base);
    if (source) u.searchParams.set("utm_source", source);
    if (medium) u.searchParams.set("utm_medium", medium);
    if (campaign.trim()) u.searchParams.set("utm_campaign", campaign.trim());
    return u.toString();
  }, [sku, custom, source, medium, campaign]);

  const copy = () => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4 rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase" style={labelStyle}>Pick a product</span>
            <select
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus-visible:ring-2"
              style={inputStyle}
            >
              {PRODUCTS.map((p) => (
                <option key={p.sku} value={p.sku} style={{ color: "#000" }}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase" style={labelStyle}>Or paste a product URL</span>
            <input
              type="url"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="https://nexphoria.com/products/..."
              className="rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus-visible:ring-2"
              style={inputStyle}
            />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={labelStyle}>utm_source</span>
              <input value={source} onChange={(e) => setSource(e.target.value)} className="rounded-md px-3 py-2 text-[13px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={labelStyle}>utm_medium</span>
              <input value={medium} onChange={(e) => setMedium(e.target.value)} className="rounded-md px-3 py-2 text-[13px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={labelStyle}>utm_campaign</span>
              <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="optional" className="rounded-md px-3 py-2 text-[13px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </label>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase" style={labelStyle}>Your tracked link</span>
            <div className="flex items-stretch gap-2">
              <code
                className="min-w-0 flex-1 truncate rounded-md px-3 py-2.5 text-[13px]"
                style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)", color: "var(--accent)", fontFamily: "var(--font-mono)" }}
              >
                {url}
              </code>
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-3.5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
                style={{ backgroundColor: copied ? "var(--ok)" : "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <span className="text-[11px] uppercase" style={labelStyle}>Inline QR</span>
          <QrMock seed={url} />
          <p className="text-center text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            Illustrative QR for layout preview
          </p>
        </div>
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Saved links
          </h2>
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            {SAVED_LINKS.length} links
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                {["Product", "Link", "Clicks", "Conversions", "Created"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)", borderBottom: "1px solid var(--steel)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAVED_LINKS.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--steel)" }}>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{l.label}</td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{buildReferralUrl(l.sku, l.code)}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{l.clicks.toLocaleString("en-US")}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{l.conversions}</td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>{l.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
