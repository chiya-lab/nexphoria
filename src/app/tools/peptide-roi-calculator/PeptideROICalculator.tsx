"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const CATALOG: { slug: string; name: string; sizeMg: number; price: number; category: string; doseMcgPerKg?: number; freqPerWeek?: number }[] = [
  // Recovery & Healing
  { slug: "bpc-157",            name: "BPC-157",                 sizeMg: 10,  price: 120,  category: "Recovery",   doseMcgPerKg: 10,   freqPerWeek: 7  },
  { slug: "tb-500",             name: "TB-500",                  sizeMg: 10,  price: 168,  category: "Recovery",   doseMcgPerKg: 150,  freqPerWeek: 3  },
  { slug: "ghk-cu",             name: "GHK-Cu",                  sizeMg: 100, price: 156,  category: "Recovery",   doseMcgPerKg: 200,  freqPerWeek: 5  },
  { slug: "ll-37",              name: "LL-37",                   sizeMg: 5,   price: 144,  category: "Recovery",   doseMcgPerKg: 100,  freqPerWeek: 5  },
  { slug: "aod-9604",           name: "AOD-9604",                sizeMg: 10,  price: 99,   category: "Metabolic",  doseMcgPerKg: 250,  freqPerWeek: 5  },
  // GH Axis
  { slug: "ipamorelin",         name: "Ipamorelin",              sizeMg: 10,  price: 168,  category: "GH Axis",    doseMcgPerKg: 100,  freqPerWeek: 21 },
  { slug: "cjc-1295-no-dac",    name: "CJC-1295 No DAC",         sizeMg: 5,   price: 120,  category: "GH Axis",    doseMcgPerKg: 100,  freqPerWeek: 21 },
  { slug: "cjc-1295",           name: "CJC-1295 (DAC)",          sizeMg: 5,   price: 120,  category: "GH Axis",    doseMcgPerKg: 1000, freqPerWeek: 1  },
  { slug: "cjc-1295-ipamorelin",name: "CJC-1295 / Ipamorelin",  sizeMg: 10,  price: 108,  category: "GH Axis",    doseMcgPerKg: 100,  freqPerWeek: 21 },
  { slug: "sermorelin",         name: "Sermorelin",              sizeMg: 10,  price: 168,  category: "GH Axis",    doseMcgPerKg: 100,  freqPerWeek: 7  },
  { slug: "tesamorelin",        name: "Tesamorelin",             sizeMg: 10,  price: 300,  category: "GH Axis",    doseMcgPerKg: 100,  freqPerWeek: 7  },
  { slug: "mk-677",             name: "MK-677 (Ibutamoren)",     sizeMg: 25,  price: 89,   category: "GH Axis",    doseMcgPerKg: 400,  freqPerWeek: 7  },
  // Metabolic / GLP-1
  { slug: "semaglutide",        name: "Semaglutide",             sizeMg: 5,   price: 120,  category: "Metabolic",  doseMcgPerKg: 100,  freqPerWeek: 1  },
  { slug: "tirzepatide",        name: "Tirzepatide",             sizeMg: 10,  price: 180,  category: "Metabolic",  doseMcgPerKg: 300,  freqPerWeek: 1  },
  { slug: "retatrutide",        name: "Retatrutide",             sizeMg: 10,  price: 300,  category: "Metabolic",  doseMcgPerKg: 300,  freqPerWeek: 1  },
  { slug: "mots-c",             name: "MOTS-c",                  sizeMg: 10,  price: 240,  category: "Metabolic",  doseMcgPerKg: 5000, freqPerWeek: 7  },
  // Longevity
  { slug: "epitalon",           name: "Epitalon",                sizeMg: 50,  price: 480,  category: "Longevity",  doseMcgPerKg: 40,   freqPerWeek: 7  },
  { slug: "nad-plus",           name: "NAD+",                    sizeMg: 100, price: 156,  category: "Longevity",  doseMcgPerKg: 500,  freqPerWeek: 7  },
  { slug: "ss-31",              name: "SS-31 (Elamipretide)",    sizeMg: 10,  price: 264,  category: "Longevity",  doseMcgPerKg: 120,  freqPerWeek: 7  },
  { slug: "thymosin-alpha-1",   name: "Thymosin Alpha-1",        sizeMg: 5,   price: 99,   category: "Immunology", doseMcgPerKg: 100,  freqPerWeek: 5  },
  // Nootropics
  { slug: "selank",             name: "Selank",                  sizeMg: 5,   price: 96,   category: "Nootropic",  doseMcgPerKg: 400,  freqPerWeek: 7  },
  { slug: "semax",              name: "Semax",                   sizeMg: 5,   price: 108,  category: "Nootropic",  doseMcgPerKg: 300,  freqPerWeek: 7  },
  { slug: "dsip",               name: "DSIP",                    sizeMg: 5,   price: 89,   category: "Nootropic",  doseMcgPerKg: 250,  freqPerWeek: 7  },
  { slug: "kpv",                name: "KPV",                     sizeMg: 10,  price: 79,   category: "Immunology", doseMcgPerKg: 100,  freqPerWeek: 7  },
  // Hormonal
  { slug: "pt-141",             name: "PT-141",                  sizeMg: 10,  price: 120,  category: "Hormonal",   doseMcgPerKg: 800,  freqPerWeek: 3  },
  { slug: "melanotan-ii",       name: "Melanotan-II",            sizeMg: 10,  price: 99,   category: "Hormonal",   doseMcgPerKg: 1600, freqPerWeek: 5  },
  { slug: "kisspeptin",         name: "Kisspeptin-10",           sizeMg: 5,   price: 120,  category: "Hormonal",   doseMcgPerKg: 10,   freqPerWeek: 7  },
  { slug: "oxytocin",           name: "Oxytocin",                sizeMg: 5,   price: 96,   category: "Hormonal",   doseMcgPerKg: 80,   freqPerWeek: 5  },
  // Blends
  { slug: "wolverine-blend",    name: "Wolverine Stack",         sizeMg: 10,  price: 219,  category: "Recovery",   doseMcgPerKg: 200,  freqPerWeek: 5  },
  { slug: "follistatin-344",    name: "Follistatin 344",         sizeMg: 1,   price: 420,  category: "Recovery",   doseMcgPerKg: 500,  freqPerWeek: 3  },
];

