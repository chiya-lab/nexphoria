"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

interface Biomarker {
  name: string;
  abbr?: string;
  measures: string;
  normalRange: string;
  normalRangeFemale?: string;
  affectedBy: string[];
  testingFrequency: string;
  category: string;
  notes?: string;
}

const BIOMARKERS: Biomarker[] = [
  {
    name: "IGF-1",
    abbr: "Insulin-like Growth Factor 1",
    measures: "GH axis bioavailability",
    normalRange: "100-300 ng/mL (adult)",
    affectedBy: ["mk-677", "sermorelin", "cjc-1295-ipamorelin", "cjc-1295-dac", "hexarelin", "tesamorelin", "ghrp-2"],
    testingFrequency: "Baseline, Week 4, Week 8, Week 12",
    category: "GH Axis",
  },
  {
    name: "Growth Hormone",
    abbr: "GH / HGH",
    measures: "Pulsatile GH secretion",
    normalRange: "<10 ng/mL (fasting baseline)",
    affectedBy: ["mk-677", "sermorelin", "cjc-1295-ipamorelin", "cjc-1295-dac", "hexarelin", "tesamorelin", "ghrp-2", "ghrp-6"],
    testingFrequency: "Baseline only (pulsatile; not useful for tracking)",
    category: "GH Axis",
    notes: "Highly pulsatile; IGF-1 is a more stable marker",
  },
  {
    name: "Luteinizing Hormone",
    abbr: "LH",
    measures: "Reproductive/gonadal axis",
    normalRange: "1.5-9.3 IU/L",
    normalRangeFemale: "1.9-12.5 IU/L (follicular)",
    affectedBy: ["kisspeptin-10", "oxytocin"],
    testingFrequency: "Baseline, Week 4, Week 8 (if using kisspeptin)",
    category: "Reproductive",
  },
  {
    name: "Follicle Stimulating Hormone",
    abbr: "FSH",
    measures: "Reproductive/spermatogenesis/follicular maturation",
    normalRange: "1.5-12.4 IU/L",
    affectedBy: ["kisspeptin-10"],
    testingFrequency: "Baseline, Week 4, Week 8 (if using kisspeptin)",
    category: "Reproductive",
  },
  {
    name: "Total Testosterone",
    abbr: "TT",
    measures: "Androgen status",
    normalRange: "300-1000 ng/dL",
    normalRangeFemale: "15-70 ng/dL",
    affectedBy: ["kisspeptin-10"],
    testingFrequency: "Baseline, Week 4, Week 8 (if using kisspeptin or GH peptides)",
    category: "Reproductive",
    notes: "Indirect effect via LH elevation",
  },
  {
    name: "Sex Hormone Binding Globulin",
    abbr: "SHBG",
    measures: "Free testosterone availability",
    normalRange: "10-57 nmol/L",
    normalRangeFemale: "18-144 nmol/L",
    affectedBy: ["mk-677"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Reproductive",
    notes: "MK-677 may decrease SHBG (increases free T)",
  },
  {
    name: "Hemoglobin A1c",
    abbr: "HbA1c",
    measures: "3-month glycemic control",
    normalRange: "<5.7% (normal), 5.7-6.4% (prediabetes), ≥6.5% (diabetes)",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide"],
    testingFrequency: "Baseline, Month 3, Month 6",
    category: "Metabolic",
  },
  {
    name: "Fasting Insulin",
    measures: "Insulin secretion and resistance",
    normalRange: "2-25 μIU/mL",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide", "mk-677"],
    testingFrequency: "Baseline, Week 4, Week 8, Week 12",
    category: "Metabolic",
    notes: "MK-677 may increase insulin resistance",
  },
  {
    name: "HOMA-IR",
    abbr: "Homeostatic Model Assessment for Insulin Resistance",
    measures: "Insulin resistance index",
    normalRange: "<2.0 (normal), 2.0-2.9 (early resistance), ≥3.0 (significant resistance)",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide", "mk-677"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Metabolic",
    notes: "Calculated from fasting glucose and insulin",
  },
  {
    name: "Fasting Glucose",
    measures: "Glycemic control",
    normalRange: "70-99 mg/dL (normal), 100-125 mg/dL (prediabetes), ≥126 mg/dL (diabetes)",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide", "mk-677"],
    testingFrequency: "Baseline, Week 4, Week 8, Week 12",
    category: "Metabolic",
  },
  {
    name: "C-Peptide",
    measures: "Endogenous insulin secretion / beta cell function",
    normalRange: "0.5-2.0 ng/mL (fasting)",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide"],
    testingFrequency: "Baseline, Month 3, Month 6 (if diabetic/prediabetic)",
    category: "Metabolic",
  },
  {
    name: "Triglycerides",
    abbr: "TG",
    measures: "Lipid metabolism",
    normalRange: "<150 mg/dL",
    affectedBy: ["tesamorelin", "semaglutide", "tirzepatide", "retatrutide", "nad-plus"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Lipids",
  },
  {
    name: "HDL Cholesterol",
    abbr: "HDL-C",
    measures: "\"Good\" cholesterol",
    normalRange: ">40 mg/dL",
    normalRangeFemale: ">50 mg/dL",
    affectedBy: ["tesamorelin", "nad-plus"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Lipids",
  },
  {
    name: "LDL Cholesterol",
    abbr: "LDL-C",
    measures: "\"Bad\" cholesterol",
    normalRange: "<100 mg/dL (optimal), 100-129 mg/dL (near optimal)",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide", "nad-plus"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Lipids",
  },
  {
    name: "Cortisol",
    measures: "Stress response, HPA axis",
    normalRange: "6-23 μg/dL (morning), 3-16 μg/dL (afternoon)",
    affectedBy: ["ghrp-2", "hexarelin", "bpc-157"],
    testingFrequency: "Baseline, Week 4, Week 8 (morning draw)",
    category: "Stress",
    notes: "GHRP-2/hexarelin elevate cortisol; BPC-157 may modulate",
  },
  {
    name: "ACTH",
    abbr: "Adrenocorticotropic Hormone",
    measures: "Pituitary-adrenal axis",
    normalRange: "10-60 pg/mL",
    affectedBy: ["ghrp-2", "hexarelin"],
    testingFrequency: "Baseline, Week 4 (if using GHRP-2/hexarelin)",
    category: "Stress",
  },
  {
    name: "Prolactin",
    abbr: "PRL",
    measures: "Pituitary hormone",
    normalRange: "2-18 ng/mL",
    normalRangeFemale: "2-29 ng/mL",
    affectedBy: ["ghrp-2", "hexarelin"],
    testingFrequency: "Baseline, Week 4, Week 8 (if using GHRP-2/hexarelin)",
    category: "Stress",
    notes: "GHRP-2/hexarelin may mildly elevate prolactin",
  },
  {
    name: "TSH",
    abbr: "Thyroid Stimulating Hormone",
    measures: "Thyroid function",
    normalRange: "0.4-4.0 mIU/L",
    affectedBy: ["mk-677", "nad-plus"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Thyroid",
    notes: "MK-677 may slightly decrease TSH",
  },
  {
    name: "Free T3",
    abbr: "FT3",
    measures: "Active thyroid hormone",
    normalRange: "2.3-4.2 pg/mL",
    affectedBy: ["mk-677", "nad-plus"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Thyroid",
  },
  {
    name: "Free T4",
    abbr: "FT4",
    measures: "Thyroid hormone storage",
    normalRange: "0.8-1.8 ng/dL",
    affectedBy: ["mk-677", "nad-plus"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Thyroid",
  },
  {
    name: "AST",
    abbr: "Aspartate Aminotransferase",
    measures: "Liver enzyme (hepatic stress)",
    normalRange: "<40 U/L",
    affectedBy: ["bpc-157", "semaglutide", "tirzepatide", "retatrutide"],
    testingFrequency: "Baseline, Week 4, Week 8, Week 12",
    category: "Renal/Hepatic",
    notes: "BPC-157 is hepatoprotective; GLP-1 agonists reduce liver fat",
  },
  {
    name: "ALT",
    abbr: "Alanine Aminotransferase",
    measures: "Liver enzyme (hepatic stress)",
    normalRange: "<56 U/L",
    affectedBy: ["bpc-157", "semaglutide", "tirzepatide", "retatrutide"],
    testingFrequency: "Baseline, Week 4, Week 8, Week 12",
    category: "Renal/Hepatic",
    notes: "GLP-1 agonists may improve NASH/NAFLD markers",
  },
  {
    name: "GGT",
    abbr: "Gamma-Glutamyl Transferase",
    measures: "Liver stress marker",
    normalRange: "<60 U/L",
    affectedBy: ["bpc-157"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Renal/Hepatic",
  },
  {
    name: "Creatinine",
    measures: "Kidney function",
    normalRange: "0.7-1.3 mg/dL",
    normalRangeFemale: "0.5-1.1 mg/dL",
    affectedBy: [],
    testingFrequency: "Baseline, Week 12",
    category: "Renal/Hepatic",
    notes: "General renal function baseline",
  },
  {
    name: "BUN",
    abbr: "Blood Urea Nitrogen",
    measures: "Kidney function",
    normalRange: "7-20 mg/dL",
    affectedBy: [],
    testingFrequency: "Baseline, Week 12",
    category: "Renal/Hepatic",
  },
  {
    name: "WBC",
    abbr: "White Blood Cell Count",
    measures: "Immune function",
    normalRange: "4.5-11.0 × 10³/μL",
    affectedBy: ["thymosin-alpha-1", "bpc-157", "kpv"],
    testingFrequency: "Baseline, Week 4, Week 8",
    category: "Blood",
  },
  {
    name: "Lymphocytes",
    measures: "Immune cell subset",
    normalRange: "20-40% of WBC",
    affectedBy: ["thymosin-alpha-1"],
    testingFrequency: "Baseline, Week 4, Week 8 (if using thymosin alpha-1)",
    category: "Blood",
  },
  {
    name: "Hemoglobin",
    abbr: "Hgb",
    measures: "Oxygen-carrying capacity",
    normalRange: "13.5-17.5 g/dL",
    normalRangeFemale: "12.0-15.5 g/dL",
    affectedBy: [],
    testingFrequency: "Baseline, Week 12",
    category: "Blood",
    notes: "General health marker",
  },
  {
    name: "C-Reactive Protein",
    abbr: "CRP",
    measures: "Systemic inflammation",
    normalRange: "<1.0 mg/L (low risk), 1.0-3.0 mg/L (moderate), >3.0 mg/L (high)",
    affectedBy: ["semaglutide", "tirzepatide", "retatrutide", "bpc-157", "kpv"],
    testingFrequency: "Baseline, Week 8, Week 12",
    category: "Inflammation",
  },
  {
    name: "8-OHdG",
    abbr: "8-Hydroxy-2'-deoxyguanosine",
    measures: "Oxidative DNA damage",
    normalRange: "<5 ng/mL (urine)",
    affectedBy: ["nad-plus", "ghk-cu", "epitalon"],
    testingFrequency: "Baseline, Month 3, Month 6",
    category: "Oxidative Stress",
    notes: "Specialized test; not routine",
  },
  {
    name: "BDNF",
    abbr: "Brain-Derived Neurotrophic Factor",
    measures: "Neuroplasticity, cognitive function",
    normalRange: "8-30 ng/mL (serum)",
    affectedBy: ["selank", "semax", "mk-677"],
    testingFrequency: "Baseline, Month 3, Month 6",
    category: "Neurological",
    notes: "Specialized test; not routine",
  },
  {
    name: "Homocysteine",
    measures: "Cardiovascular risk, methylation status",
    normalRange: "<12 μmol/L (optimal <10 μmol/L)",
    affectedBy: ["nad-plus"],
    testingFrequency: "Baseline, Month 3, Month 6",
    category: "Inflammation",
    notes: "NAD+ influences B-vitamin metabolism",
  },
];

const CATEGORIES = [
  "All",
  "GH Axis",
  "Metabolic",
  "Reproductive",
  "Thyroid",
  "Stress",
  "Lipids",
  "Blood",
  "Renal/Hepatic",
  "Oxidative Stress",
  "Inflammation",
  "Neurological",
];

const CATEGORY_COLORS: Record<string, string> = {
  "GH Axis": "#d4af37",
  "Metabolic": "#ef4444",
  "Reproductive": "#8b5cf6",
  "Thyroid": "#3b82f6",
  "Stress": "#f59e0b",
  "Lipids": "#10b981",
  "Blood": "#ec4899",
  "Renal/Hepatic": "#14b8a6",
  "Oxidative Stress": "#f97316",
  "Inflammation": "#dc2626",
  "Neurological": "#6366f1",
};

export default function BiomarkerReference() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredBiomarkers = useMemo(() => {
    let filtered = BIOMARKERS;

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          (b.abbr && b.abbr.toLowerCase().includes(query)) ||
          b.measures.toLowerCase().includes(query) ||
          b.affectedBy.some((c) => c.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ backgroundColor: "#18181b", minHeight: "100vh", color: "#fff" }}>
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "#09090b" }}>
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Biomarker Reference" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#d4af37" }}>
            Lab Reference
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#fff", lineHeight: 1.05 }}
          >
            Biomarker Reference Guide
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mb-8"
            style={{ fontWeight: 300, color: "#a1a1aa", lineHeight: 1.65 }}
          >
            Track the right labs for your research protocol. Comprehensive reference table with normal ranges, compound
            interactions, and optimal testing frequency for 32 biomarkers.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <div className="text-2xl font-light" style={{ color: "#d4af37" }}>
                32
              </div>
              <div style={{ color: "#71717a" }}>Biomarkers</div>
            </div>
            <div>
              <div className="text-2xl font-light" style={{ color: "#d4af37" }}>
                10
              </div>
              <div style={{ color: "#71717a" }}>Categories</div>
            </div>
            <div>
              <div className="text-2xl font-light" style={{ color: "#d4af37" }}>
                30+
              </div>
              <div style={{ color: "#71717a" }}>Compound Interactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="px-6 py-8 border-b" style={{ borderColor: "#27272a", backgroundColor: "#18181b" }}>
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search biomarkers, compounds, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-sm text-sm mb-4"
            style={{
              backgroundColor: "#27272a",
              border: "1px solid #3f3f46",
              color: "#fff",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#d4af37")}
            onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
          />

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 text-xs rounded-sm transition-all"
                style={{
                  backgroundColor: selectedCategory === cat ? "#d4af37" : "#27272a",
                  color: selectedCategory === cat ? "#000" : "#a1a1aa",
                  border: "1px solid",
                  borderColor: selectedCategory === cat ? "#d4af37" : "#3f3f46",
                  fontWeight: selectedCategory === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs mt-4" style={{ color: "#71717a" }}>
            Showing {filteredBiomarkers.length} of {BIOMARKERS.length} biomarkers
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr style={{ backgroundColor: "#27272a" }}>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                    Biomarker
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                    Reference Range
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                    Compounds
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                    Testing Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBiomarkers.map((biomarker, idx) => (
                  <tr
                    key={biomarker.name}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#18181b" : "#1f1f23",
                      borderBottom: "1px solid #27272a",
                    }}
                    className="hover:bg-zinc-900 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === biomarker.name ? null : biomarker.name)}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium" style={{ color: "#fff" }}>
                        {biomarker.name}
                      </div>
                      {biomarker.abbr && (
                        <div className="text-xs mt-0.5" style={{ color: "#71717a" }}>
                          {biomarker.abbr}
                        </div>
                      )}
                      {expandedRow === biomarker.name && (
                        <div className="text-xs mt-2" style={{ color: "#a1a1aa" }}>
                          <strong style={{ color: "#d4af37" }}>Measures:</strong> {biomarker.measures}
                          {biomarker.notes && (
                            <div className="mt-1">
                              <strong style={{ color: "#d4af37" }}>Notes:</strong> {biomarker.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="inline-block px-2 py-1 text-xs rounded-sm font-medium"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[biomarker.category]}22`,
                          color: CATEGORY_COLORS[biomarker.category],
                          border: `1px solid ${CATEGORY_COLORS[biomarker.category]}44`,
                        }}
                      >
                        {biomarker.category}
                      </span>
                    </td>
                    <td className="px-4 py-4" style={{ color: "#e4e4e7" }}>
                      <div>{biomarker.normalRange}</div>
                      {biomarker.normalRangeFemale && (
                        <div className="text-xs mt-1" style={{ color: "#71717a" }}>
                          ♀ {biomarker.normalRangeFemale}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {biomarker.affectedBy.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {biomarker.affectedBy.slice(0, expandedRow === biomarker.name ? undefined : 3).map((compound) => (
                            <span
                              key={compound}
                              className="inline-block px-2 py-0.5 text-xs rounded-sm"
                              style={{
                                backgroundColor: "#27272a",
                                color: "#d4af37",
                                border: "1px solid #3f3f46",
                              }}
                            >
                              {compound}
                            </span>
                          ))}
                          {!expandedRow && biomarker.affectedBy.length > 3 && (
                            <span className="text-xs" style={{ color: "#71717a" }}>
                              +{biomarker.affectedBy.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#71717a" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-4" style={{ color: "#a1a1aa" }}>
                      {biomarker.testingFrequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBiomarkers.length === 0 && (
              <div className="text-center py-12" style={{ color: "#71717a" }}>
                No biomarkers found matching your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Track Biomarkers */}
      <section className="px-6 py-16" style={{ backgroundColor: "#09090b" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light mb-6" style={{ color: "#fff" }}>
            Why Track Biomarkers?
          </h2>
          <div className="space-y-4 text-sm" style={{ color: "#a1a1aa", lineHeight: 1.7 }}>
            <p>
              Biomarkers provide objective, quantifiable data on physiological responses to research peptides. Baseline
              testing establishes your starting point, while serial follow-up measurements reveal how your system
              responds to the compound(s) being studied.
            </p>
            <p>
              <strong style={{ color: "#d4af37" }}>Baseline + follow-up protocol:</strong> Always obtain baseline labs
              before starting any research cycle. Follow-up testing at strategic intervals (typically Week 4, Week 8,
              Week 12, or monthly for longer cycles) allows you to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirm on-target effects (e.g., IGF-1 elevation with GH secretagogues)</li>
              <li>Detect off-target or adverse effects early (e.g., glucose dysregulation with MK-677)</li>
              <li>Optimize dose and frequency based on measured response</li>
              <li>Make informed decisions about cycle continuation, adjustment, or termination</li>
            </ul>
            <p>
              <strong style={{ color: "#d4af37" }}>Not medical advice.</strong> This reference is for educational and
              research purposes. Always work with qualified healthcare providers for biomarker interpretation and
              clinical decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-light mb-8" style={{ color: "#fff" }}>
            Related Tools
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                href: "/tools/igf-1-calculator",
                title: "IGF-1 Response Estimator",
                desc: "Estimate IGF-1 % elevation from GHRH/GHRP stacking",
              },
              {
                href: "/guides/dosing-protocols",
                title: "Dosing Protocol Design",
                desc: "Loading phases, timing, stacking principles",
              },
              {
                href: "/tools/protocol-template-generator",
                title: "Protocol Template Generator",
                desc: "Printable research protocol with biomarker tracking fields",
              },
              {
                href: "/tools/half-life-calculator",
                title: "Half-Life Calculator",
                desc: "Plasma half-life, clearance, dosing frequency",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block p-5 rounded-sm transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  textDecoration: "none",
                }}
              >
                <h3 className="text-sm font-medium mb-2" style={{ color: "#fff" }}>
                  {tool.title}
                </h3>
                <p className="text-xs" style={{ color: "#71717a" }}>
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog rail */}
      <ToolCatalogCTA className="py-2" />

      {/* RUO Disclaimer */}
      <section className="px-6 py-12 border-t" style={{ borderColor: "#27272a" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs" style={{ color: "#71717a", lineHeight: 1.6 }}>
            <strong style={{ color: "#a1a1aa" }}>Research Use Only (RUO).</strong> This biomarker reference is for
            educational purposes and qualified researchers only. Peptides sold by Nexphoria are not approved for human
            consumption, clinical use, or medical treatment. Reference ranges are provided for informational purposes
            and should not be used for self-diagnosis or treatment decisions. Always consult qualified healthcare
            providers for medical advice and biomarker interpretation.
          </p>
        </div>
      </section>
    </div>
  );
}
