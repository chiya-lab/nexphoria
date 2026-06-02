"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

/* ────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────── */
type PurityTier = "pharmaceutical" | "research" | "standard";

interface CompoundSpec {
  name: string;
  slug?: string;
  category: string;
  hplcMin: number; // minimum acceptable purity %
  hplcTypical: number; // typical reported purity %
  mw: number; // Da
  cas: string;
  ms: boolean; // mass spec confirmation typical?
  notes: string;
  tier: PurityTier;
}

const COMPOUNDS: CompoundSpec[] = [
  // GI / Tissue Repair
  { name: "BPC-157", slug: "bpc-157", category: "GI / Tissue Repair", hplcMin: 98, hplcTypical: 99.2, mw: 1419.5, cas: "137525-51-0", ms: true, notes: "Acetate salt. Look for ESI-MS confirming [M+H]+ at 1420.5 Da. Acetate content typically 10–15%; subtract when evaluating net purity.", tier: "research" },
  { name: "TB-500 (Thymosin Beta-4)", slug: "tb-500", category: "GI / Tissue Repair", hplcMin: 98, hplcTypical: 99.0, mw: 4963.5, cas: "77591-33-4", ms: true, notes: "Large peptide; baseline separation on C18 RP-HPLC can be challenging. ESI-MS multi-charge envelope should match calculated MW within 0.02%.", tier: "research" },
  { name: "GHK-Cu", slug: "ghk-cu", category: "GI / Tissue Repair", hplcMin: 98, hplcTypical: 99.5, mw: 340.4, cas: "89030-95-5", ms: true, notes: "Copper complex — verify the peptide is in chelated form (blue/green color in solution is expected). Free-peptide vs copper-chelated peak separation is important.", tier: "research" },
  { name: "AOD-9604", slug: "aod-9604", category: "GI / Tissue Repair", hplcMin: 98, hplcTypical: 99.1, mw: 2088.5, cas: "221231-10-3", ms: true, notes: "Contains one disulfide bridge. Reduced form (free thiols) should not appear as major peak. Alkylation test helps confirm disulfide integrity.", tier: "research" },
  { name: "KPV", slug: "kpv", category: "GI / Tissue Repair", hplcMin: 98, hplcTypical: 99.6, mw: 340.4, cas: "101727-87-1", ms: true, notes: "Tripeptide — very small. IEC or RP-HPLC both work. Confirm with ESI-MS. Batch-to-batch consistency is straightforward at this MW.", tier: "research" },
  // GH Axis
  { name: "Sermorelin", slug: "sermorelin", category: "GH Axis", hplcMin: 98, hplcTypical: 98.8, mw: 3357.9, cas: "86168-78-7", ms: true, notes: "First 29 aa of GHRH. Acetate salt common. Verify by MALDI or ESI. Check for Met oxidation (+16 Da) as a degradation marker.", tier: "research" },
  { name: "Tesamorelin", slug: "tesamorelin", category: "GH Axis", hplcMin: 98, hplcTypical: 99.0, mw: 5135.9, cas: "218949-48-5", ms: true, notes: "Full-length GHRH(1-44) with trans-3-hexenoic acid conjugate. Confirm conjugate via MS — fragment at loss of hexenoyl side-chain is a quality marker.", tier: "research" },
  { name: "CJC-1295 No DAC (Mod GRF 1-29)", slug: "cjc-1295-no-dac", category: "GH Axis", hplcMin: 98, hplcTypical: 99.2, mw: 3367.9, cas: "863288-34-0", ms: true, notes: "No Drug Affinity Complex. Confirm absence of maleimide-albumin adduct on MS. Shorter half-life than DAC variant; purity spec same.", tier: "research" },
  { name: "Ipamorelin", slug: "ipamorelin", category: "GH Axis", hplcMin: 98, hplcTypical: 99.4, mw: 711.9, cas: "170851-70-4", ms: true, notes: "Pentapeptide with D-2-Nal residue. Confirm chirality (D vs L 2-Nal) — some underpure batches may show L-isomer peak. High purity is straightforward given low MW.", tier: "research" },
  { name: "MK-677 (Ibutamoren)", slug: "mk-677", category: "GH Axis", hplcMin: 99, hplcTypical: 99.7, mw: 624.8, cas: "159752-10-0", ms: true, notes: "Small molecule (not a peptide). RP-HPLC on C18. Should show a clean single peak. No need for acetate correction. NMR purity confirmation is a premium indicator.", tier: "pharmaceutical" },
  { name: "Hexarelin", slug: "hexarelin", category: "GH Axis", hplcMin: 98, hplcTypical: 98.9, mw: 887.1, cas: "140703-51-1", ms: true, notes: "Hexapeptide with D-2-methyl-Trp. Verify the methylated tryptophan residue is present on MS fragmentation. Improperly synthesized batches may substitute regular Trp.", tier: "research" },
  // GLP-1 / Metabolic
  { name: "Semaglutide", slug: "semaglutide", category: "GLP-1 / Metabolic", hplcMin: 98, hplcTypical: 99.1, mw: 4113.6, cas: "910463-68-2", ms: true, notes: "Fatty acid chain (C18 diacid) adds complexity. LC-MS confirmation critical — unmodified base peptide peak should not appear. Water content by Karl Fischer typically 5–8%.", tier: "research" },
  { name: "Tirzepatide", slug: "tirzepatide", category: "GLP-1 / Metabolic", hplcMin: 98, hplcTypical: 98.7, mw: 4813.5, cas: "2023788-19-2", ms: true, notes: "39-aa dual GLP-1/GIP agonist with C20 fatty diacid. Complex synthesis; more acceptable impurity peaks than simpler peptides. ESI multi-charge envelope required for MW confirmation.", tier: "research" },
  { name: "Retatrutide", slug: "retatrutide", category: "GLP-1 / Metabolic", hplcMin: 98, hplcTypical: 98.5, mw: 5380.2, cas: "2381609-83-0", ms: true, notes: "Triple agonist (GIP/GLP-1/GCGR) with fatty acid modification. Most complex synthesis in catalog. HPLC baseline resolution may show small shoulders — verify these are instrument artifacts vs impurities.", tier: "research" },
  { name: "MOTS-c", slug: "mots-c", category: "GLP-1 / Metabolic", hplcMin: 98, hplcTypical: 99.0, mw: 2174.5, cas: "1627580-64-6", ms: true, notes: "Mitochondria-encoded 16-aa peptide. Confirm sequence by ESI-MS/MS fragmentation — verify all b/y ions. Acetate salt form standard.", tier: "research" },
  // Neuropeptides / Nootropics
  { name: "Semax", slug: "semax", category: "Nootropics", hplcMin: 98, hplcTypical: 99.3, mw: 708.9, cas: "80714-61-0", ms: true, notes: "ACTH(4-7)PGP heptapeptide. Small and clean — purity is straightforward. Confirm Pro-Gly-Pro C-terminal extension on MS fragmentation.", tier: "research" },
  { name: "Selank", slug: "selank", category: "Nootropics", hplcMin: 98, hplcTypical: 99.2, mw: 751.9, cas: "129954-34-3", ms: true, notes: "Tuftsin analog heptapeptide. Similar QC profile to Semax. Very stable lyophilized; look for clean single-peak HPLC.", tier: "research" },
  { name: "DSIP", slug: "dsip", category: "Nootropics", hplcMin: 98, hplcTypical: 98.5, mw: 848.9, cas: "62568-57-4", ms: false, notes: "9-aa nonapeptide. D-Ala residue imparts plasma stability. MS fragmentation should confirm D vs L Ala at position 5 via retention time differences vs all-L analog.", tier: "research" },
  { name: "PT-141 (Bremelanotide)", slug: "pt-141", category: "Nootropics", hplcMin: 98, hplcTypical: 99.0, mw: 1025.2, cas: "189691-06-3", ms: true, notes: "Cyclic melanocortin peptide. Disulfide bridge critical — reduced form impurity indicates poor synthesis. Confirm cyclic structure by ring-opening fragmentation pattern on MS.", tier: "research" },
  { name: "Kisspeptin-10", slug: "kisspeptin", category: "Nootropics", hplcMin: 98, hplcTypical: 98.8, mw: 1302.5, cas: "374683-28-0", ms: true, notes: "C-terminal amide modification must be confirmed. Acid form (+1 Da) is a common synthesis artifact — MS confirms amide vs free acid.", tier: "research" },
  { name: "Oxytocin", slug: "oxytocin", category: "Nootropics", hplcMin: 99, hplcTypical: 99.5, mw: 1007.2, cas: "50-56-6", ms: true, notes: "Cyclic nonapeptide, disulfide-bridged. BP reference standard available (USP/EP) — comparison is straightforward. Dimethyl byproduct impurity at 1021 Da is a known synthesis artifact to flag.", tier: "pharmaceutical" },
  // Longevity / Anti-Aging
  { name: "Epitalon", slug: "epitalon", category: "Longevity", hplcMin: 98, hplcTypical: 99.4, mw: 390.4, cas: "307297-39-8", ms: true, notes: "Tetrapeptide Ala-Glu-Asp-Gly. Very small; clean synthesis. Acetate salt. ESI-MS shows [M+H]+ at 391.3 Da.", tier: "research" },
  { name: "NAD+", slug: "nad-plus", category: "Longevity", hplcMin: 99, hplcTypical: 99.7, mw: 663.4, cas: "53-84-9", ms: false, notes: "Not a peptide — a coenzyme. Ion-pair RP-HPLC or anion-exchange HPLC. 260 nm UV detection. NADH contamination (reduced form) is a key impurity to check.", tier: "pharmaceutical" },
  { name: "SS-31 (Elamipretide)", slug: "ss-31", category: "Longevity", hplcMin: 98, hplcTypical: 99.1, mw: 639.8, cas: "736992-21-5", ms: true, notes: "D-Arg, dimethyl-Tyr (Dmt), Lys, Phe-NH₂. Confirm Dmt incorporation via MS — substitution with regular Tyr (MW 16 less) is detectable. C-terminal amide required.", tier: "research" },
  { name: "GHK-Cu (Copper Peptide)", slug: "ghk-cu", category: "Longevity", hplcMin: 98, hplcTypical: 99.5, mw: 340.4, cas: "89030-95-5", ms: true, notes: "Same as GI/Tissue Repair entry. See above.", tier: "research" },
  // Immunology
  { name: "Thymosin Alpha-1 (Tα1)", slug: "thymosin-alpha-1", category: "Immunology", hplcMin: 98, hplcTypical: 99.0, mw: 3108.4, cas: "62304-98-7", ms: true, notes: "28-aa peptide with N-terminal acetylation. Confirm acetylation on MS (loss of 42 Da from unacetylated form should NOT be seen). TFA salt common but acetate preferred.", tier: "research" },
  { name: "LL-37", slug: "ll-37", category: "Immunology", hplcMin: 98, hplcTypical: 98.5, mw: 4493.3, cas: "154947-66-7", ms: true, notes: "37-aa cationic peptide prone to aggregation. Monitor HPLC elution for broad peaks indicating self-association. ESI multi-charge required; confirm via MALDI for large-batch QC.", tier: "research" },
  // Cosmetic / Skin
  { name: "Snap-8 (Acetyl Octapeptide-3)", slug: "snap-8", category: "Cosmetic", hplcMin: 98, hplcTypical: 99.2, mw: 1075.2, cas: "868844-74-0", ms: true, notes: "Acetyl-EEMQRRAD amide. Confirm N-terminal acetylation and C-terminal amide by MS. Argireline (hexapeptide-3) should NOT be present as an impurity in correctly synthesized batches.", tier: "research" },
  { name: "Melanotan 2", slug: "melanotan-2", category: "Cosmetic", hplcMin: 98, hplcTypical: 99.0, mw: 1024.2, cas: "121062-08-6", ms: true, notes: "Cyclic analog of α-MSH. Disulfide bridge — same integrity test as PT-141. PT-141 is the reduced/modified version; cross-contamination is a known fraud marker.", tier: "research" },
];

