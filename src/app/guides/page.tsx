import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Research Guides | Nexphoria — In-Depth Peptide Research References",
  description:
    "Comprehensive research guides for peptide scientists: storage temperatures, reconstitution protocols, dosing design, COA verification, sourcing evaluation, safety practices, and a complete peptide glossary.",
  openGraph: {
    title: "Peptide Research Guides — Nexphoria",
    description:
      "7 in-depth guides covering everything peptide researchers need: storage, reconstitution, dosing protocols, COA verification, sourcing evaluation, safety & handling, and a 50+ term glossary.",
    url: "https://nexphoria.com/guides",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptide Research Guides — Nexphoria",
    description:
      "7 comprehensive guides for peptide researchers: storage, reconstitution, dosing, COA verification, sourcing, safety, and glossary. Research use only.",
  },
};

const GUIDES = [
  {
    href: "/guides/storage",
    label: "Peptide Storage Guide",
    desc: "Temperature requirements by compound, freeze-thaw cycle limits, lyophilized vs reconstituted shelf life, light sensitivity, container selection. Pull-from-products data for all 34 catalog compounds.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    badge: "Reference",
    badgeColor: "bg-blue-900/40 text-blue-300 border border-blue-800/50",
    tags: ["Storage", "Cold Chain", "Stability"],
  },
  {
    href: "/guides/reconstitution",
    label: "Reconstitution Guide",
    desc: "Choosing solvents (BAC water, sterile water, acetic acid, DMSO), wall injection technique, swirl vs vortex, concentration calculations with worked examples, multi-use vial strategy, and labeling protocol.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    badge: "How-To",
    badgeColor: "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50",
    tags: ["BAC Water", "Concentration", "Technique"],
  },
  {
    href: "/guides/dosing-protocols",
    label: "Dosing Protocols Guide",
    desc: "Loading vs maintenance phases, morning vs evening GH axis timing, injection site rotation schema, 3-month vs 6-month cycle philosophy, washout period calculation, stacking principles, and record-keeping SOPs.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V10.5zm-3.75 0h.008v.008H8.25V10.5zm7.5 0h.008v.008h-.008V10.5zm-3.75 3.75h.008v.008H12v-.008zm-3.75 0h.008v.008H8.25v-.008zm7.5 0h.008v.008h-.008v-.008zm-3.75 3.75h.008v.008H12v-.008zm-3.75 0h.008v.008H8.25v-.008zm7.5 0h.008v.008h-.008v-.008z" />
      </svg>
    ),
    badge: "Protocol",
    badgeColor: "bg-amber-900/40 text-amber-300 border border-amber-800/50",
    tags: ["Dosing", "Cycles", "Timing"],
  },
  {
    href: "/guides/coa-verification",
    label: "COA Verification Guide",
    desc: "6-step guide to authenticating certificates of analysis: ISO 17025 lab accreditation check, lot number matching, HPLC chromatogram verification, MS identity confirmation, LAL endotoxin interpretation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    badge: "Quality",
    badgeColor: "bg-purple-900/40 text-purple-300 border border-purple-800/50",
    tags: ["COA", "HPLC", "ISO 17025"],
  },
  {
    href: "/guides/peptide-sourcing",
    label: "Peptide Sourcing Guide",
    desc: "How to evaluate research peptide suppliers: ISO 17025 accreditation explained, why HPLC + MS + LAL endotoxin are all required, quality tiers comparison, COA chain-of-custody, and red flags to avoid.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    badge: "Sourcing",
    badgeColor: "bg-rose-900/40 text-rose-300 border border-rose-800/50",
    tags: ["Supplier Quality", "Red Flags", "Purity Tiers"],
  },
  {
    href: "/guides/safety-handling",
    label: "Safety & Handling Guide",
    desc: "PPE selection for peptide research, aseptic technique, sharps and needlestick protocol, spill response, contamination control, waste disposal, and incident documentation for BSL-1 research practices.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    badge: "Safety",
    badgeColor: "bg-orange-900/40 text-orange-300 border border-orange-800/50",
    tags: ["PPE", "Sharps", "BSL-1"],
  },
  {
    href: "/guides/peptide-glossary",
    label: "Peptide Glossary",
    desc: "50+ research terms across 9 categories: chemistry, pharmacology, quality control, reconstitution, biology, methods, storage, pharmacokinetics, and logistics. Alphabetically indexed with cross-links.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    badge: "Reference",
    badgeColor: "bg-blue-900/40 text-blue-300 border border-blue-800/50",
    tags: ["Glossary", "Terminology", "Definitions"],
  },
];

const QUICK_LINKS = [
  { label: "COA Library", href: "/coa", desc: "Search certificates of analysis by lot" },
  { label: "Compound Index", href: "/compounds", desc: "All 34 research compounds" },
  { label: "Interactive Tools", href: "/tools", desc: "19+ calculators and planners" },
  { label: "Protocol Finder", href: "/quiz", desc: "Match compounds to your research" },
];

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Research Guides" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">In-Depth Reference</p>
          <h1 className="text-page-hero font-bold tracking-tight mb-6">
            Research Guides
          </h1>
          <p className="body-lg text-zinc-400 mb-8 max-w-2xl">
            Comprehensive written references for peptide researchers. From evaluating supplier quality to designing
            multi-compound protocols, these guides cover the practical knowledge gaps that published papers don&apos;t address.
          </p>
          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8A44C]" />
              <strong className="text-white">7</strong> guides
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8A44C]" />
              <strong className="text-white">9</strong> topic categories
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8A44C]" />
              Free &amp; unrestricted
            </span>
          </div>
        </div>
      </section>

      {/* Guide cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex flex-col bg-zinc-900 border border-white/8 rounded-2xl p-6 hover:border-[#B8A44C]/50 hover:bg-zinc-800/60 transition-all duration-200"
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#B8A44C]/10 flex items-center justify-center text-[#B8A44C]">
                  {guide.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${guide.badgeColor}`}>
                  {guide.badge}
                </span>
              </div>

              {/* Title + desc */}
              <h2 className="text-base font-semibold text-white mb-2 group-hover:text-[#B8A44C] transition-colors">
                {guide.label}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">
                {guide.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {guide.tags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 border border-white/6 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1 text-[#B8A44C] text-sm font-medium">
                <span>Read guide</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-4.25a.75.75 0 00-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 000-1.5H8.75V3.75z" clipRule="evenodd" />
                </svg>
                <svg className="w-4 h-4 -ml-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick links to related sections */}
      <section className="border-t border-white/8 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="eyebrow mb-3">More Resources</p>
          <h2 className="text-2xl font-bold tracking-tight mb-8">Continue Your Research</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col bg-zinc-900 border border-white/8 rounded-xl p-5 hover:border-[#B8A44C]/50 transition-all duration-200"
              >
                <p className="font-semibold text-white group-hover:text-[#B8A44C] transition-colors mb-1">
                  {link.label}
                </p>
                <p className="text-sm text-zinc-500">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RUO disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
          All guides are provided for <strong className="text-zinc-500">research use only (RUO)</strong>. Content is educational and intended for qualified researchers working in laboratory settings. None of the information constitutes medical advice, clinical guidance, or veterinary recommendation. Nexphoria does not supply compounds for human or veterinary use.
        </p>
      </div>
    </div>
  );
}
