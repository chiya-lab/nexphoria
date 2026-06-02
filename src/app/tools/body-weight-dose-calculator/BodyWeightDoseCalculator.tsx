"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Compound database with published rodent study dosing ────────────────────
interface CompoundDose {
  slug: string;
  name: string;
  category: string;
  unit: "mcg/kg" | "mg/kg";
  typicalDose: number;        // typical single dose in that unit
  doseRange: [number, number]; // [low, high]
  frequency: string;
  route: string;
  reference: string;
  notes: string;
}

const COMPOUND_DATABASE: CompoundDose[] = [
  // Recovery & Healing
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Recovery & Healing",
    unit: "mcg/kg",
    typicalDose: 10,
    doseRange: [2, 10],
    frequency: "Once daily",
    route: "IP or SC",
    reference: "Sikiric et al. 2010; Sebecic et al. 1999",
    notes: "Effective across wide dose range (2–10 mcg/kg). IP and SC both well-validated in rodent models.",
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    category: "Recovery & Healing",
    unit: "mg/kg",
    typicalDose: 2,
    doseRange: [1, 6],
    frequency: "2× per week or daily",
    route: "IP or SC",
    reference: "Philp et al. 2004; Bock-Marquette et al. 2004",
    notes: "Higher doses (4–6 mg/kg) used in cardiac I/R models; lower doses (1–2 mg/kg) for musculoskeletal repair.",
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    category: "Recovery & Healing",
    unit: "mg/kg",
    typicalDose: 1,
    doseRange: [0.5, 3],
    frequency: "Once daily",
    route: "SC or topical",
    reference: "Pickart 1973; Leyden et al. 1994",
    notes: "SC injection or topical. Copper content is ~15% by weight; monitor if using high-frequency dosing.",
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "Recovery & Healing",
    unit: "mcg/kg",
    typicalDose: 500,
    doseRange: [100, 1000],
    frequency: "Once daily",
    route: "SC or IP",
    reference: "Heffernan et al. 1999; Ng et al. 2000",
    notes: "Dose-response non-linearity observed — 500 mcg/kg optimal in DIO models; higher doses may be less effective.",
  },

  // GH Axis
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "GH Axis",
    unit: "mcg/kg",
    typicalDose: 100,
    doseRange: [50, 300],
    frequency: "Once to 3× daily",
    route: "SC or IV",
    reference: "Johansen et al. 1999; Raun et al. 1998",
    notes: "Pulsatile administration (3× daily) maximizes GH axis response. No cortisol/prolactin elevation.",
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 No DAC (Mod GRF 1-29)",
    category: "GH Axis",
    unit: "mcg/kg",
    typicalDose: 100,
    doseRange: [30, 200],
    frequency: "Pulsatile, 2–3× daily",
    route: "SC",
    reference: "Thorner et al. 1997; Walker et al. 1995",
    notes: "~30-min half-life; administer immediately before expected GH pulse window.",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "GH Axis",
    unit: "mcg/kg",
    typicalDose: 30,
    doseRange: [10, 100],
    frequency: "Once daily (nocturnal)",
    route: "SC",
    reference: "Vittone et al. 1997; Sigalos & Pastuszak 2018",
    notes: "~11-min half-life; administer nocturnally to align with endogenous GH pulse.",
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "GH Axis",
    unit: "mcg/kg",
    typicalDose: 200,
    doseRange: [100, 300],
    frequency: "Once daily",
    route: "SC",
    reference: "Stanley et al. 2009; Lo et al. 2010",
    notes: "Full-length GHRH analog; ~26-min half-life. Female rodents may show lower IGF-1 response.",
  },
  {
    slug: "mk-677",
    name: "MK-677 (Ibutamoren)",
    category: "GH Axis",
    unit: "mg/kg",
    typicalDose: 10,
    doseRange: [5, 30],
    frequency: "Once daily (oral)",
    route: "Oral gavage",
    reference: "Nass et al. 2008; Chapman et al. 1996",
    notes: "Oral bioavailability ~5-7%. 24-hour half-life enables once-daily oral dosing. Monitor glucose/insulin.",
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    category: "GH Axis",
    unit: "mcg/kg",
    typicalDose: 80,
    doseRange: [40, 160],
    frequency: "2–3× daily",
    route: "SC or IV",
    reference: "Ghigo et al. 1994; Torsello et al. 2003",
    notes: "Highest GH-releasing potency among GHRPs; tachyphylaxis at 4 weeks. Cardiac protective via CD36.",
  },

  // Metabolic / GLP-1
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "Metabolic",
    unit: "mcg/kg",
    typicalDose: 30,
    doseRange: [3, 100],
    frequency: "Once weekly",
    route: "SC",
    reference: "O'Neil et al. 2018 (SCALE); Wilding et al. 2021 (STEP-1)",
    notes: "Mice: 30–100 mcg/kg/week; rats: 10–30 mcg/kg/week. Use pair-fed controls in metabolic studies.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "Metabolic",
    unit: "mcg/kg",
    typicalDose: 30,
    doseRange: [3, 100],
    frequency: "Once weekly",
    route: "SC",
    reference: "Jastreboff et al. 2022 (SURMOUNT-1); Min et al. 2021",
    notes: "Dual GLP-1R/GIPR agonist. Start low (3–10 mcg/kg) and escalate to minimize nausea/emesis.",
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "Metabolic",
    unit: "mcg/kg",
    typicalDose: 30,
    doseRange: [3, 100],
    frequency: "Once weekly",
    route: "SC",
    reference: "Jastreboff et al. 2023 (NEJM Phase 2)",
    notes: "Triple GLP-1R/GIPR/GCGR agonist. Escalation protocol critical; pair-fed + DEXA endpoints recommended.",
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Metabolic",
    unit: "mg/kg",
    typicalDose: 5,
    doseRange: [0.5, 15],
    frequency: "Once daily or 3× per week",
    route: "IP",
    reference: "Lee et al. 2015 (Cell Metabolism); Young et al. 2021",
    notes: "IP preferred for acute studies. Age-dependent effects observed — include young vs aged comparison groups.",
  },

  // Longevity
  {
    slug: "epitalon",
    name: "Epitalon",
    category: "Longevity",
    unit: "mcg/kg",
    typicalDose: 50,
    doseRange: [10, 200],
    frequency: "Once daily (10–20 day cycles)",
    route: "IP or SC",
    reference: "Khavinson et al. 2003; Anisimov et al. 2003",
    notes: "Typically dosed in cyclic protocols (10-day on, rest). Telomerase activation endpoint requires ≥14-day exposure.",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Longevity",
    unit: "mg/kg",
    typicalDose: 500,
    doseRange: [100, 1000],
    frequency: "Once daily",
    route: "IP or IV",
    reference: "Gomes et al. 2013 (Cell); Canto et al. 2012",
    notes: "IP injection preferred in mice; IV for acute studies. NR/NMN precursors may have different optimal doses.",
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "Longevity",
    unit: "mg/kg",
    typicalDose: 3,
    doseRange: [0.1, 10],
    frequency: "Once daily (chronic) or acute IV (I/R)",
    route: "SC (chronic) or IV (acute)",
    reference: "Szeto 2008 (Biochim Biophys Acta); Siegel et al. 2013",
    notes: "Cardiac I/R: 1–3 mg/kg IV given as preconditioning. Aging studies: 3 mg/kg SC daily for 8+ weeks.",
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1 (Tα1)",
    category: "Longevity",
    unit: "mg/kg",
    typicalDose: 1,
    doseRange: [0.5, 5],
    frequency: "2× weekly",
    route: "SC or IP",
    reference: "Goldstein et al. 1981; Li et al. 2017",
    notes: "Immunostimulatory effects dose-dependent; 1–2 mg/kg 2×/week standard in murine immune studies.",
  },

  // Nootropics / Neuro
  {
    slug: "selank",
    name: "Selank",
    category: "Nootropics",
    unit: "mcg/kg",
    typicalDose: 300,
    doseRange: [100, 1000],
    frequency: "Once daily",
    route: "IP or intranasal",
    reference: "Kozlovskaya et al. 2002; Semenova et al. 2010",
    notes: "Intranasal bioavailability significantly higher than IP in rodents; 200–300 mcg/kg IP equivalent to ~100 mcg/kg IN.",
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Nootropics",
    unit: "mcg/kg",
    typicalDose: 100,
    doseRange: [50, 500],
    frequency: "Once daily",
    route: "IP or intranasal",
    reference: "Dolotov et al. 2006; Agapova et al. 2007",
    notes: "BDNF + VEGF upregulation primary endpoints. Ischemia models: 250–500 mcg/kg IP pre-treatment.",
  },
  {
    slug: "dsip",
    name: "DSIP",
    category: "Nootropics",
    unit: "mcg/kg",
    typicalDose: 30,
    doseRange: [10, 100],
    frequency: "Once daily (evening)",
    route: "ICV or IP",
    reference: "Monnier et al. 1977; Graf & Kastin 1986",
    notes: "ICV at 10–30 mcg/kg produces strongest delta-wave potentiation; IP requires 3–5× higher dose.",
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Nootropics",
    unit: "mcg/kg",
    typicalDose: 100,
    doseRange: [50, 200],
    frequency: "Once daily",
    route: "IP, oral, or topical",
    reference: "Dalmasso et al. 2008; Mandal et al. 2009",
    notes: "DSS colitis model: 100 mcg/kg/day oral effective. IP dosing for systemic inflammatory endpoints.",
  },

  // Hormonal / Reproductive
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Hormonal",
    unit: "mcg/kg",
    typicalDose: 100,
    doseRange: [50, 200],
    frequency: "Per experiment",
    route: "SC or IP",
    reference: "Pfaus et al. 2004; Diamond et al. 2004",
    notes: "SC dosing standard. Monitor blood pressure. Sexual behavior endpoints require ≥20-min observation window.",
  },
  {
    slug: "melanotan-ii",
    name: "Melanotan-II",
    category: "Hormonal",
    unit: "mcg/kg",
    typicalDose: 80,
    doseRange: [40, 200],
    frequency: "Per experiment",
    route: "SC or ICV",
    reference: "Dorr et al. 1998; Erskine & Hanagan 1997",
    notes: "PVN ICV at 0.5–2 nmol produces arousal effects. SC 80–160 mcg/kg for melanogenesis/systemic studies.",
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin-10",
    category: "Hormonal",
    unit: "mcg/kg",
    typicalDose: 200,
    doseRange: [50, 1000],
    frequency: "Per experiment (pulsatile)",
    route: "IV or IP",
    reference: "Dhillo et al. 2005 (JCEM); Abbara et al. 2017",
    notes: "IV infusion for LH surge studies (50–200 mcg/kg). Pulsatile IP: 200–1000 mcg/kg every 30–60 min.",
  },
  {
    slug: "oxytocin",
    name: "Oxytocin",
    category: "Hormonal",
    unit: "mcg/kg",
    typicalDose: 1,
    doseRange: [0.1, 10],
    frequency: "Per experiment",
    route: "IP or intranasal",
    reference: "Donaldson & Young 2008; Modi et al. 2014",
    notes: "Intranasal olfactory transport: 1 IU/kg ≈ 3 mcg/kg. IP requires higher dose; monitor social context.",
  },
];

