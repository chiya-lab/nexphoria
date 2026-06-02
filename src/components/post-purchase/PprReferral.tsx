"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Share2, Gift } from "lucide-react";

function makeCode(): string {
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
  return `RESEARCH-${rand}`;
}

export default function PprReferral({ code }: { code?: string }) {
  const referralCode = useMemo(() => code ?? makeCode(), [code]);
  const shareUrl = useMemo(() => {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://nexphoria.com";
    return `${base}/?ref=${referralCode}`;
  }, [referralCode]);

  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Nexphoria — research compounds",
          text: "Give $20, get $20 on research protocols.",
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or unsupported — fall through to copy
      }
    }
    copy();
  }

  return (
    <section
      className="rounded-lg p-6"
      style={{
        backgroundColor: "color-mix(in srgb, var(--accent) 6%, var(--ink-2))",
        border: "1px solid var(--accent)",
      }}
    >
      <div className="mb-1.5 flex items-center gap-2.5">
        <Gift size={20} aria-hidden="true" style={{ color: "var(--accent)" }} />
        <h2
          className="text-[18px] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Give $20, get $20
        </h2>
      </div>
      <p className="mb-4 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
        Share your link with a fellow researcher. They get $20 off their first protocol; you earn
        $20 in lab credit once their order ships.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <code
          className="flex-1 truncate rounded-md px-4 py-3 text-[14px]"
          style={{
            backgroundColor: "var(--ink)",
            border: "1px solid var(--steel)",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.03em",
          }}
        >
          {shareUrl}
        </code>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-[13px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={share}
            aria-label="Share"
            className="flex items-center justify-center rounded-md px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
          >
            <Share2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
        Code: {referralCode}
      </p>
    </section>
  );
}
