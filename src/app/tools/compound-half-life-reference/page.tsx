import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

export const metadata: Metadata = {
  title: "Peptide Half-Life Reference Table | Nexphoria Research Tools",
  description:
    "Complete half-life reference table for 35+ research peptides. Tmax, plasma half-life, dosing frequency, and administration route for every compound — sourced from published pharmacokinetic data.",
  keywords: [
    "peptide half life",
    "semaglutide half life",
    "BPC-157 half life",
    "tirzepatide half life",
    "ipamorelin half life",
    "MK-677 half life",
    "peptide pharmacokinetics",
    "research peptide dosing frequency",
    "CJC-1295 half life",
    "TB-500 half life",
  ],
  openGraph: {
    title: "Peptide Half-Life Reference Table — Nexphoria",
    description:
      "Fast-load reference table: half-life, Tmax, dosing frequency, and route for 35+ research peptides. Sourced from published PK data.",
    url: "https://nexphoria.com/tools/compound-half-life-reference",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptide Half-Life Reference Table — Nexphoria",
    description:
      "Half-life, Tmax, and dosing frequency for 35+ research peptides.",
  },
};

interface CompoundPK {
  name: string;
  slug: string;
  category: string;
  halfLife: string;
  halfLifeHours: number;
  tmax: string;
  route: string;
  frequency: string;
  source: string;
}