type Category = "All" | string;

const RED_FLAGS = [
  {
    flag: "No HPLC chromatogram included",
    severity: "critical",
    explanation:
      "A purity number without a chromatogram is unverifiable. Any legitimate COA shows the HPLC trace — peak position, peak area %, baseline, and column/method details.",
  },
  {
    flag: "Purity stated as '>99%' with no decimal",
    severity: "warning",
    explanation:
      "Legitimate labs report actual measured values (e.g., 99.2% ± 0.3%). A generic '>99%' often means the purity was never actually measured with instrument data.",
  },
  {
    flag: "MW or molecular formula doesn't match compound",
    severity: "critical",
    explanation:
      "Cross-check every COA against the compound's known molecular weight. A wrong MW usually indicates the wrong compound, salt form confusion, or a fabricated document.",
  },
  {
    flag: "No mass spectrometry confirmation",
    severity: "warning",
    explanation:
      "HPLC measures purity by peak area but can't confirm identity. ESI-MS or MALDI confirms the molecular weight, verifying you have the right compound at that purity.",
  },
  {
    flag: "Lab name not verifiable (Google search returns nothing)",
    severity: "critical",
    explanation:
      "Any analytical lab issuing COAs should have a web presence, accreditation (ISO 17025 is standard), and contact information. Fictional lab names are a major fraud signal.",
  },
  {
    flag: "Batch number doesn't match product labeling",
    severity: "critical",
    explanation:
      "The lot number on the vial label must match the COA exactly. Mismatched batch numbers mean the COA was not generated for the product you received.",
  },
  {
    flag: "Endotoxin / LAL test missing for injectable-grade",
    severity: "warning",
    explanation:
      "Endotoxin limits matter for injectable research compounds. Legitimate suppliers include LAL (Limulus Amebocyte Lysate) or rFC test results. Absence is acceptable for topical-only compounds.",
  },
  {
    flag: "Date of analysis older than 24 months",
    severity: "warning",
    explanation:
      "COAs should reflect recent analysis — not a recycled document from a prior batch. Compounds degrade; a stale COA may not reflect current product quality.",
  },
  {
    flag: "HPLC method not specified (column, mobile phase, gradient)",
    severity: "warning",
    explanation:
      "A complete COA specifies: column type and dimensions, mobile phase (A and B), gradient program, detection wavelength, and flow rate. Without this, results are unreproducible and unverifiable.",
  },
  {
    flag: "Single retention time peak claimed as 99%+ but chromatogram shows multiple peaks",
    severity: "critical",
    explanation:
      "If the annotated purity says 99.2% but the chromatogram clearly shows multiple peaks, the annotation is deceptive. Count the peaks yourself.",
  },
];

