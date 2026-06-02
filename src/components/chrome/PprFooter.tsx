"use client";

import { useState } from "react";
import Link from "next/link";
import { Snowflake, FlaskConical, MapPin, Lock } from "lucide-react";

const SHOP_LINKS = [
  { label: "Catalog", href: "/products" },
  { label: "Protocols", href: "/protocols" },
  { label: "Bestsellers", href: "/products/best-sellers" },
  { label: "Build Your Stack", href: "/quiz" },
  { label: "Compare", href: "/compare" },
  { label: "Subscriptions", href: "/products?filter=subscriptions" },
];

const RESEARCH_LINKS = [
  { label: "Science", href: "/science" },
  { label: "Manufacturing", href: "/science#manufacturing" },
  { label: "COAs", href: "/coa" },
  { label: "Citations", href: "/science#citations" },
  { label: "Journal", href: "/blog" },
  { label: "Tools", href: "/tools" },
];

const SUPPORT_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Contact", href: "/contact" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Account", href: "/account/orders" },
];

const TRUST = [
  { Icon: Snowflake, label: "Cold-chain logistics" },
  { Icon: FlaskConical, label: "Third-party HPLC tested" },
  { Icon: MapPin, label: "Ships from US" },
  { Icon: Lock, label: "Age + RUO verified" },
];

const LEGAL = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Compliance", href: "/compliance" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p
        className="mb-4 text-[11px] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em",
          color: "var(--silver-2)",
        }}
      >
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[14px] transition-colors hover:text-[color:var(--platinum)]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PprFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* Static export has no API route; show success optimistically. */
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <footer style={{ backgroundColor: "var(--ink)" }}>
      {/* Gradient top border */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, var(--steel) 0%, transparent 50%, var(--steel) 100%)",
        }}
      />

      {/* Top section — 4 columns */}
      <div className="mx-auto max-w-[1440px] px-8" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 — brand */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: "-0.02em",
                color: "var(--platinum)",
              }}
            >
              <span style={{ color: "var(--accent)" }}>N</span>exphoria
            </span>
            <p
              className="mt-4 max-w-[260px] text-[14px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.6 }}
            >
              Research-grade peptides, third-party verified, cold-chain shipped.
            </p>
            <p
              className="mt-5 text-[11px] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.12em",
                color: "var(--silver-2)",
              }}
            >
              RUO · Not for human consumption
            </p>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Research" links={RESEARCH_LINKS} />
          <FooterColumn title="Support" links={SUPPORT_LINKS} />
        </div>
      </div>

      {/* Middle — newsletter */}
      <div style={{ borderTop: "1px solid var(--steel)" }}>
        <div
          className="mx-auto flex max-w-[1440px] flex-col gap-6 px-8 lg:flex-row lg:items-center lg:justify-between"
          style={{ paddingTop: 48, paddingBottom: 48 }}
        >
          <div className="max-w-[440px]">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 600,
                color: "var(--platinum)",
                lineHeight: 1.15,
              }}
            >
              Cited research, monthly. No promos.
            </p>
            <p
              className="mt-2 text-[14px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
            >
              Peer-reviewed peptide research summaries, sent the first Monday.
            </p>
          </div>

          {status === "success" ? (
            <p
              className="text-[14px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
              role="status"
            >
              Subscribed. Watch for the next research digest.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full max-w-[420px] gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@institution.edu"
                disabled={status === "loading"}
                aria-label="Email address"
                className="flex-1 rounded-md px-4 py-3 text-[14px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink-2)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="whitespace-nowrap rounded-md px-5 py-3 text-[14px] font-medium transition-opacity disabled:opacity-60"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Subscribe &rarr;
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom — trust strip + legal */}
      <div style={{ borderTop: "1px solid var(--steel)" }}>
        <div
          className="mx-auto max-w-[1440px] px-8"
          style={{ paddingTop: 32, paddingBottom: 32 }}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {TRUST.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" style={{ color: "var(--accent)" }} />
                <span
                  className="text-[13px]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className="text-[12px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
            >
              © 2026 Nexphoria Research
            </span>
            {LEGAL.map((l) => (
              <span key={l.href} className="flex items-center gap-2">
                <span style={{ color: "var(--silver-2)", fontSize: 12 }}>·</span>
                <Link
                  href={l.href}
                  className="text-[12px] transition-colors hover:text-[color:var(--platinum)]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