// Study type presets
type StudyType = {
  id: string;
  label: string;
  description: string;
  defaultSubjects: number;
  defaultGroups: number;
  defaultWeeks: number;
  defaultCompounds: string[];
  defaultBodyWeightG: number;
  defaultSpecies: string;
  defaultEndpoints: number;
  croPricePerAnimal: number; // commercial CRO estimate USD
};

const STUDY_TYPES: StudyType[] = [
  {
    id: "tendon-repair",
    label: "Tendon / Ligament Repair",
    description: "Achilles transection or MCL repair model in rodents",
    defaultSubjects: 8,
    defaultGroups: 4,
    defaultWeeks: 4,
    defaultCompounds: ["bpc-157", "tb-500"],
    defaultBodyWeightG: 350,
    defaultSpecies: "rat",
    defaultEndpoints: 5,
    croPricePerAnimal: 1200,
  },
  {
    id: "metabolic",
    label: "Metabolic / GLP-1 Research",
    description: "DIO C57BL/6J high-fat diet model",
    defaultSubjects: 10,
    defaultGroups: 5,
    defaultWeeks: 12,
    defaultCompounds: ["semaglutide", "tirzepatide"],
    defaultBodyWeightG: 40,
    defaultSpecies: "mouse",
    defaultEndpoints: 8,
    croPricePerAnimal: 800,
  },
  {
    id: "longevity",
    label: "Longevity / Anti-Aging",
    description: "Aged C57BL/6J multi-compound longevity stack",
    defaultSubjects: 10,
    defaultGroups: 4,
    defaultWeeks: 12,
    defaultCompounds: ["nad-plus", "epitalon", "ss-31"],
    defaultBodyWeightG: 30,
    defaultSpecies: "mouse",
    defaultEndpoints: 6,
    croPricePerAnimal: 1000,
  },
  {
    id: "cognitive",
    label: "Cognitive Enhancement",
    description: "Rodent behavioral assays + biomarker panels",
    defaultSubjects: 10,
    defaultGroups: 3,
    defaultWeeks: 6,
    defaultCompounds: ["semax", "selank"],
    defaultBodyWeightG: 30,
    defaultSpecies: "mouse",
    defaultEndpoints: 4,
    croPricePerAnimal: 950,
  },
  {
    id: "gh-axis",
    label: "GH Axis / Body Composition",
    description: "GH secretagogue pulse + IGF-1 / EchoMRI endpoints",
    defaultSubjects: 8,
    defaultGroups: 4,
    defaultWeeks: 12,
    defaultCompounds: ["ipamorelin", "cjc-1295-no-dac", "mk-677"],
    defaultBodyWeightG: 300,
    defaultSpecies: "rat",
    defaultEndpoints: 5,
    croPricePerAnimal: 900,
  },
  {
    id: "immune",
    label: "Immunology / Inflammation",
    description: "DSS colitis, TNBS, or immune senescence model",
    defaultSubjects: 8,
    defaultGroups: 4,
    defaultWeeks: 4,
    defaultCompounds: ["thymosin-alpha-1", "kpv"],
    defaultBodyWeightG: 25,
    defaultSpecies: "mouse",
    defaultEndpoints: 6,
    croPricePerAnimal: 850,
  },
];

