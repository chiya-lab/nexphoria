"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── FDA Km values (2005 Guidance) ──────────────────────────────────────────
interface Species {
  id: string;
  label: string;
  km: number;            // body surface area normalizer (g/m²)
  avgWeightG: number;    // typical study animal weight in grams
  avgWeightLabel: string;
}

const SPECIES: Species[] = [
  { id: "mouse",   label: "Mouse",          km: 3,    avgWeightG: 20,    avgWeightLabel: "20 g" },
  { id: "rat",     label: "Rat",            km: 6,    avgWeightG: 150,   avgWeightLabel: "150 g" },
  { id: "hamster", label: "Hamster",        km: 5,    avgWeightG: 60,    avgWeightLabel: "60 g" },
  { id: "guinea",  label: "Guinea Pig",     km: 8,    avgWeightG: 400,   avgWeightLabel: "400 g" },
  { id: "rabbit",  label: "Rabbit",         km: 12,   avgWeightG: 1800,  avgWeightLabel: "1.8 kg" },
  { id: "cat",     label: "Cat",            km: 16,   avgWeightG: 3000,  avgWeightLabel: "3 kg" },
  { id: "monkey",  label: "Monkey (NHP)",   km: 12,   avgWeightG: 3000,  avgWeightLabel: "3 kg" },
  { id: "dog",     label: "Dog",            km: 20,   avgWeightG: 10000, avgWeightLabel: "10 kg" },
  { id: "human",   label: "Human",          km: 37,   avgWeightG: 60000, avgWeightLabel: "60 kg" },
];

const HUMAN_KM = 37;
const HUMAN_WEIGHT_DEFAULT = 60; // kg

// ─── Common research peptide notes ──────────────────────────────────────────
interface PeptideNote {
  name: string;
  notes: string;
  category: string;
}

const PEPTIDE_NOTES: PeptideNote[] = [
  { name: "BPC-157", notes: "HED typically 1.4–5 mcg/kg. IP to SC conversion needs route bioavailability adjustment (~70–90% for SC).", category: "Recovery" },
  { name: "TB-500", notes: "Primate-specific PK differs from rodents. BSA-scaled HED from rat data: ~0.3–1 mg/kg.", category: "Recovery" },
  { name: "GHK-Cu", notes: "Topical route not captured by allometric scaling. SC injections scale normally.", category: "Recovery" },
  { name: "Ipamorelin", notes: "GHSR-1a density varies significantly between species; scaling accounts for dose, not receptor sensitivity.", category: "GH Axis" },
  { name: "Sermorelin", notes: "Pituitary somatotroph reserve varies by age; HED scaling reflects pharmacokinetic equivalence only.", category: "GH Axis" },
  { name: "Semaglutide", notes: "GLP-1R agonism varies between rodents and humans. Phase 2 STEP 1: 2.4 mg/week SC in humans.", category: "Metabolic" },
  { name: "Tirzepatide", notes: "Dual GIP/GLP-1 agonism. Human Phase 3 SURMOUNT doses: 5, 10, 15 mg/week SC.", category: "Metabolic" },
  { name: "Retatrutide", notes: "Triple agonist. Phase 2 used 1–12 mg/week in humans. Rodent data used 1–3 mg/kg/day SC.", category: "Metabolic" },
  { name: "MK-677", notes: "Oral bioavailability ~60–70%. Allometric scaling applies to oral doses but CNS/receptor penetration may differ.", category: "GH Axis" },
  { name: "NAD+", notes: "IV NAD+ does not scale allometrically in the same way — tissue uptake and compartment kinetics dominate.", category: "Longevity" },
  { name: "Epitalon", notes: "Telomerase activation endpoint; scaling gives dose equivalence but biological endpoint sensitivity differs.", category: "Longevity" },
  { name: "PT-141", notes: "SC in humans: 1.25 mg typical. Allometric rodent scale from 80–160 mcg/kg gives HED ~0.25–0.5 mg.", category: "Hormonal" },
  { name: "Oxytocin", notes: "Intranasal route BBB delivery is route-specific; allometric scaling applies to SC/IP routes only.", category: "Hormonal" },
];

// ─── Utilities ───────────────────────────────────────────────────────────────
function calcHED(animalDoseMgKg: number, animalKm: number, humanKm: number): number {
  // HED (mg/kg) = Animal dose (mg/kg) × (Animal Km / Human Km)
  return animalDoseMgKg * (animalKm / humanKm);
}

