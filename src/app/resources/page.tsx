import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Research Hub | Nexphoria — Tools, Guides, Articles & More",
  description:
    "Your central research hub: 16 interactive tools, 7 comprehensive guides, 39+ journal articles across 9 categories, compound index, COA library, and more. Everything a peptide researcher needs in one place.",
  openGraph: {
    title: "Research Hub — Nexphoria",
    description:
      "16 tools, 7 guides, 39 articles, compound index, COA library — everything for peptide research in one place.",
    url: "https://nexphoria.com/resources",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Hub — Nexphoria",
    description: "16 tools, 7 guides, 39 articles — your complete peptide research resource center.",
    images: ["/og-image.jpg"],
  },
};

/* ─── Data ─── */

const TOOLS = [
  {
    href: "/quiz",
    label: "Protocol Finder Quiz",
    desc: "5-question funnel → 3 personalized compound recommendations",
    badge: "Quiz",
    highlight: true,
  },
  { href: "/tools/reconstitution-calculator", label: "Reconstitution Calculator", desc: "BAC water volume, dose volume, doses per vial" },
  { href: "/tools/half-life-calculator", label: "Half-Life Calculator", desc: "Decay curve, clearance milestones, dosing interval" },
  { href: "/tools/dosing-frequency-planner", label: "Dosing Frequency Planner", desc: "Weekly injection schedule builder" },
  { href: "/tools/cost-per-dose-calculator", label: "Cost Per Dose Calculator", desc: "Per-dose, per-week, monthly cost breakdown" },
  { href: "/tools/stack-builder", label: "Stack Builder", desc: "Goal-based compound stacking with synergy data" },
  { href: "/tools/purity-checker", label: "Purity Checker", desc: "HPLC standards, red flags, COA reading guide" },
  { href: "/tools/unit-converter", label: "Unit Converter", desc: "mcg/mg/IU, syringe units, nmol/L ↔ ng/mL, dilution" },
  { href: "/tools/bac-water-guide", label: "BAC Water Guide", desc: "Benzyl alcohol mechanism, reconstitution steps, mistakes" },
  { href: "/tools/igf-1-calculator", label: "IGF-1 Response Calculator", desc: "Estimate IGF-1 elevation from GH secretagogue stacks" },
  { href: "/tools/half-life-calculator", label: "Peptide Interaction Checker", desc: "Synergies, conflicts, receptor overlap warnings" },
  { href: "/tools/peptide-interaction-checker", label: "Peptide Interaction Checker", desc: "Compatibility matrix for up to 5 compounds" },
  { href: "/tools/peptide-cycle-planner", label: "Peptide Cycle Planner", desc: "Calendar-based 3/6-month research cycle builder" },
  { href: "/tools/dosing-frequency-planner", label: "Dosing Frequency Planner", desc: "Weekly injection schedule grid builder" },
  { href: "/tools/body-weight-dose-calculator", label: "Body Weight Dose Calculator", desc: "mg/kg ↔ absolute dose with species presets" },
  { href: "/tools/peptide-safety-checker", label: "Peptide Safety Checker", desc: "Side effects, contraindications, and handling warnings per compound" },
  { href: "/tools/peptide-stability-checker", label: "Peptide Stability Checker", desc: "Shelf life by storage condition and compound" },
  { href: "/tools/protocol-template-generator", label: "Protocol Template Generator", desc: "Printable research protocol document builder" },
  { href: "/tools/research-log", label: "Research Log", desc: "LocalStorage research journal with CSV export" },
  { href: "/tools/vial-inventory-tracker", label: "Vial Inventory Tracker", desc: "Track vial counts, expiry dates, reconstituted status" },
  { href: "/tools/biomarker-reference", label: "Biomarker Reference", desc: "32 lab markers with compound interactions and ranges" },
  { href: "/tools/peptide-timer", label: "Peptide Injection Timer", desc: "Live countdown to next dose, multi-compound status tracking" },
  { href: "/tools/injection-site-diagram", label: "Injection Site Diagram", desc: "Interactive body diagram — needle length, angle, volume limits per zone" },
  { href: "/tools/peptide-research-planner", label: "Peptide Research Planner", desc: "All-in-one 4-step wizard to generate a complete printable research protocol" },
  { href: "/tools/peptide-dose-response-planner", label: "Dose-Response Study Planner", desc: "Log-spaced dose arms, power-calculated group sizes, compound requirements" },
  { href: "/tools/peptide-news-feed", label: "Research News Feed", desc: "Curated landmark PubMed papers — filter by compound, category, or impact level" },
  { href: "/tools/compound-half-life-reference", label: "Half-Life Reference Table", desc: "Fast-load static reference for 35+ compounds: half-life, Tmax, dosing frequency, route" },
  { href: "/tools/molarity-calculator", label: "Molarity Calculator", desc: "Convert molar ↔ mass concentration (nM/μM ↔ mg/mL) for any peptide — 30+ compound MW database, rodent dose → nmol converter" },
  { href: "/tools/peptide-label-generator", label: "Vial Label Generator", desc: "Generate printable 1\"×2.5\" cryo vial labels with compound, concentration, lot, reconstitution date, and auto-expiry" },
  { href: "/tools/peptide-roi-calculator", label: "Research ROI Calculator", desc: "Estimate total compound cost by study type, subject count, and compound stack — includes CRO cost comparison and grant budget breakdown" },
  { href: "/compare", label: "Compare Compounds", desc: "Side-by-side purity, MW, storage, and pricing for up to 3 compounds" },
];