const GOOD_SIGNS = [
  "ISO 17025 accredited laboratory with verifiable address",
  "HPLC chromatogram shows single sharp peak with tailing factor < 1.5",
  "ESI-MS confirms correct [M+H]+ within 0.02% of theoretical MW",
  "Karl Fischer water content reported (5–12% typical for acetate salt lyophilizates)",
  "LAL endotoxin result < 1 EU/mg (< 0.1 EU/mg for injectable-grade)",
  "Batch number printed on vial label matches COA exactly",
  "Analysis date within 12 months of purchase date",
  "Method details complete: column, mobile phase, gradient, flow rate, detection wavelength",
  "Appearance section matches (white/off-white lyophilized powder)",
  "Solubility test result included",
];

const CATEGORY_COLORS: Record<string, string> = {
  "GI / Tissue Repair": "#4ade80",
  "GH Axis": "#60a5fa",
  "GLP-1 / Metabolic": "#f59e0b",
  Nootropics: "#a78bfa",
  Longevity: "#34d399",
  Immunology: "#f87171",
  Cosmetic: "#f9a8d4",
};

export default function PurityChecker() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [selected, setSelected] = useState<CompoundSpec | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(COMPOUNDS.map((c) => c.category)));
    return ["All", ...cats];
  }, []);

  const filtered = useMemo(() => {
    return COMPOUNDS.filter((c) => {
      const matchCat = category === "All" || c.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.cas.includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const severityColor = (s: string) =>
    s === "critical" ? "#ef4444" : "#f59e0b";
  const severityLabel = (s: string) =>
    s === "critical" ? "CRITICAL" : "WARNING";

  return (
    <div style={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative px-6 pt-32 pb-12 md:pt-40 md:pb-16"
        style={{ backgroundColor: "#010101" }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Purity Checker" },
            ]}
          />
          <p
            className="text-xs uppercase tracking-widest mb-5"
            style={{ color: "#C9DD69" }}
          >
            Research Tools
          </p>
          <h1
            className="text-4xl md:text-5xl mb-4 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Purity Checker &amp; COA Guide
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mb-6"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Look up typical HPLC purity specifications for 28+ research
            compounds. Learn to read a Certificate of Analysis, know what a
            good COA looks like, and spot the red flags that signal fraudulent
            or low-quality product.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools/reconstitution-calculator"
              className="text-xs px-4 py-2 rounded-sm"
              style={{
                backgroundColor: "#1a1a18",
                color: "#C9DD69",
                border: "1px solid #2a2a28",
              }}
            >
              Reconstitution Calculator →
            </Link>
            <Link
              href="/tools/cost-per-dose-calculator"
              className="text-xs px-4 py-2 rounded-sm"
              style={{
                backgroundColor: "#1a1a18",
                color: "#C9DD69",
                border: "1px solid #2a2a28",
              }}
            >
              Cost Per Dose →
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">

        {/* ── Compound Lookup ── */}
        <section className="mb-16">
          <h2
            className="text-2xl mb-2 tracking-tight"
            style={{ fontWeight: 300, color: "#111" }}
          >
            Compound Purity Specifications
          </h2>
          <p className="text-sm mb-6" style={{ color: "#666" }}>
            Typical HPLC purity ranges from published research-grade specifications.
            Select a compound for full details.
          </p>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search compound name or CAS…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-sm"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #DCDAD4",
                  color: "#111",
                  outline: "none",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-sm"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #DCDAD4",
                color: "#111",
                outline: "none",
                minWidth: "160px",
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div
              className="rounded-sm p-10 text-center"
              style={{ border: "1px solid #ECEAE4" }}
            >
              <p className="text-sm" style={{ color: "#666666" }}>
                No compounds match your search.{" "}
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="underline"
                  style={{ color: "#B8A44C" }}
                >
                  Clear filters
                </button>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-sm" style={{ border: "1px solid #ECEAE4" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F5F3EE", borderBottom: "1px solid #ECEAE4" }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "#555" }}>Compound</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: "#555" }}>Category</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: "#555" }}>Min HPLC</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: "#555" }}>Typical</th>
                    <th className="text-center px-4 py-3 font-medium hidden md:table-cell" style={{ color: "#555" }}>MS</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.name + i}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderBottom: "1px solid #ECEAE4",
                        backgroundColor:
                          selected?.name === c.name ? "#F0F7E8" : "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          selected?.name === c.name ? "#F0F7E8" : "#FAFAF5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          selected?.name === c.name ? "#F0F7E8" : "transparent")
                      }
                      onClick={() =>
                        setSelected(selected?.name === c.name ? null : c)
                      }
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium" style={{ color: "#111" }}>
                          {c.name}
                        </span>
                        <span
                          className="ml-2 text-xs px-1.5 py-0.5 rounded hidden sm:inline"
                          style={{
                            backgroundColor: CATEGORY_COLORS[c.category] + "22",
                            color: CATEGORY_COLORS[c.category] || "#888",
                            border: `1px solid ${CATEGORY_COLORS[c.category]}44`,
                          }}
                        >
                          {c.tier === "pharmaceutical" ? "Pharm" : "Research"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden sm:table-cell" style={{ color: "#666" }}>
                        {c.category}
                      </td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: "#555" }}>
                        ≥{c.hplcMin}%
                      </td>
                      <td
                        className="px-4 py-3 text-right font-mono font-medium"
                        style={{
                          color: c.hplcTypical >= 99.5 ? "#16a34a" : c.hplcTypical >= 99 ? "#ca8a04" : "#555",
                        }}
                      >
                        {c.hplcTypical}%
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span style={{ color: c.ms ? "#16a34a" : "#aaa" }}>
                          {c.ms ? "✓" : "–"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="text-xs"
                          style={{ color: "#B8A44C" }}
                        >
                          {selected?.name === c.name ? "▲" : "▼"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Expanded detail panel */}
          {selected && (
            <div
              className="mt-4 rounded-sm p-6"
              style={{
                backgroundColor: "#010101",
                border: "1px solid #2a2a28",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-xl font-medium mb-1"
                    style={{ color: "#F9F9F9" }}
                  >
                    {selected.name}
                  </h3>
                  <p className="text-xs" style={{ color: "#A0A0A0" }}>
                    CAS {selected.cas} &nbsp;·&nbsp; MW {selected.mw.toFixed(1)} Da &nbsp;·&nbsp;{" "}
                    <span
                      style={{
                        color: CATEGORY_COLORS[selected.category] || "#C9DD69",
                      }}
                    >
                      {selected.category}
                    </span>
                  </p>
                </div>
                {selected.slug && (
                  <Link
                    href={`/coa/${selected.slug}`}
                    className="text-xs px-3 py-1.5 rounded-sm flex-shrink-0 ml-4"
                    style={{
                      backgroundColor: "#16a34a22",
                      color: "#4ade80",
                      border: "1px solid #16a34a44",
                    }}
                  >
                    View Sample COA →
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div
                  className="rounded-sm p-3"
                  style={{ backgroundColor: "#1a1a18", border: "1px solid #2a2a28" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#666" }}>Min Acceptable</p>
                  <p className="text-lg font-mono font-medium" style={{ color: "#F9F9F9" }}>
                    ≥{selected.hplcMin}%
                  </p>
                </div>
                <div
                  className="rounded-sm p-3"
                  style={{ backgroundColor: "#1a1a18", border: "1px solid #2a2a28" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#666" }}>Typical Reported</p>
                  <p
                    className="text-lg font-mono font-medium"
                    style={{
                      color:
                        selected.hplcTypical >= 99.5
                          ? "#4ade80"
                          : selected.hplcTypical >= 99
                          ? "#facc15"
                          : "#F9F9F9",
                    }}
                  >
                    {selected.hplcTypical}%
                  </p>
                </div>
                <div
                  className="rounded-sm p-3"
                  style={{ backgroundColor: "#1a1a18", border: "1px solid #2a2a28" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#666" }}>MS Confirmation</p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: selected.ms ? "#4ade80" : "#A0A0A0" }}
                  >
                    {selected.ms ? "Recommended" : "Not Standard"}
                  </p>
                </div>
                <div
                  className="rounded-sm p-3"
                  style={{ backgroundColor: "#1a1a18", border: "1px solid #2a2a28" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#666" }}>Grade</p>
                  <p className="text-sm font-medium" style={{ color: "#C9DD69" }}>
                    {selected.tier === "pharmaceutical"
                      ? "Pharmaceutical-like"
                      : "Research Grade"}
                  </p>
                </div>
              </div>

              <div
                className="rounded-sm p-4"
                style={{ backgroundColor: "#0d1f0d", border: "1px solid #1a3a1a" }}
              >
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#4ade80" }}>
                  QC Notes
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#C0C0B8" }}>
                  {selected.notes}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── How to Read a COA ── */}
        <section className="mb-16">
          <h2
            className="text-2xl mb-2 tracking-tight"
            style={{ fontWeight: 300, color: "#111" }}
          >
            How to Read a Certificate of Analysis
          </h2>
          <p className="text-sm mb-8" style={{ color: "#666" }}>
            A COA is only as good as the lab that generated it. Here's what
            every section should contain and what to verify.
          </p>

          <div className="space-y-4">
            {[
              {
                section: "Header & Identity",
                required: [
                  "Compound name (IUPAC or common)",
                  "CAS number",
                  "Molecular formula",
                  "Molecular weight (exact, not rounded)",
                  "Lot/batch number (must match vial label)",
                  "Analysis date",
                  "Issuing laboratory name, address, accreditation",
                ],
              },
              {
                section: "HPLC Purity",
                required: [
                  "Measured purity value with decimal (e.g., 99.2%)",
                  "Column type and dimensions",
                  "Mobile phase A and B composition",
                  "Gradient program",
                  "Detection wavelength (nm)",
                  "Flow rate (mL/min)",
                  "Chromatogram image with peak labels and area %",
                ],
              },
              {
                section: "Mass Spectrometry",
                required: [
                  "Method: ESI-MS, MALDI-TOF, or LC-MS",
                  "Observed [M+H]+ or multi-charge envelope",
                  "Theoretical MW for comparison",
                  "Ion mode (positive/negative)",
                ],
              },
              {
                section: "Additional QC Tests",
                required: [
                  "Karl Fischer water content (important for lyophilized peptides)",
                  "Residual solvents (TFA, acetonitrile, acetic acid)",
                  "Appearance (white/off-white lyophilized powder)",
                  "Endotoxin / LAL (for injectable-grade compounds)",
                  "pH of reconstituted solution",
                ],
              },
              {
                section: "Conclusion & Sign-Off",
                required: [
                  "Pass/Fail statement against specification",
                  "Analyst name or ID",
                  "QA signatory",
                  "Statement that compound meets stated specification",
                ],
              },
            ].map((item) => (
              <div
                key={item.section}
                className="rounded-sm overflow-hidden"
                style={{ border: "1px solid #ECEAE4" }}
              >
                <div
                  className="px-5 py-3"
                  style={{ backgroundColor: "#F5F3EE" }}
                >
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "#333" }}
                  >
                    {item.section}
                  </h3>
                </div>
                <ul className="px-5 py-4 space-y-1.5">
                  {item.required.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm" style={{ color: "#444" }}>
                      <span style={{ color: "#B8A44C", marginTop: "2px" }}>✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Red Flags ── */}
        <section className="mb-16">
          <h2
            className="text-2xl mb-2 tracking-tight"
            style={{ fontWeight: 300, color: "#111" }}
          >
            COA Red Flags
          </h2>
          <p className="text-sm mb-8" style={{ color: "#666" }}>
            These are the warning signs that a COA was fabricated, recycled
            from another batch, or generated without actual laboratory analysis.
          </p>

          <div className="space-y-3">
            {RED_FLAGS.map((item) => (
              <div
                key={item.flag}
                className="rounded-sm p-5"
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid ${severityColor(item.severity)}44`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-sm flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: severityColor(item.severity) + "22",
                      color: severityColor(item.severity),
                      border: `1px solid ${severityColor(item.severity)}44`,
                    }}
                  >
                    {severityLabel(item.severity)}
                  </span>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "#111" }}>
                      {item.flag}
                    </p>
                    <p className="text-sm" style={{ color: "#555" }}>
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Good Signs ── */}
        <section className="mb-16">
          <h2
            className="text-2xl mb-2 tracking-tight"
            style={{ fontWeight: 300, color: "#111" }}
          >
            Signs of a High-Quality COA
          </h2>
          <p className="text-sm mb-6" style={{ color: "#666" }}>
            These indicators correlate with genuine laboratory analysis from
            credentialed facilities.
          </p>

          <div
            className="rounded-sm p-6"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ECEAE4",
            }}
          >
            <ul className="space-y-3">
              {GOOD_SIGNS.map((sign) => (
                <li
                  key={sign}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "#333" }}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ backgroundColor: "#16a34a22", color: "#16a34a" }}
                  >
                    ✓
                  </span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="mb-12">
          <div
            className="rounded-sm p-7"
            style={{ backgroundColor: "#010101", border: "1px solid #2a2a28" }}
          >
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>
              Related Resources
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: "/coa/bpc-157", label: "View Sample COA (BPC-157)", icon: "📄" },
                { href: "/tools/reconstitution-calculator", label: "Reconstitution Calculator", icon: "🧪" },
                { href: "/guides/storage", label: "Storage Requirements Guide", icon: "❄️" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-sm px-4 py-3 text-sm transition-opacity hover:opacity-70"
                  style={{
                    backgroundColor: "#1a1a18",
                    border: "1px solid #2a2a28",
                    color: "#F9F9F9",
                    textDecoration: "none",
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        {/* Catalog rail */}
        <ToolCatalogCTA className="py-2" />

        <div
          className="rounded-sm p-5 text-xs leading-relaxed"
          style={{
            backgroundColor: "#F5F3EE",
            border: "1px solid #ECEAE4",
            color: "#666",
          }}
        >
          <strong style={{ color: "#333" }}>Research Use Only.</strong> The
          purity specifications listed here are reference values derived from
          published literature and standard industry practice. They are
          provided for educational purposes to assist qualified researchers in
          evaluating supplier documentation. They do not constitute analytical
          guarantees or regulatory standards. All Nexphoria products are
          intended for in vitro or preclinical laboratory research only and are
          not for human use, veterinary use, or consumption.
        </div>
      </div>
    </div>
  );
}
