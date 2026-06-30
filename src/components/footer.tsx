"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";

const activeProducts = products.filter((p) => !p.comingSoon);

const popularProductSlugs = [
  "bpc-157",
  "tirzepatide",
  "ghk-cu",
  "ipamorelin",
  "retatrutide",
  "nad-plus",
  "sermorelin",
  "tb-500",
];

const footerProducts = popularProductSlugs
  .map((slug) => activeProducts.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))
  .map((p) => ({
    label: p.name,
    href: `/products/${p.slug}`,
  }));

footerProducts.push({ label: "New Arrivals", href: "/products/new-arrivals" });
footerProducts.push({ label: "Best Sellers", href: "/products/best-sellers" });
footerProducts.push({ label: "Bundles", href: "/products/bundles" });
footerProducts.push({ label: "View All Products", href: "/products" });

const footerNav = {
  Products: footerProducts,
  Company: [
    { label: "About", href: "/about" },
    { label: "Our Team", href: "/about/team" },
    { label: "Science Advisors", href: "/about/science-advisors" },
    { label: "Science & Testing", href: "/science" },
    { label: "Research Hub", href: "/resources" },
    { label: "Compound Index", href: "/compounds" },
    { label: "Research Blog", href: "/blog" },
    { label: "Reviews", href: "/reviews" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Research Concierge", href: "/contact" },
    { label: "Customer Support", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping & Cold-Chain", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Compare Compounds", href: "/compare" },
    { label: "Research Tools", href: "/tools" },
    { label: "BAC Water Guide", href: "/tools/bac-water-guide" },
    { label: "Research Guides", href: "/guides" },
    { label: "Storage Guide", href: "/guides/storage" },
    { label: "Reconstitution Guide", href: "/guides/reconstitution" },
    { label: "Dosing Protocols Guide", href: "/guides/dosing-protocols" },
    { label: "Peptide Sourcing Guide", href: "/guides/peptide-sourcing" },
    { label: "Safety & Handling Guide", href: "/guides/safety-handling" },
    { label: "Biomarker Reference", href: "/tools/biomarker-reference" },
    { label: "Peptide Glossary", href: "/guides/peptide-glossary" },
    { label: "COA Verification Guide", href: "/guides/coa-verification" },
    { label: "Track Your Order", href: "/account/orders" },
    { label: "Order Status", href: "/account/lookup" },
    { label: "Wholesale", href: "/wholesale" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Research Use Policy", href: "/legal/disclaimer" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
  ],
};

function EmailCapture() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [tcpaConsent, setTcpaConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }
    if (!tcpaConsent) {
      setErrorMsg("Please confirm your consent to receive updates.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      try {
        const existing = JSON.parse(localStorage.getItem("nex_subscribers") || "[]") as string[];
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem("nex_subscribers", JSON.stringify(existing));
        }
      } catch {
        // localStorage may be unavailable
      }
      const res = await fetch("https://nexphoria-checkout.chiya-b60.workers.dev/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "nexphoria-footer", tcpaConsent: true, tcpaConsentTimestamp: new Date().toISOString() }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok && process.env.NODE_ENV === "development") {
        console.warn("Subscribe worker error:", res.status);
      }
      setStatus("success");
      setEmail("");
      router.push("/subscribe/confirmed");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <h4
        className="text-[10px] uppercase mb-2 font-medium"
        style={{ letterSpacing: "0.14em", color: "#B8A44C" }}
      >
        Research Updates
      </h4>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
        New compounds, batch releases, and protocol research — delivered to your inbox.
      </p>
      {status === "success" ? (
        <p className="text-sm font-medium" style={{ color: "#B8A44C" }}>
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      ) : (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setErrorMsg("");
              }
            }}
            placeholder="your@email.com"
            aria-label="Email address for research updates"
            className="flex-1 px-4 py-2.5 text-sm rounded bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors min-w-0"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading" || !tcpaConsent}
            className="px-5 py-2.5 text-sm font-medium rounded transition-all duration-200 whitespace-nowrap shrink-0"
            style={{
              backgroundColor: (status === "loading" || !tcpaConsent) ? "rgba(184,164,76,0.4)" : "#B8A44C",
              color: "#1A1A18",
              cursor: (status === "loading" || !tcpaConsent) ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {/* TCPA consent */}
        <label className="flex items-start gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={tcpaConsent}
            onChange={(e) => {
              setTcpaConsent(e.target.checked);
              if (status === "error") { setStatus("idle"); setErrorMsg(""); }
            }}
            className="mt-0.5 flex-shrink-0 accent-[#B8A44C]"
            aria-required="true"
          />
          <span className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
            I agree to receive research updates and marketing communications from Nexphoria Research, LLC by email.
            Consent is not a condition of purchase. Message frequency varies. You may{" "}
            <a href="/privacy" className="underline hover:text-white transition-colors">unsubscribe</a>{" "}
            at any time. View our{" "}
            <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
          </span>
        </label>
        </>
      )}
      {status === "error" && errorMsg && (
        <p className="text-xs mt-2" style={{ color: "rgba(255,100,100,0.8)" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}

/** Single collapsible footer section — mobile accordion, always-open on desktop */
function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.07] md:border-none">
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-full flex items-center justify-between py-3.5 text-left"
        aria-expanded={open}
      >
        <span
          className="text-[10px] uppercase font-medium"
          style={{ letterSpacing: "0.14em", color: "#B8A44C" }}
        >
          {title}
        </span>
        {/* Chevron icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: "rgba(255,255,255,0.35)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M5 7.5l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Desktop heading (always visible) */}
      <h4
        className="hidden md:block text-[10px] uppercase mb-4 font-medium"
        style={{ letterSpacing: "0.14em", color: "#B8A44C" }}
      >
        {title}
      </h4>

      {/* Link list — mobile: collapsible; desktop: always shown */}
      <ul
        className={[
          "space-y-2.5 overflow-hidden transition-all duration-200",
          "md:block md:overflow-visible md:max-h-none md:pb-0",
          open ? "max-h-[600px] pb-4" : "max-h-0 md:max-h-none",
        ].join(" ")}
      >
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A1A18" }}>
      <div className="footer-gold-top" />
      <div className="container-nex pt-16 pb-10">

        {/* Email capture row */}
        <div className="mb-12 pb-12 border-b border-white/[0.08]">
          <div className="max-w-md">
            <EmailCapture />
          </div>
        </div>

        {/* Brand + nav columns */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-14 pb-14 border-b border-white/[0.08]">

          {/* Brand block */}
          <div className="max-w-xs shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" className="h-6 w-6" role="img" aria-label="Nexphoria">
                <g>
                  <circle fill="#B8A44C" cx="129.698" cy="380.792" r="71.864" />
                  <path
                    fill="#B8A44C"
                    d="M519.834,328.405c-17.864-16.774-41.141-22.533-62.628-18.55c-18.724,3.471-38.055-0.118-53.17-11.702l-6.86-5.257c-15.349-11.763-23.999-29.746-25.629-49.016c-1.685-19.927-11.623-39.039-29.014-51.808c-16.815-12.346-37.204-16.273-56.18-12.583c-18.19,3.537-37.03,0.099-51.739-11.173l-7.496-5.744c-15.472-11.857-24.203-29.973-25.892-49.393c-1.792-20.603-12.408-40.363-31.14-53.138c-29.987-20.451-71.799-14.725-95.228,12.998c-26.524,31.385-21.393,78.205,10.727,103.18c17.127,13.317,38.364,17.629,58.085,13.695c18.6-3.71,37.886,0.889,52.94,12.426l6.216,4.764c15.349,11.763,23.999,29.746,25.629,49.016c1.685,19.927,11.623,39.039,29.014,51.809c16.815,12.346,37.204,16.273,56.18,12.583c18.19-3.537,37.03-0.099,51.739,11.173l7.704,5.904c14.677,11.248,24.521,28.127,25.467,46.594c1.094,21.348,11.653,41.983,30.521,55.197c34.727,24.32,83.49,13.65,104.428-24.632C548.956,386.504,543.301,350.44,519.834,328.405z"
                  />
                  <circle fill="#B8A44C" cx="470.305" cy="119.208" r="71.864" />
                </g>
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
                Nexphoria
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Research-grade peptide compounds for qualified professionals.
              Manufactured under cGMP standards.
            </p>
            <div className="space-y-1">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                Nexphoria Research, LLC
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                30 N Gould St Ste R, Sheridan, WY 82801
              </p>
              <a
                href="mailto:research@nexphoria.com"
                className="text-xs transition-colors hover:text-white block"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                research@nexphoria.com
              </a>
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-colors hover:text-white block mt-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                WhatsApp (urgent inquiries)
              </a>
            </div>
          </div>

          {/* Nav columns — desktop: 4-column grid, mobile: stacked accordion */}
          <div className="flex-1 md:max-w-2xl">
            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-8 md:gap-10">
              {Object.entries(footerNav).map(([section, links]) => (
                <div key={section}>
                  <h4
                    className="text-[10px] uppercase mb-4 font-medium"
                    style={{ letterSpacing: "0.14em", color: "#B8A44C" }}
                  >
                    {section}
                  </h4>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-colors duration-200 hover:text-white"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mobile accordion */}
            <div className="md:hidden border-t border-white/[0.07]">
              {Object.entries(footerNav).map(([section, links]) => (
                <FooterSection key={section} title={section} links={links} />
              ))}
            </div>
          </div>
        </div>

        {/* Lab partner credits */}
        <div className="mb-10 flex flex-col items-center gap-2.5">
          <p
            className="text-[10px] uppercase font-medium"
            style={{ letterSpacing: "0.2em", color: "#B8A44C" }}
          >
            Independently Verified By
          </p>
          <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Janoshik Analytical
            </span>
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Freedom Diagnostics
            </span>
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              HPLC &amp; MS Third-Party Testing
            </span>
          </div>
        </div>

        {/* Compliance disclaimer */}
        <div className="mb-10" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem" }}>
          <p
            className="text-center"
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              maxWidth: "72ch",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            For Research Use Only — Not for human consumption, clinical use, or veterinary applications.
            By purchasing you confirm exclusive use for in vitro testing and laboratory experimentation.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 Nexphoria Research, LLC. All rights reserved.
          </p>

          {/* Payment method icons */}
          <div className="flex items-center flex-wrap gap-2" aria-label="Accepted payment methods">

            {/* Visa */}
            <div
              className="flex items-center justify-center px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="Visa"
            >
              <svg width="32" height="11" viewBox="0 0 32 11" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.28 1.16L11.2 9.84H9.04L11.12 1.16H13.28Z" fill="rgba(255,255,255,0.55)" />
                <path d="M20.72 1.36C20.24 1.16 19.44 0.96 18.48 0.96C16.32 0.96 14.8 2.08 14.8 3.68C14.8 4.88 15.84 5.52 16.64 5.92C17.44 6.32 17.68 6.56 17.68 6.96C17.68 7.52 17.04 7.76 16.48 7.76C15.68 7.76 15.28 7.64 14.56 7.28L14.24 7.12L13.92 8.96C14.48 9.2 15.44 9.44 16.48 9.44C18.8 9.44 20.24 8.32 20.24 6.64C20.24 5.68 19.68 4.96 18.4 4.4C17.68 4 17.28 3.76 17.28 3.36C17.28 2.96 17.68 2.56 18.56 2.56C19.2 2.56 19.68 2.68 20.08 2.88L20.24 2.96L20.72 1.36Z" fill="rgba(255,255,255,0.55)" />
                <path d="M23.84 1.16C23.44 1.16 23.12 1.36 22.96 1.72L19.92 9.84H22.16L22.64 8.36H25.44L25.76 9.84H27.76L26 1.16H23.84ZM23.28 6.64L24.4 3.28L25.04 6.64H23.28Z" fill="rgba(255,255,255,0.55)" />
                <path d="M11.04 1.16L8.88 7.28L8.64 6.16C8.16 4.64 6.8 3.04 5.28 2.24L7.28 9.84H9.52L12.96 1.16H11.04Z" fill="rgba(255,255,255,0.55)" />
                <path d="M6.4 1.16H3.04L3 1.36C5.6 2 7.44 3.6 8.16 5.6L7.36 2.08C7.2 1.44 6.88 1.16 6.4 1.16Z" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>

            {/* Mastercard */}
            <div
              className="flex items-center justify-center px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="Mastercard"
            >
              <svg width="26" height="16" viewBox="0 0 26 16" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="8" r="7" fill="rgba(220,50,50,0.6)" />
                <circle cx="17" cy="8" r="7" fill="rgba(240,160,30,0.5)" />
                <path d="M13 2.8C14.6 4 15.6 5.9 15.6 8C15.6 10.1 14.6 12 13 13.2C11.4 12 10.4 10.1 10.4 8C10.4 5.9 11.4 4 13 2.8Z" fill="rgba(220,110,20,0.5)" />
              </svg>
            </div>

            {/* Amex */}
            <div
              className="flex items-center justify-center px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="American Express"
            >
              <svg width="30" height="11" viewBox="0 0 30 11" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="30" height="11" rx="2" fill="rgba(45,100,180,0.0)" />
                <text x="1" y="9" fontFamily="'Arial Black',Arial,sans-serif" fontSize="8" fontWeight="900" fill="rgba(255,255,255,0.55)" letterSpacing="0.5">AMEX</text>
              </svg>
            </div>

            {/* AllayPay */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="AllayPay"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="#B8A44C" strokeWidth="1.1" />
                <path d="M4.5 6.5h4M6.5 4.5v4" stroke="#B8A44C" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>AllayPay</span>
            </div>

            {/* Stripe */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="Stripe"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <rect x="1" y="3" width="11" height="7" rx="1.5" stroke="rgba(99,91,255,0.8)" strokeWidth="1" />
                <rect x="1" y="5.5" width="11" height="1.5" fill="rgba(99,91,255,0.4)" />
              </svg>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>Stripe</span>
            </div>

            {/* Bitcoin */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="Bitcoin"
            >
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
                <path d="M2 2h4.5c1.2 0 2.2.9 2.2 2S7.7 6 6.5 6H2V2ZM2 6h5c1.2 0 2.2.9 2.2 2S8.2 10 7 10H2V6Z" stroke="rgba(247,147,26,0.8)" strokeWidth="0.9" strokeLinejoin="round" />
                <line x1="3.5" y1="1" x2="3.5" y2="12" stroke="rgba(247,147,26,0.7)" strokeWidth="0.9" strokeLinecap="round" />
                <line x1="6" y1="1" x2="6" y2="12" stroke="rgba(247,147,26,0.7)" strokeWidth="0.9" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>BTC</span>
            </div>

            {/* Ethereum */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              title="Ethereum"
            >
              <svg width="9" height="13" viewBox="0 0 9 13" fill="none" aria-hidden="true">
                <path d="M4.5 1L1 7l3.5 2L8 7 4.5 1Z" stroke="rgba(98,126,234,0.8)" strokeWidth="0.9" strokeLinejoin="round" />
                <path d="M4.5 10L1 7.5l3.5 4.5L8 7.5 4.5 10Z" stroke="rgba(98,126,234,0.8)" strokeWidth="0.9" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>ETH</span>
            </div>
          </div>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Not evaluated by the FDA. Not for diagnostic or therapeutic use.
          </p>
        </div>
      </div>
    </footer>
  );
}
