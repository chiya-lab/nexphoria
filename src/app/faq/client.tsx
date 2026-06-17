"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

// FAQPage JSON-LD structured data — objection-handling rewrite
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    // ── PURITY & TRUST ──────────────────────────────────────────────────────
    {
      "@type": "Question",
      name: "How do I know your purity claims are real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every lot we sell is independently tested by Janoshik Analytical (Prague, CZ) and Freedom Diagnostics before shipping. We never self-test. Your COA includes the lab name, analyst signature, lot number, HPLC chromatogram, and MS identity confirmation. You can contact either lab directly to verify any COA we issue — the lot number will trace back to your order. Most vendors cite generic purity numbers; we attach the actual documentation. We require ≥98% HPLC across the catalog; most compounds ship at ≥99%+.",
      },
    },
    {
      "@type": "Question",
      name: "Which labs do you use for testing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our primary testing laboratories are Janoshik Analytical (janoshik.com, Prague, Czech Republic) — an ISO-accredited lab widely trusted in the research peptide industry — and Freedom Diagnostics for secondary confirmation on high-demand compounds. Both labs perform HPLC purity analysis and mass spectrometry identity confirmation. Endotoxin (LAL) testing is performed on select injectable-grade SKUs. Lab names and contact information appear on every COA so you can verify independently.",
      },
    },
    {
      "@type": "Question",
      name: "Can I see a COA before I order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Sample COAs for our top 6 compounds (BPC-157, Semaglutide, Tirzepatide, TB-500, GHK-Cu, NAD+) are available at nexphoria.com/coa/{slug}. Each shows the HPLC purity table, MS confirmation, endotoxin result, lot number, and analyst sign-off. For other compounds, COAs ship with every order and are available on request before purchase — just contact us at research@nexphoria.com with your compound of interest.",
      },
    },
    // ── SHIPPING & COLD CHAIN ───────────────────────────────────────────────
    {
      "@type": "Question",
      name: "How fast do you actually ship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orders placed before 2 PM ET Monday–Friday ship the same business day. Orders placed after 2 PM or on weekends ship the next business day. Standard delivery (FedEx Ground) is 2–5 business days within the continental US. Overnight Express (FedEx Priority Overnight) delivers the next business day by 10:30 AM. You receive a tracking number by email the moment your label is generated.",
      },
    },
    {
      "@type": "Question",
      name: "How is cold-chain maintained during shipping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All orders ship in insulated EPS foam boxes with refrigerant gel packs rated for 48–72 hours of transit at ambient temperatures up to 90°F. Lyophilized (freeze-dried) peptides are the most stable form — brief ambient exposure during transit does not degrade them. If you order reconstituted or solution-form compounds, we upgrade automatically to overnight shipping with phase-change 4°C gel packs. We monitor transit weather patterns for heat events during summer months and hold shipments when necessary.",
      },
    },
    {
      "@type": "Question",
      name: "Do you ship internationally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, we ship within the United States only. International shipping is not available at this time. We are working on expanding to Canada and select EU jurisdictions where research peptides can be lawfully imported. Join our email list to be notified when your country is added.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track my order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A FedEx tracking number is emailed to you as soon as your label is generated — typically within 2 hours of your order for same-day-ship orders. You can also look up your order status at nexphoria.com/account/orders using your email address and the order session ID from your confirmation email.",
      },
    },
    // ── RETURNS & DAMAGE ────────────────────────────────────────────────────
    {
      "@type": "Question",
      name: "What if my order arrives damaged or warm?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contact us within 48 hours of delivery at research@nexphoria.com with your order number and a photo of the packaging, gel packs, and vials. If the cold chain was compromised during transit or packaging was damaged in shipping, we will send a replacement at no charge or issue a full refund — your choice. We stand behind our logistics. If it was our error, we fix it without debate.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return and refund policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept returns and issue refunds for: (1) damaged or compromised shipments (within 48 hours of delivery), (2) wrong product shipped (within 7 days), (3) vials with broken seals on arrival (within 48 hours). We do not accept returns on opened vials or compounds that have been reconstituted. All sales on correctly shipped, intact compounds are final due to cold-chain and research integrity requirements. Subscriptions can be cancelled any time via your Stripe billing portal before the next billing cycle.",
      },
    },
    // ── PAYMENT ─────────────────────────────────────────────────────────────
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) via Stripe's secure checkout. Apple Pay and Google Pay are available on supported devices. All payment processing is handled by Stripe (PCI-DSS Level 1 certified) — Nexphoria never stores your card details. Cryptocurrency payments are not currently accepted.",
      },
    },
    {
      "@type": "Question",
      name: "Is my payment information secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All transactions are processed by Stripe, which is PCI-DSS Level 1 certified — the highest level of payment security certification. Your card data never touches our servers. Our site uses TLS 1.3 encryption and is protected by Cloudflare's WAF. We do not store payment information.",
      },
    },
    // ── STORAGE & USE ───────────────────────────────────────────────────────
    {
      "@type": "Question",
      name: "How do I store my compounds when they arrive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lyophilized (powder) compounds: store at −20°C (standard freezer), in a desiccated environment, protected from light. Shelf life: 24+ months. If you don't have a −20°C freezer, 4°C (standard refrigerator) works for short-term storage up to 3–6 months for most compounds. Reconstituted solutions: store at 4°C for up to 2–4 weeks depending on the compound. Do not refreeze reconstituted solutions more than once. Full storage guidance by compound is available at nexphoria.com/guides/storage.",
      },
    },
    {
      "@type": "Question",
      name: "How do I reconstitute a lyophilized peptide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard procedure: (1) Let the sealed vial warm to room temperature (~15 minutes). (2) Using a sterile syringe, inject bacteriostatic water slowly down the inside wall of the vial — do not squirt directly onto the peptide cake. (3) Gently swirl the vial in a circular motion; do not shake or vortex. (4) Allow 5–10 minutes for complete dissolution. The solution should be clear with no visible particles. Our reconstitution calculator at nexphoria.com/tools/reconstitution-calculator will calculate exactly how much BAC water to add for your target concentration.",
      },
    },
    {
      "@type": "Question",
      name: "What is a research use only (RUO) compound?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Research Use Only means the compound is sold exclusively for in vitro and in vivo laboratory research — not for human or veterinary therapeutic use, and not for use in clinical trials without proper IND authorization. All Nexphoria compounds carry RUO designation. This is a legal classification, not a comment on quality — RUO compounds are manufactured to the same high-purity standards as analytical reference standards.",
      },
    },
    // ── WHOLESALE ───────────────────────────────────────────────────────────
    {
      "@type": "Question",
      name: "Do you offer wholesale or bulk pricing for labs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer tiered wholesale pricing for research institutions, biotech firms, and labs with recurring volume. Minimum order requirements and volume-based discounts are discussed individually. Submit a wholesale inquiry at nexphoria.com/wholesale with your institution name, estimated monthly volume, and compounds of interest. We respond within 1 business day.",
      },
    },
  ],
};

