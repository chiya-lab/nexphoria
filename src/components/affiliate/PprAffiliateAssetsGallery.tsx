"use client";

import { useState } from "react";
import { Download } from "lucide-react";

type TabId = "banners" | "social" | "email" | "brand" | "product";

const TABS: { id: TabId; label: string }[] = [
  { id: "banners", label: "Banners" },
  { id: "social", label: "Social" },
  { id: "email", label: "Email templates" },
  { id: "brand", label: "Brand kit" },
  { id: "product", label: "Product shots" },
];

const BANNERS = [
  { id: "leaderboard", label: "Leaderboard", w: 728, h: 90 },
  { id: "mrec", label: "Medium rectangle", w: 300, h: 250 },
  { id: "skyscraper", label: "Wide skyscraper", w: 160, h: 600 },
];

const SOCIAL = [
  { id: "square", label: "Square 1:1", w: 320, h: 320 },
  { id: "portrait", label: "Portrait 4:5", w: 280, h: 350 },
  { id: "story", label: "Story 9:16", w: 220, h: 391 },
];

const EMAIL_TEMPLATES = [
  { id: "intro", subject: "A research-grade peptide source worth a look" },
  { id: "coa", subject: "How to read a certificate of analysis" },
  { id: "restock", subject: "Back in stock: BPC-157 (RUO)" },
];

const BRAND_ITEMS = [
  { id: "logo", label: "Wordmark + hex icon" },
  { id: "palette", label: "Color tokens" },
  { id: "type", label: "Type specimen" },
];

const PRODUCT_SHOTS = [
  { id: "bpc", label: "BPC-157 5mg" },
  { id: "tb500", label: "TB-500 5mg" },
  { id: "ghkcu", label: "GHK-Cu 50mg" },
];

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function bannerSvg(label: string, w: number, h: number): string {
  const stacked = w < h;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#0A0B0D"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#2A2F36"/>
  <text x="${stacked ? w / 2 : 16}" y="${stacked ? h / 2 - 8 : h / 2 - 4}" fill="#F3F5F7" font-family="sans-serif" font-size="${stacked ? 16 : 18}" font-weight="600" text-anchor="${stacked ? "middle" : "start"}">Nexphoria</text>
  <text x="${stacked ? w / 2 : 16}" y="${stacked ? h / 2 + 14 : h / 2 + 16}" fill="#B8E04F" font-family="monospace" font-size="11" text-anchor="${stacked ? "middle" : "start"}">Research-grade peptides · RUO</text>
</svg>`;
}

function emailHtml(subject: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0A0B0D;font-family:Inter,Arial,sans-serif;color:#C8CDD3">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#111317;border:1px solid #2A2F36;border-radius:8px">
      <tr><td style="padding:28px">
        <p style="color:#B8E04F;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px">Nexphoria · Partner email</p>
        <h1 style="color:#F3F5F7;font-size:22px;margin:0 0 12px">${subject}</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 16px">Insert your on-voice copy here. Speak peer-to-peer with researchers — specifications, purity, citations. No medical claims.</p>
        <a href="https://nxph.io/r/YOURCODE" style="display:inline-block;background:#B8E04F;color:#0A0B0D;font-weight:600;font-size:14px;text-decoration:none;padding:12px 20px;border-radius:4px">Browse the catalog</a>
        <p style="font-size:11px;color:#5A5F66;font-family:monospace;margin:20px 0 0">Some links are affiliate links. Research use only.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function brandKitText(): string {
  return `Nexphoria — Brand kit (partner reference)

Colors
  Ink        #0A0B0D
  Ink-2      #111317
  Steel      #2A2F36
  Silver     #C8CDD3
  Platinum   #F3F5F7
  Accent     #B8E04F (acid green)

Type
  Display    Space Grotesk 500/600
  Body       Inter 400/500
  Mono       JetBrains Mono 400/500

Voice
  Peer-to-peer with researchers. Specs forward. RUO. No medical claims. No emojis.

Disclosure
  "Some links are affiliate links. Nexphoria research integrity is not influenced by commissions."
`;
}

function productShotSvg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#0A0B0D"/>
  <radialGradient id="g" cx="38%" cy="28%" r="70%">
    <stop offset="0%" stop-color="#1A1D22"/><stop offset="100%" stop-color="#0A0B0D"/>
  </radialGradient>
  <rect width="400" height="400" fill="url(#g)"/>
  <rect x="168" y="120" width="64" height="170" rx="8" fill="#111317" stroke="#2A2F36"/>
  <rect x="176" y="108" width="48" height="20" rx="4" fill="#2A2F36"/>
  <rect x="176" y="170" width="48" height="92" fill="#0A0B0D"/>
  <rect x="184" y="186" width="32" height="3" fill="#C8CDD3"/>
  <text x="200" y="340" fill="#F3F5F7" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">${label}</text>
  <text x="200" y="362" fill="#B8E04F" font-family="monospace" font-size="11" text-anchor="middle">Research use only</text>
</svg>`;
}

