"use client";

import { useState } from "react";
import { Copy, Check, Mail, MessageCircle, MessageSquare } from "lucide-react";

const REFERRAL_URL = "https://nxph.io/refer/RESEARCH20";
const SHARE_TEXT = "Research-grade peptides, third-party tested. Get $20 off your first Nexphoria order (RUO):";

function shareLinks(url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    email: `mailto:?subject=${encodeURIComponent("A research-grade peptide source")}&body=${t}%20${u}`,
    sms: `sms:?&body=${t}%20${u}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
  };
}

const SHARE_BTNS: { id: keyof ReturnType<typeof shareLinks>; label: string; icon: typeof Mail }[] = [
  { id: "x", label: "X", icon: MessageSquare },
  { id: "facebook", label: "Facebook", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export default function PprReferLinkBox() {
  const [copied, setCopied] = useState(false);
  const links = shareLinks(REFERRAL_URL, SHARE_TEXT);

  const copy = () => {
    navigator.clipboard?.writeText(REFERRAL_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="mx-auto max-w-2xl px-5 pb-4">
      <div className="flex flex-col gap-4 rounded-2xl p-6 lg:p-8" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 6%, var(--ink-2))", border: "1px solid var(--accent)" }}>
        <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
          Your referral link
        </span>
        <div className="flex items-stretch gap-2">
          <code
            className="min-w-0 flex-1 truncate rounded-md px-3.5 py-3 text-[14px]"
            style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)", color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            {REFERRAL_URL}
          </code>
          <button
            type="button"
            onClick={copy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-4 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: copied ? "var(--ok)" : "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SHARE_BTNS.map((b) => {
            const Icon = b.icon;
            return (
              <a
                key={b.id}
                href={links[b.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[13px] focus:outline-none focus-visible:ring-2"
                style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
              >
                <Icon size={15} aria-hidden="true" />
                {b.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