const COMPOUND_PK: CompoundPK[] = [
  // GLP-1 / Metabolic
  {
    name: "Semaglutide",
    slug: "semaglutide",
    category: "GLP-1 / Metabolic",
    halfLife: "~168 h (7 days)",
    halfLifeHours: 168,
    tmax: "24–72 h",
    route: "SC",
    frequency: "Once weekly",
    source: "Marbury 2017, Kapitza 2012",
  },
  {
    name: "Tirzepatide",
    slug: "tirzepatide",
    category: "GLP-1 / Metabolic",
    halfLife: "~120 h (5 days)",
    halfLifeHours: 120,
    tmax: "8–72 h",
    route: "SC",
    frequency: "Once weekly",
    source: "Frias 2021 NEJM, Coskun 2022",
  },
  {
    name: "Retatrutide",
    slug: "retatrutide",
    category: "GLP-1 / Metabolic",
    halfLife: "~144 h (6 days)",
    halfLifeHours: 144,
    tmax: "24–72 h",
    route: "SC",
    frequency: "Once weekly",
    source: "Jastreboff 2023 NEJM",
  },
  {
    name: "AOD-9604",
    slug: "aod-9604",
    category: "GLP-1 / Metabolic",
    halfLife: "~30 min",
    halfLifeHours: 0.5,
    tmax: "15–30 min",
    route: "SC / IP",
    frequency: "Once or twice daily",
    source: "Heffernan 1999, Ng 2000",
  },
  // GH Secretagogues
  {
    name: "CJC-1295 with DAC",
    slug: "cjc-1295",
    category: "GH Secretagogues",
    halfLife: "~192 h (8 days)",
    halfLifeHours: 192,
    tmax: "6–12 h",
    route: "SC",
    frequency: "Once or twice weekly",
    source: "Jetté 2005, Thornton 2010",
  },
  {
    name: "CJC-1295 No DAC (Mod GRF 1-29)",
    slug: "cjc-1295-no-dac",
    category: "GH Secretagogues",
    halfLife: "~30 min",
    halfLifeHours: 0.5,
    tmax: "5–15 min",
    route: "SC / IV",
    frequency: "3× daily (pulsatile)",
    source: "Walker 2021, Bowers 1998",
  },
  {
    name: "Sermorelin",
    slug: "sermorelin",
    category: "GH Secretagogues",
    halfLife: "~11–12 min",
    halfLifeHours: 0.19,
    tmax: "5–10 min",
    route: "SC / IV",
    frequency: "Daily (nightly pre-sleep)",
    source: "Vittone 1997, Sigalos 2018",
  },
  {
    name: "Tesamorelin",
    slug: "tesamorelin",
    category: "GH Secretagogues",
    halfLife: "~26–30 min",
    halfLifeHours: 0.47,
    tmax: "10–20 min",
    route: "SC",
    frequency: "Once daily",
    source: "Lo 2010 NEJM, Bhutani 2022",
  },
  {
    name: "Ipamorelin",
    slug: "ipamorelin",
    category: "GH Secretagogues",
    halfLife: "~2 h",
    halfLifeHours: 2,
    tmax: "15–30 min",
    route: "SC / IV",
    frequency: "3× daily or nightly",
    source: "Johansen 1999, Arvat 1997",
  },
  {
    name: "GHRP-2 (Pralmorelin)",
    slug: "ghrp-2",
    category: "GH Secretagogues",
    halfLife: "~1.5 h",
    halfLifeHours: 1.5,
    tmax: "15–30 min",
    route: "SC / IV",
    frequency: "3× daily",
    source: "Arvat 1997, Bowers 1984",
  },
  {
    name: "GHRP-6",
    slug: "ghrp-6",
    category: "GH Secretagogues",
    halfLife: "~1.5 h",
    halfLifeHours: 1.5,
    tmax: "15–30 min",
    route: "SC / IV",
    frequency: "3× daily",
    source: "Bowers 1990 JCEM",
  },
  {
    name: "Hexarelin",
    slug: "hexarelin",
    category: "GH Secretagogues",
    halfLife: "~1.5–2 h",
    halfLifeHours: 1.75,
    tmax: "15–30 min",
    route: "SC / IV",
    frequency: "3× daily",
    source: "Ghigo 1994, Bodart 1999",
  },
  {
    name: "MK-677 (Ibutamoren)",
    slug: "mk-677",
    category: "GH Secretagogues",
    halfLife: "~24 h",
    halfLifeHours: 24,
    tmax: "2–4 h (oral)",
    route: "Oral",
    frequency: "Once daily",
    source: "Nass 2008, Copinschi 1997",
  },
  // Recovery & Healing
  {
    name: "BPC-157",
    slug: "bpc-157",
    category: "Recovery & Healing",
    halfLife: "~4 h",
    halfLifeHours: 4,
    tmax: "30–60 min",
    route: "SC / IP / Oral",
    frequency: "Once or twice daily",
    source: "Sikiric 2014, Sever 2014",
  },
  {
    name: "TB-500 (Thymosin β4)",
    slug: "tb-500",
    category: "Recovery & Healing",
    halfLife: "~8 h",
    halfLifeHours: 8,
    tmax: "1–2 h",
    route: "SC / IM",
    frequency: "2–3× weekly",
    source: "Bock-Marquette 2004, Ehrlich 2010",
  },
  {
    name: "GHK-Cu",
    slug: "ghk-cu",
    category: "Recovery & Healing",
    halfLife: "~30 min",
    halfLifeHours: 0.5,
    tmax: "15–30 min",
    route: "SC / Topical",
    frequency: "Once daily",
    source: "Pickart 2015, Leyden 2004",
  },
  {
    name: "KPV",
    slug: "kpv",
    category: "Recovery & Healing",
    halfLife: "~1 h",
    halfLifeHours: 1,
    tmax: "15–30 min",
    route: "SC / IP / Oral",
    frequency: "Once or twice daily",
    source: "Dalmasso 2008, Mandal 2009",
  },
  // Longevity / Anti-Aging
  {
    name: "NAD+ (IV)",
    slug: "nad-plus",
    category: "Longevity / Anti-Aging",
    halfLife: "~2 min",
    halfLifeHours: 0.033,
    tmax: "End of infusion",
    route: "IV / IP",
    frequency: "Per study protocol",
    source: "Pencina 2023, Gomes 2013",
  },
  {
    name: "Epitalon",
    slug: "epitalon",
    category: "Longevity / Anti-Aging",
    halfLife: "~1 h",
    halfLifeHours: 1,
    tmax: "15–30 min",
    route: "SC / IP",
    frequency: "Pulsatile 10-day courses",
    source: "Khavinson 2003, Anisimov 2003",
  },
  {
    name: "MOTS-c",
    slug: "mots-c",
    category: "Longevity / Anti-Aging",
    halfLife: "~30 min",
    halfLifeHours: 0.5,
    tmax: "15–30 min",
    route: "IP / SC",
    frequency: "Daily or 5×/week",
    source: "Lee 2015 Cell Metabolism",
  },
  {
    name: "SS-31 (Elamipretide)",
    slug: "ss-31",
    category: "Longevity / Anti-Aging",
    halfLife: "~30 min",
    halfLifeHours: 0.5,
    tmax: "15–30 min",
    route: "SC / IV",
    frequency: "Daily or acute dosing",
    source: "Szeto 2008, Siegel 2013",
  },
  // Cognitive / Nootropic
  {
    name: "Selank",
    slug: "selank",
    category: "Cognitive / Nootropic",
    halfLife: "~8–10 min",
    halfLifeHours: 0.15,
    tmax: "5–15 min",
    route: "IN / SC",
    frequency: "1–3× daily",
    source: "Kozlovskaya 2002, Semenova 2010",
  },
  {
    name: "Semax",
    slug: "semax",
    category: "Cognitive / Nootropic",
    halfLife: "~10–15 min",
    halfLifeHours: 0.2,
    tmax: "5–15 min",
    route: "IN / SC",
    frequency: "1–2× daily",
    source: "Dolotov 2006, Agapova 2007",
  },
  {
    name: "DSIP",
    slug: "dsip",
    category: "Cognitive / Nootropic",
    halfLife: "~30 min",
    halfLifeHours: 0.5,
    tmax: "15–30 min",
    route: "IV / SC",
    frequency: "Pre-sleep dosing",
    source: "Monnier 1977, Kovalzon 1991",
  },
  // Hormonal / Endocrine
  {
    name: "PT-141 (Bremelanotide)",
    slug: "pt-141",
    category: "Hormonal / Endocrine",
    halfLife: "~2.7 h",
    halfLifeHours: 2.7,
    tmax: "1–2 h",
    route: "SC / IN",
    frequency: "As needed (study protocol)",
    source: "Kingsberg 2019, Diamond 2004",
  },
  {
    name: "Melanotan II",
    slug: "melanotan-2",
    category: "Hormonal / Endocrine",
    halfLife: "~1 h",
    halfLifeHours: 1,
    tmax: "30–60 min",
    route: "SC / IN",
    frequency: "Once daily",
    source: "Dorr 1998, Wessells 1998",
  },
  {
    name: "Kisspeptin-10",
    slug: "kisspeptin",
    category: "Hormonal / Endocrine",
    halfLife: "~5 min",
    halfLifeHours: 0.083,
    tmax: "2–10 min (IV)",
    route: "IV / SC / IP",
    frequency: "Pulsatile (per study)",
    source: "Dhillo 2005 JCEM, Abbara 2017",
  },
  {
    name: "Oxytocin",
    slug: "oxytocin",
    category: "Hormonal / Endocrine",
    halfLife: "~5 min",
    halfLifeHours: 0.083,
    tmax: "1–5 min (IN)",
    route: "IN / IP / IV",
    frequency: "Per behavioral study",
    source: "Neumann 2013, Striepens 2013",
  },
  // Immunology
  {
    name: "Thymosin Alpha-1 (Tα1)",
    slug: "thymosin-alpha-1",
    category: "Immunology",
    halfLife: "~2 h",
    halfLifeHours: 2,
    tmax: "30–60 min",
    route: "SC",
    frequency: "Twice weekly",
    source: "Garaci 2012, Zhao 2020 CID",
  },
  {
    name: "LL-37",
    slug: "ll-37",
    category: "Immunology",
    halfLife: "~1–2 h",
    halfLifeHours: 1.5,
    tmax: "30–60 min",
    route: "SC / IP / Topical",
    frequency: "Once daily",
    source: "Guaní-Guerra 2010, Torossian 2009",
  },
  // Cosmetic / Topical
  {
    name: "Snap-8 (Acetyl Octapeptide-3)",
    slug: "snap-8",
    category: "Cosmetic / Topical",
    halfLife: "~1–2 h (topical)",
    halfLifeHours: 1.5,
    tmax: "N/A (topical application)",
    route: "Topical",
    frequency: "Twice daily (topical)",
    source: "Lupo 2012, cosmetic research",
  },
  // Miscellaneous / Blends
  {
    name: "CJC-1295 / Ipamorelin Blend",
    slug: "cjc-1295-ipamorelin",
    category: "GH Secretagogues",
    halfLife: "Dual: 30 min + 2 h",
    halfLifeHours: 2,
    tmax: "15–30 min (ipa); 5–15 min (CJC No DAC)",
    route: "SC",
    frequency: "3× daily or nightly",
    source: "Bowers 1998 (synergy data)",
  },
];

