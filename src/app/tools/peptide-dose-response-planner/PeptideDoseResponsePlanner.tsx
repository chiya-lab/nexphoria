"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CompoundData {
  slug: string;
  name: string;
  category: string;
  unit: "mcg/kg" | "mg/kg";
  minDose: number;
  maxDose: number;
  typicalDose: number;
  frequency: string;
  route: string;
  studyDurationDays: number;
  endpoint: string;
  expectedEffectLow: number;   // % change at typical dose
  expectedEffectHigh: number;
  cvPercent: number;           // inter-animal CV% from literature (for power calc)
  reference: string;
  notes: string;
}

interface DoseGroup {
  groupId: number;
  doseValue: number;         // in the compound's unit
  label: string;
  nPerGroup: number;
  totalDose_mg: number;       // absolute dose per injection in mg (for 25g mouse default)
  totalCompound_mg: number;   // total compound needed for this group
  expectedEffect: number | null; // estimated % effect
}

interface StudyDesign {
  compound: CompoundData;
  numDoseGroups: number;
  includeVehicle: boolean;
  includeMax: boolean;
  subjectWeight_g: number;
  species: "mouse" | "rat";
  studyDays: number;
  injFreqPerDay: number;
  nPerGroupOverride: number | null;
  doseGroups: DoseGroup[];
  totalAnimals: number;
  totalCompound_mg: number;
  totalCompound_vials: string;
  powerNote: string;
}