// CRO overhead multipliers
const CRO_OVERHEAD = {
  housing:       { label: "Animal housing & husbandry",  perAnimalPerWeek: 45 },
  surgery:       { label: "Surgical procedures",         perAnimal: 350 },
  assays:        { label: "Laboratory assays",            perEndpointPerGroup: 380 },
  histology:     { label: "Histology & pathology",        perAnimal: 120 },
  statistician:  { label: "Statistical analysis",         flat: 1800 },
  projectMgmt:   { label: "Project management (15%)",     percent: 0.15 },
};

// Endpoint cost references
const ENDPOINT_COSTS: Record<string, number> = {
  "EchoMRI body composition": 120,
  "ELISA (IGF-1 / cytokines)": 250,
  "GTT / ITT": 180,
  "Histomorphometry (H&E / Masson)": 380,
  "Seahorse OCR/SRC": 550,
  "TRAP assay (telomerase)": 420,
  "Behavioral battery": 300,
  "DXA / microCT": 280,
  "qPCR gene expression panel": 320,
  "Flow cytometry panel": 480,
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

type SelectedCompound = {
  slug: string;
  customDoseMcgPerKg: string;
  customFreqPerWeek: string;
};

export default function PeptideROICalculator() {
  const [studyTypeId, setStudyTypeId] = useState<string>("tendon-repair");
  const [nPerGroup, setNPerGroup] = useState<string>("8");
  const [groups, setGroups] = useState<string>("4");
  const [weeks, setWeeks] = useState<string>("4");
  const [bodyWeightG, setBodyWeightG] = useState<string>("350");
  const [species, setSpecies] = useState<string>("rat");
  const [selectedCompounds, setSelectedCompounds] = useState<SelectedCompound[]>([
    { slug: "bpc-157", customDoseMcgPerKg: "", customFreqPerWeek: "" },
    { slug: "tb-500",  customDoseMcgPerKg: "", customFreqPerWeek: "" },
  ]);
  const [endpointsPerGroup, setEndpointsPerGroup] = useState<string>("5");
  const [showCRODetails, setShowCRODetails] = useState(false);
  const [includeVehicleControl, setIncludeVehicleControl] = useState(true);
  const [showEndpointBreakdown, setShowEndpointBreakdown] = useState(false);

  const studyType = STUDY_TYPES.find((s) => s.id === studyTypeId) ?? STUDY_TYPES[0];

  // Load study type preset
  const loadPreset = useCallback((typeId: string) => {
    const t = STUDY_TYPES.find((s) => s.id === typeId);
    if (!t) return;
    setStudyTypeId(typeId);
    setNPerGroup(String(t.defaultSubjects));
    setGroups(String(t.defaultGroups));
    setWeeks(String(t.defaultWeeks));
    setBodyWeightG(String(t.defaultBodyWeightG));
    setSpecies(t.defaultSpecies);
    setEndpointsPerGroup(String(t.defaultEndpoints));
    setSelectedCompounds(
      t.defaultCompounds.map((slug) => ({
        slug,
        customDoseMcgPerKg: "",
        customFreqPerWeek: "",
      }))
    );
  }, []);

  // Add compound
  const addCompound = () => {
    if (selectedCompounds.length >= 8) return;
    const existing = selectedCompounds.map((c) => c.slug);
    const next = CATALOG.find((c) => !existing.includes(c.slug));
    if (next) {
      setSelectedCompounds([...selectedCompounds, { slug: next.slug, customDoseMcgPerKg: "", customFreqPerWeek: "" }]);
    }
  };

  const removeCompound = (i: number) => {
    setSelectedCompounds(selectedCompounds.filter((_, idx) => idx !== i));
  };

  const updateCompound = (i: number, field: keyof SelectedCompound, value: string) => {
    const updated = [...selectedCompounds];
    updated[i] = { ...updated[i], [field]: value };
    setSelectedCompounds(updated);
  };

  // ─── CALCULATIONS ───
  const results = useMemo(() => {
    const n = Math.max(1, parseInt(nPerGroup) || 1);
    const g = Math.max(1, parseInt(groups) || 1);
    const w = Math.max(1, parseInt(weeks) || 1);
    const bwG = Math.max(1, parseFloat(bodyWeightG) || 25);
    const bwKg = bwG / 1000;
    const eps = Math.max(1, parseInt(endpointsPerGroup) || 1);

    const totalAnimals = n * g + (includeVehicleControl ? n : 0);
    const activeGroups = includeVehicleControl ? g + 1 : g;
    const studyDays = w * 7;

    // Per-compound cost
    const compoundRows = selectedCompounds.map((sc) => {
      const cat = CATALOG.find((c) => c.slug === sc.slug);
      if (!cat) return null;
      const doseMcgPerKg = parseFloat(sc.customDoseMcgPerKg) || cat.doseMcgPerKg || 100;
      const freqPerWeek = parseFloat(sc.customFreqPerWeek) || cat.freqPerWeek || 7;
      const totalDoses = freqPerWeek * w;
      const dosePerAnimalMcg = doseMcgPerKg * bwKg;
      const totalMcgPerAnimal = dosePerAnimalMcg * totalDoses;
      const totalMgPerAnimal = totalMcgPerAnimal / 1000;
      // Only active groups (not vehicle) receive compound
      const groupsReceiving = g; // vehicle group doesn't receive compound
      const totalAnimalsReceiving = n * groupsReceiving;
      const totalMgNeeded = totalMgPerAnimal * totalAnimalsReceiving;
      const wasteFactor = 1.2; // 20% overage
      const totalMgWithWaste = totalMgNeeded * wasteFactor;
      const vialsNeeded = Math.ceil(totalMgWithWaste / cat.sizeMg);
      const totalCost = vialsNeeded * cat.price;
      const pricePerMg = cat.price / cat.sizeMg;

      return {
        slug: sc.slug,
        name: cat.name,
        category: cat.category,
        sizeMg: cat.sizeMg,
        price: cat.price,
        doseMcgPerKg,
        freqPerWeek,
        totalDoses: Math.round(totalDoses),
        dosePerAnimalMcg: Math.round(dosePerAnimalMcg * 10) / 10,
        totalMgPerAnimal: Math.round(totalMgPerAnimal * 100) / 100,
        totalMgNeeded: Math.round(totalMgNeeded * 100) / 100,
        totalMgWithWaste: Math.round(totalMgWithWaste * 100) / 100,
        vialsNeeded,
        totalCost,
        pricePerMg: Math.round(pricePerMg * 100) / 100,
      };
    }).filter((r): r is NonNullable<typeof r> => r !== null);

    const totalCompoundCost = compoundRows.reduce((s, r) => s + r.totalCost, 0);

    // CRO estimates
    const housingCost  = CRO_OVERHEAD.housing.perAnimalPerWeek * totalAnimals * w;
    const surgeryCost  = ["tendon-repair", "gh-axis"].includes(studyTypeId)
      ? CRO_OVERHEAD.surgery.perAnimal * totalAnimals
      : 0;
    const assayCost    = CRO_OVERHEAD.assays.perEndpointPerGroup * eps * activeGroups;
    const histologyCost= CRO_OVERHEAD.histology.perAnimal * totalAnimals;
    const statCost     = CRO_OVERHEAD.statistician.flat;
    const subtotal     = housingCost + surgeryCost + assayCost + histologyCost + statCost + totalCompoundCost;
    const mgmtCost     = subtotal * CRO_OVERHEAD.projectMgmt.percent;
    const totalCROCost = subtotal + mgmtCost;

    // Per-animal CRO benchmark
    const croBenchmark = studyType.croPricePerAnimal * totalAnimals;

    // Cost ratios
    const costPerGroup    = totalCompoundCost / g;
    const costPerAnimal   = totalCompoundCost / totalAnimals;
    const costPerEndpoint = totalCompoundCost / (eps * activeGroups);
    const savings         = croBenchmark - totalCROCost;
    const savingsPct      = croBenchmark > 0 ? (savings / croBenchmark) * 100 : 0;

    return {
      n, g, w, bwG, bwKg, eps, totalAnimals, activeGroups, studyDays,
      compoundRows,
      totalCompoundCost,
      housingCost, surgeryCost, assayCost, histologyCost, statCost, mgmtCost, totalCROCost,
      croBenchmark,
      costPerGroup, costPerAnimal, costPerEndpoint,
      savings, savingsPct,
    };
  }, [selectedCompounds, nPerGroup, groups, weeks, bodyWeightG, endpointsPerGroup, includeVehicleControl, studyTypeId, studyType.croPricePerAnimal]);

  function fmt$(n: number, digits = 0) {
    return "$" + n.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function fmtN(n: number, d = 1) {
    return n.toFixed(d);
  }

  // Color based on pct
  const savingsColor = results.savingsPct > 0 ? "text-emerald-400" : "text-amber-400";

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Research ROI Calculator" },
        ]}
      />

      {/* ── Hero ── */}
      <div className="border-b border-white/10 py-14 px-6 text-center">
        <p className="eyebrow mb-3">Research Budget Planner</p>
        <h1 className="text-page-hero mb-4">Peptide Research ROI Calculator</h1>
        <p className="body-lg text-white/60 max-w-2xl mx-auto">
          Estimate total compound cost, cost per group, cost per endpoint, and compare vs commercial
          CRO pricing — ideal for grant budget planning and study design.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="text-[#C4A265]">✓</span> Pure client-side math
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C4A265]">✓</span> Live Nexphoria catalog pricing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C4A265]">✓</span> CRO benchmark comparison
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ── Study Type Presets ── */}
        <section>
          <h2 className="text-section-title mb-4">1. Select Study Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STUDY_TYPES.map((st) => (
              <button
                key={st.id}
                onClick={() => loadPreset(st.id)}
                className={`text-left p-4 rounded-lg border transition-all ${
                  studyTypeId === st.id
                    ? "border-[#C4A265] bg-[#C4A265]/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <p className="font-semibold text-sm mb-1">{st.label}</p>
                <p className="text-xs text-white/50 leading-snug">{st.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Study Parameters ── */}
        <section>
          <h2 className="text-section-title mb-4">2. Study Parameters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-white/5 border border-white/10 rounded-lg p-5">
            {/* n per group */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-white/60">Subjects / group</label>
              <input
                type="number"
                min="1" max="50"
                value={nPerGroup}
                onChange={(e) => setNPerGroup(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4A265] w-full"
              />
            </div>
            {/* groups */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-white/60">Treatment groups</label>
              <input
                type="number"
                min="1" max="10"
                value={groups}
                onChange={(e) => setGroups(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4A265] w-full"
              />
            </div>
            {/* weeks */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-white/60">Study duration (wks)</label>
              <input
                type="number"
                min="1" max="52"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4A265] w-full"
              />
            </div>
            {/* body weight */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-white/60">Body weight (g)</label>
              <input
                type="number"
                min="10" max="2000"
                value={bodyWeightG}
                onChange={(e) => setBodyWeightG(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4A265] w-full"
              />
            </div>
            {/* species */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-white/60">Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4A265] w-full"
              >
                <option value="mouse">Mouse</option>
                <option value="rat">Rat</option>
                <option value="rabbit">Rabbit</option>
                <option value="primate">Primate</option>
              </select>
            </div>
            {/* endpoints */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-white/60">Endpoints / group</label>
              <input
                type="number"
                min="1" max="20"
                value={endpointsPerGroup}
                onChange={(e) => setEndpointsPerGroup(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4A265] w-full"
              />
            </div>
          </div>
          {/* Vehicle control toggle */}
          <label className="mt-3 flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={includeVehicleControl}
              onChange={(e) => setIncludeVehicleControl(e.target.checked)}
              className="accent-[#C4A265] w-4 h-4"
            />
            Include vehicle control group (+ {nPerGroup} subjects, no compound cost)
          </label>
          <p className="mt-2 text-xs text-white/40">
            Total animals: <span className="text-white/70 font-medium">{results.totalAnimals}</span> &nbsp;·&nbsp;
            Study days: <span className="text-white/70 font-medium">{results.studyDays}</span>
          </p>
        </section>

        {/* ── Compounds ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section-title">3. Select Compounds</h2>
            <button
              onClick={addCompound}
              disabled={selectedCompounds.length >= 8}
              className="text-xs px-3 py-1.5 border border-[#C4A265] text-[#C4A265] rounded hover:bg-[#C4A265]/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add Compound
            </button>
          </div>
          <div className="space-y-3">
            {selectedCompounds.map((sc, i) => {
              const cat = CATALOG.find((c) => c.slug === sc.slug);
              return (
                <div key={i} className="flex flex-wrap items-end gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                  {/* Compound dropdown */}
                  <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                    <label className="label-sm text-white/50">Compound</label>
                    <select
                      value={sc.slug}
                      onChange={(e) => updateCompound(i, "slug", e.target.value)}
                      className="bg-[#1a1a1a] border border-white/20 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#C4A265]"
                    >
                      {CATALOG.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name} — {c.sizeMg}mg @ ${c.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Dose */}
                  <div className="flex flex-col gap-1 w-36">
                    <label className="label-sm text-white/50">Dose (mcg/kg)</label>
                    <input
                      type="number"
                      min="0.1"
                      placeholder={String(cat?.doseMcgPerKg ?? 100)}
                      value={sc.customDoseMcgPerKg}
                      onChange={(e) => updateCompound(i, "customDoseMcgPerKg", e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#C4A265]"
                    />
                  </div>
                  {/* Frequency */}
                  <div className="flex flex-col gap-1 w-32">
                    <label className="label-sm text-white/50">Inj / week</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      placeholder={String(cat?.freqPerWeek ?? 7)}
                      value={sc.customFreqPerWeek}
                      onChange={(e) => updateCompound(i, "customFreqPerWeek", e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#C4A265]"
                    />
                  </div>
                  {/* Vials / Cost preview */}
                  {(() => {
                    const row = results.compoundRows[i];
                    return row ? (
                      <div className="flex gap-4 text-xs text-white/60">
                        <span>{row.vialsNeeded} vials</span>
                        <span className="text-[#C4A265] font-semibold text-sm">${row.totalCost.toLocaleString()}</span>
                      </div>
                    ) : null;
                  })()}
                  {/* Remove */}
                  {selectedCompounds.length > 1 && (
                    <button
                      onClick={() => removeCompound(i)}
                      className="text-white/30 hover:text-red-400 text-lg leading-none pb-1"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-white/40">
            Doses auto-filled from published preclinical protocols. Override as needed.
            20% overage included for reconstitution waste.
          </p>
        </section>

        {/* ── Results ── */}
        <section>
          <h2 className="text-section-title mb-6">4. Cost Summary</h2>

          {/* Primary KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Compound Cost",  value: fmt$(results.totalCompoundCost),        sub: `${results.compoundRows.length} compound(s)` },
              { label: "Cost / Group",          value: fmt$(results.costPerGroup),              sub: `${results.g} treatment groups` },
              { label: "Cost / Animal",         value: fmt$(results.costPerAnimal, 2),          sub: `${results.totalAnimals} total subjects` },
              { label: "Cost / Endpoint",       value: fmt$(results.costPerEndpoint, 2),        sub: `${results.eps} endpoints × ${results.activeGroups} groups` },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4">
                <p className="text-xs text-white/50 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-[#C4A265]">{kpi.value}</p>
                <p className="text-xs text-white/40 mt-1">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Per-compound table */}
          <div className="overflow-x-auto rounded-lg border border-white/10 mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Compound</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Dose (mcg/kg)</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Total doses</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Total mg needed</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Vials</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {results.compoundRows.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-right text-white/70">{r.doseMcgPerKg}</td>
                    <td className="px-4 py-3 text-right text-white/70">{r.totalDoses}</td>
                    <td className="px-4 py-3 text-right text-white/70">{r.totalMgWithWaste} mg</td>
                    <td className="px-4 py-3 text-right text-white/70">{r.vialsNeeded}× {r.sizeMg}mg</td>
                    <td className="px-4 py-3 text-right text-[#C4A265] font-semibold">${r.totalCost.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-white/5">
                  <td colSpan={5} className="px-4 py-3 font-semibold">Total compound cost</td>
                  <td className="px-4 py-3 text-right font-bold text-[#C4A265] text-base">{fmt$(results.totalCompoundCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CRO comparison */}
          <div className="bg-[#111] border border-white/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-base">vs. Commercial CRO Pricing</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Industry benchmark for a {studyType.label.toLowerCase()} study in {species}
                </p>
              </div>
              <button
                onClick={() => setShowCRODetails(!showCRODetails)}
                className="text-xs text-[#C4A265] hover:underline"
              >
                {showCRODetails ? "Hide details ▲" : "Show breakdown ▼"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/5 rounded p-4">
                <p className="text-xs text-white/50 mb-1">Your cost (compounds only)</p>
                <p className="text-2xl font-bold">{fmt$(results.totalCompoundCost)}</p>
              </div>
              <div className="bg-white/5 rounded p-4">
                <p className="text-xs text-white/50 mb-1">Fully-loaded in-house estimate</p>
                <p className="text-2xl font-bold">{fmt$(results.totalCROCost)}</p>
                <p className="text-xs text-white/40 mt-1">Compounds + housing + assays + stats</p>
              </div>
              <div className="bg-[#C4A265]/10 border border-[#C4A265]/30 rounded p-4">
                <p className="text-xs text-white/50 mb-1">CRO benchmark estimate</p>
                <p className="text-2xl font-bold text-[#C4A265]">{fmt$(results.croBenchmark)}</p>
                <p className={`text-xs mt-1 ${savingsColor}`}>
                  {results.savings > 0
                    ? `~${fmtN(results.savingsPct, 0)}% savings vs CRO`
                    : `In-house costs may exceed CRO for this study size`}
                </p>
              </div>
            </div>

            {showCRODetails && (
              <div className="overflow-x-auto rounded border border-white/10 mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-4 py-2 text-white/60 font-medium">Cost Component</th>
                      <th className="text-right px-4 py-2 text-white/60 font-medium">Estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Compound cost", fmt$(results.totalCompoundCost)],
                      ["Animal housing & husbandry", fmt$(results.housingCost)],
                      ...(results.surgeryCost > 0 ? [["Surgical procedures", fmt$(results.surgeryCost)]] : []),
                      ["Laboratory assays", fmt$(results.assayCost)],
                      ["Histology & pathology", fmt$(results.histologyCost)],
                      ["Statistical analysis", fmt$(results.statCost)],
                      ["Project management (15%)", fmt$(results.mgmtCost)],
                    ].map(([label, val], i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-4 py-2.5 text-white/70">{label}</td>
                        <td className="px-4 py-2.5 text-right text-white/80">{val}</td>
                      </tr>
                    ))}
                    <tr className="bg-white/5 font-semibold">
                      <td className="px-4 py-3">Total in-house estimate</td>
                      <td className="px-4 py-3 text-right text-[#C4A265]">{fmt$(results.totalCROCost)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-white/30 p-3">
                  CRO estimates based on published industry benchmarks (2024–2025 averages). Actual costs vary by institution,
                  region, IACUC protocol, and vendor. These figures are for budgeting reference only.
                </p>
              </div>
            )}
          </div>

          {/* Endpoint cost reference */}
          <div>
            <button
              onClick={() => setShowEndpointBreakdown(!showEndpointBreakdown)}
              className="text-sm text-white/60 hover:text-white mb-3 flex items-center gap-2"
            >
              <span className="text-[#C4A265]">{showEndpointBreakdown ? "▲" : "▼"}</span>
              Endpoint Cost Reference (click to expand)
            </button>
            {showEndpointBreakdown && (
              <div className="overflow-x-auto rounded border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-4 py-2.5 text-white/60 font-medium">Endpoint / Assay</th>
                      <th className="text-right px-4 py-2.5 text-white/60 font-medium">Approx. Cost / Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(ENDPOINT_COSTS).map(([ep, cost]) => (
                      <tr key={ep} className="border-b border-white/5">
                        <td className="px-4 py-2.5 text-white/70">{ep}</td>
                        <td className="px-4 py-2.5 text-right text-white/70">${cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-white/30 p-3">
                  Based on published institutional core facility rates (2024–2025). Commercial CROs may charge 2–4× higher.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Grant Writing Notes ── */}
        <section className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6">
          <h2 className="font-semibold text-base mb-4">Grant Budget Planning Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/60">
            <div>
              <p className="font-medium text-white/80 mb-1">NIH Budget Categories</p>
              <ul className="space-y-1">
                <li>• Compound costs → <span className="text-white/70">Supplies & Materials (F&A applicable)</span></li>
                <li>• Animal housing → <span className="text-white/70">Animal care costs (F&A applicable)</span></li>
                <li>• Core facility assays → <span className="text-white/70">Other Direct Costs</span></li>
                <li>• Statistic consultants → <span className="text-white/70">Consultants line</span></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white/80 mb-1">Best Practices</p>
              <ul className="space-y-1">
                <li>• Add 10–20% supply overage for pilot failures</li>
                <li>• Include 1 extra vial per compound for QC</li>
                <li>• Budget for 2 independent experiment replications</li>
                <li>• IACUC approval fees: $500–$2,000 per protocol</li>
                <li>• F&A (indirect costs): typically 26–65% on direct</li>
              </ul>
            </div>
          </div>
          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded text-xs text-amber-300/70">
            <strong>Research Use Only Disclaimer:</strong> All calculations are for research budget planning purposes only.
            Nexphoria compounds are sold for in vitro and animal research use only, not for human use.
            Verify all dosing protocols against current published literature before use.
          </div>
        </section>

        {/* ── Related Tools ── */}
        <section>
          <h2 className="text-section-title mb-4">Related Research Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/tools/body-weight-dose-calculator",   label: "Body-Weight Dose Calculator",   desc: "Convert mg/kg to absolute doses for your species and weight" },
              { href: "/tools/protocol-template-generator",   label: "Protocol Template Generator",   desc: "Generate a printable study protocol document" },
              { href: "/tools/cost-per-dose-calculator",      label: "Cost Per Dose Calculator",       desc: "Calculate cost per injection, weekly and monthly totals" },
              { href: "/tools/reconstitution-calculator",     label: "Reconstitution Calculator",      desc: "BAC water volume, concentration, doses per vial" },
              { href: "/tools/peptide-dose-response-planner", label: "Dose-Response Planner",          desc: "Log-spaced dose groups + power calculations" },
              { href: "/tools/stack-builder",                 label: "Stack Builder",                  desc: "Pre-built research stacks with mechanistic rationale" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#C4A265]/50 hover:bg-[#C4A265]/5 transition-all"
              >
                <p className="font-medium text-sm mb-1">{t.label}</p>
                <p className="text-xs text-white/50">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