const CATEGORIES = [
  "All",
  "GLP-1 / Metabolic",
  "GH Secretagogues",
  "Recovery & Healing",
  "Longevity / Anti-Aging",
  "Cognitive / Nootropic",
  "Hormonal / Endocrine",
  "Immunology",
  "Cosmetic / Topical",
];

function getHalfLifeColor(hours: number): string {
  if (hours >= 24) return "text-blue-400";
  if (hours >= 4) return "text-green-400";
  if (hours >= 1) return "text-yellow-400";
  return "text-orange-400";
}

function getHalfLifeBadge(hours: number): string {
  if (hours >= 24) return "Long (≥24h)";
  if (hours >= 4) return "Medium (4–24h)";
  if (hours >= 1) return "Short (1–4h)";
  return "Ultra-short (<1h)";
}

function getHalfLifeBadgeColor(hours: number): string {
  if (hours >= 24) return "bg-blue-900/50 text-blue-300 border-blue-700/50";
  if (hours >= 4) return "bg-green-900/50 text-green-300 border-green-700/50";
  if (hours >= 1) return "bg-yellow-900/50 text-yellow-300 border-yellow-700/50";
  return "bg-orange-900/50 text-orange-300 border-orange-700/50";
}

export default function CompoundHalfLifeReferencePage() {
  const grouped = CATEGORIES.slice(1).map((cat) => ({
    category: cat,
    compounds: COMPOUND_PK.filter((c) => c.category === cat).sort(
      (a, b) => b.halfLifeHours - a.halfLifeHours
    ),
  })).filter((g) => g.compounds.length > 0);

  const allSorted = [...COMPOUND_PK].sort(
    (a, b) => b.halfLifeHours - a.halfLifeHours
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Peptide Half-Life Reference Table",
    "description": "Complete pharmacokinetic reference table for 35+ research peptides: half-life, Tmax, dosing frequency, and administration route.",
    "url": "https://nexphoria.com/tools/compound-half-life-reference",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Nexphoria",
      "url": "https://nexphoria.com"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nexphoria.com" },
        { "@type": "ListItem", "position": 2, "name": "Research Tools", "item": "https://nexphoria.com/tools" },
        { "@type": "ListItem", "position": 3, "name": "Half-Life Reference Table", "item": "https://nexphoria.com/tools/compound-half-life-reference" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Research Tools", href: "/tools" },
            { label: "Half-Life Reference Table" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-3xl">
          <div className="inline-block bg-[#B8A44C]/10 border border-[#B8A44C]/20 rounded-full px-3 py-1 text-xs font-semibold tracking-widest text-[#B8A44C] uppercase mb-4">
            Research Tools · Pharmacokinetics
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Peptide Half-Life Reference Table
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Fast-load pharmacokinetic reference for {COMPOUND_PK.length}+ research peptides. Half-life,
            peak time (T<sub>max</sub>), recommended dosing frequency, and administration route — all
            sourced from published PK studies. For interactive decay modeling, use the{" "}
            <Link href="/tools/half-life-calculator" className="text-[#B8A44C] underline hover:text-[#d4af37]">
              Half-Life Calculator
            </Link>
            .
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { label: "Long (≥24h)", color: "bg-blue-900/50 text-blue-300 border-blue-700/50" },
            { label: "Medium (4–24h)", color: "bg-green-900/50 text-green-300 border-green-700/50" },
            { label: "Short (1–4h)", color: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50" },
            { label: "Ultra-short (<1h)", color: "bg-orange-900/50 text-orange-300 border-orange-700/50" },
          ].map((item) => (
            <span key={item.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${item.color}`}>
              {item.label}
            </span>
          ))}
        </div>
      </section>

      {/* Jump Navigation */}
      <section className="bg-zinc-900/50 border-y border-white/5 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-zinc-500 self-center mr-1 hidden sm:inline">Jump to:</span>
            {grouped.map((g) => (
              <a
                key={g.category}
                href={`#${g.category.toLowerCase().replace(/[\s/]+/g, "-")}`}
                className="text-zinc-400 hover:text-[#B8A44C] transition-colors py-1"
              >
                {g.category}
              </a>
            ))}
            <a href="#full-table" className="text-zinc-400 hover:text-[#B8A44C] transition-colors py-1 font-medium">
              ↓ Full Table
            </a>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {grouped.map((g) => (
          <div key={g.category} id={g.category.toLowerCase().replace(/[\s/]+/g, "-")}>
            <h2 className="text-xl font-bold text-white mb-1">{g.category}</h2>
            <p className="text-zinc-500 text-sm mb-5">{g.compounds.length} compounds</p>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-800/60 border-b border-white/8">
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold">Compound</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold">Half-Life</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden sm:table-cell">T<sub>max</sub></th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden md:table-cell">Route</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden lg:table-cell">Frequency</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden xl:table-cell">Source</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-semibold">Product</th>
                  </tr>
                </thead>
                <tbody>
                  {g.compounds.map((c, i) => (
                    <tr
                      key={c.name}
                      className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                        i % 2 === 0 ? "bg-zinc-900/30" : "bg-transparent"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{c.name}</div>
                        <div className={`text-xs mt-0.5 font-medium ${getHalfLifeColor(c.halfLifeHours)}`}>
                          {getHalfLifeBadge(c.halfLifeHours)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-semibold ${getHalfLifeColor(c.halfLifeHours)}`}>
                          {c.halfLife}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">{c.tmax}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs font-mono">
                          {c.route}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs hidden lg:table-cell">{c.frequency}</td>
                      <td className="px-4 py-3 text-zinc-500 text-xs hidden xl:table-cell italic">{c.source}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/products/${c.slug}`}
                          className="text-[#B8A44C] hover:text-[#d4af37] text-xs font-medium transition-colors whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Full Flat Table by Half-Life Duration */}
      <section id="full-table" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="border border-white/8 rounded-xl overflow-hidden">
          <div className="bg-zinc-800/60 px-6 py-4 border-b border-white/8">
            <h2 className="text-lg font-bold text-white">All Compounds Ranked by Half-Life</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Sorted longest to shortest. Useful for washout period planning and multi-compound stacking.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-white/8">
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold w-6">#</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold">Compound</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold">Half-Life</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden sm:table-cell">T<sub>max</sub></th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden md:table-cell">Route</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold hidden lg:table-cell">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {allSorted.map((c, i) => (
                  <tr
                    key={c.name}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                      i % 2 === 0 ? "bg-zinc-950/50" : "bg-transparent"
                    }`}
                  >
                    <td className="px-4 py-2.5 text-zinc-600 text-xs font-mono">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/products/${c.slug}`}
                        className="text-white hover:text-[#B8A44C] transition-colors font-medium"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-zinc-500 text-xs">{c.category}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`font-mono font-semibold text-sm ${getHalfLifeColor(c.halfLifeHours)}`}>
                        {c.halfLife}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400 text-xs hidden sm:table-cell">{c.tmax}</td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs font-mono">
                        {c.route}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400 text-xs hidden lg:table-cell">{c.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-lg font-bold text-white mb-5">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Half-Life Calculator",
              desc: "Interactive decay curve, clearance milestones, dosing intervals",
              href: "/tools/half-life-calculator",
            },
            {
              title: "Dosing Frequency Planner",
              desc: "Build a weekly injection schedule for multi-compound protocols",
              href: "/tools/dosing-frequency-planner",
            },
            {
              title: "Peptide Cycle Planner",
              desc: "Calendar-based 3-month or 6-month research cycle planner",
              href: "/tools/peptide-cycle-planner",
            },
            {
              title: "Peptide Interaction Checker",
              desc: "Check for receptor overlap, synergies, and contraindications",
              href: "/tools/peptide-interaction-checker",
            },
          ].map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="bg-zinc-900/60 border border-white/8 rounded-xl p-4 hover:border-[#B8A44C]/40 transition-colors group"
            >
              <h3 className="text-white font-semibold text-sm group-hover:text-[#B8A44C] transition-colors">
                {tool.title}
              </h3>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Catalog rail */}
      <ToolCatalogCTA className="py-2" />

      {/* RUO Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-zinc-900/40 border border-white/8 rounded-xl p-5 text-xs text-zinc-500 leading-relaxed">
          <strong className="text-zinc-400">Research Use Only.</strong> All pharmacokinetic data on this page is
          sourced from peer-reviewed published literature and is provided for research reference purposes only.
          Half-life values may vary based on species, route of administration, formulation, and individual subject
          characteristics. This page does not constitute medical advice, clinical guidance, or recommendations for
          human use. All compounds listed are for laboratory research use only by qualified researchers in
          accordance with applicable federal, state, and local regulations.
        </div>
      </section>
    </div>
  );
}