// Visible FAQ data (rich ReactNode version for the UI)
const faqs: { category: string; items: { q: string; a: string | ReactNode }[] }[] = [
  {
    category: "Purity & Testing",
    items: [
      {
        q: "How do I know your purity claims are real?",
        a: (
          <>
            Every lot we sell is independently tested by{" "}
            <a href="https://janoshik.com" className="underline" target="_blank" rel="noopener noreferrer">
              Janoshik Analytical
            </a>{" "}
            (Prague, CZ) and{" "}
            <strong>Freedom Diagnostics</strong> before shipping. We never self-test.
            Your COA includes the lab name, analyst signature, lot number, HPLC chromatogram, and MS identity confirmation.
            You can contact either lab directly to verify — the lot number will trace back to your order.
            We require <strong>≥98% HPLC</strong> across the catalog; most compounds ship at <strong>≥99%+</strong>.
          </>
        ),
      },
      {
        q: "Which labs do you use for testing?",
        a: (
          <>
            Our primary testing laboratories are{" "}
            <a href="https://janoshik.com" className="underline" target="_blank" rel="noopener noreferrer">
              Janoshik Analytical
            </a>{" "}
            (ISO-accredited, Prague, Czech Republic — widely trusted in research peptide testing) and{" "}
            <strong>Freedom Diagnostics</strong> for secondary confirmation on high-demand compounds.
            Both labs perform HPLC purity analysis and mass spectrometry identity confirmation.
            Endotoxin (LAL) testing is performed on select injectable-grade SKUs.
            Lab names and contact info appear on every COA so you can verify independently.
          </>
        ),
      },
      {
        q: "Can I see a COA before I order?",
        a: (
          <>
            Yes. Sample COAs for our top 6 compounds are available at{" "}
            <Link href="/coa/bpc-157" className="underline">BPC-157</Link>,{" "}
            <Link href="/coa/semaglutide" className="underline">Semaglutide</Link>,{" "}
            <Link href="/coa/tirzepatide" className="underline">Tirzepatide</Link>,{" "}
            <Link href="/coa/tb-500" className="underline">TB-500</Link>,{" "}
            <Link href="/coa/ghk-cu" className="underline">GHK-Cu</Link>, and{" "}
            <Link href="/coa/nad-plus" className="underline">NAD+</Link>.
            For other compounds, COAs ship with every order and are available on request before purchase —
            email <a href="mailto:research@nexphoria.com" className="underline">research@nexphoria.com</a>.
          </>
        ),
      },
      {
        q: "What purity standards do you require, and how does that compare to other vendors?",
        a: "We require ≥98% HPLC purity as a floor across our entire catalog. Most competitors accept 95% or below as passing. Our most-ordered compounds (BPC-157, Semaglutide, Tirzepatide, TB-500) consistently test at ≥99.2%. Purity specifications are listed on every product page; actual lot results are documented on the COA that ships with your order.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "How fast do you actually ship?",
        a: (
          <>
            Orders placed before <strong>2 PM ET Monday–Friday</strong> ship the same business day.
            Orders placed after 2 PM or on weekends ship the next business day.
            Standard delivery (FedEx Ground) is <strong>2–5 business days</strong> in the continental US.
            Overnight Express (FedEx Priority Overnight) delivers next business day by 10:30 AM.
            You receive a tracking number by email the moment your label is generated.
            See our full shipping details at{" "}
            <Link href="/shipping" className="underline">nexphoria.com/shipping</Link>.
          </>
        ),
      },
      {
        q: "How is cold-chain maintained during shipping?",
        a: "All orders ship in insulated EPS foam boxes with refrigerant gel packs rated for 48–72 hours of transit at ambient temperatures up to 90°F. Lyophilized (freeze-dried) peptides are stable — brief ambient exposure during transit does not degrade them. We monitor transit weather patterns during summer heat events and hold shipments when necessary. For reconstituted compounds, we automatically upgrade to overnight shipping with 4°C phase-change packs.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship within the United States only. We are working on adding Canada and select EU jurisdictions. Join our email list to be notified when international shipping launches.",
      },
      {
        q: "Can I track my order?",
        a: (
          <>
            Yes. A FedEx tracking number is emailed to you as soon as your label is generated.
            You can also look up your order at{" "}
            <Link href="/account/orders" className="underline">nexphoria.com/account/orders</Link>{" "}
            using your email and order session ID from your confirmation email.
          </>
        ),
      },
    ],
  },
  {
    category: "Damaged Orders & Returns",
    items: [
      {
        q: "What if my order arrives damaged or warm?",
        a: (
          <>
            Contact us within <strong>48 hours of delivery</strong> at{" "}
            <a href="mailto:research@nexphoria.com" className="underline">research@nexphoria.com</a>{" "}
            with your order number and a photo of the packaging, gel packs, and vials.
            If the cold chain was compromised or packaging was damaged in transit, we send a replacement at no charge
            or issue a full refund — your choice. We stand behind our logistics. If it was our error, we fix it without debate.
          </>
        ),
      },
      {
        q: "What is your return and refund policy?",
        a: (
          <>
            We accept returns and issue refunds for: (1) damaged or compromised shipments (within 48 hours),
            (2) wrong product shipped (within 7 days), (3) vials with broken seals on arrival (within 48 hours).
            We do not accept returns on opened vials or reconstituted compounds.
            Subscriptions can be cancelled any time via your Stripe billing portal before the next billing date.
            For any issue, email{" "}
            <a href="mailto:research@nexphoria.com" className="underline">research@nexphoria.com</a>{" "}
            with your order number.
          </>
        ),
      },
    ],
  },
  {
    category: "Payment & Security",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, and Discover via Stripe's secure checkout. Apple Pay and Google Pay are available on supported devices. All payment processing is handled by Stripe (PCI-DSS Level 1 certified). Nexphoria never stores your card details. Cryptocurrency is not currently accepted.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All transactions are processed by Stripe — PCI-DSS Level 1, the highest certification level. Your card data never touches our servers. Our site uses TLS 1.3 encryption and Cloudflare WAF protection. We do not store payment information of any kind.",
      },
    ],
  },
  {
    category: "Storage & Handling",
    items: [
      {
        q: "How do I store my compounds when they arrive?",
        a: (
          <>
            <strong>Lyophilized (powder):</strong> Store at −20°C (standard freezer), desiccated, away from light.
            Shelf life: 24+ months. No −20°C? 4°C (standard refrigerator) works for most compounds up to 3–6 months.{" "}
            <strong>Reconstituted solutions:</strong> Store at 4°C for 2–4 weeks depending on the compound.
            Do not refreeze reconstituted solutions more than once.
            Full per-compound storage data:{" "}
            <Link href="/guides/storage" className="underline">nexphoria.com/guides/storage</Link>.
          </>
        ),
      },
      {
        q: "How do I reconstitute a lyophilized peptide?",
        a: (
          <>
            Standard procedure: (1) Let the sealed vial warm to room temperature (~15 min).
            (2) Inject bacteriostatic water slowly down the inside wall — not directly onto the peptide cake.
            (3) Gently swirl; do not shake or vortex.
            (4) Allow 5–10 minutes for complete dissolution.
            Use our{" "}
            <Link href="/tools/reconstitution-calculator" className="underline">reconstitution calculator</Link>{" "}
            to calculate exact BAC water volume for your target concentration.
          </>
        ),
      },
      {
        q: "Can I order bacteriostatic or sterile water from you?",
        a: "Yes. We carry Sterile Water (3 mL and 10 mL vials) in our catalog — pharmaceutical-grade, endotoxin-tested, sealed under aseptic conditions. These are suitable for research reconstitution.",
      },
    ],
  },
  {
    category: "Research Use & Compliance",
    items: [
      {
        q: "What does 'Research Use Only' mean?",
        a: "Research Use Only (RUO) means the compound is sold exclusively for in vitro and in vivo laboratory research — not for human or veterinary therapeutic use. This is a legal classification required by FDA for non-approved substances. It is not a comment on quality — RUO compounds are manufactured to the same high-purity standards as analytical reference standards. By purchasing, you confirm you are a qualified researcher using compounds strictly in a laboratory context.",
      },
      {
        q: "Are your compounds legal to purchase?",
        a: "In the United States, research peptides sold for laboratory research use are legal to purchase by qualified researchers. We ship to US addresses only. It is your responsibility to verify that receiving research compounds is lawful in your specific state and jurisdiction. Some state and local regulations may impose additional restrictions.",
      },
    ],
  },
  {
    category: "Wholesale & Bulk",
    items: [
      {
        q: "Do you offer wholesale or bulk pricing for labs?",
        a: (
          <>
            Yes. We offer tiered wholesale pricing for research institutions, biotech firms, and labs with recurring volume.
            Submit a{" "}
            <Link href="/wholesale" className="underline">wholesale inquiry here</Link>{" "}
            with your institution name, monthly volume estimate, and compounds of interest. We respond within 1 business day.
          </>
        ),
      },
      {
        q: "Can you synthesize custom peptide sequences?",
        a: (
          <>
            Yes. We accept custom synthesis inquiries for sequences not in our catalog. Lead times are typically 2–3 weeks.
            Contact us at{" "}
            <Link href="/contact" className="underline">nexphoria.com/contact</Link>{" "}
            to submit a custom synthesis inquiry.
          </>
        ),
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string | ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b"
      style={{ borderColor: "rgba(0,0,0,0.07)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className="text-sm md:text-base leading-snug"
          style={{ fontWeight: 500, color: "#010101", maxWidth: "85%" }}
        >
          {q}
        </span>
        <span
          className="shrink-0 mt-0.5 text-lg transition-transform duration-200"
          style={{
            color: "#B8A44C",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          className="pb-5 text-sm leading-relaxed"
          style={{ color: "#555", maxWidth: "85%" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

function faqText(node: string | ReactNode): string {
  if (typeof node === "string") return node;
  return "";
}

export default function FaqClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();

  const visibleFaqs = faqs
    .filter((f) => activeCategory === null || f.category === activeCategory)
    .map((section) => {
      if (!trimmedQuery) return section;
      const categoryMatch = section.category.toLowerCase().includes(trimmedQuery);
      if (categoryMatch) return section;
      const items = section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(trimmedQuery) ||
          faqText(item.a).toLowerCase().includes(trimmedQuery)
      );
      return { ...section, items };
    })
    .filter((section) => section.items.length > 0);

  const hasResults = visibleFaqs.length > 0;

  return (
    <div style={{ backgroundColor: "#EAE7E3", minHeight: "100vh" }}>
      {/* FAQPage JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section style={{ paddingTop: "160px", paddingBottom: "64px" }} className="px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="light"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "FAQ" },
            ]}
          />
          <p className="eyebrow mb-6" style={{ color: "#B8A44C" }}>
            Support
          </p>
          <h1
            className="text-4xl md:text-5xl mb-6 font-medium tracking-tight"
            style={{ color: "#010101", lineHeight: 1.1 }}
          >
            Questions Researchers<br />Actually Ask
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
            Straight answers on purity, testing labs, shipping timelines, storage, returns,
            and payment — the things that matter before you order.
          </p>
        </div>
      </section>

      {/* Quick stats strip — trust anchors */}
      <div className="px-6 md:px-12 pb-10">
        <div className="max-w-4xl mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl p-6"
            style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            {[
              { stat: "Janoshik + Freedom Diagnostics", label: "Independent Testing Labs" },
              { stat: "Same-Day Shipping", label: "Orders before 2 PM ET" },
              { stat: "48-Hour Guarantee", label: "Damaged shipment resolution" },
              { stat: "Visa · MC · Amex", label: "Stripe PCI-DSS Level 1" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-xs sm:text-sm font-semibold mb-1 leading-tight"
                  style={{ color: "#010101" }}
                >
                  {stat}
                </p>
                <p className="text-xs" style={{ color: "#7F7F7D" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 md:px-12 pb-6">
        <div className="max-w-4xl mx-auto relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7F7F7D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions — purity, shipping, COA, returns…"
            aria-label="Search frequently asked questions"
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "#010101",
            }}
          />
        </div>
      </div>

      {/* Category filter pills */}
      <div className="px-6 md:px-12 pb-10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-4 py-1.5 text-xs uppercase rounded-full transition-all"
            style={{
              letterSpacing: "0.08em",
              backgroundColor: activeCategory === null ? "#010101" : "transparent",
              color: activeCategory === null ? "#fff" : "#555",
              border: "1px solid",
              borderColor: activeCategory === null ? "#010101" : "rgba(0,0,0,0.15)",
            }}
          >
            All Topics
          </button>
          {faqs.map((section) => (
            <button
              key={section.category}
              onClick={() =>
                setActiveCategory(
                  activeCategory === section.category ? null : section.category
                )
              }
              className="px-4 py-1.5 text-xs rounded-full transition-all"
              style={{
                letterSpacing: "0.04em",
                backgroundColor:
                  activeCategory === section.category ? "#010101" : "transparent",
                color: activeCategory === section.category ? "#fff" : "#555",
                border: "1px solid",
                borderColor:
                  activeCategory === section.category
                    ? "#010101"
                    : "rgba(0,0,0,0.15)",
              }}
            >
              {section.category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ sections */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto space-y-14">
          {!hasResults && (
            <div
              className="rounded-xl p-10 text-center"
              style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
                No questions match “{query.trim()}”. Try a different term, or email us at{" "}
                <a href="mailto:research@nexphoria.com" className="underline" style={{ color: "#010101" }}>
                  research@nexphoria.com
                </a>
                .
              </p>
            </div>
          )}
          {visibleFaqs.map((section) => (
            <div key={section.category}>
              <h2
                className="text-xs uppercase mb-6 pb-3 border-b"
                style={{
                  color: "#B8A44C",
                  letterSpacing: "0.2em",
                  fontWeight: 600,
                  borderColor: "rgba(0,0,0,0.1)",
                }}
              >
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learn more cross-links */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs uppercase mb-6"
            style={{ color: "#B8A44C", letterSpacing: "0.2em", fontWeight: 600 }}
          >
            Learn More
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/science",
                title: "How we verify every lot",
                body: "Independent HPLC and ESI-MS testing, analyst sign-off, and lot-traceable COAs — the methodology behind our purity claims.",
              },
              {
                href: "/manufacturing",
                title: "From synthesis to cold-chain",
                body: "How research compounds move from synthesis through verification to temperature-controlled delivery at your bench.",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-xl p-6 transition-colors"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h3 className="text-base font-medium mb-2" style={{ color: "#010101" }}>
                  {card.title}
                </h3>
                <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
                  {card.body}
                </p>
                <span className="text-xs uppercase mt-4 inline-block" style={{ color: "#B8A44C", letterSpacing: "0.1em" }}>
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-xl p-10 text-center"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <p
              className="text-xs uppercase mb-4"
              style={{ color: "#B8A44C", letterSpacing: "0.2em" }}
            >
              Still Have Questions?
            </p>
            <h3
              className="text-2xl mb-3 font-medium"
              style={{ color: "#010101" }}
            >
              Our research team responds within 4 hours.
            </h3>
            <p
              className="text-sm mb-8 max-w-lg mx-auto"
              style={{ color: "#7F7F7D", lineHeight: 1.7 }}
            >
              Questions about specific compounds, COA requests, wholesale pricing, shipping timelines,
              or custom synthesis — email us directly at{" "}
              <a
                href="mailto:research@nexphoria.com"
                className="underline"
                style={{ color: "#010101" }}
              >
                research@nexphoria.com
              </a>
              .
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
