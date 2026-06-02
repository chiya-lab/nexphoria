"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// Compound reference database with MW, CAS, and representative assay concentrations
interface CompoundEntry {
  name: string;
  slug: string;
  mw: number; // g/mol
  cas: string;
  category: string;
  typicalAssayConc?: {
    label: string;
    molar: number; // in nM
    context: string;
  };
}

const COMPOUNDS: CompoundEntry[] = [
  // GH Axis
  { name: "BPC-157", slug: "bpc-157", mw: 1419.55, cas: "137525-51-0", category: "Recovery",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "Cell culture scratch assay (Sikiric 2003)" } },
  { name: "TB-500 (Thymosin Beta-4 fragment)", slug: "tb-500", mw: 4963.5, cas: "885340-08-9", category: "Recovery",
    typicalAssayConc: { label: "1 μM", molar: 1000, context: "Cardioprotection cell culture (Bock-Marquette 2004)" } },
  { name: "GHK-Cu", slug: "ghk-cu", mw: 403.95, cas: "89030-95-5", category: "Recovery",
    typicalAssayConc: { label: "1 μM", molar: 1000, context: "Nrf2 pathway activation in vitro (Pickart)" } },
  { name: "Ipamorelin", slug: "ipamorelin", mw: 711.85, cas: "170851-70-4", category: "GH Axis",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "GHSR-1a binding assay (Johansen 1999)" } },
  { name: "CJC-1295 No DAC", slug: "cjc-1295-no-dac", mw: 3367.97, cas: "863288-34-0", category: "GH Axis",
    typicalAssayConc: { label: "10 nM", molar: 10, context: "GHRHr cAMP assay" } },
  { name: "CJC-1295 (DAC)", slug: "cjc-1295", mw: 3647.28, cas: "863288-34-0", category: "GH Axis" },
  { name: "Sermorelin", slug: "sermorelin", mw: 3357.93, cas: "86168-78-7", category: "GH Axis",
    typicalAssayConc: { label: "10 nM", molar: 10, context: "GHRHr receptor binding" } },
  { name: "MK-677 (Ibutamoren)", slug: "mk-677", mw: 624.77, cas: "159634-47-6", category: "GH Axis",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "GHSR-1a full agonism (Chapman 1996)" } },
  { name: "Tesamorelin", slug: "tesamorelin", mw: 5135.79, cas: "218949-48-5", category: "GH Axis" },
  { name: "Hexarelin", slug: "hexarelin", mw: 887.05, cas: "140703-51-1", category: "GH Axis" },
  // GLP-1 / Metabolic
  { name: "Semaglutide", slug: "semaglutide", mw: 4113.58, cas: "910463-68-2", category: "Metabolic",
    typicalAssayConc: { label: "1 nM", molar: 1, context: "GLP-1R cAMP assay EC50 ~0.06 nM (Lau 2015)" } },
  { name: "Tirzepatide", slug: "tirzepatide", mw: 4813.48, cas: "2023788-19-2", category: "Metabolic",
    typicalAssayConc: { label: "1 nM", molar: 1, context: "GLP-1R EC50 ~0.05 nM; GIPR EC50 ~0.012 nM" } },
  { name: "Retatrutide", slug: "retatrutide", mw: 4762.49, cas: "2382700-73-2", category: "Metabolic" },
  { name: "AOD-9604", slug: "aod-9604", mw: 1815.11, cas: "221231-10-3", category: "Metabolic",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "β3-AR lipolysis assay (Heffernan 1999)" } },
  // Longevity
  { name: "NAD+", slug: "nad-plus", mw: 663.43, cas: "53-84-9", category: "Longevity",
    typicalAssayConc: { label: "500 μM", molar: 500000, context: "SIRT1 deacetylase assay (in vitro)" } },
  { name: "Epitalon", slug: "epitalon", mw: 390.35, cas: "307297-39-8", category: "Longevity",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "Telomerase TRAP assay (Khavinson 2003)" } },
  { name: "SS-31 (Elamipretide)", slug: "ss-31", mw: 640.82, cas: "736992-21-5", category: "Longevity",
    typicalAssayConc: { label: "10 nM", molar: 10, context: "Cardiolipin binding, ETC restoration (Szeto 2014)" } },
  { name: "MOTS-c", slug: "mots-c", mw: 2174.5, cas: "1627580-64-6", category: "Longevity",
    typicalAssayConc: { label: "1 μM", molar: 1000, context: "AMPK activation in vitro (Lee 2015)" } },
  { name: "Follistatin 344", slug: "follistatin-344", mw: 37340, cas: "80432-79-7", category: "Longevity" },
  // Nootropics
  { name: "Selank", slug: "selank", mw: 751.86, cas: "129954-34-3", category: "Nootropics",
    typicalAssayConc: { label: "10 μM", molar: 10000, context: "BDNF upregulation cell culture (Semenova 2010)" } },
  { name: "Semax", slug: "semax", mw: 813.96, cas: "80714-61-0", category: "Nootropics",
    typicalAssayConc: { label: "1 μM", molar: 1000, context: "BDNF/VEGF upregulation assay (Dolotov 2006)" } },
  { name: "DSIP", slug: "dsip", mw: 848.83, cas: "62697-27-0", category: "Nootropics",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "EEG delta-wave induction (Monnier 1977)" } },
  // Immunology
  { name: "Thymosin Alpha-1", slug: "thymosin-alpha-1", mw: 3108.47, cas: "62304-98-7", category: "Immunology",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "PBMC cytokine stimulation assay" } },
  { name: "KPV", slug: "kpv", mw: 341.38, cas: "63664-91-5", category: "Immunology",
    typicalAssayConc: { label: "10 μM", molar: 10000, context: "NF-κB inhibition RAW264.7 (Mandal 2009)" } },
  { name: "LL-37", slug: "ll-37", mw: 4493.35, cas: "154947-66-7", category: "Immunology",
    typicalAssayConc: { label: "1 μM", molar: 1000, context: "Antimicrobial MIC (E. coli/S. aureus)" } },
  // Reproductive
  { name: "PT-141 (Bremelanotide)", slug: "pt-141", mw: 1025.2, cas: "189691-06-3", category: "Reproductive",
    typicalAssayConc: { label: "1 μM", molar: 1000, context: "MC4R cAMP assay (Dorr 1998)" } },
  { name: "Melanotan II", slug: "melanotan-ii", mw: 1024.2, cas: "121062-08-6", category: "Reproductive",
    typicalAssayConc: { label: "100 nM", molar: 100, context: "MC1R pigmentation assay" } },
  { name: "Kisspeptin", slug: "kisspeptin", mw: 1302.51, cas: "374683-27-9", category: "Reproductive",
    typicalAssayConc: { label: "10 nM", molar: 10, context: "GPR54 activation, LH secretion (Dhillo 2005)" } },
  { name: "Oxytocin", slug: "oxytocin", mw: 1007.19, cas: "50-56-6", category: "Reproductive",
    typicalAssayConc: { label: "1 nM", molar: 1, context: "OTR Gq/PKC activation EC50 ~1–10 nM" } },
  // Cosmetic
  { name: "Snap-8", slug: "snap-8", mw: 1076.22, cas: "868844-74-0", category: "Cosmetic",
    typicalAssayConc: { label: "100 μM", molar: 100000, context: "SNARE complex disruption in vitro" } },
];