// ─── Compound Database ────────────────────────────────────────────────────────
const COMPOUNDS: CompoundData[] = [
  // Recovery & Healing
  {
    slug: "bpc-157", name: "BPC-157", category: "Recovery & Healing",
    unit: "mcg/kg", minDose: 0.5, maxDose: 100, typicalDose: 10,
    frequency: "Once daily", route: "IP", studyDurationDays: 14,
    endpoint: "Tendon tensile strength / wound area", expectedEffectLow: 25, expectedEffectHigh: 55,
    cvPercent: 22,
    reference: "Sikiric et al. 2010; Sebecic et al. 1999",
    notes: "Dose-response well-characterized 2–100 mcg/kg. Vehicle: saline. IP preferred for systemic tissue repair models.",
  },
  {
    slug: "tb-500", name: "TB-500 (Thymosin Beta-4)", category: "Recovery & Healing",
    unit: "mg/kg", minDose: 0.1, maxDose: 6, typicalDose: 2,
    frequency: "2–3× per week", route: "SC", studyDurationDays: 21,
    endpoint: "Tendon repair score / wound closure %", expectedEffectLow: 30, expectedEffectHigh: 60,
    cvPercent: 25,
    reference: "Philp et al. 2004; Bock-Marquette et al. 2004",
    notes: "Cardiac I/R models use 4–6 mg/kg acute IP. Musculoskeletal: 1–3 mg/kg SC chronic. CV ~25% from Ehrlich model.",
  },
  {
    slug: "ghk-cu", name: "GHK-Cu", category: "Recovery & Healing",
    unit: "mg/kg", minDose: 0.1, maxDose: 10, typicalDose: 1,
    frequency: "Once daily", route: "SC", studyDurationDays: 28,
    endpoint: "Wound contraction area / collagen content", expectedEffectLow: 20, expectedEffectHigh: 50,
    cvPercent: 28,
    reference: "Pickart 1973; Leyden et al. 1994; Ehrlich et al. 2000",
    notes: "Topical also validated. SC injection: 1–3 mg/kg/day. CV% higher in wound models (~28%).",
  },
  {
    slug: "wolverine-blend", name: "Wolverine Blend (BPC-157+TB-500+GHK-Cu)", category: "Recovery & Healing",
    unit: "mcg/kg", minDose: 2, maxDose: 20, typicalDose: 10,
    frequency: "Once daily", route: "IP/SC", studyDurationDays: 21,
    endpoint: "Composite repair score", expectedEffectLow: 40, expectedEffectHigh: 70,
    cvPercent: 27,
    reference: "Sikiric 2010; Bock-Marquette 2004; Pickart 1973 (BPC-157 dosing reference)",
    notes: "Combination study: administer each component separately at published doses. Use full factorial design when feasible.",
  },
  // GH Axis
  {
    slug: "ipamorelin", name: "Ipamorelin", category: "GH Axis",
    unit: "mcg/kg", minDose: 10, maxDose: 500, typicalDose: 100,
    frequency: "3× daily (pulsatile)", route: "SC", studyDurationDays: 84,
    endpoint: "Peak GH (ng/mL) / IGF-1 (ng/mL)", expectedEffectLow: 30, expectedEffectHigh: 60,
    cvPercent: 18,
    reference: "Johansen et al. 1999; Raun et al. 1998",
    notes: "CV% ~18% for GH peak assay. IGF-1 at 4–6 weeks more stable endpoint than acute GH peak.",
  },
  {
    slug: "cjc-1295-no-dac", name: "CJC-1295 No DAC (Mod GRF 1-29)", category: "GH Axis",
    unit: "mcg/kg", minDose: 10, maxDose: 300, typicalDose: 100,
    frequency: "2–3× daily", route: "SC", studyDurationDays: 56,
    endpoint: "Peak GH (ng/mL) / IGF-1 (ng/mL)", expectedEffectLow: 30, expectedEffectHigh: 50,
    cvPercent: 20,
    reference: "Thorner et al. 1997; Walker et al. 1995",
    notes: "Pulsatile ~30-min half-life. Best endpoint is IGF-1 at steady state (4+ weeks). GH peak assay CV% ~20%.",
  },
  {
    slug: "sermorelin", name: "Sermorelin", category: "GH Axis",
    unit: "mcg/kg", minDose: 5, maxDose: 200, typicalDose: 30,
    frequency: "Once daily (nocturnal)", route: "SC", studyDurationDays: 56,
    endpoint: "IGF-1 (% elevation from baseline)", expectedEffectLow: 25, expectedEffectHigh: 45,
    cvPercent: 22,
    reference: "Vittone et al. 1997; Sigalos & Pastuszak 2018",
    notes: "Pituitary reserve required. Male rodents show more robust IGF-1 response than females.",
  },
  {
    slug: "mk-677", name: "MK-677 (Ibutamoren)", category: "GH Axis",
    unit: "mg/kg", minDose: 1, maxDose: 50, typicalDose: 10,
    frequency: "Once daily (oral)", route: "Oral gavage", studyDurationDays: 56,
    endpoint: "IGF-1 (ng/mL) / lean mass (g)", expectedEffectLow: 30, expectedEffectHigh: 45,
    cvPercent: 15,
    reference: "Nass et al. 2008; Chapman et al. 1996",
    notes: "Oral bioavailability ~5-7%. Monitor fasting glucose and insulin. IGF-1 CV ~15% in rodent models.",
  },
  {
    slug: "tesamorelin", name: "Tesamorelin", category: "GH Axis",
    unit: "mcg/kg", minDose: 50, maxDose: 500, typicalDose: 200,
    frequency: "Once daily", route: "SC", studyDurationDays: 56,
    endpoint: "VAT area (cm²) / IGF-1 (ng/mL)", expectedEffectLow: 15, expectedEffectHigh: 30,
    cvPercent: 22,
    reference: "Stanley et al. 2009; Lo et al. 2010",
    notes: "DIO mouse / HIV-lipodystrophy models. Primary endpoint VAT by EchoMRI/DEXA. 26-min half-life.",
  },
  {
    slug: "hexarelin", name: "Hexarelin", category: "GH Axis",
    unit: "mcg/kg", minDose: 20, maxDose: 320, typicalDose: 80,
    frequency: "2–3× daily", route: "SC or IV", studyDurationDays: 28,
    endpoint: "Peak GH (ng/mL) / infarct size (%)", expectedEffectLow: 35, expectedEffectHigh: 60,
    cvPercent: 20,
    reference: "Ghigo et al. 1994; Torsello et al. 2003",
    notes: "Cardiac I/R: acute preconditioning protocol, GH-deficient dwarf rat controls recommended.",
  },
  // Metabolic / GLP-1
  {
    slug: "semaglutide", name: "Semaglutide", category: "Metabolic",
    unit: "mg/kg", minDose: 0.01, maxDose: 3, typicalDose: 0.1,
    frequency: "1× per week (SC)", route: "SC", studyDurationDays: 56,
    endpoint: "Body weight (%) / fat mass (DEXA)", expectedEffectLow: 10, expectedEffectHigh: 25,
    cvPercent: 12,
    reference: "Wilding et al. 2021 NEJM; DIO C57BL/6J standard",
    notes: "DIO C57BL/6J: 0.01–3 mg/kg 1×/week SC. CV% ~12% for BW endpoint. Pair-fed control essential.",
  },
  {
    slug: "tirzepatide", name: "Tirzepatide", category: "Metabolic",
    unit: "mg/kg", minDose: 0.01, maxDose: 10, typicalDose: 0.3,
    frequency: "1× per week (SC)", route: "SC", studyDurationDays: 56,
    endpoint: "Body weight (%) / fat mass / HbA1c", expectedEffectLow: 15, expectedEffectHigh: 30,
    cvPercent: 12,
    reference: "Jastreboff et al. 2022 NEJM; SURMOUNT-1",
    notes: "DIO db/db or DIO C57BL/6J. 0.03–3 mg/kg 1×/week SC. DEXA for lean mass. Pair-fed arm required.",
  },
  {
    slug: "retatrutide", name: "Retatrutide", category: "Metabolic",
    unit: "mg/kg", minDose: 0.01, maxDose: 10, typicalDose: 0.3,
    frequency: "1× per week (SC)", route: "SC", studyDurationDays: 56,
    endpoint: "Body weight (%) / hepatic fat / lean mass", expectedEffectLow: 18, expectedEffectHigh: 35,
    cvPercent: 13,
    reference: "Jastreboff et al. 2023 NEJM; Phase 2 data",
    notes: "Triple GLP-1R/GIPR/GCGR agonist. Include GCGR antagonist arm for receptor dissection. Hepatic biopsy endpoint.",
  },
  {
    slug: "mots-c", name: "MOTS-c", category: "Metabolic",
    unit: "mg/kg", minDose: 0.1, maxDose: 20, typicalDose: 5,
    frequency: "3–5× per week", route: "IP", studyDurationDays: 42,
    endpoint: "Fasting glucose / insulin sensitivity (GTT)", expectedEffectLow: 20, expectedEffectHigh: 45,
    cvPercent: 24,
    reference: "Lee et al. 2015 Cell Metabolism; Young et al. 2021 Nature Aging",
    notes: "IP delivery; 16aa mitochondrial peptide. GTT at baseline + endpoint. HFD or db/db mouse model.",
  },
  // Longevity
  {
    slug: "nad-plus", name: "NAD+", category: "Longevity",
    unit: "mg/kg", minDose: 50, maxDose: 1000, typicalDose: 500,
    frequency: "Once daily (IP)", route: "IP", studyDurationDays: 28,
    endpoint: "NAD+/NADH tissue ratio / SIRT1 activity", expectedEffectLow: 30, expectedEffectHigh: 80,
    cvPercent: 30,
    reference: "Gomes et al. 2013 Cell; Canto et al. 2012 Cell Metabolism",
    notes: "Prepare fresh; rapid clearance (~2h). Sterile saline only — no BAC water. Wrap in foil (light-sensitive). CV ~30%.",
  },
  {
    slug: "epitalon", name: "Epitalon", category: "Longevity",
    unit: "mcg/kg", minDose: 20, maxDose: 200, typicalDose: 40,
    frequency: "10-day pulsatile courses (2–4× per year)", route: "SC", studyDurationDays: 365,
    endpoint: "Telomerase activity (TRAP) / IGF-1 / cancer incidence", expectedEffectLow: 15, expectedEffectHigh: 35,
    cvPercent: 35,
    reference: "Khavinson et al. 2003; Anisimov et al. 2006",
    notes: "Long-term lifespan model (CBA/C57BL/6 mice). Short pulsatile courses — not continuous. Sterile saline reconstitution.",
  },
  {
    slug: "ss-31", name: "SS-31 (Elamipretide)", category: "Longevity",
    unit: "mg/kg", minDose: 0.1, maxDose: 10, typicalDose: 3,
    frequency: "Once daily (SC) or acute IV", route: "SC or IV", studyDurationDays: 28,
    endpoint: "Mitochondrial CRC / Complex I activity / LVEF", expectedEffectLow: 25, expectedEffectHigh: 50,
    cvPercent: 22,
    reference: "Szeto et al. 2008 Circ Res; Siegel et al. 2013 Aging Cell",
    notes: "Acute I/R: 3 mg/kg IV 10-min before ischemia. Chronic aging: 3 mg/kg SC/day. CsA as mPTP comparator.",
  },
  // Nootropics
  {
    slug: "semax", name: "Semax", category: "Nootropics",
    unit: "mcg/kg", minDose: 25, maxDose: 500, typicalDose: 100,
    frequency: "Once daily (IN or SC)", route: "Intranasal or SC", studyDurationDays: 14,
    endpoint: "BDNF (pg/mL) / hippocampal neurogenesis / MWM latency", expectedEffectLow: 20, expectedEffectHigh: 45,
    cvPercent: 28,
    reference: "Dolotov et al. 2006; Agapova et al. 2007",
    notes: "Intranasal: 5 µL/nostril per dose (mice). BDNF ELISA endpoint. Include melanocortin receptor antagonist control.",
  },
  {
    slug: "selank", name: "Selank", category: "Nootropics",
    unit: "mcg/kg", minDose: 100, maxDose: 3000, typicalDose: 300,
    frequency: "Once daily (IN or SC)", route: "Intranasal or IP", studyDurationDays: 14,
    endpoint: "Anxiety index (EPM/OFT) / BDNF / IL-6 (pg/mL)", expectedEffectLow: 25, expectedEffectHigh: 50,
    cvPercent: 25,
    reference: "Kozlovskaya et al. 2002; Semenova et al. 2010",
    notes: "EPM and open-field test for anxiety endpoints. BDNF ELISA. IL-6 cytokine suppression measurable at 4+ days.",
  },
  {
    slug: "dsip", name: "DSIP (Delta Sleep-Inducing Peptide)", category: "Nootropics",
    unit: "mcg/kg", minDose: 20, maxDose: 500, typicalDose: 100,
    frequency: "Once daily (ICV or IP)", route: "ICV or IP", studyDurationDays: 7,
    endpoint: "EEG delta wave % / NREM duration (min)", expectedEffectLow: 15, expectedEffectHigh: 35,
    cvPercent: 32,
    reference: "Monnier et al. 1977; Graf & Kastin 1986",
    notes: "EEG polysomnography required. ICV route for direct CNS delivery. High inter-animal CV in sleep architecture (~32%).",
  },
  // Immunology
  {
    slug: "kpv", name: "KPV (α-MSH C-terminal tripeptide)", category: "Immunology",
    unit: "mg/kg", minDose: 0.01, maxDose: 5, typicalDose: 0.1,
    frequency: "Once daily (IP or oral)", route: "IP or oral", studyDurationDays: 14,
    endpoint: "MPO activity / colon crypt preservation / TNF-α (pg/mL)", expectedEffectLow: 30, expectedEffectHigh: 60,
    cvPercent: 24,
    reference: "Dalmasso et al. 2008; Brzosko et al. 2019",
    notes: "DSS colitis model: 0.1 mg/kg/day IP × 14d. TNBS model: 1 mg/kg IP. MPO activity primary endpoint.",
  },
  {
    slug: "pt-141", name: "PT-141 (Bremelanotide)", category: "Immunology",
    unit: "mg/kg", minDose: 0.1, maxDose: 10, typicalDose: 1,
    frequency: "Acute (1× per study session)", route: "SC or ICV", studyDurationDays: 7,
    endpoint: "Lordosis quotient / mount latency (sec)", expectedEffectLow: 40, expectedEffectHigh: 70,
    cvPercent: 30,
    reference: "Diamond et al. 2004; RECONNECT trial 2019",
    notes: "Acute sexual behavior models. PVN microinjection for central-only dissection. MC4R antagonist SHU-9119 as control.",
  },
  // Other/misc
  {
    slug: "aod-9604", name: "AOD-9604", category: "Metabolic",
    unit: "mcg/kg", minDose: 50, maxDose: 5000, typicalDose: 500,
    frequency: "Once daily", route: "SC or IP", studyDurationDays: 42,
    endpoint: "Body fat % (DEXA) / lipolysis (glycerol release)", expectedEffectLow: 15, expectedEffectHigh: 35,
    cvPercent: 20,
    reference: "Heffernan et al. 1999; Ng et al. 2000",
    notes: "Non-linear dose-response — peak efficacy at ~500 mcg/kg. Β3-AR antagonist SR59230A as control.",
  },
  {
    slug: "melanotan-2", name: "Melanotan II", category: "Recovery & Healing",
    unit: "mg/kg", minDose: 0.05, maxDose: 2, typicalDose: 0.3,
    frequency: "Once daily", route: "SC or IP", studyDurationDays: 14,
    endpoint: "Skin OD (melanin) / erythema index / sexual behavior", expectedEffectLow: 30, expectedEffectHigh: 60,
    cvPercent: 28,
    reference: "Dorr et al. 1998 JACI; Barnhart et al. 2011",
    notes: "0.08–0.16 mg/kg SC for sexual behavior endpoint; 0.3 mg/kg SC for melanogenesis. Nausea endpoint: pica scoring.",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(COMPOUNDS.map((c) => c.category))).sort()];