// ─── Subject presets ──────────────────────────────────────────────────────────
const SUBJECT_PRESETS = [
  { label: "Mouse (25 g)", weight: 25, unit: "g", species: "Mouse" },
  { label: "Mouse (30 g)", weight: 30, unit: "g", species: "Mouse" },
  { label: "Rat (250 g)", weight: 250, unit: "g", species: "Rat" },
  { label: "Rat (350 g)", weight: 350, unit: "g", species: "Rat" },
  { label: "Rat (500 g)", weight: 500, unit: "g", species: "Rat" },
];

// Category order
const CATEGORY_ORDER = [
  "Recovery & Healing",
  "GH Axis",
  "Metabolic",
  "Longevity",
  "Nootropics",
  "Hormonal",
];

// ─── Category color map ────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Recovery & Healing": "#6db33f",
  "GH Axis": "#3b82f6",
  "Metabolic": "#f59e0b",
  "Longevity": "#8b5cf6",
  "Nootropics": "#06b6d4",
  "Hormonal": "#ec4899",
};

export default function BodyWeightDoseCalculator() {
  // ── Mode: "forward" = weight × mg/kg → absolute; "reverse" = absolute → mg/kg
  const [mode, setMode] = useState<"forward" | "reverse">("forward");

  // Forward inputs
  const [selectedCompound, setSelectedCompound] = useState<string>("bpc-157");
  const [useCustom, setUseCustom] = useState(false);
  const [customDoseValue, setCustomDoseValue] = useState<string>("10");
  const [customDoseUnit, setCustomDoseUnit] = useState<"mcg/kg" | "mg/kg">("mcg/kg");
  const [weightValue, setWeightValue] = useState<string>("25");
  const [weightUnit, setWeightUnit] = useState<"g" | "kg">("g");

  // Reverse inputs
  const [absoluteDoseMcg, setAbsoluteDoseMcg] = useState<string>("250");
  const [revWeightValue, setRevWeightValue] = useState<string>("25");
  const [revWeightUnit, setRevWeightUnit] = useState<"g" | "kg">("g");

  // ── Derived compound data
  const compound = useMemo(
    () => COMPOUND_DATABASE.find((c) => c.slug === selectedCompound),
    [selectedCompound]
  );

  // ── Forward calculation ───────────────────────────────────────────────────
  const forwardResult = useMemo(() => {
    const dose = useCustom
      ? { unit: customDoseUnit, value: parseFloat(customDoseValue) }
      : compound
        ? { unit: compound.unit, value: compound.typicalDose }
        : null;
    if (!dose) return null;

    const weightKg =
      weightUnit === "g"
        ? parseFloat(weightValue) / 1000
        : parseFloat(weightValue);
    if (isNaN(weightKg) || weightKg <= 0) return null;
    if (isNaN(dose.value) || dose.value <= 0) return null;

    // Convert dose to both mcg and mg
    const dosePerKg_mcg =
      dose.unit === "mcg/kg" ? dose.value : dose.value * 1000;
    const dosePerKg_mg =
      dose.unit === "mg/kg" ? dose.value : dose.value / 1000;

    const absoluteMcg = dosePerKg_mcg * weightKg;
    const absoluteMg = dosePerKg_mg * weightKg;
    const absoluteUg = absoluteMcg; // alias

    // Syringe volume at common concentrations
    const concentrations = [
      { label: "0.1 mg/mL (100 mcg/mL)", concMgPerMl: 0.1 },
      { label: "0.5 mg/mL (500 mcg/mL)", concMgPerMl: 0.5 },
      { label: "1 mg/mL", concMgPerMl: 1 },
      { label: "2 mg/mL", concMgPerMl: 2 },
      { label: "5 mg/mL", concMgPerMl: 5 },
    ];

    const volumes = concentrations.map((c) => ({
      label: c.label,
      volumeMl: absoluteMg / c.concMgPerMl,
      units100: (absoluteMg / c.concMgPerMl) * 1000, // units on 100U/mL syringe
    }));

    return {
      absoluteMcg,
      absoluteMg,
      absoluteUg,
      weightKg,
      volumes,
      dosePerKg_mcg,
      dosePerKg_mg,
    };
  }, [compound, useCustom, customDoseUnit, customDoseValue, weightValue, weightUnit]);

  // ── Range results (low/high) for selected compound ─────────────────────────
  const rangeResults = useMemo(() => {
    if (!compound || useCustom) return null;
    const weightKg =
      weightUnit === "g"
        ? parseFloat(weightValue) / 1000
        : parseFloat(weightValue);
    if (isNaN(weightKg) || weightKg <= 0) return null;

    const toMcg = (v: number, u: "mcg/kg" | "mg/kg") =>
      u === "mcg/kg" ? v : v * 1000;

    return {
      low: toMcg(compound.doseRange[0], compound.unit) * weightKg,
      high: toMcg(compound.doseRange[1], compound.unit) * weightKg,
    };
  }, [compound, useCustom, weightValue, weightUnit]);

  // ── Reverse calculation ───────────────────────────────────────────────────
  const reverseResult = useMemo(() => {
    const absoluteMcg = parseFloat(absoluteDoseMcg);
    const weightKg =
      revWeightUnit === "g"
        ? parseFloat(revWeightValue) / 1000
        : parseFloat(revWeightValue);
    if (isNaN(absoluteMcg) || absoluteMcg <= 0) return null;
    if (isNaN(weightKg) || weightKg <= 0) return null;

    const mcgPerKg = absoluteMcg / weightKg;
    const mgPerKg = mcgPerKg / 1000;

    return { mcgPerKg, mgPerKg };
  }, [absoluteDoseMcg, revWeightValue, revWeightUnit]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const applyPreset = useCallback(
    (preset: (typeof SUBJECT_PRESETS)[number]) => {
      if (mode === "forward") {
        setWeightValue(preset.weight.toString());
        setWeightUnit(preset.unit as "g" | "kg");
      } else {
        setRevWeightValue(preset.weight.toString());
        setRevWeightUnit(preset.unit as "g" | "kg");
      }
    },
    [mode]
  );

  const fmtNum = (n: number, decimals = 2) => {
    if (n < 0.001) return n.toExponential(2);
    if (n >= 10000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (n >= 100) return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
    return n.toFixed(decimals);
  };

  const groupedCompounds = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      compounds: COMPOUND_DATABASE.filter((c) => c.category === cat),
    }));
  }, []);

  const catColor = (cat: string) => CATEGORY_COLORS[cat] ?? "#B8A44C";

  const inputStyle = {
    backgroundColor: "#18181a",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#F9F9F9",
    borderRadius: 4,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#A0A0A0",
    marginBottom: 6,
    display: "block",
  };

  const resultCardStyle = (accent?: string) => ({
    backgroundColor: "#1a1a1c",
    border: `1px solid ${accent ? accent + "40" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 6,
    padding: "16px 20px",
  });

  return (
    <div style={{ backgroundColor: "#0a0a0c", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section
        className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20"
        style={{ backgroundColor: "#010101", borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Research Tools", href: "/tools" },
              { label: "Body Weight Dose Calculator" },
            ]}
          />
          <p
            className="text-xs uppercase tracking-widest mb-5"
            style={{ color: "#C9DD69" }}
          >
            Research Tools
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Body Weight Dose Calculator
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Convert rodent study dosing protocols (mg/kg, mcg/kg) to absolute doses for any subject
            weight — or flip to calculate what mg/kg a given absolute dose represents.
            Pre-populated with published preclinical dosing data for 30+ research compounds.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mode switcher */}
          <div className="flex gap-2">
            {(["forward", "reverse"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-4 py-2 rounded-sm text-sm font-medium transition-all"
                style={{
                  backgroundColor: mode === m ? "#d4af37" : "#1a1a1c",
                  color: mode === m ? "#000" : "#A0A0A0",
                  border: `1px solid ${mode === m ? "#d4af37" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {m === "forward"
                  ? "mg/kg → Absolute Dose"
                  : "Absolute → mg/kg"}
              </button>
            ))}
          </div>

          {mode === "forward" ? (
            /* ─── FORWARD MODE ─────────────────────────────────────────────── */
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Inputs */}
              <div className="space-y-5">
                {/* Compound selector */}
                <div>
                  <label style={labelStyle}>Compound</label>
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setUseCustom(false)}
                      className="text-xs px-3 py-1.5 rounded-sm transition-all"
                      style={{
                        backgroundColor: !useCustom ? "#d4af37" : "#18181a",
                        color: !useCustom ? "#000" : "#A0A0A0",
                        border: `1px solid ${!useCustom ? "#d4af37" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      From Catalog
                    </button>
                    <button
                      onClick={() => setUseCustom(true)}
                      className="text-xs px-3 py-1.5 rounded-sm transition-all"
                      style={{
                        backgroundColor: useCustom ? "#d4af37" : "#18181a",
                        color: useCustom ? "#000" : "#A0A0A0",
                        border: `1px solid ${useCustom ? "#d4af37" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      Custom
                    </button>
                  </div>

                  {!useCustom ? (
                    <select
                      value={selectedCompound}
                      onChange={(e) => setSelectedCompound(e.target.value)}
                      style={inputStyle}
                    >
                      {groupedCompounds.map(({ category, compounds }) => (
                        <optgroup key={category} label={`── ${category} ──`}>
                          {compounds.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name} ({c.typicalDose} {c.unit})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={customDoseValue}
                        onChange={(e) => setCustomDoseValue(e.target.value)}
                        placeholder="Dose value"
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <select
                        value={customDoseUnit}
                        onChange={(e) =>
                          setCustomDoseUnit(e.target.value as "mcg/kg" | "mg/kg")
                        }
                        style={{ ...inputStyle, width: "auto", flex: 0 }}
                      >
                        <option value="mcg/kg">mcg/kg</option>
                        <option value="mg/kg">mg/kg</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Subject weight */}
                <div>
                  <label style={labelStyle}>Subject Weight</label>
                  {/* Quick presets */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {SUBJECT_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p)}
                        className="text-xs px-2.5 py-1 rounded-sm transition-all"
                        style={{
                          backgroundColor:
                            weightValue === p.weight.toString() &&
                            weightUnit === p.unit
                              ? "#d4af3730"
                              : "#1a1a1c",
                          color:
                            weightValue === p.weight.toString() &&
                            weightUnit === p.unit
                              ? "#d4af37"
                              : "#A0A0A0",
                          border: `1px solid ${
                            weightValue === p.weight.toString() &&
                            weightUnit === p.unit
                              ? "#d4af3760"
                              : "rgba(255,255,255,0.08)"
                          }`,
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                      placeholder="Weight"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) =>
                        setWeightUnit(e.target.value as "g" | "kg")
                      }
                      style={{ ...inputStyle, width: "auto", flex: 0 }}
                    >
                      <option value="g">g (grams)</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                {/* Compound info card */}
                {compound && !useCustom && (
                  <div
                    style={{
                      backgroundColor: "#111113",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 6,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      className="text-xs px-2 py-0.5 rounded-sm inline-block mb-3"
                      style={{
                        backgroundColor: catColor(compound.category) + "22",
                        color: catColor(compound.category),
                        border: `1px solid ${catColor(compound.category)}44`,
                      }}
                    >
                      {compound.category}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      {[
                        ["Route", compound.route],
                        ["Frequency", compound.frequency],
                        ["Dose range", `${compound.doseRange[0]}–${compound.doseRange[1]} ${compound.unit}`],
                        ["Reference", compound.reference],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <div style={{ color: "#666" }}>{k}</div>
                          <div style={{ color: "#F9F9F9", marginTop: 2 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {compound.notes && (
                      <p className="text-xs mt-3 leading-relaxed" style={{ color: "#666666" }}>
                        {compound.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Results */}
              <div className="space-y-4">
                {forwardResult ? (
                  <>
                    {/* Primary results */}
                    <div className="grid grid-cols-2 gap-3">
                      <div style={resultCardStyle("#d4af37")}>
                        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#d4af37" }}>
                          Absolute Dose
                        </div>
                        <div className="text-2xl font-light" style={{ color: "#F9F9F9" }}>
                          {fmtNum(forwardResult.absoluteMcg)} <span className="text-sm text-gray-400">mcg</span>
                        </div>
                        <div className="text-sm mt-1" style={{ color: "#A0A0A0" }}>
                          {fmtNum(forwardResult.absoluteMg, 4)} mg
                        </div>
                      </div>
                      <div style={resultCardStyle("#B8A44C")}>
                        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#B8A44C" }}>
                          Subject Weight
                        </div>
                        <div className="text-2xl font-light" style={{ color: "#F9F9F9" }}>
                          {fmtNum(forwardResult.weightKg * 1000, 1)} <span className="text-sm text-gray-400">g</span>
                        </div>
                        <div className="text-sm mt-1" style={{ color: "#A0A0A0" }}>
                          {fmtNum(forwardResult.weightKg, 4)} kg
                        </div>
                      </div>
                    </div>

                    {/* Published range for selected compound */}
                    {rangeResults && (
                      <div style={resultCardStyle()}>
                        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "#A0A0A0" }}>
                          Published Dose Range
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-xs" style={{ color: "#666" }}>Low</div>
                            <div className="text-lg font-light" style={{ color: "#F9F9F9" }}>
                              {fmtNum(rangeResults.low)} mcg
                            </div>
                          </div>
                          <div style={{ flex: 1, height: 2, backgroundColor: "#2a2a2c", borderRadius: 1, position: "relative" }}>
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                height: "100%",
                                background: "linear-gradient(90deg, #d4af3744, #d4af37)",
                                borderRadius: 1,
                              }}
                            />
                          </div>
                          <div className="text-right">
                            <div className="text-xs" style={{ color: "#666" }}>High</div>
                            <div className="text-lg font-light" style={{ color: "#F9F9F9" }}>
                              {fmtNum(rangeResults.high)} mcg
                            </div>
                          </div>
                        </div>
                        <div className="text-xs mt-2" style={{ color: "#666" }}>
                          Your dose ({fmtNum(forwardResult.absoluteMcg)} mcg) is{" "}
                          {forwardResult.absoluteMcg < rangeResults.low
                            ? "below the low end"
                            : forwardResult.absoluteMcg > rangeResults.high
                              ? "above the high end"
                              : "within range"}{" "}
                          of published protocols.
                        </div>
                      </div>
                    )}

                    {/* Injection volume table */}
                    <div style={resultCardStyle()}>
                      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: "#A0A0A0" }}>
                        Injection Volume by Reconstitution Concentration
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            <th className="text-left pb-2 font-medium" style={{ color: "#666" }}>Concentration</th>
                            <th className="text-right pb-2 font-medium" style={{ color: "#666" }}>Volume (mL)</th>
                            <th className="text-right pb-2 font-medium" style={{ color: "#666" }}>Syringe Units</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forwardResult.volumes.map((v, i) => (
                            <tr
                              key={i}
                              style={{
                                borderTop: "1px solid rgba(255,255,255,0.05)",
                                color: v.volumeMl < 0.001 || v.volumeMl > 1 ? "#666" : "#F9F9F9",
                              }}
                            >
                              <td className="py-1.5">{v.label}</td>
                              <td className="py-1.5 text-right">{fmtNum(v.volumeMl, 4)}</td>
                              <td className="py-1.5 text-right">
                                {fmtNum(v.units100, 1)} U
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs mt-2" style={{ color: "#555" }}>
                        Syringe units based on 100 U/mL insulin syringe (1 U = 0.01 mL).
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    className="rounded-sm p-8 text-center"
                    style={{
                      backgroundColor: "#111113",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="text-sm" style={{ color: "#555" }}>
                      Enter a compound and subject weight to calculate.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ─── REVERSE MODE ─────────────────────────────────────────────── */
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Inputs */}
              <div className="space-y-5">
                <div>
                  <label style={labelStyle}>Absolute Dose (mcg)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={absoluteDoseMcg}
                    onChange={(e) => setAbsoluteDoseMcg(e.target.value)}
                    placeholder="e.g. 250"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Subject Weight</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {SUBJECT_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p)}
                        className="text-xs px-2.5 py-1 rounded-sm transition-all"
                        style={{
                          backgroundColor:
                            revWeightValue === p.weight.toString() &&
                            revWeightUnit === p.unit
                              ? "#d4af3730"
                              : "#1a1a1c",
                          color:
                            revWeightValue === p.weight.toString() &&
                            revWeightUnit === p.unit
                              ? "#d4af37"
                              : "#A0A0A0",
                          border: `1px solid ${
                            revWeightValue === p.weight.toString() &&
                            revWeightUnit === p.unit
                              ? "#d4af3760"
                              : "rgba(255,255,255,0.08)"
                          }`,
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={revWeightValue}
                      onChange={(e) => setRevWeightValue(e.target.value)}
                      placeholder="Weight"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <select
                      value={revWeightUnit}
                      onChange={(e) =>
                        setRevWeightUnit(e.target.value as "g" | "kg")
                      }
                      style={{ ...inputStyle, width: "auto", flex: 0 }}
                    >
                      <option value="g">g (grams)</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: Results */}
              <div className="space-y-4">
                {reverseResult ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div style={resultCardStyle("#d4af37")}>
                        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#d4af37" }}>
                          Dose (mcg/kg)
                        </div>
                        <div className="text-2xl font-light" style={{ color: "#F9F9F9" }}>
                          {fmtNum(reverseResult.mcgPerKg, 1)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "#A0A0A0" }}>mcg/kg</div>
                      </div>
                      <div style={resultCardStyle("#B8A44C")}>
                        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#B8A44C" }}>
                          Dose (mg/kg)
                        </div>
                        <div className="text-2xl font-light" style={{ color: "#F9F9F9" }}>
                          {fmtNum(reverseResult.mgPerKg, 4)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "#A0A0A0" }}>mg/kg</div>
                      </div>
                    </div>

                    {/* Comparison with catalog compounds */}
                    <div style={resultCardStyle()}>
                      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: "#A0A0A0" }}>
                        Compare to Published Protocol Range
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {COMPOUND_DATABASE.map((c) => {
                          const rangeMcgLow =
                            c.unit === "mcg/kg" ? c.doseRange[0] : c.doseRange[0] * 1000;
                          const rangeMcgHigh =
                            c.unit === "mcg/kg" ? c.doseRange[1] : c.doseRange[1] * 1000;
                          const inRange =
                            reverseResult.mcgPerKg >= rangeMcgLow &&
                            reverseResult.mcgPerKg <= rangeMcgHigh;
                          if (!inRange) return null;
                          return (
                            <div
                              key={c.slug}
                              className="flex items-center justify-between text-xs py-1.5 px-2 rounded-sm"
                              style={{
                                backgroundColor: catColor(c.category) + "15",
                                border: `1px solid ${catColor(c.category)}30`,
                              }}
                            >
                              <span style={{ color: "#F9F9F9" }}>{c.name}</span>
                              <span style={{ color: catColor(c.category) }}>
                                {c.doseRange[0]}–{c.doseRange[1]} {c.unit}
                              </span>
                            </div>
                          );
                        })}
                        {COMPOUND_DATABASE.every((c) => {
                          const rangeMcgLow =
                            c.unit === "mcg/kg" ? c.doseRange[0] : c.doseRange[0] * 1000;
                          const rangeMcgHigh =
                            c.unit === "mcg/kg" ? c.doseRange[1] : c.doseRange[1] * 1000;
                          return !(
                            reverseResult.mcgPerKg >= rangeMcgLow &&
                            reverseResult.mcgPerKg <= rangeMcgHigh
                          );
                        }) && (
                          <p className="text-xs" style={{ color: "#555" }}>
                            No catalog compound matches this dose range in published protocols.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="rounded-sm p-8 text-center"
                    style={{
                      backgroundColor: "#111113",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="text-sm" style={{ color: "#555" }}>
                      Enter dose and weight to calculate.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Full Reference Table ── */}
          <div>
            <h2
              className="text-xl mb-5 tracking-tight"
              style={{ fontWeight: 300, color: "#F9F9F9" }}
            >
              Published Rodent Dosing Reference
            </h2>
            <div className="space-y-6">
              {groupedCompounds.map(({ category, compounds }) => (
                <div key={category}>
                  <div
                    className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"
                    style={{ color: catColor(category) }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: catColor(category),
                        flexShrink: 0,
                      }}
                    />
                    {category}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#111113",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                          {["Compound", "Typical Dose", "Range", "Frequency", "Route", "Reference"].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left font-medium"
                                style={{ color: "#666" }}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {compounds.map((c, i) => (
                          <tr
                            key={c.slug}
                            style={{
                              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                            }}
                          >
                            <td className="px-4 py-3" style={{ color: "#F9F9F9" }}>
                              <button
                                onClick={() => {
                                  setSelectedCompound(c.slug);
                                  setUseCustom(false);
                                  setMode("forward");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="hover:opacity-70 transition-opacity text-left"
                                title="Load into calculator"
                              >
                                {c.name}
                                <span className="ml-1 opacity-40">↑</span>
                              </button>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#d4af37" }}>
                              {c.typicalDose} {c.unit}
                            </td>
                            <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>
                              {c.doseRange[0]}–{c.doseRange[1]} {c.unit}
                            </td>
                            <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>
                              {c.frequency}
                            </td>
                            <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>
                              {c.route}
                            </td>
                            <td className="px-4 py-3" style={{ color: "#555", maxWidth: 200 }}>
                              {c.reference}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Design considerations ── */}
          <div
            className="rounded-sm p-6"
            style={{
              backgroundColor: "#111113",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-base font-medium mb-4" style={{ color: "#F9F9F9" }}>
              Research Design Considerations
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                {
                  title: "Allometric Scaling",
                  body: "mg/kg dosing does not directly translate across species due to differences in metabolic rate. Use allometric scaling (BSA or metabolic body weight) when extrapolating from mouse to rat or larger species.",
                },
                {
                  title: "Pair-Fed Controls",
                  body: "For metabolic peptides (GLP-1 analogs, MOTS-c), always include pair-fed controls to separate pharmacological effects from caloric restriction effects on body composition.",
                },
                {
                  title: "Route of Administration",
                  body: "IP and SC bioavailability differ. IP is faster but can irritate peritoneal tissue at high frequency. SC mimics clinical SC injection more closely and is preferred for chronic protocols.",
                },
                {
                  title: "Dose-Response Non-Linearity",
                  body: "Several peptides (AOD-9604, KPV, oxytocin) show inverted U-shaped dose-response curves. Always include at least 3 dose groups to characterize the full response curve.",
                },
                {
                  title: "Vehicle Controls",
                  body: "Match vehicle solvent, volume, and injection site between groups. BAC water at high volumes (>0.2 mL/mouse) can cause inflammation and confound results.",
                },
                {
                  title: "Sex Differences",
                  body: "GH axis peptides (sermorelin, tesamorelin, hexarelin) frequently show sex-specific IGF-1 responses. Include both sexes or justify single-sex studies explicitly in protocol.",
                },
              ].map((c) => (
                <div key={c.title}>
                  <div className="font-medium mb-1" style={{ color: "#d4af37" }}>
                    {c.title}
                  </div>
                  <div style={{ color: "#666666", lineHeight: 1.6 }}>{c.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2 mb-6" />

          {/* ── Disclaimer ── */}
          <div
            className="rounded-sm p-5"
            style={{
              backgroundColor: "#0f0f11",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <p className="text-xs leading-relaxed" style={{ color: "#555" }}>
              <strong style={{ color: "#777" }}>Research Use Only.</strong>{" "}
              All dosing data is sourced from published preclinical literature and is provided for
              reference purposes only. Nexphoria does not provide veterinary, medical, or dosing
              advice. Dose values reflect published rodent study protocols and are not applicable to
              human use. Always consult published literature and institutional guidelines (IACUC) for
              approved study protocols. This calculator performs arithmetic only — verify all inputs
              and outputs independently.
            </p>
          </div>

          {/* ── Related tools CTA ── */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: "/tools/reconstitution-calculator",
                title: "Reconstitution Calculator",
                desc: "Calculate BAC water volume and dose volumes.",
              },
              {
                href: "/tools/cost-per-dose-calculator",
                title: "Cost Per Dose",
                desc: "Calculate research cost at your dosing protocol.",
              },
              {
                href: "/tools/dosing-frequency-planner",
                title: "Dosing Frequency Planner",
                desc: "Build a weekly injection schedule.",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block rounded-sm p-5 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#111113",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
              >
                <div className="text-sm font-medium mb-1" style={{ color: "#F9F9F9" }}>
                  {t.title}
                </div>
                <div className="text-xs" style={{ color: "#666" }}>
                  {t.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