// Molar unit multipliers → to moles/L
const MOLAR_UNITS = [
  { label: "M", factor: 1 },
  { label: "mM", factor: 1e-3 },
  { label: "μM", factor: 1e-6 },
  { label: "nM", factor: 1e-9 },
  { label: "pM", factor: 1e-12 },
];

// Mass concentration unit multipliers → to g/L
const MASS_UNITS = [
  { label: "mg/mL", factor: 1 }, // 1 mg/mL = 1 g/L
  { label: "μg/mL", factor: 1e-3 }, // 1 μg/mL = 0.001 g/L
  { label: "ng/mL", factor: 1e-6 },
  { label: "mg/L", factor: 1e-3 },
  { label: "g/L", factor: 1 },
];

function formatNumber(n: number): string {
  if (n === 0) return "0";
  if (!isFinite(n)) return "—";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumSignificantDigits: 5 });
  if (n >= 0.001) return String(parseFloat(n.toPrecision(5)));
  return n.toExponential(3);
}

const CATEGORIES = ["All", ...Array.from(new Set(COMPOUNDS.map((c) => c.category))).sort()];

export default function MolarityCalculator() {
  // Conversion direction
  const [mode, setMode] = useState<"molar-to-mass" | "mass-to-molar">("molar-to-mass");

  // Compound selection
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [customMW, setCustomMW] = useState<string>("");
  const [catFilter, setCatFilter] = useState<string>("All");

  // Input values
  const [molarValue, setMolarValue] = useState<string>("1");
  const [molarUnit, setMolarUnit] = useState<string>("μM");
  const [massValue, setMassValue] = useState<string>("1");
  const [massUnit, setMassUnit] = useState<string>("mg/mL");

  // Rodent dose example
  const [animalWeight, setAnimalWeight] = useState<string>("25");
  const [doseMcgKg, setDoseMcgKg] = useState<string>("10");

  const selectedCompound = COMPOUNDS.find((c) => c.slug === selectedSlug);
  const mwNum: number = selectedCompound
    ? selectedCompound.mw
    : parseFloat(customMW) || 0;

  // --- Calculations ---
  // Convert molar → mass
  const calcMassFromMolar = useCallback(
    (molVal: number, molUnitLabel: string): { [unit: string]: number } => {
      if (!mwNum || molVal <= 0) return {};
      const mu = MOLAR_UNITS.find((u) => u.label === molUnitLabel);
      if (!mu) return {};
      const concMolL = molVal * mu.factor; // mol/L
      const concGL = concMolL * mwNum; // g/L = mol/L × g/mol
      const results: { [unit: string]: number } = {};
      for (const mu2 of MASS_UNITS) {
        results[mu2.label] = concGL / mu2.factor;
      }
      return results;
    },
    [mwNum]
  );

  // Convert mass → molar
  const calcMolarFromMass = useCallback(
    (massVal: number, massUnitLabel: string): { [unit: string]: number } => {
      if (!mwNum || massVal <= 0) return {};
      const mu = MASS_UNITS.find((u) => u.label === massUnitLabel);
      if (!mu) return {};
      const concGL = massVal * mu.factor; // g/L
      const concMolL = concGL / mwNum; // mol/L
      const results: { [unit: string]: number } = {};
      for (const mu2 of MOLAR_UNITS) {
        results[mu2.label] = concMolL / mu2.factor;
      }
      return results;
    },
    [mwNum]
  );

  const molarNum = parseFloat(molarValue) || 0;
  const massNum = parseFloat(massValue) || 0;

  const molarResults = calcMassFromMolar(molarNum, molarUnit);
  const massResults = calcMolarFromMass(massNum, massUnit);
  const activeResults = mode === "molar-to-mass" ? molarResults : massResults;

  // Rodent dose example (molar from mass dose)
  const animalWeightNum = parseFloat(animalWeight) || 0;
  const doseMcgKgNum = parseFloat(doseMcgKg) || 0;
  const absoluteDoseMcg = (doseMcgKgNum * animalWeightNum) / 1000; // (mcg/kg × g) / 1000
  const absoluteDoseMol = mwNum > 0 ? (absoluteDoseMcg * 1e-6) / mwNum : 0; // g / (g/mol)
  const absoluteDoseNmol = absoluteDoseMol * 1e9;
  const absoluteDosePmol = absoluteDoseMol * 1e12;

  const filteredCompounds =
    catFilter === "All" ? COMPOUNDS : COMPOUNDS.filter((c) => c.category === catFilter);

  return (
    <div style={{ backgroundColor: "#010101", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="px-6 pt-32 pb-12 md:pt-40 md:pb-16" style={{ backgroundColor: "#010101" }}>
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Research Tools", href: "/tools" },
              { label: "Molarity Calculator" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
            Research Tools
          </p>
          <h1
            className="text-4xl md:text-5xl mb-4 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Molarity Calculator
          </h1>
          <p className="text-base mb-0 max-w-2xl" style={{ color: "#A0A0A0" }}>
            Convert between molar concentration (nM/μM/mM/M) and mass concentration (mg/mL/μg/mL) for any peptide or
            small molecule. Select a compound for automatic MW lookup or enter a custom molecular weight.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Compound / MW selector */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
              1. Select Compound or Enter MW
            </h2>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className="text-xs px-3 py-1 rounded-sm transition-colors"
                  style={{
                    backgroundColor: catFilter === cat ? "#C9A84C" : "#1A1A18",
                    color: catFilter === cat ? "#010101" : "#A0A0A0",
                    border: "1px solid " + (catFilter === cat ? "#C9A84C" : "#2A2A28"),
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Compound dropdown */}
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                  Catalog Compound
                </label>
                <select
                  value={selectedSlug}
                  onChange={(e) => { setSelectedSlug(e.target.value); setCustomMW(""); }}
                  className="w-full px-3 py-2 text-sm rounded-sm"
                  style={{
                    backgroundColor: "#1A1A18",
                    border: "1px solid #2A2A28",
                    color: "#F9F9F9",
                    outline: "none",
                  }}
                >
                  <option value="">— Select compound —</option>
                  {filteredCompounds.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} (MW {c.mw.toLocaleString()} g/mol)
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom MW */}
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                  Custom MW (g/mol)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5500.0"
                  value={customMW}
                  onChange={(e) => { setCustomMW(e.target.value); setSelectedSlug(""); }}
                  className="w-full px-3 py-2 text-sm rounded-sm"
                  style={{
                    backgroundColor: "#1A1A18",
                    border: "1px solid #2A2A28",
                    color: "#F9F9F9",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Show selected MW */}
            {mwNum > 0 && (
              <div
                className="mt-4 px-4 py-3 rounded-sm flex items-center gap-3"
                style={{ backgroundColor: "#141412", border: "1px solid #2A2A28" }}
              >
                <div className="text-xs uppercase tracking-widest" style={{ color: "#666" }}>Active MW:</div>
                <div className="text-2xl font-light" style={{ color: "#C9A84C" }}>
                  {mwNum.toLocaleString()} g/mol
                </div>
                {selectedCompound && (
                  <div className="ml-auto text-xs" style={{ color: "#666" }}>
                    CAS {selectedCompound.cas}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mode toggle */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
              2. Conversion Mode
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setMode("molar-to-mass")}
                className="flex-1 py-3 text-sm rounded-sm transition-colors"
                style={{
                  backgroundColor: mode === "molar-to-mass" ? "#C9A84C" : "#1A1A18",
                  color: mode === "molar-to-mass" ? "#010101" : "#A0A0A0",
                  border: "1px solid " + (mode === "molar-to-mass" ? "#C9A84C" : "#2A2A28"),
                  fontWeight: mode === "molar-to-mass" ? 600 : 400,
                }}
              >
                Molar → Mass
                <span className="block text-xs mt-0.5 opacity-70">Enter nM/μM → get mg/mL</span>
              </button>
              <button
                onClick={() => setMode("mass-to-molar")}
                className="flex-1 py-3 text-sm rounded-sm transition-colors"
                style={{
                  backgroundColor: mode === "mass-to-molar" ? "#C9A84C" : "#1A1A18",
                  color: mode === "mass-to-molar" ? "#010101" : "#A0A0A0",
                  border: "1px solid " + (mode === "mass-to-molar" ? "#C9A84C" : "#2A2A28"),
                  fontWeight: mode === "mass-to-molar" ? 600 : 400,
                }}
              >
                Mass → Molar
                <span className="block text-xs mt-0.5 opacity-70">Enter mg/mL → get nM/μM</span>
              </button>
            </div>
          </div>

          {/* Input */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
              3. Enter Concentration
            </h2>

            {mode === "molar-to-mass" ? (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                    Molar Concentration
                  </label>
                  <input
                    type="number"
                    value={molarValue}
                    onChange={(e) => setMolarValue(e.target.value)}
                    className="w-full px-3 py-2 text-base rounded-sm"
                    style={{
                      backgroundColor: "#1A1A18",
                      border: "1px solid #2A2A28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                </div>
                <div className="w-32">
                  <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                    Unit
                  </label>
                  <select
                    value={molarUnit}
                    onChange={(e) => setMolarUnit(e.target.value)}
                    className="w-full px-3 py-2 text-base rounded-sm"
                    style={{
                      backgroundColor: "#1A1A18",
                      border: "1px solid #2A2A28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  >
                    {MOLAR_UNITS.map((u) => (
                      <option key={u.label} value={u.label}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                    Mass Concentration
                  </label>
                  <input
                    type="number"
                    value={massValue}
                    onChange={(e) => setMassValue(e.target.value)}
                    className="w-full px-3 py-2 text-base rounded-sm"
                    style={{
                      backgroundColor: "#1A1A18",
                      border: "1px solid #2A2A28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                </div>
                <div className="w-32">
                  <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                    Unit
                  </label>
                  <select
                    value={massUnit}
                    onChange={(e) => setMassUnit(e.target.value)}
                    className="w-full px-3 py-2 text-base rounded-sm"
                    style={{
                      backgroundColor: "#1A1A18",
                      border: "1px solid #2A2A28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  >
                    {MASS_UNITS.map((u) => (
                      <option key={u.label} value={u.label}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* No MW warning */}
            {mwNum === 0 && (
              <p className="mt-3 text-xs" style={{ color: "#888" }}>
                ⚠ Select a compound or enter a custom MW above to see results.
              </p>
            )}
          </div>

          {/* Results */}
          {mwNum > 0 && (Object.keys(activeResults).length > 0) && (
            <div
              className="rounded-sm p-6"
              style={{ backgroundColor: "#0D0D0B", border: "1px solid #2A2A28" }}
            >
              <h2 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
                Results
              </h2>

              {/* Primary result (highlighted) */}
              {mode === "molar-to-mass" ? (
                <div className="mb-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["mg/mL", "μg/mL", "ng/mL"].map((u) => (
                    <div
                      key={u}
                      className="px-4 py-4 rounded-sm text-center"
                      style={{
                        backgroundColor: u === "mg/mL" ? "#141412" : "#0A0A09",
                        border: "1px solid " + (u === "mg/mL" ? "#C9A84C" : "#1E1E1C"),
                      }}
                    >
                      <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#666" }}>
                        {u}
                      </div>
                      <div
                        className="text-2xl font-light"
                        style={{ color: u === "mg/mL" ? "#C9A84C" : "#F9F9F9" }}
                      >
                        {formatNumber(activeResults[u] ?? 0)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["μM", "nM", "mM"].map((u) => (
                    <div
                      key={u}
                      className="px-4 py-4 rounded-sm text-center"
                      style={{
                        backgroundColor: u === "μM" ? "#141412" : "#0A0A09",
                        border: "1px solid " + (u === "μM" ? "#C9A84C" : "#1E1E1C"),
                      }}
                    >
                      <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#666" }}>
                        {u}
                      </div>
                      <div
                        className="text-2xl font-light"
                        style={{ color: u === "μM" ? "#C9A84C" : "#F9F9F9" }}
                      >
                        {formatNumber(activeResults[u] ?? 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Full conversion table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1E1E1C" }}>
                      <th className="text-left py-2 text-xs uppercase tracking-widest" style={{ color: "#666" }}>Unit</th>
                      <th className="text-right py-2 text-xs uppercase tracking-widest" style={{ color: "#666" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(activeResults).map(([unit, val]) => (
                      <tr key={unit} style={{ borderBottom: "1px solid #111" }}>
                        <td className="py-2" style={{ color: "#A0A0A0" }}>{unit}</td>
                        <td className="py-2 text-right font-mono text-xs" style={{ color: "#F9F9F9" }}>
                          {formatNumber(val)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Typical assay concentration note */}
              {selectedCompound?.typicalAssayConc && (
                <div
                  className="mt-5 px-4 py-3 rounded-sm"
                  style={{ backgroundColor: "#141412", border: "1px solid #2A2A28" }}
                >
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888" }}>
                    Published Assay Reference
                  </p>
                  <p className="text-sm" style={{ color: "#C9A84C" }}>
                    {selectedCompound.typicalAssayConc.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#777" }}>
                    {selectedCompound.typicalAssayConc.context}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Rodent dose converter */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-2" style={{ color: "#C9DD69" }}>
              Rodent Dose → Molar Amount
            </h2>
            <p className="text-xs mb-5" style={{ color: "#666" }}>
              Useful for in vitro planning: given an in vivo dose, calculate the absolute molar amount injected.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                  Animal Weight (g)
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {[["Mouse 25g", "25"], ["Mouse 30g", "30"], ["Rat 250g", "250"], ["Rat 350g", "350"]].map(
                    ([label, val]) => (
                      <button
                        key={val}
                        onClick={() => setAnimalWeight(val)}
                        className="text-xs px-2 py-1 rounded-sm"
                        style={{
                          backgroundColor: animalWeight === val ? "#C9A84C" : "#1A1A18",
                          color: animalWeight === val ? "#010101" : "#888",
                          border: "1px solid " + (animalWeight === val ? "#C9A84C" : "#2A2A28"),
                        }}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
                <input
                  type="number"
                  value={animalWeight}
                  onChange={(e) => setAnimalWeight(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-sm"
                  style={{
                    backgroundColor: "#1A1A18",
                    border: "1px solid #2A2A28",
                    color: "#F9F9F9",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "#666" }}>
                  Dose (μg/kg)
                </label>
                <input
                  type="number"
                  value={doseMcgKg}
                  onChange={(e) => setDoseMcgKg(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-sm"
                  style={{
                    backgroundColor: "#1A1A18",
                    border: "1px solid #2A2A28",
                    color: "#F9F9F9",
                    outline: "none",
                  }}
                  placeholder="e.g. 10"
                />
                <p className="text-xs mt-2" style={{ color: "#555" }}>
                  BPC-157 typical: 10 μg/kg · Ipamorelin: 100 mcg/kg
                </p>
              </div>
            </div>

            {mwNum > 0 && animalWeightNum > 0 && doseMcgKgNum > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="px-4 py-4 rounded-sm text-center"
                  style={{ backgroundColor: "#141412", border: "1px solid #2A2A28" }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#666" }}>Absolute Dose</div>
                  <div className="text-xl font-light" style={{ color: "#C9A84C" }}>
                    {formatNumber(absoluteDoseMcg)} μg
                  </div>
                </div>
                <div
                  className="px-4 py-4 rounded-sm text-center"
                  style={{ backgroundColor: "#0A0A09", border: "1px solid #1E1E1C" }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#666" }}>nmol</div>
                  <div className="text-xl font-light" style={{ color: "#F9F9F9" }}>
                    {formatNumber(absoluteDoseNmol)}
                  </div>
                </div>
                <div
                  className="px-4 py-4 rounded-sm text-center"
                  style={{ backgroundColor: "#0A0A09", border: "1px solid #1E1E1C" }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#666" }}>pmol</div>
                  <div className="text-xl font-light" style={{ color: "#F9F9F9" }}>
                    {formatNumber(absoluteDosePmol)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compound MW Reference Table */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
              Compound MW Reference Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1E1E1C" }}>
                    <th className="text-left py-2 text-xs uppercase tracking-widest" style={{ color: "#666" }}>Compound</th>
                    <th className="text-left py-2 text-xs uppercase tracking-widest" style={{ color: "#666" }}>Category</th>
                    <th className="text-right py-2 text-xs uppercase tracking-widest" style={{ color: "#666" }}>MW (g/mol)</th>
                    <th className="text-right py-2 text-xs uppercase tracking-widest hidden md:table-cell" style={{ color: "#666" }}>CAS</th>
                    <th className="text-right py-2 text-xs uppercase tracking-widest hidden md:table-cell" style={{ color: "#666" }}>Typical Assay</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {COMPOUNDS.map((c) => (
                    <tr
                      key={c.slug}
                      style={{
                        borderBottom: "1px solid #111",
                        backgroundColor: selectedSlug === c.slug ? "#141412" : "transparent",
                      }}
                    >
                      <td className="py-2 pr-4" style={{ color: "#F9F9F9" }}>{c.name}</td>
                      <td className="py-2 pr-4">
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: "#1A1A18", color: "#A0A0A0" }}
                        >
                          {c.category}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono" style={{ color: "#C9A84C" }}>
                        {c.mw.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-xs hidden md:table-cell" style={{ color: "#666" }}>
                        {c.cas}
                      </td>
                      <td className="py-2 text-right text-xs hidden md:table-cell" style={{ color: "#888" }}>
                        {c.typicalAssayConc?.label ?? "—"}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => { setSelectedSlug(c.slug); setCustomMW(""); setCatFilter("All"); }}
                          className="text-xs px-2 py-1 rounded-sm"
                          style={{
                            backgroundColor: "#1A1A18",
                            color: "#C9A84C",
                            border: "1px solid #2A2A28",
                          }}
                        >
                          Use
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Research Context / FAQ */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
              Why Molar Concentration Matters
            </h2>
            <div className="space-y-4 text-sm" style={{ color: "#A0A0A0" }}>
              <div>
                <h3 className="font-medium mb-1" style={{ color: "#F9F9F9" }}>Cell culture & in vitro assays</h3>
                <p>Receptor binding EC₅₀ and Ki values are reported in molar units (nM/μM). When preparing peptide
                  solutions for cell culture, you must convert your stock mg/mL concentration to nM to know whether
                  you&apos;re working near, at, or above the EC₅₀. For example, semaglutide&apos;s GLP-1R EC₅₀ ≈ 0.06 nM —
                  a 1 mg/mL stock is ~243 μM, or ~4 million-fold above the EC₅₀.</p>
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: "#F9F9F9" }}>Comparing compounds of different MW</h3>
                <p>A &ldquo;10 μg/mL&rdquo; solution of BPC-157 (MW 1,420 g/mol) contains 7.04 μM, while 10 μg/mL of SS-31
                  (MW 641 g/mol) contains 15.6 μM — more than twice the molar concentration. Equimolar dosing
                  requires MW-adjusted preparation, not equivalent mg/kg dosing.</p>
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: "#F9F9F9" }}>Reporting in publications</h3>
                <p>Most peer-reviewed journals require molar units for dose-response curves and mechanistic studies.
                  Converting your working concentrations to nM/μM before submission is required — this tool
                  generates the exact values for your methods section.</p>
              </div>
            </div>
          </div>

          {/* Related tools */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#0D0D0B", border: "1px solid #1E1E1C" }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>
              Related Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { href: "/tools/reconstitution-calculator", label: "Reconstitution Calculator" },
                { href: "/tools/water-volume-calculator", label: "BAC Water Volume" },
                { href: "/tools/unit-converter", label: "Unit Converter" },
                { href: "/tools/body-weight-dose-calculator", label: "Body-Weight Dose" },
                { href: "/tools/allometric-scaling-calculator", label: "Allometric Scaling" },
                { href: "/tools/peptide-dose-response-planner", label: "Dose-Response Planner" },
              ].map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="px-3 py-3 rounded-sm text-xs transition-colors"
                  style={{
                    backgroundColor: "#141412",
                    color: "#C9A84C",
                    border: "1px solid #1E1E1C",
                    display: "block",
                  }}
                >
                  {t.label} →
                </Link>
              ))}
            </div>
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* RUO disclaimer */}
          <div
            className="rounded-sm px-5 py-4 text-xs"
            style={{ backgroundColor: "#0A0A09", border: "1px solid #1A1A18", color: "#666" }}
          >
            <span className="font-medium" style={{ color: "#888" }}>Research Use Only. </span>
            All calculations are for in vitro and preclinical research applications. Molecular weights sourced from
            published literature and may vary slightly by salt form or counterion. Verify MW against your lot-specific
            COA for precise calculation. Not intended for clinical use.
          </div>
        </div>
      </section>
    </div>
  );
}