function calcAbsoluteHED(hedMgKg: number, humanWeightKg: number): number {
  return hedMgKg * humanWeightKg;
}

function formatNum(n: number, decimals = 3): string {
  if (n === 0) return "0";
  if (n < 0.001) return n.toExponential(2);
  if (n < 1) return n.toFixed(decimals);
  if (n < 100) return n.toFixed(2);
  return n.toFixed(1);
}

export default function AllometricScalingCalculator() {
  const [animalSpecies, setAnimalSpecies] = useState<string>("mouse");
  const [animalWeightG, setAnimalWeightG] = useState<string>("20");
  const [animalDose, setAnimalDose] = useState<string>("10");
  const [animalDoseUnit, setAnimalDoseUnit] = useState<"mcg/kg" | "mg/kg">("mcg/kg");
  const [humanWeight, setHumanWeight] = useState<string>("60");
  const [showNotes, setShowNotes] = useState(false);

  const selectedSpecies = useMemo(
    () => SPECIES.find((s) => s.id === animalSpecies) ?? SPECIES[0],
    [animalSpecies]
  );

  const results = useMemo(() => {
    const dose = parseFloat(animalDose);
    const hwKg = parseFloat(humanWeight) || HUMAN_WEIGHT_DEFAULT;
    const awG = parseFloat(animalWeightG) || selectedSpecies.avgWeightG;

    if (!dose || dose <= 0) return null;

    // Convert to mg/kg for HED calculation
    const doseMgKg = animalDoseUnit === "mcg/kg" ? dose / 1000 : dose;
    const absoluteAnimalMg = doseMgKg * (awG / 1000); // awG in grams → kg
    const absoluteAnimalMcg = absoluteAnimalMg * 1000;

    const hedMgKg = calcHED(doseMgKg, selectedSpecies.km, HUMAN_KM);
    const hedMcgKg = hedMgKg * 1000;
    const absoluteHEDmg = calcAbsoluteHED(hedMgKg, hwKg);
    const absoluteHEDmcg = absoluteHEDmg * 1000;
    const scalingFactor = selectedSpecies.km / HUMAN_KM;

    return {
      doseMgKg,
      absoluteAnimalMg,
      absoluteAnimalMcg,
      hedMgKg,
      hedMcgKg,
      absoluteHEDmg,
      absoluteHEDmcg,
      scalingFactor,
      animalKm: selectedSpecies.km,
      humanKm: HUMAN_KM,
      hwKg,
      awKg: awG / 1000,
    };
  }, [animalDose, animalDoseUnit, animalWeightG, humanWeight, selectedSpecies]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Allometric Scaling Calculator" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-white/10 pt-8 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-6">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#d4af37] block mb-3">
              Research Tools
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Allometric Scaling Calculator
            </h1>
            <p className="text-zinc-400 max-w-2xl text-base leading-relaxed">
              Convert rodent study doses to human equivalent doses (HED) using FDA 2005 allometric
              scaling guidance. Based on body surface area (BSA) Km factors from the FDA&apos;s
              &ldquo;Estimating the Maximum Safe Starting Dose in Initial Clinical Trials for
              Therapeutics in Adult Healthy Volunteers&rdquo; guidance document.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ─── Formula explainer ─── */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#d4af37] mb-4">
            Formula (FDA 2005 Guidance)
          </h2>
          <div className="bg-zinc-950 border border-white/10 rounded-lg px-6 py-4 font-mono text-center text-sm sm:text-base text-white mb-4">
            HED (mg/kg) = Animal Dose (mg/kg) × <span className="text-[#d4af37]">Animal K<sub>m</sub></span> ÷ <span className="text-blue-400">Human K<sub>m</sub></span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            K<sub>m</sub> is a body surface area normalization factor (body weight in kg ÷ BSA in m²).
            Dividing by a larger human K<sub>m</sub> (37) typically yields a lower HED than the animal dose —
            reflecting the fact that smaller animals have proportionally larger surface areas and faster metabolism.
          </p>
        </div>

        {/* ─── Main calculator ─── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-white mb-1">Animal Study Parameters</h2>

            {/* Species */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Animal Species
              </label>
              <select
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                value={animalSpecies}
                onChange={(e) => {
                  const sp = SPECIES.find((s) => s.id === e.target.value);
                  setAnimalSpecies(e.target.value);
                  if (sp) setAnimalWeightG(String(sp.avgWeightG));
                }}
              >
                {SPECIES.filter((s) => s.id !== "human").map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} — Km: {s.km} (avg {s.avgWeightLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Animal weight */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Animal Body Weight
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  value={animalWeightG}
                  onChange={(e) => setAnimalWeightG(e.target.value)}
                  placeholder={String(selectedSpecies.avgWeightG)}
                />
                <span className="text-zinc-400 text-sm font-medium whitespace-nowrap">grams (g)</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">Typical: {selectedSpecies.avgWeightLabel}</p>
            </div>

            {/* Dose */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Animal Dose
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  value={animalDose}
                  onChange={(e) => setAnimalDose(e.target.value)}
                  placeholder="e.g. 10"
                />
                <select
                  className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  value={animalDoseUnit}
                  onChange={(e) => setAnimalDoseUnit(e.target.value as "mcg/kg" | "mg/kg")}
                >
                  <option value="mcg/kg">mcg/kg</option>
                  <option value="mg/kg">mg/kg</option>
                </select>
              </div>
            </div>

            {/* Human weight */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Reference Human Weight
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="30"
                  max="200"
                  className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  value={humanWeight}
                  onChange={(e) => setHumanWeight(e.target.value)}
                  placeholder="60"
                />
                <span className="text-zinc-400 text-sm font-medium whitespace-nowrap">kg</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">FDA guidance uses 60 kg reference human</p>
            </div>

            {/* Quick presets */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "BPC-157 (mouse)", species: "mouse", weight: "20", dose: "10", unit: "mcg/kg" as const },
                  { label: "Ipamorelin (rat)", species: "rat", weight: "250", dose: "100", unit: "mcg/kg" as const },
                  { label: "TB-500 (rat)", species: "rat", weight: "250", dose: "2", unit: "mg/kg" as const },
                  { label: "Sema (mouse, DIO)", species: "mouse", weight: "30", dose: "60", unit: "mcg/kg" as const },
                  { label: "PT-141 (mouse)", species: "mouse", weight: "25", dose: "100", unit: "mcg/kg" as const },
                  { label: "MK-677 (rat, oral)", species: "rat", weight: "300", dose: "10", unit: "mg/kg" as const },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setAnimalSpecies(p.species);
                      setAnimalWeightG(p.weight);
                      setAnimalDose(p.dose);
                      setAnimalDoseUnit(p.unit);
                      const sp = SPECIES.find((s) => s.id === p.species);
                      if (sp) setAnimalWeightG(p.weight);
                    }}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-md px-2.5 py-1 text-zinc-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {results ? (
              <>
                {/* Km factors used */}
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Km Factors Used
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 text-center">
                      <div className="text-2xl font-bold text-[#d4af37]">{results.animalKm}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{selectedSpecies.label} Km</div>
                    </div>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{results.humanKm}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Human Km</div>
                    </div>
                  </div>
                  <div className="mt-3 bg-zinc-800 rounded-lg px-4 py-2.5 text-center">
                    <span className="text-zinc-400 text-xs">Scaling Factor: </span>
                    <span className="font-mono text-sm text-white font-semibold">
                      {results.animalKm} ÷ {results.humanKm} = {formatNum(results.scalingFactor, 4)}
                    </span>
                  </div>
                </div>

                {/* Animal dose summary */}
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Animal Dose Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Dose per kg:</span>
                      <span className="font-mono text-white font-semibold">
                        {animalDoseUnit === "mcg/kg"
                          ? `${formatNum(parseFloat(animalDose))} mcg/kg`
                          : `${formatNum(parseFloat(animalDose))} mg/kg`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Absolute dose (animal):</span>
                      <span className="font-mono text-white font-semibold">
                        {results.absoluteAnimalMcg < 1000
                          ? `${formatNum(results.absoluteAnimalMcg)} mcg`
                          : `${formatNum(results.absoluteAnimalMg)} mg`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Animal weight:</span>
                      <span className="font-mono text-white font-semibold">
                        {results.awKg < 1
                          ? `${parseFloat(animalWeightG)} g`
                          : `${formatNum(results.awKg)} kg`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HED results — main output */}
                <div className="bg-gradient-to-br from-[#d4af37]/10 to-zinc-900 border border-[#d4af37]/30 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4">
                    Human Equivalent Dose (HED)
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg px-4 py-4">
                      <div className="text-xs text-zinc-400 mb-1">HED per kg body weight:</div>
                      <div className="text-3xl font-bold text-white">
                        {results.hedMcgKg < 10
                          ? `${formatNum(results.hedMcgKg, 3)} mcg/kg`
                          : results.hedMcgKg < 1000
                          ? `${formatNum(results.hedMcgKg, 2)} mcg/kg`
                          : `${formatNum(results.hedMgKg, 3)} mg/kg`}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 font-mono">
                        ({formatNum(results.hedMgKg, 4)} mg/kg)
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-lg px-4 py-4">
                      <div className="text-xs text-zinc-400 mb-1">
                        Absolute HED for {results.hwKg} kg human:
                      </div>
                      <div className="text-3xl font-bold text-[#d4af37]">
                        {results.absoluteHEDmcg < 1000
                          ? `${formatNum(results.absoluteHEDmcg, 2)} mcg`
                          : `${formatNum(results.absoluteHEDmg, 3)} mg`}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 font-mono">
                        ({formatNum(results.absoluteHEDmg, 4)} mg total)
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-lg px-4 py-2.5 text-xs font-mono text-zinc-300">
                      {formatNum(results.doseMgKg, 4)} mg/kg × ({results.animalKm} ÷ {results.humanKm}) = {formatNum(results.hedMgKg, 4)} mg/kg × {results.hwKg} kg = {formatNum(results.absoluteHEDmg, 4)} mg
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 text-center text-zinc-500 h-full flex items-center justify-center">
                <div>
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                  </svg>
                  <p className="text-sm">Enter animal dose parameters to calculate HED</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Km Reference Table ─── */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-base font-semibold text-white">
              Species K<sub>m</sub> Reference Table
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              K<sub>m</sub> values from FDA Guidance (2005) &mdash; used in HED conversion
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-500">
                  <th className="text-left px-6 py-3">Species</th>
                  <th className="text-right px-4 py-3">K<sub>m</sub></th>
                  <th className="text-right px-4 py-3">Avg Weight</th>
                  <th className="text-right px-4 py-3">HED Factor vs Human</th>
                  <th className="text-right px-6 py-3">Typical Route</th>
                </tr>
              </thead>
              <tbody>
                {SPECIES.map((s, i) => {
                  const factor = s.km / HUMAN_KM;
                  const isHuman = s.id === "human";
                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-white/5 transition-colors ${isHuman ? "bg-blue-500/5" : i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                    >
                      <td className={`px-6 py-3 font-medium ${isHuman ? "text-blue-400" : "text-white"}`}>
                        {s.label} {isHuman && <span className="text-xs text-blue-400/70 ml-1">(reference)</span>}
                      </td>
                      <td className={`text-right px-4 py-3 font-mono font-bold ${isHuman ? "text-blue-400" : "text-[#d4af37]"}`}>
                        {s.km}
                      </td>
                      <td className="text-right px-4 py-3 text-zinc-300 font-mono">{s.avgWeightLabel}</td>
                      <td className="text-right px-4 py-3 font-mono text-zinc-300">
                        {isHuman ? "1.000×" : `${formatNum(factor, 3)}×`}
                      </td>
                      <td className="text-right px-6 py-3 text-zinc-400 text-xs">
                        {s.id === "mouse" && "IP, SC, IV"}
                        {s.id === "rat" && "IP, SC, IV, PO"}
                        {s.id === "hamster" && "IP, SC"}
                        {s.id === "guinea" && "SC, IP"}
                        {s.id === "rabbit" && "SC, IV, PO"}
                        {s.id === "cat" && "SC, IM, IV"}
                        {s.id === "monkey" && "SC, IV, IM"}
                        {s.id === "dog" && "SC, IV, PO"}
                        {s.id === "human" && "SC, IV, PO, IN"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Multi-species comparison ─── */}
        {results && (
          <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">Cross-Species HED Comparison</h2>
              <p className="text-zinc-400 text-sm mt-1">
                What the same animal dose (
                <span className="font-mono text-white">{animalDose} {animalDoseUnit}</span>) maps to across all species
                → {parseFloat(humanWeight) || 60} kg human HED
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-500">
                    <th className="text-left px-6 py-3">If Studied In</th>
                    <th className="text-right px-4 py-3">K<sub>m</sub></th>
                    <th className="text-right px-4 py-3">HED (mg/kg)</th>
                    <th className="text-right px-6 py-3">Absolute HED ({parseFloat(humanWeight)||60} kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECIES.filter((s) => s.id !== "human").map((s, i) => {
                    const doseMgKg = animalDoseUnit === "mcg/kg"
                      ? parseFloat(animalDose) / 1000
                      : parseFloat(animalDose);
                    const hed = calcHED(doseMgKg, s.km, HUMAN_KM);
                    const absHEDmg = hed * (parseFloat(humanWeight) || 60);
                    const isSelected = s.id === animalSpecies;
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-white/5 ${isSelected ? "bg-[#d4af37]/5 border-l-2 border-l-[#d4af37]" : i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                      >
                        <td className={`px-6 py-3 font-medium ${isSelected ? "text-[#d4af37]" : "text-white"}`}>
                          {s.label}
                          {isSelected && <span className="text-xs text-[#d4af37]/70 ml-1">← selected</span>}
                        </td>
                        <td className="text-right px-4 py-3 font-mono text-zinc-400">{s.km}</td>
                        <td className={`text-right px-4 py-3 font-mono ${isSelected ? "text-[#d4af37] font-bold" : "text-zinc-300"}`}>
                          {formatNum(hed * 1000, 3)} mcg/kg
                        </td>
                        <td className={`text-right px-6 py-3 font-mono font-bold ${isSelected ? "text-[#d4af37]" : "text-white"}`}>
                          {absHEDmg * 1000 < 1000
                            ? `${formatNum(absHEDmg * 1000, 2)} mcg`
                            : `${formatNum(absHEDmg, 3)} mg`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Peptide-specific notes ─── */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowNotes((p) => !p)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
          >
            <div>
              <h2 className="text-base font-semibold text-white">Compound-Specific Scaling Notes</h2>
              <p className="text-zinc-400 text-sm mt-0.5">
                Important caveats for {PEPTIDE_NOTES.length} common research peptides
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-zinc-400 transition-transform ${showNotes ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showNotes && (
            <div className="border-t border-white/10 px-6 py-5">
              <div className="grid sm:grid-cols-2 gap-3">
                {PEPTIDE_NOTES.map((n) => (
                  <div key={n.name} className="bg-zinc-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-white text-sm">{n.name}</span>
                      <span className="text-[10px] bg-zinc-700 text-zinc-300 rounded px-1.5 py-0.5">{n.category}</span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">{n.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Important limitations ─── */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-3">
            ⚠ Important Limitations
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-300 leading-relaxed">
            <div>
              <p className="font-semibold text-white mb-1">What allometric scaling DOES account for:</p>
              <ul className="space-y-1 text-zinc-400 text-xs">
                <li>• Metabolic rate differences between species</li>
                <li>• Body surface area normalization</li>
                <li>• Pharmacokinetic equivalence (first approximation)</li>
                <li>• FDA-validated scaling methodology</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">What allometric scaling DOES NOT account for:</p>
              <ul className="space-y-1 text-zinc-400 text-xs">
                <li>• Species-specific receptor density/affinity differences</li>
                <li>• Route-specific bioavailability differences</li>
                <li>• First-pass metabolism variation by species</li>
                <li>• Protein binding differences</li>
                <li>• Target organ differences or disease state</li>
                <li>• Intranasal CNS transport (route-specific)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Catalog rail */}
        <ToolCatalogCTA className="py-2" />

        {/* ─── RUO Disclaimer ─── */}
        <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-5 text-center">
          <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
            Research Use Only — Not for Clinical Use
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-2xl mx-auto">
            HED calculations are provided for research modeling and study design purposes only.
            This calculator does not constitute medical advice, clinical translation guidance, or
            dosing recommendations. All Nexphoria peptides are for in vitro and preclinical research
            only and are not approved for human administration.
          </p>
        </div>

        {/* ─── Related tools ─── */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4">Related Research Tools</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: "/tools/body-weight-dose-calculator", title: "Body Weight Dose Calculator", desc: "Convert mg/kg protocols to absolute doses for mice, rats, and other subjects." },
              { href: "/tools/half-life-calculator", title: "Half-Life Calculator", desc: "Plasma clearance milestones and dosing frequency guidance for 30+ peptides." },
              { href: "/tools/dosing-frequency-planner", title: "Dosing Frequency Planner", desc: "Build a weekly injection schedule for multi-compound research protocols." },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="bg-zinc-900 border border-white/10 hover:border-[#d4af37]/40 rounded-xl p-4 transition-colors group"
              >
                <div className="font-semibold text-white group-hover:text-[#d4af37] transition-colors text-sm mb-1">
                  {t.title}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
