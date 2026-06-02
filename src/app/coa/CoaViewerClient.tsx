"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  ShieldCheck,
  FlaskConical,
  Snowflake,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export interface CoaEntry {
  slug: string;
  name: string;
  casNumber: string;
  purity: string;
  category: string;
  labPartner: string;
  lotPattern: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const READING_GUIDE = [
  {
    term: "Purity (HPLC area %)",
    body: "Reverse-phase HPLC separates the target compound from related substances. The main-peak area percentage is the reported purity — Nexphoria lots are released at ≥98%.",
  },
  {
    term: "Identity (ESI-MS)",
    body: "Electrospray ionization mass spectrometry confirms the molecular weight matches the target sequence. A passing result shows the expected [M+H]⁺ ion.",
  },
  {
    term: "Lot number",
    body: "Each production batch carries a unique lot ID that ties the vial in hand to the specific document. The lot on the COA must match the lot on the label.",
  },
  {
    term: "Testing laboratory",
    body: "An independent, accredited laboratory performs the analysis — not the manufacturer. The lab name and report date appear on every certificate.",
  },
];

export default function CoaViewerClient({ entries }: { entries: CoaEntry[] }) {
  const [query, setQuery] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.slug.toLowerCase().includes(q) ||
        e.casNumber.toLowerCase().includes(q) ||
        e.lotPattern.toLowerCase().includes(q) ||
        e.labPartner.toLowerCase().includes(q),
    );
  }, [entries, query]);

  return (
    <div style={{ backgroundColor: "#F5F5F0" }}>
      {/* Hero */}
      <section
        className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20"
        style={{ backgroundColor: "#0F0F0E" }}
      >
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[{ label: "Home", href: "/" }, { label: "Certificate of Analysis" }]}
          />
          <p className="eyebrow mb-5" style={{ color: "#B8A44C" }}>
            Independent Verification
          </p>
          <h1
            className="mb-6"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 500,
              color: "#FDFCF8",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            The Certificate of Analysis library.
          </h1>
          <p
            className="text-lg max-w-2xl"
            style={{ color: "rgba(253,252,248,0.72)", lineHeight: 1.6 }}
          >
            Every Nexphoria lot ships with a lot-specific COA from an independent
            analytical laboratory — RP-HPLC purity, ESI-MS identity confirmation,
            and supporting quality tests. Search a compound to preview its sample
            certificate.
          </p>

          {/* Search */}
          <div className="mt-9 max-w-xl">
            <label htmlFor="coa-search" className="sr-only">
              Search certificates by compound, CAS, lot, or laboratory
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(253,252,248,0.5)" }}
                strokeWidth={1.75}
              />
              <input
                id="coa-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by compound, CAS number, or lot…"
                className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm"
                style={{
                  backgroundColor: "#1C1C1A",
                  border: "1px solid #2A2A28",
                  color: "#FDFCF8",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="px-6 py-5"
        style={{ backgroundColor: "#1A1A18", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-x-8 gap-y-3">
          {[
            { icon: FlaskConical, label: "Independent HPLC / ESI-MS verification" },
            { icon: ShieldCheck, label: "Lot-specific COA on every shipment" },
            { icon: Snowflake, label: "Cold-chain packed every shipment" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <s.icon className="w-4 h-4" style={{ color: "#B8A44C" }} strokeWidth={1.5} />
              <span className="text-xs" style={{ color: "rgba(253,252,248,0.7)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* COA grid */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <p className="eyebrow" style={{ color: "#7A6B2A" }}>
              {filtered.length} {filtered.length === 1 ? "Certificate" : "Certificates"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{ border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
            >
              <FileText
                className="w-8 h-8 mx-auto mb-4"
                style={{ color: "#B8A44C" }}
                strokeWidth={1.25}
              />
              <h3
                className="text-lg mb-2"
                style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}
              >
                No certificate matches “{query}”.
              </h3>
              <p className="text-sm mb-6" style={{ color: "#666" }}>
                Sample COAs are published for a selection of compounds. A
                lot-specific COA accompanies every order regardless of catalog
                listing.
              </p>
              <Link href="/products" className="btn-primary">
                Browse the Catalog
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {filtered.map((e, i) => (
                <motion.div
                  key={e.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl overflow-hidden group"
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-widest mb-1.5"
                          style={{ color: "#7A6B2A" }}
                        >
                          {e.category}
                        </p>
                        <h3
                          className="text-xl"
                          style={{
                            fontFamily: "Georgia, serif",
                            color: "#1A1A1A",
                            lineHeight: 1.2,
                          }}
                        >
                          {e.name}
                        </h3>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "rgba(184,164,76,0.12)" }}
                      >
                        <ShieldCheck
                          className="w-3.5 h-3.5"
                          style={{ color: "#7A6B2A" }}
                          strokeWidth={2}
                        />
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: "#7A6B2A" }}
                        >
                          {e.purity}
                        </span>
                      </div>
                    </div>

                    <dl className="space-y-2.5 mb-6">
                      {[
                        { k: "CAS", v: e.casNumber, mono: true },
                        { k: "Lot pattern", v: e.lotPattern, mono: true },
                        { k: "Identity", v: "RP-HPLC + ESI-MS" },
                        { k: "Verified by", v: e.labPartner },
                      ].map((row) => (
                        <div key={row.k} className="flex items-baseline justify-between gap-4">
                          <dt
                            className="text-[11px] uppercase tracking-wider flex-shrink-0"
                            style={{ color: "#999" }}
                          >
                            {row.k}
                          </dt>
                          <dd
                            className={`text-xs text-right ${row.mono ? "font-mono" : ""}`}
                            style={{ color: "#333" }}
                          >
                            {row.v}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <Link
                      href={`/coa/${e.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium transition-opacity group-hover:opacity-70"
                      style={{ color: "#7A6B2A" }}
                    >
                      <FileText className="w-4 h-4" strokeWidth={1.75} />
                      View sample COA
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to read a COA */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "#EAE7E3" }}>
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-4" style={{ color: "#7A6B2A" }}>
            Reading the Document
          </p>
          <h2
            className="text-2xl md:text-3xl mb-8"
            style={{ fontFamily: "Georgia, serif", color: "#1A1A1A", letterSpacing: "-0.01em" }}
          >
            How to read a Certificate of Analysis
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {READING_GUIDE.map((g) => (
              <div
                key={g.term}
                className="rounded-2xl p-6"
                style={{ border: "1px solid rgba(0,0,0,0.07)", backgroundColor: "#F9F9F9" }}
              >
                <h3
                  className="text-base mb-2"
                  style={{ fontFamily: "Georgia, serif", color: "#1A1A1A", fontWeight: 600 }}
                >
                  {g.term}
                </h3>
                <p className="text-sm" style={{ color: "#555", lineHeight: 1.65 }}>
                  {g.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/guides/how-to-read-coa"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "#7A6B2A" }}
            >
              Read the full COA guide
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Methodology note (collapsible) */}
      <section className="px-6 py-12" style={{ backgroundColor: "#F5F5F0" }}>
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => setGuideOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left"
            style={{ border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
            aria-expanded={guideOpen}
          >
            <span
              className="text-base"
              style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}
            >
              About these sample certificates
            </span>
            <ChevronDown
              className="w-5 h-5 flex-shrink-0 transition-transform"
              style={{
                color: "#7A6B2A",
                transform: guideOpen ? "rotate(180deg)" : "none",
              }}
            />
          </button>
          {guideOpen && (
            <div
              className="rounded-b-2xl px-6 py-6 -mt-2"
              style={{ border: "1px solid rgba(0,0,0,0.08)", borderTop: "none", backgroundColor: "#FFFFFF" }}
            >
              <p className="text-sm mb-3" style={{ color: "#555", lineHeight: 1.7 }}>
                The certificates linked above are representative samples that
                illustrate the structure and analytical scope of Nexphoria
                documentation. Lot identifiers shown on this index use placeholder
                patterns (for example, <span className="font-mono">Lot 2026-04-XXX</span>) and do not
                reference a specific issued lot.
              </p>
              <p className="text-sm" style={{ color: "#555", lineHeight: 1.7 }}>
                The actual COA for the lot you receive is issued with your shipment
                and reflects the specific batch tested, including the analyzing
                laboratory, report date, and authorized sign-off.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "#0F0F0E" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4" style={{ color: "#B8A44C" }}>
            Research Catalog
          </p>
          <h2
            className="text-2xl md:text-3xl mb-5"
            style={{ fontFamily: "Georgia, serif", color: "#FDFCF8", lineHeight: 1.3 }}
          >
            Documentation you can verify.
          </h2>
          <p
            className="text-sm mb-8 max-w-xl mx-auto"
            style={{ color: "rgba(253,252,248,0.6)", lineHeight: 1.7 }}
          >
            Every compound in the catalog ships with a lot-specific COA from an
            independent laboratory, cold-chain packed for transit.
          </p>
          <Link href="/products" className="btn-acid" style={{ borderColor: "#B8A44C", color: "#B8A44C" }}>
            Browse the Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