const SPECIES_DEFAULTS = {
  mouse: { weight_g: 25, label: "Mouse (25 g)" },
  rat: { weight_g: 300, label: "Rat (300 g)" },
};

// ─── Power/group size calc ───────────────────────────────────────────────────
function calcGroupSize(
  effectSize: number,    // expected % change at effective dose
  cv: number,            // inter-animal CV%
  alpha: number = 0.05,
  power: number = 0.80
): number {
  // z-scores for two-sided alpha and power
  const zAlpha = 1.96;   // alpha = 0.05 two-sided
  const zBeta = 0.842;   // power = 0.80
  // Cohen's d from effect size and CV
  const d = effectSize / cv;
  // Two-sample t-test formula: n = 2 * ((zAlpha + zBeta) / d)^2
  const n = 2 * Math.pow((zAlpha + zBeta) / d, 2);
  return Math.max(5, Math.ceil(n));
}

// ─── Log-spaced doses ─────────────────────────────────────────────────────────
function logSpacedDoses(min: number, max: number, n: number): number[] {
  if (n === 1) return [min];
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return Array.from({ length: n }, (_, i) => {
    const val = Math.pow(10, logMin + (i / (n - 1)) * (logMax - logMin));
    // Round to 3 significant figures
    const magnitude = Math.pow(10, Math.floor(Math.log10(val)));
    return Math.round(val / magnitude * 100) / 100 * magnitude;
  });
}