// Deduplicated tools
const TOOLS_DEDUPED = Array.from(
  new Map(TOOLS.map((t) => [t.href, t])).values()
).filter((t) => t.href.startsWith("/tools") || t.href === "/quiz" || t.href === "/compare");

const GUIDES = [
  {
    href: "/guides/storage",
    label: "Peptide Storage Guide",
    desc: "Temperature requirements, freeze-thaw limits, per-compound reference table",
  },
  {
    href: "/guides/reconstitution",
    label: "Reconstitution Guide",
    desc: "Solvent selection, mixing technique, concentration calculations",
  },
  {
    href: "/guides/dosing-protocols",
    label: "Dosing Protocols Guide",
    desc: "Loading phases, timing, washout periods, stack principles",
  },
  {
    href: "/guides/peptide-glossary",
    label: "Peptide Glossary",
    desc: "50+ research terms alphabetically indexed with cross-links",
  },
  {
    href: "/guides/coa-verification",
    label: "COA Verification Guide",
    desc: "6-step guide to authenticating certificates of analysis",
  },
  {
    href: "/guides/peptide-sourcing",
    label: "Peptide Sourcing Guide",
    desc: "Evaluate suppliers: ISO 17025, HPLC + MS + LAL endotoxin, quality tiers, red flags",
  },
  {
    href: "/guides/safety-handling",
    label: "Safety & Handling Guide",
    desc: "PPE, aseptic technique, sharps handling, spill response, and waste disposal",
  },
];

const BLOG_CATEGORIES = [
  { slug: "compound-profiles", label: "Compound Profiles", count: 18 },
  { slug: "gh-axis", label: "GH Axis", count: 6 },
  { slug: "longevity", label: "Longevity", count: 4 },
  { slug: "nootropics", label: "Nootropics", count: 4 },
  { slug: "immunology", label: "Immunology", count: 3 },
  { slug: "research-fundamentals", label: "Research Fundamentals", count: 3 },
  { slug: "handling-storage", label: "Handling & Storage", count: 1 },
  { slug: "quality-testing", label: "Quality & Testing", count: 1 },
  { slug: "cosmetic", label: "Cosmetic", count: 1 },
];

const COA_PRODUCTS = [
  { slug: "bpc-157", label: "BPC-157" },
  { slug: "semaglutide", label: "Semaglutide" },
  { slug: "tirzepatide", label: "Tirzepatide" },
  { slug: "tb-500", label: "TB-500" },
  { slug: "ghk-cu", label: "GHK-Cu" },
  { slug: "nad-plus", label: "NAD+" },
];