const tabBtn = (active: boolean) =>
  ({
    fontFamily: "var(--font-body)",
    color: active ? "var(--ink)" : "var(--silver-1)",
    backgroundColor: active ? "var(--accent)" : "transparent",
    border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
  }) as const;

function DownloadBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold focus:outline-none focus-visible:ring-2"
      style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
    >
      <Download size={14} aria-hidden="true" />
      Download
    </button>
  );
}

export default function PprAffiliateAssetsGallery() {
  const [tab, setTab] = useState<TabId>("banners");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className="rounded-md px-3.5 py-1.5 text-[13px] focus:outline-none focus-visible:ring-2"
            style={tabBtn(tab === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "banners" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {BANNERS.map((b) => (
            <div key={b.id} className="flex flex-col gap-3 rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
              <div className="flex items-center justify-center overflow-hidden rounded-md p-2" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)", minHeight: 130 }}>
                <div dangerouslySetInnerHTML={{ __html: bannerSvg("Nexphoria", b.w, b.h).replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, `height="${Math.min(b.h, 120)}"`) }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>{b.label} · {b.w}x{b.h}</span>
                <DownloadBtn onClick={() => download(`nexphoria-banner-${b.id}.svg`, bannerSvg("Nexphoria", b.w, b.h), "image/svg+xml")} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "social" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SOCIAL.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
              <div className="flex items-center justify-center overflow-hidden rounded-md" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}>
                <div dangerouslySetInnerHTML={{ __html: bannerSvg("Nexphoria", s.w, s.h) }} style={{ maxHeight: 220, display: "flex" }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>{s.label}</span>
                <DownloadBtn onClick={() => download(`nexphoria-social-${s.id}.svg`, bannerSvg("Nexphoria", s.w, s.h), "image/svg+xml")} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "email" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {EMAIL_TEMPLATES.map((e) => (
            <div key={e.id} className="flex flex-col gap-3 rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
              <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-3)" }}>Subject</span>
              <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{e.subject}</p>
              <DownloadBtn onClick={() => download(`nexphoria-email-${e.id}.html`, emailHtml(e.subject), "text/html")} />
            </div>
          ))}
        </div>
      )}

      {tab === "brand" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {BRAND_ITEMS.map((b) => (
            <div key={b.id} className="flex flex-col gap-3 rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
              <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{b.label}</p>
              <DownloadBtn onClick={() => download("nexphoria-brand-kit.txt", brandKitText(), "text/plain")} />
            </div>
          ))}
        </div>
      )}

      {tab === "product" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PRODUCT_SHOTS.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
              <div className="overflow-hidden rounded-md" style={{ border: "1px solid var(--steel)" }} dangerouslySetInnerHTML={{ __html: productShotSvg(p.label).replace(/width="400"/, 'width="100%"').replace(/height="400"/, 'height="200"') }} />
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>{p.label}</span>
                <DownloadBtn onClick={() => download(`nexphoria-product-${p.id}.svg`, productShotSvg(p.label), "image/svg+xml")} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        All assets are demo SVG/HTML mocks generated client-side. Every placement must carry the FTC disclosure. Research use only.
      </p>
    </div>
  );
}