// ─── Expected effect interpolation ───────────────────────────────────────────
function interpolateEffect(
  dose: number,
  minDose: number,
  maxDose: number,
  effectLow: number,
  effectHigh: number
): number {
  if (minDose === maxDose) return effectLow;
  const frac = (Math.log10(dose) - Math.log10(minDose)) / (Math.log10(maxDose) - Math.log10(minDose));
  const clamped = Math.max(0, Math.min(1, frac));
  return effectLow + clamped * (effectHigh - effectLow);
}

// ─── Format dose value ────────────────────────────────────────────────────────
function formatDose(val: number, unit: string): string {
  if (val >= 1000) return `${(val / 1000).toPrecision(3)} ${unit.replace("mcg", "mg").replace("mg", "g")}`;
  if (val < 0.01) return `${val.toExponential(2)} ${unit}`;
  if (val < 1) return `${val.toPrecision(2)} ${unit}`;
  return `${val.toPrecision(3)} ${unit}`;
}

// ─── Convert compound unit to mg for compound req ────────────────────────────
function toMg(val: number, unit: "mcg/kg" | "mg/kg", weight_g: number): number {
  const weight_kg = weight_g / 1000;
  if (unit === "mcg/kg") return (val * weight_kg) / 1000;
  return val * weight_kg;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PeptideDoseResponsePlanner() {
  const [selectedSlug, setSelectedSlug] = useState<string>("bpc-157");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [numDoseGroups, setNumDoseGroups] = useState<number>(4);
  const [includeVehicle, setIncludeVehicle] = useState<boolean>(true);
  const [includeMax, setIncludeMax] = useState<boolean>(true);
  const [species, setSpecies] = useState<"mouse" | "rat">("mouse");
  const [customWeight, setCustomWeight] = useState<string>("");
  const [customStudyDays, setCustomStudyDays] = useState<string>("");
  const [nOverride, setNOverride] = useState<string>("");
  const [injFreq, setInjFreq] = useState<string>("1");
  const [showPrint, setShowPrint] = useState<boolean>(false);

  const compound = useMemo(
    () => COMPOUNDS.find((c) => c.slug === selectedSlug) ?? COMPOUNDS[0],
    [selectedSlug]
  );

  const filteredCompounds = useMemo(
    () =>
      categoryFilter === "All"
        ? COMPOUNDS
        : COMPOUNDS.filter((c) => c.category === categoryFilter),
    [categoryFilter]
  );

  const subjectWeight_g = customWeight
    ? parseFloat(customWeight) || SPECIES_DEFAULTS[species].weight_g
    : SPECIES_DEFAULTS[species].weight_g;

  const studyDays = customStudyDays
    ? parseInt(customStudyDays) || compound.studyDurationDays
    : compound.studyDurationDays;

  const injFreqPerDay = parseInt(injFreq) || 1;

  // Compute dose groups
  const studyDesign = useMemo<StudyDesign>(() => {
    const doses = logSpacedDoses(compound.minDose, compound.maxDose, numDoseGroups);

    // Use min CV for power calc (conservative)
    const n_power = calcGroupSize(
      (compound.expectedEffectLow + compound.expectedEffectHigh) / 2,
      compound.cvPercent
    );
    const n = nOverride ? parseInt(nOverride) || n_power : n_power;

    const doseGroups: DoseGroup[] = doses.map((dose, i) => {
      const absPerInj_mg = toMg(dose, compound.unit, subjectWeight_g);
      const totalInjs = studyDays * injFreqPerDay;
      const totalComp_mg = absPerInj_mg * n * totalInjs;
      const expectedEffect = interpolateEffect(
        dose,
        compound.minDose,
        compound.maxDose,
        compound.expectedEffectLow,
        compound.expectedEffectHigh
      );
      return {
        groupId: i + 1,
        doseValue: dose,
        label: `Dose ${i + 1}`,
        nPerGroup: n,
        totalDose_mg: absPerInj_mg,
        totalCompound_mg: totalComp_mg,
        expectedEffect,
      };
    });

    // Vehicle group
    const vehicleGroup: DoseGroup | null = includeVehicle
      ? {
          groupId: 0,
          doseValue: 0,
          label: "Vehicle Control",
          nPerGroup: n,
          totalDose_mg: 0,
          totalCompound_mg: 0,
          expectedEffect: null,
        }
      : null;

    const allGroups = vehicleGroup ? [vehicleGroup, ...doseGroups] : doseGroups;
    const totalAnimals = allGroups.reduce((sum, g) => sum + g.nPerGroup, 0);
    const totalCompound_mg = allGroups.reduce((sum, g) => sum + g.totalCompound_mg, 0);

    // Vial equivalents (assuming 5mg or 10mg vials typical)
    const vialSize_mg = compound.unit === "mg/kg" ? 5 : 0.005; // 5mg vials for mg/kg compounds; 5mcg-equivalent for mcg ones
    const vials5mg = Math.ceil(totalCompound_mg / 5);
    const vialsNote = `≈ ${vials5mg} × 5 mg vials`;

    const powerNote = nOverride
      ? `Manual override: n = ${n} per group`
      : `Power calculation: n = ${n_power}/group (80% power, α = 0.05, CV = ${compound.cvPercent}%)`;

    return {
      compound,
      numDoseGroups,
      includeVehicle,
      includeMax,
      subjectWeight_g,
      species,
      studyDays,
      injFreqPerDay,
      nPerGroupOverride: nOverride ? parseInt(nOverride) : null,
      doseGroups: allGroups,
      totalAnimals,
      totalCompound_mg,
      totalCompound_vials: vialsNote,
      powerNote,
    };
  }, [
    compound,
    numDoseGroups,
    includeVehicle,
    subjectWeight_g,
    studyDays,
    injFreqPerDay,
    nOverride,
    species,
    includeMax,
  ]);

  const GOLD = "#B8A44C";
  const LIME = "#C9DD69";
  const BG = "#010101";
  const CARD = "#111110";
  const BORDER = "rgba(255,255,255,0.08)";
  const TEXT_DIM = "#888";
  const TEXT_MED = "#ccc";
  const TEXT_BRIGHT = "#f5f5f5";

  return (
    <div style={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Research Tools", href: "/tools" },
              { label: "Dose-Response Planner" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: LIME }}>
            Research Tools
          </p>
          <h1 className="text-4xl md:text-5xl mb-4 tracking-tight" style={{ fontWeight: 200, color: TEXT_BRIGHT, lineHeight: 1.05 }}>
            Dose-Response Study Planner
          </h1>
          <p className="text-base md:text-lg max-w-2xl mb-8" style={{ fontWeight: 300, color: TEXT_DIM, lineHeight: 1.65 }}>
            Design multi-arm dose-response studies: log-spaced dose groups, statistically powered group sizes from published inter-animal variability data, expected effect sizes, and total compound requirements.
          </p>
          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["28", "Compounds"],
              ["80%", "Power Target"],
              ["α = 0.05", "Significance"],
              ["Log-Scale", "Dose Spacing"],
            ].map(([val, lab]) => (
              <div key={lab} className="rounded-sm p-4" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
                <div className="text-xl font-medium mb-1" style={{ color: GOLD }}>{val}</div>
                <div className="text-xs" style={{ color: TEXT_DIM }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main calculator */}
      <section className="px-6 py-10 md:py-14">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* ── Compound Selector ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <h2 className="text-lg font-medium mb-5" style={{ color: "#111" }}>1. Select Compound</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="text-xs px-3 py-1.5 rounded-sm transition-colors"
                  style={{
                    backgroundColor: categoryFilter === cat ? GOLD : "transparent",
                    color: categoryFilter === cat ? "#000" : "#555",
                    border: `1px solid ${categoryFilter === cat ? GOLD : "#ddd"}`,
                    fontWeight: categoryFilter === cat ? 600 : 400,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full rounded-sm px-4 py-3 text-sm focus:outline-none"
              style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
            >
              {filteredCompounds.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name} — {c.category}</option>
              ))}
            </select>
            {/* Compound summary */}
            <div className="mt-4 rounded-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-3" style={{ backgroundColor: "#F9F8F4" }}>
              {[
                ["Typical Dose", `${compound.typicalDose} ${compound.unit}`],
                ["Published Range", `${compound.minDose}–${compound.maxDose} ${compound.unit}`],
                ["Frequency", compound.frequency],
                ["Route", compound.route],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs mb-1" style={{ color: "#999" }}>{k}</div>
                  <div className="text-sm font-medium" style={{ color: "#222" }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs" style={{ color: "#666666" }}>
              <span className="font-medium" style={{ color: "#555" }}>Typical endpoint:</span> {compound.endpoint} ·{" "}
              <span className="font-medium" style={{ color: "#555" }}>Reference:</span> {compound.reference}
            </div>
          </div>

          {/* ── Study Parameters ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <h2 className="text-lg font-medium mb-5" style={{ color: "#111" }}>2. Study Parameters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Dose groups */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>
                  Number of Dose Groups
                </label>
                <select
                  value={numDoseGroups}
                  onChange={(e) => setNumDoseGroups(parseInt(e.target.value))}
                  className="w-full rounded-sm px-3 py-2.5 text-sm focus:outline-none"
                  style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} dose levels{n === 4 ? " (recommended)" : ""}</option>
                  ))}
                </select>
              </div>
              {/* Species */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>Species</label>
                <select
                  value={species}
                  onChange={(e) => {
                    setSpecies(e.target.value as "mouse" | "rat");
                    setCustomWeight("");
                  }}
                  className="w-full rounded-sm px-3 py-2.5 text-sm focus:outline-none"
                  style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
                >
                  <option value="mouse">Mouse (default 25 g)</option>
                  <option value="rat">Rat (default 300 g)</option>
                </select>
              </div>
              {/* Custom weight */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>
                  Subject Weight (g) — override
                </label>
                <input
                  type="number"
                  placeholder={String(SPECIES_DEFAULTS[species].weight_g)}
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                  className="w-full rounded-sm px-3 py-2.5 text-sm focus:outline-none"
                  style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
                />
              </div>
              {/* Study days */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>
                  Study Duration (days) — override
                </label>
                <input
                  type="number"
                  placeholder={String(compound.studyDurationDays)}
                  value={customStudyDays}
                  onChange={(e) => setCustomStudyDays(e.target.value)}
                  className="w-full rounded-sm px-3 py-2.5 text-sm focus:outline-none"
                  style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
                />
              </div>
              {/* Injections per day */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>
                  Injections per Day
                </label>
                <select
                  value={injFreq}
                  onChange={(e) => setInjFreq(e.target.value)}
                  className="w-full rounded-sm px-3 py-2.5 text-sm focus:outline-none"
                  style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
                >
                  {[
                    ["1", "Once daily"],
                    ["2", "Twice daily"],
                    ["3", "Three times daily"],
                    ["0.43", "3× per week (~0.43/day)"],
                    ["0.29", "2× per week (~0.29/day)"],
                    ["0.14", "1× per week (~0.14/day)"],
                  ].map(([val, lab]) => (
                    <option key={val} value={val}>{lab}</option>
                  ))}
                </select>
              </div>
              {/* n override */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>
                  Animals per Group — manual override
                </label>
                <input
                  type="number"
                  placeholder="Auto (power calc)"
                  value={nOverride}
                  onChange={(e) => setNOverride(e.target.value)}
                  className="w-full rounded-sm px-3 py-2.5 text-sm focus:outline-none"
                  style={{ backgroundColor: "#F5F3EE", border: "1px solid #ddd", color: "#111" }}
                />
              </div>
            </div>
            {/* Checkboxes */}
            <div className="mt-4 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#444" }}>
                <input
                  type="checkbox"
                  checked={includeVehicle}
                  onChange={(e) => setIncludeVehicle(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: GOLD }}
                />
                Include vehicle control group
              </label>
            </div>
          </div>

          {/* ── Results: Dose Table ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium" style={{ color: "#111" }}>3. Study Design Output</h2>
                <p className="text-xs mt-1" style={{ color: "#666666" }}>{studyDesign.powerNote}</p>
              </div>
              <button
                onClick={() => setShowPrint(true)}
                className="text-xs px-4 py-2 rounded-sm transition-colors"
                style={{ backgroundColor: GOLD + "22", color: "#7a6820", border: `1px solid ${GOLD}66` }}
              >
                Print Protocol ↗
              </button>
            </div>
            {/* Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                ["Total Animals", studyDesign.totalAnimals],
                ["Total Groups", studyDesign.doseGroups.length],
                ["Study Days", studyDesign.studyDays],
                ["Compound Req.", `${studyDesign.totalCompound_mg < 1 ? (studyDesign.totalCompound_mg * 1000).toFixed(1) + " µg" : studyDesign.totalCompound_mg.toFixed(2) + " mg"}`],
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded-sm p-3" style={{ backgroundColor: "#F9F8F4", border: "1px solid #eee" }}>
                  <div className="text-xs mb-1" style={{ color: "#999" }}>{k}</div>
                  <div className="text-xl font-medium" style={{ color: "#111" }}>{v}</div>
                </div>
              ))}
            </div>
            <p className="text-xs mb-4" style={{ color: "#999" }}>
              Vial estimate: {studyDesign.totalCompound_vials} (assumes 5 mg/vial standard catalog size)
            </p>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    {["Group", "Dose", "Absolute/Inj (mg)", "n/Group", "Total Compound (mg)", "Expected Effect"].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold" style={{ color: "#666" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {studyDesign.doseGroups.map((g, i) => {
                    const isVehicle = g.doseValue === 0;
                    const effPct = g.expectedEffect;
                    const bgRow = i % 2 === 0 ? "#FAFAF8" : "#fff";
                    return (
                      <tr key={g.groupId} style={{ backgroundColor: isVehicle ? "#F0EFE9" : bgRow }}>
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-sm" style={{
                            backgroundColor: isVehicle ? "#E8E5DC" : GOLD + "22",
                            color: isVehicle ? "#666" : "#7a6820",
                            border: `1px solid ${isVehicle ? "#ccc" : GOLD + "55"}`,
                          }}>
                            {isVehicle ? "Vehicle" : `Dose ${i}`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium" style={{ color: isVehicle ? "#888" : "#111" }}>
                          {isVehicle ? "0 (vehicle)" : formatDose(g.doseValue, compound.unit)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-xs" style={{ color: "#555" }}>
                          {isVehicle ? "—" : g.totalDose_mg < 0.001
                            ? `${(g.totalDose_mg * 1000000).toFixed(2)} ng`
                            : g.totalDose_mg < 1
                            ? `${(g.totalDose_mg * 1000).toFixed(2)} µg`
                            : `${g.totalDose_mg.toFixed(4)} mg`}
                        </td>
                        <td className="py-2.5 px-3" style={{ color: "#333" }}>{g.nPerGroup}</td>
                        <td className="py-2.5 px-3 font-mono text-xs" style={{ color: "#555" }}>
                          {isVehicle ? "—" : g.totalCompound_mg < 0.001
                            ? `${(g.totalCompound_mg * 1000000).toFixed(1)} ng`
                            : g.totalCompound_mg < 1
                            ? `${(g.totalCompound_mg * 1000).toFixed(2)} µg`
                            : `${g.totalCompound_mg.toFixed(3)} mg`}
                        </td>
                        <td className="py-2.5 px-3">
                          {effPct !== null ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "#eee", maxWidth: 80 }}>
                                <div
                                  className="h-1.5 rounded-full"
                                  style={{ width: `${Math.min(100, effPct)}%`, backgroundColor: effPct > 40 ? "#4A9B8E" : GOLD }}
                                />
                              </div>
                              <span className="text-xs" style={{ color: "#555" }}>~{effPct.toFixed(0)}%</span>
                            </div>
                          ) : (
                            <span className="text-xs" style={{ color: "#999" }}>Baseline ref.</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Notes */}
            <div className="mt-4 text-xs p-3 rounded-sm" style={{ backgroundColor: "#F5F3EE", border: "1px solid #E8E5DC" }}>
              <span className="font-medium" style={{ color: "#555" }}>Compound notes:</span>{" "}
              <span style={{ color: "#777" }}>{compound.notes}</span>
            </div>
          </div>

          {/* ── Expected Effect Chart ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <h2 className="text-lg font-medium mb-1" style={{ color: "#111" }}>4. Dose-Response Curve (Estimated)</h2>
            <p className="text-xs mb-5" style={{ color: "#666666" }}>
              Log-linear interpolation from published literature. Not a fitted curve — use actual experimental data for final curve fitting.
            </p>
            {/* SVG dose-response curve */}
            <DoseResponseChart
              doseGroups={studyDesign.doseGroups.filter((g) => g.doseValue > 0)}
              compound={compound}
              goldColor={GOLD}
            />
          </div>

          {/* ── Power Table ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <h2 className="text-lg font-medium mb-4" style={{ color: "#111" }}>5. Group Size vs. Effect Size Reference</h2>
            <p className="text-xs mb-4" style={{ color: "#666666" }}>
              Required n per group (80% power, α = 0.05, two-sample t-test) for {compound.name} with CV = {compound.cvPercent}%.
              Based on published inter-animal variability for this compound&apos;s endpoint: {compound.endpoint}.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: "#666" }}>Expected Effect Size</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: "#666" }}>Required n / Group</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: "#666" }}>4-group study (excl. vehicle)</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: "#666" }}>Feasibility</th>
                  </tr>
                </thead>
                <tbody>
                  {[10, 20, 30, 40, 50, 60, 75].map((eff, i) => {
                    const n = calcGroupSize(eff, compound.cvPercent);
                    const totalWith4 = n * 4;
                    const feasible = n <= 12 ? "✓ Feasible" : n <= 20 ? "⚠ Moderate" : "✗ Large study";
                    const feasColor = n <= 12 ? "#2A7A4B" : n <= 20 ? "#B8860B" : "#C03";
                    const isCurrent = Math.abs(eff - (compound.expectedEffectLow + compound.expectedEffectHigh) / 2) < 8;
                    return (
                      <tr key={eff} style={{ backgroundColor: isCurrent ? GOLD + "18" : i % 2 === 0 ? "#FAFAF8" : "#fff", borderBottom: "1px solid #eee" }}>
                        <td className="py-2 px-3 font-medium" style={{ color: "#111" }}>
                          {eff}% {isCurrent && <span className="ml-1 text-xs" style={{ color: GOLD }}>← {compound.name}</span>}
                        </td>
                        <td className="py-2 px-3" style={{ color: "#333" }}>{n}</td>
                        <td className="py-2 px-3" style={{ color: "#555" }}>{totalWith4} animals</td>
                        <td className="py-2 px-3 text-xs font-medium" style={{ color: feasColor }}>{feasible}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Research Design Considerations ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <h2 className="text-lg font-medium mb-5" style={{ color: "#111" }}>6. Research Design Considerations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Log-Scale Dose Spacing",
                  text: "Log-spaced doses (e.g., 1, 3, 10, 30 mcg/kg) are standard for dose-response studies because biological systems typically exhibit log-linear relationships between dose and effect. Equal linear spacing concentrates arms in a narrow effective range.",
                },
                {
                  title: "Vehicle Control Design",
                  text: "Vehicle controls receive the same reconstitution buffer (BAC water, saline, PBS) at the same volume and route as treatment groups. This isolates compound-specific effects from injection stress, solvent effects, and handling variability.",
                },
                {
                  title: "Statistical Power & CV%",
                  text: `Group size calculations use compound-specific CV% from published preclinical data (${compound.name}: ${compound.cvPercent}% CV). Higher biological variability requires larger groups. Use pilot data to refine CV estimates before committing to full study cohorts.`,
                },
                {
                  title: "Endpoint Timing",
                  text: `For ${compound.name}, the recommended endpoint is: ${compound.endpoint}. Assess at the correct time post-treatment (${compound.studyDurationDays} days standard) — premature assessment underestimates maximum effect.`,
                },
                {
                  title: "Pair-Fed Controls",
                  text: "For metabolic endpoints (body weight, fat mass, glucose), include a pair-fed control group matching caloric intake of the highest-dose group. This distinguishes anorexigenic effects from direct metabolic mechanism.",
                },
                {
                  title: "Blinding & Randomization",
                  text: "Randomize animals to groups by weight-stratified randomization at study start. Blind investigators to treatment group for behavioral, histological, and ELISA endpoints. Document randomization scheme in IACUC protocol.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-sm p-4" style={{ backgroundColor: "#F9F8F4", border: "1px solid #eee" }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "#222" }}>{c.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Reference Table ── */}
          <div className="rounded-sm p-6" style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}>
            <h2 className="text-lg font-medium mb-4" style={{ color: "#111" }}>Compound Reference: Dose-Response Data</h2>
            <p className="text-xs mb-4" style={{ color: "#666666" }}>
              Published preclinical dose ranges, endpoints, and inter-animal variability (CV%) for all catalog compounds.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    {["Compound", "Category", "Published Range", "Typical Dose", "Endpoint", "CV%", "Study Days"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold" style={{ color: "#666" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPOUNDS.map((c, i) => (
                    <tr
                      key={c.slug}
                      onClick={() => { setSelectedSlug(c.slug); setCategoryFilter("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="cursor-pointer hover:bg-amber-50 transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? "#FAFAF8" : "#fff", borderBottom: "1px solid #eee" }}
                    >
                      <td className="py-2 px-3 font-medium text-xs" style={{ color: GOLD }}>{c.name}</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#777" }}>{c.category}</td>
                      <td className="py-2 px-3 text-xs font-mono" style={{ color: "#555" }}>{c.minDose}–{c.maxDose} {c.unit}</td>
                      <td className="py-2 px-3 text-xs font-mono" style={{ color: "#444" }}>{c.typicalDose} {c.unit}</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#666", maxWidth: 180 }}>{c.endpoint}</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#444" }}>{c.cvPercent}%</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#444" }}>{c.studyDurationDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related tools */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/tools/body-weight-dose-calculator", label: "Body Weight Dose Calculator" },
              { href: "/tools/allometric-scaling-calculator", label: "Allometric Scaling Calculator" },
              { href: "/tools/protocol-template-generator", label: "Protocol Template Generator" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-sm p-4 flex items-center justify-between transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4", textDecoration: "none" }}
              >
                <span className="text-sm font-medium" style={{ color: "#222" }}>{t.label}</span>
                <span style={{ color: GOLD }}>→</span>
              </Link>
            ))}
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <div className="rounded-sm p-5 text-xs" style={{ backgroundColor: "#F9F8F4", border: "1px solid #ECEAE4", color: "#666666" }}>
            <strong style={{ color: "#666" }}>Research Use Only.</strong> Group size calculations use simplified two-sample t-test power formula with published CV% estimates. Actual study power depends on true biological variability, effect size, and assay precision. Consult a biostatistician for IACUC protocol submissions. Expected effect sizes are literature-derived estimates — actual results vary by model, strain, age, sex, and experimental conditions. All compounds sold by Nexphoria are for in vitro and preclinical research only. Not for human or clinical use.
          </div>
        </div>
      </section>

      {/* Print modal */}
      {showPrint && (
        <PrintModal design={studyDesign} onClose={() => setShowPrint(false)} goldColor={GOLD} />
      )}
    </div>
  );
}

// ─── Dose-Response Chart ──────────────────────────────────────────────────────
function DoseResponseChart({
  doseGroups,
  compound,
  goldColor,
}: {
  doseGroups: DoseGroup[];
  compound: CompoundData;
  goldColor: string;
}) {
  if (doseGroups.length < 2) return <p className="text-xs" style={{ color: "#999" }}>Need ≥ 2 dose groups for chart.</p>;

  const W = 600;
  const H = 240;
  const PAD = { top: 20, right: 30, bottom: 50, left: 55 };

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const doses = doseGroups.map((g) => g.doseValue);
  const effects = doseGroups.map((g) => g.expectedEffect ?? 0);

  const logMin = Math.log10(doses[0]);
  const logMax = Math.log10(doses[doses.length - 1]);
  const effMax = Math.max(...effects) * 1.15;

  const xScale = (dose: number) =>
    PAD.left + ((Math.log10(dose) - logMin) / (logMax - logMin)) * innerW;
  const yScale = (eff: number) =>
    PAD.top + innerH - (eff / effMax) * innerH;

  const pathD = doseGroups
    .map((g, i) => `${i === 0 ? "M" : "L"} ${xScale(g.doseValue)} ${yScale(g.expectedEffect ?? 0)}`)
    .join(" ");

  // Area under curve
  const areaD =
    `M ${xScale(doses[0])} ${PAD.top + innerH} ` +
    doseGroups.map((g) => `L ${xScale(g.doseValue)} ${yScale(g.expectedEffect ?? 0)}`).join(" ") +
    ` L ${xScale(doses[doses.length - 1])} ${PAD.top + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ fontFamily: "sans-serif" }}>
      <defs>
        <linearGradient id="dr-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={goldColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={goldColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => {
        if (pct > effMax) return null;
        const y = yScale(pct);
        return (
          <g key={pct}>
            <line x1={PAD.left} y1={y} x2={PAD.left + innerW} y2={y} stroke="#eee" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#aaa">{pct}%</text>
          </g>
        );
      })}

      {/* Area */}
      <path d={areaD} fill="url(#dr-area-grad)" />
      {/* Curve */}
      <path d={pathD} fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {doseGroups.map((g) => (
        <circle
          key={g.groupId}
          cx={xScale(g.doseValue)}
          cy={yScale(g.expectedEffect ?? 0)}
          r="4"
          fill={goldColor}
          stroke="#fff"
          strokeWidth="2"
        />
      ))}

      {/* X-axis labels */}
      {doseGroups.map((g) => (
        <text
          key={g.doseValue}
          x={xScale(g.doseValue)}
          y={PAD.top + innerH + 18}
          textAnchor="middle"
          fontSize="9"
          fill="#666"
        >
          {g.doseValue < 0.01
            ? g.doseValue.toExponential(1)
            : g.doseValue < 1
            ? g.doseValue.toPrecision(2)
            : g.doseValue >= 1000
            ? `${(g.doseValue / 1000).toPrecision(2)}k`
            : g.doseValue.toPrecision(3)}
        </text>
      ))}

      {/* Axis labels */}
      <text x={PAD.left + innerW / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#999">
        {`Dose (${compound.unit})`}
      </text>
      <text
        x={10}
        y={PAD.top + innerH / 2}
        textAnchor="middle"
        fontSize="10"
        fill="#999"
        transform={`rotate(-90, 10, ${PAD.top + innerH / 2})`}
      >
        Effect (% change)
      </text>

      {/* Axes */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH} stroke="#ccc" strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + innerH} x2={PAD.left + innerW} y2={PAD.top + innerH} stroke="#ccc" strokeWidth="1" />
    </svg>
  );
}

// ─── Print Modal ──────────────────────────────────────────────────────────────
function PrintModal({
  design,
  onClose,
  goldColor,
}: {
  design: StudyDesign;
  onClose: () => void;
  goldColor: string;
}) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
    >
      <div className="w-full max-w-3xl bg-white rounded-sm p-8 my-8 print:m-0 print:p-0 print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 print:hidden">
          <h2 className="text-lg font-semibold">Dose-Response Protocol Summary</h2>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="text-sm px-4 py-2 rounded-sm"
              style={{ backgroundColor: goldColor, color: "#000", fontWeight: 600 }}
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-sm"
              style={{ backgroundColor: "#eee", color: "#333" }}
            >
              Close
            </button>
          </div>
        </div>

        <div className="border-b-2 border-gray-900 pb-3 mb-5">
          <h1 className="text-2xl font-bold">Nexphoria Research</h1>
          <p className="text-sm text-gray-500">Dose-Response Study Design — {today}</p>
        </div>

        <table className="w-full text-sm mb-6">
          <tbody>
            {[
              ["Compound", design.compound.name],
              ["Category", design.compound.category],
              ["Dose Range", `${design.compound.minDose}–${design.compound.maxDose} ${design.compound.unit}`],
              ["Species / Weight", `${design.species === "mouse" ? "Mouse" : "Rat"} / ${design.subjectWeight_g} g`],
              ["Study Duration", `${design.studyDays} days`],
              ["Endpoint", design.compound.endpoint],
              ["Total Animals", design.totalAnimals],
              ["Power Note", design.powerNote],
            ].map(([k, v]) => (
              <tr key={String(k)} className="border-b border-gray-100">
                <td className="py-1.5 pr-4 font-semibold text-gray-600 w-40">{k}</td>
                <td className="py-1.5 text-gray-800">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-bold mb-2">Dose Group Specifications</h3>
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              {["Group", "Dose", "Abs/Inj", "n", "Compound (total)", "Est. Effect"].map((h) => (
                <th key={h} className="text-left py-2 px-2 font-semibold text-gray-600 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {design.doseGroups.map((g, i) => (
              <tr key={g.groupId} className="border-b border-gray-200">
                <td className="py-1.5 px-2 text-xs">{g.doseValue === 0 ? "Vehicle" : `Dose ${i}`}</td>
                <td className="py-1.5 px-2 text-xs font-mono">
                  {g.doseValue === 0 ? "—" : `${g.doseValue} ${design.compound.unit}`}
                </td>
                <td className="py-1.5 px-2 text-xs font-mono">
                  {g.doseValue === 0 ? "—" : g.totalDose_mg < 1 ? `${(g.totalDose_mg * 1000).toFixed(2)} µg` : `${g.totalDose_mg.toFixed(4)} mg`}
                </td>
                <td className="py-1.5 px-2 text-xs">{g.nPerGroup}</td>
                <td className="py-1.5 px-2 text-xs font-mono">
                  {g.doseValue === 0 ? "—" : g.totalCompound_mg < 1 ? `${(g.totalCompound_mg * 1000).toFixed(2)} µg` : `${g.totalCompound_mg.toFixed(3)} mg`}
                </td>
                <td className="py-1.5 px-2 text-xs">
                  {g.expectedEffect !== null ? `~${g.expectedEffect.toFixed(0)}%` : "Baseline"}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-1.5 px-2 text-xs" colSpan={3}>TOTAL</td>
              <td className="py-1.5 px-2 text-xs">{design.totalAnimals}</td>
              <td className="py-1.5 px-2 text-xs font-mono">
                {design.totalCompound_mg < 1
                  ? `${(design.totalCompound_mg * 1000).toFixed(2)} µg`
                  : `${design.totalCompound_mg.toFixed(3)} mg`}
              </td>
              <td className="py-1.5 px-2 text-xs"></td>
            </tr>
          </tbody>
        </table>

        <p className="text-xs text-gray-500 mb-6">Vial estimate: {design.totalCompound_vials}</p>

        <div className="bg-gray-50 rounded p-4 text-xs text-gray-500 mt-4">
          <strong className="text-gray-700">Research Use Only (RUO) Disclaimer.</strong>{" "}
          This document is generated by Nexphoria&apos;s research planning tools for informational purposes in preclinical research design only.
          Statistical calculations are estimates. Consult a qualified biostatistician for IACUC protocol submissions.
          All compounds are sold for research use only and are not intended for human or veterinary therapeutic use.
        </div>
      </div>
    </div>
  );
}