/* ─── Section wrapper ─── */
function Section({ id, title, eyebrow, children }: { id: string; title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* ─── Page ─── */
export default function ResourcesPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero */}
      <section
        className="relative pt-32 pb-16 px-6 md:px-10 text-center overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #111 0%, #0a0a0a 100%)",
        }}
      >
        {/* background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="mb-6">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Research Hub" }]}
            />
          </div>
          <span className="eyebrow mb-4 block">Research Hub</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">
            Everything You Need to Research
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Interactive tools, written guides, journal articles, compound profiles, COA library — your
            complete research resource center, built for qualified scientists.
          </p>

          {/* Stat strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {[
              { num: "19+", label: "Interactive Tools" },
              { num: "7", label: "Written Guides" },
              { num: "39+", label: "Journal Articles" },
              { num: "32+", label: "Compound Profiles" },
              { num: "9", label: "Research Categories" },
              { num: "6", label: "Sample COAs" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: "#d4af37" }}>
                  {num}
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* Jump links */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { href: "#tools", label: "Tools" },
              { href: "#quick-links", label: "Quick Links" },
              { href: "#guides", label: "Guides" },
              { href: "#journal", label: "Journal" },
              { href: "#coa", label: "COA Library" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-1.5 text-sm rounded-full border transition-colors"
                style={{
                  borderColor: "rgba(212,175,55,0.3)",
                  color: "#d4af37",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 space-y-20">

        {/* ── Quick Links row ── */}
        <section id="quick-links" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="eyebrow">Start Here</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">Quick Links</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { href: "/quiz", label: "Protocol Quiz", icon: "❓" },
              { href: "/compounds", label: "Compound Index", icon: "🔬" },
              { href: "/blog", label: "Journal", icon: "📖" },
              { href: "/tools", label: "All Tools", icon: "🧰" },
              { href: "/products", label: "Shop", icon: "🛒" },
              { href: "/wholesale", label: "Wholesale", icon: "📦" },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all hover:border-[#d4af37]/50 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-white/80 text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Interactive Tools ── */}
        <Section id="tools" eyebrow="Research Tools" title="Interactive Tools">
          {/* Protocol Finder Quiz — featured */}
          <Link
            href="/quiz"
            className="block mb-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)",
              borderColor: "rgba(212,175,55,0.35)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: "rgba(212,175,55,0.15)" }}
              >
                🎯
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold">Protocol Finder Quiz</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{ backgroundColor: "#d4af37", color: "#000" }}
                  >
                    Start Here
                  </span>
                </div>
                <p className="text-white/50 text-sm">
                  Answer 5 questions about your research focus and get 3 personalized compound recommendations
                </p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/tools/reconstitution-calculator", label: "Reconstitution Calculator", desc: "BAC water volume, dose volume, doses per vial" },
              { href: "/tools/half-life-calculator", label: "Half-Life Calculator", desc: "Decay curve, clearance milestones, dosing interval" },
              { href: "/tools/dosing-frequency-planner", label: "Dosing Frequency Planner", desc: "Weekly injection schedule grid builder" },
              { href: "/tools/cost-per-dose-calculator", label: "Cost Per Dose Calculator", desc: "Per-dose, weekly and monthly cost breakdown" },
              { href: "/tools/stack-builder", label: "Stack Builder", desc: "Goal-based compound stacking with synergy data" },
              { href: "/tools/purity-checker", label: "Purity Checker", desc: "HPLC standards, COA red flags guide" },
              { href: "/tools/unit-converter", label: "Unit Converter", desc: "mcg/mg/IU, syringe units, nmol/L ↔ ng/mL" },
              { href: "/tools/igf-1-calculator", label: "IGF-1 Response Calculator", desc: "Estimate IGF-1 elevation from GH secretagogue stacks" },
              { href: "/tools/peptide-interaction-checker", label: "Peptide Interaction Checker", desc: "Compatibility matrix, receptor overlap warnings" },
              { href: "/tools/peptide-cycle-planner", label: "Peptide Cycle Planner", desc: "Calendar-based 3 or 6-month cycle builder" },
              { href: "/tools/body-weight-dose-calculator", label: "Body Weight Dose Calculator", desc: "mg/kg ↔ absolute dose with species presets" },
              { href: "/tools/peptide-safety-checker", label: "Peptide Safety Checker", desc: "Side effects, contraindications, handling warnings" },
              { href: "/tools/peptide-stability-checker", label: "Peptide Stability Checker", desc: "Shelf life by compound and storage condition" },
              { href: "/tools/protocol-template-generator", label: "Protocol Template Generator", desc: "Generate printable research protocol documents" },
              { href: "/tools/research-log", label: "Research Log", desc: "LocalStorage research journal with CSV export" },
              { href: "/tools/vial-inventory-tracker", label: "Vial Inventory Tracker", desc: "Track vials, expiry, reconstituted status" },
              { href: "/tools/biomarker-reference", label: "Biomarker Reference", desc: "32 lab markers with compound interactions" },
              { href: "/tools/bac-water-guide", label: "BAC Water Guide", desc: "Benzyl alcohol mechanism, reconstitution steps" },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-3 p-4 rounded-xl border transition-all hover:border-white/20 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(164,176,138,0.12)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium group-hover:text-white transition-colors">{label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link href="/tools" className="text-sm font-medium" style={{ color: "#d4af37" }}>
              View all tools →
            </Link>
          </div>
        </Section>

        {/* ── Written Guides ── */}
        <Section id="guides" eyebrow="Written Guides" title="In-Depth Research Guides">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GUIDES.map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group p-5 rounded-2xl border transition-all hover:border-white/20 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: "rgba(164,176,138,0.12)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-white transition-colors">{label}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: "#B8A44C" }}>
                  Read guide
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ── Research Journal ── */}
        <Section id="journal" eyebrow="Research Journal" title="39+ Scientific Articles">
          <p className="text-white/50 text-sm mb-6 max-w-2xl">
            In-depth compound profiles, mechanism reviews, protocol comparisons, and research fundamentals.
            Browse by category or{" "}
            <Link href="/blog" className="underline" style={{ color: "#d4af37" }}>
              view all articles
            </Link>
            .
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BLOG_CATEGORIES.map(({ slug, label, count }) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="group flex items-center justify-between p-4 rounded-xl border transition-all hover:border-white/20 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(212,175,55,0.1)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ backgroundColor: "rgba(164,176,138,0.15)", color: "#B8A44C" }}
                >
                  {count} articles
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link href="/blog" className="text-sm font-medium" style={{ color: "#d4af37" }}>
              View all 39+ articles →
            </Link>
          </div>
        </Section>

        {/* ── Compounds Index ── */}
        <section id="compounds" className="scroll-mt-24">
          <Link
            href="/compounds"
            className="block p-8 rounded-2xl border transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(164,176,138,0.08) 0%, rgba(164,176,138,0.02) 100%)",
              borderColor: "rgba(164,176,138,0.25)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow mb-2 block">Compound Index</span>
                <h2 className="text-2xl font-bold text-white mb-2">32+ Research Compounds</h2>
                <p className="text-white/55 text-sm max-w-xl">
                  Wikipedia-style index of every compound in our catalog. Mechanism summaries, category
                  groupings, MW/purity/storage data, and links to related blog articles and product pages.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Recovery", "Metabolic", "GH Axis", "Longevity", "Cognitive", "Immunology", "Cosmetic"].map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(164,176,138,0.12)", color: "#B8A44C" }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl flex-shrink-0 ml-6" style={{ backgroundColor: "rgba(164,176,138,0.1)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: "#B8A44C" }}>
              Browse Compound Index
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        </section>

        {/* ── COA Library ── */}
        <Section id="coa" eyebrow="Quality & Testing" title="Sample COA Library">
          <p className="text-white/50 text-sm mb-5 max-w-xl">
            Printable Certificate of Analysis mockups for our top compounds — includes HPLC purity data,
            mass spectrometry confirmation, and batch release sign-off.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {COA_PRODUCTS.map(({ slug, label }) => (
              <Link
                key={slug}
                href={`/coa/${slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all hover:border-[#d4af37]/30 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">{label}</span>
                <span className="text-[10px]" style={{ color: "#d4af37" }}>View COA →</span>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/coa"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "#d4af37" }}
            >
              Search the full COA library →
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-3">
            Additional COAs available on individual product pages. All batch data is for reference only.
          </p>
        </Section>

        {/* ── Additional Resources row ── */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="eyebrow">More Resources</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">Everything Else</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/protocols", label: "Research Protocols", desc: "3-month and 6-month cycle explanations and what to expect" },
              { href: "/shipping", label: "Cold-Chain Shipping", desc: "How we pack and ship compounds with dry ice" },
              { href: "/faq", label: "FAQ", desc: "18 Q&As covering ordering, storage, reconstitution, and more" },
              { href: "/reviews", label: "Researcher Reviews", desc: "Testimonials from research lab buyers with per-category ratings" },
              { href: "/wholesale", label: "Wholesale Inquiry", desc: "Bulk pricing and institutional research accounts" },
              { href: "/about", label: "About Nexphoria", desc: "Our quality standards, team, and science advisory board" },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 p-5 rounded-xl border transition-all hover:border-white/20 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white/90 font-semibold text-sm group-hover:text-white transition-colors mb-0.5">{label}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section
          className="rounded-2xl p-6 text-center"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-white/35 text-xs leading-relaxed max-w-3xl mx-auto">
            <strong className="text-white/50">Research Use Only.</strong> All resources on this page are
            provided for educational and scientific research purposes only. Nothing here constitutes medical
            advice, diagnosis, or treatment. All compounds referenced are for qualified researchers in
            laboratory settings. Not for human consumption.{" "}
            <Link href="/legal/disclaimer" className="underline hover:text-white/50">
              Full disclaimer
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
