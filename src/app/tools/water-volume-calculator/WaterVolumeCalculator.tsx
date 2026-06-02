"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// Popular concentration targets for quick reference
const CONCENTRATION_PRESETS: {
  compound: string;
  vialMg: number;
  targetConcMgPerMl: number;
  notes: string;
}[] = [
  { compound: "BPC-157", vialMg: 5, targetConcMgPerMl: 0.5, notes: "Standard 500 mcg/mL working stock" },
  { compound: "BPC-157", vialMg: 5, targetConcMgPerMl: 1.0, notes: "1 mg/mL for low-volume injections" },
  { compound: "BPC-157", vialMg: 5, targetConcMgPerMl: 2.0, notes: "2 mg/mL concentrated stock" },
  { compound: "Semaglutide", vialMg: 5, targetConcMgPerMl: 5.0, notes: "5 mg/mL standard research stock" },
  { compound: "Tirzepatide", vialMg: 10, targetConcMgPerMl: 5.0, notes: "5 mg/mL standard research stock" },
  { compound: "Tirzepatide", vialMg: 10, targetConcMgPerMl: 2.0, notes: "2 mg/mL diluted working solution" },
  { compound: "TB-500", vialMg: 10, targetConcMgPerMl: 1.0, notes: "1 mg/mL for SC administration" },
  { compound: "GHK-Cu", vialMg: 100, targetConcMgPerMl: 10.0, notes: "10 mg/mL concentrated stock" },
  { compound: "Ipamorelin", vialMg: 5, targetConcMgPerMl: 0.5, notes: "500 mcg/mL standard stock" },
  { compound: "CJC-1295", vialMg: 5, targetConcMgPerMl: 1.0, notes: "1 mg/mL standard working stock" },
  { compound: "MK-677", vialMg: 10, targetConcMgPerMl: 2.0, notes: "2 mg/mL oral research stock" },
  { compound: "Retatrutide", vialMg: 10, targetConcMgPerMl: 5.0, notes: "5 mg/mL standard research stock" },
  { compound: "NAD+", vialMg: 100, targetConcMgPerMl: 10.0, notes: "10 mg/mL — use PBS/sterile saline only" },
  { compound: "Sermorelin", vialMg: 5, targetConcMgPerMl: 0.5, notes: "500 mcg/mL standard stock" },
  { compound: "Epitalon", vialMg: 50, targetConcMgPerMl: 5.0, notes: "5 mg/mL — use sterile saline" },
];

// Quick reference table for common concentration targets
const QUICK_REF_TABLE = [
  { concMgMl: 0.5, concMcgMl: 500, label: "0.5 mg/mL", note: "BPC-157, Ipamorelin, Sermorelin" },
  { concMgMl: 1.0, concMcgMl: 1000, label: "1 mg/mL", note: "TB-500, CJC-1295, standard GHRPs" },
  { concMgMl: 2.0, concMcgMl: 2000, label: "2 mg/mL", note: "Tirzepatide (dilute), BPC-157 (concentrated)" },
  { concMgMl: 5.0, concMcgMl: 5000, label: "5 mg/mL", note: "Semaglutide, Tirzepatide, Retatrutide" },
  { concMgMl: 10.0, concMcgMl: 10000, label: "10 mg/mL", note: "GHK-Cu, NAD+, high-dose stacks" },
];

type ConcUnit = "mg/mL" | "mcg/mL";

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

interface Results {
  bacWaterMl: number;
  dosesPerVial: number | null;
  volumePerDoseMl: number | null;
  volumePerDoseUnits: number | null;
  actualConcMgMl: number;
  actualConcMcgMl: number;
}

export default function WaterVolumeCalculator() {
  const [vialMg, setVialMg] = useState<string>("5");
  const [targetConc, setTargetConc] = useState<string>("0.5");
  const [concUnit, setConcUnit] = useState<ConcUnit>("mg/mL");
  const [desiredDose, setDesiredDose] = useState<string>("");
  const [doseUnit, setDoseUnit] = useState<"mcg" | "mg">("mcg");
  const [activePreset, setActivePreset] = useState<string>("");

  const applyPreset = useCallback(
    (p: (typeof CONCENTRATION_PRESETS)[0]) => {
      setVialMg(String(p.vialMg));
      const concVal =
        concUnit === "mg/mL"
          ? String(p.targetConcMgPerMl)
          : String(p.targetConcMgPerMl * 1000);
      setTargetConc(concVal);
      setActivePreset(`${p.compound}-${p.vialMg}-${p.targetConcMgPerMl}`);
    },
    [concUnit]
  );

  // Parse inputs
  const vialMgNum = parseFloat(vialMg) || 0;
  const targetConcNum = parseFloat(targetConc) || 0;

  // Normalize to mg/mL
  const targetConcMgMl =
    concUnit === "mg/mL" ? targetConcNum : targetConcNum / 1000;

  // Core calculation: volume = mass / concentration
  const bacWaterMl =
    vialMgNum > 0 && targetConcMgMl > 0
      ? round4(vialMgNum / targetConcMgMl)
      : 0;

  // Dose calculations (optional)
  const doseMcg = (() => {
    if (!desiredDose) return 0;
    const n = parseFloat(desiredDose);
    if (!n) return 0;
    return doseUnit === "mcg" ? n : n * 1000;
  })();

  const results: Results | null =
    vialMgNum > 0 && targetConcMgMl > 0
      ? {
          bacWaterMl,
          dosesPerVial:
            doseMcg > 0
              ? Math.floor((vialMgNum * 1000) / doseMcg)
              : null,
          volumePerDoseMl:
            doseMcg > 0
              ? round4(doseMcg / (targetConcMgMl * 1000))
              : null,
          volumePerDoseUnits:
            doseMcg > 0
              ? round2((doseMcg / (targetConcMgMl * 1000)) * 100)
              : null,
          actualConcMgMl: targetConcMgMl,
          actualConcMcgMl: targetConcMgMl * 1000,
        }
      : null;

  const isValid = vialMgNum > 0 && targetConcMgMl > 0;

  return (
    <div style={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20"
        style={{ backgroundColor: "#010101" }}
      >
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Water Volume Calculator" },
            ]}
          />
          <p
            className="text-xs uppercase tracking-widest mb-5"
            style={{ color: "#C9DD69" }}
          >
            Research Tool
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            BAC Water Volume Calculator
          </h1>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Enter your vial size and desired final concentration to get the
            exact volume of bacteriostatic water to add. Optionally enter a
            per-dose amount to see doses per vial and injection volume.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">

          {/* Presets */}
          <div className="mb-8">
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#666666" }}
            >
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {CONCENTRATION_PRESETS.map((p) => {
                const key = `${p.compound}-${p.vialMg}-${p.targetConcMgPerMl}`;
                return (
                  <button
                    key={key}
                    onClick={() => applyPreset(p)}
                    className="text-xs px-3 py-1.5 rounded-sm transition-all"
                    style={{
                      border: `1px solid ${activePreset === key ? "#B8A44C" : "#DDDBD5"}`,
                      backgroundColor:
                        activePreset === key ? "#B8A44C22" : "transparent",
                      color: activePreset === key ? "#000" : "#555",
                      fontWeight: activePreset === key ? 600 : 400,
                    }}
                  >
                    {p.compound} {p.vialMg}mg @ {p.targetConcMgPerMl} mg/mL
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input card */}
          <div
            className="rounded-sm p-8 mb-6"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECEAE4",
              borderTop: "2px solid #B8A44C",
            }}
          >
            <h2
              className="text-lg mb-6"
              style={{ fontWeight: 500, color: "#000" }}
            >
              Inputs
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Vial size */}
              <div>
                <label
                  htmlFor="vialMg"
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#666666" }}
                >
                  Vial Size (mg)
                </label>
                <input
                  id="vialMg"
                  type="number"
                  min="0"
                  step="0.5"
                  value={vialMg}
                  onChange={(e) => {
                    setVialMg(e.target.value);
                    setActivePreset("");
                  }}
                  className="w-full px-4 py-3 rounded-sm text-sm"
                  style={{
                    border: "1px solid #DDDBD5",
                    backgroundColor: "#FAFAF8",
                    color: "#000",
                    outline: "none",
                  }}
                  placeholder="e.g. 5"
                />
                <p className="text-xs mt-1.5" style={{ color: "#999" }}>
                  Total peptide mass in vial
                </p>
              </div>

              {/* Target concentration with unit toggle */}
              <div>
                <label
                  htmlFor="targetConc"
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#666666" }}
                >
                  Desired Concentration
                </label>
                <div className="flex gap-2">
                  <input
                    id="targetConc"
                    type="number"
                    min="0"
                    step="0.1"
                    value={targetConc}
                    onChange={(e) => {
                      setTargetConc(e.target.value);
                      setActivePreset("");
                    }}
                    className="flex-1 px-4 py-3 rounded-sm text-sm"
                    style={{
                      border: "1px solid #DDDBD5",
                      backgroundColor: "#FAFAF8",
                      color: "#000",
                      outline: "none",
                    }}
                    placeholder="e.g. 0.5"
                  />
                  <select
                    value={concUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value as ConcUnit;
                      // Convert current value
                      const currentNum = parseFloat(targetConc) || 0;
                      if (newUnit === "mcg/mL" && concUnit === "mg/mL") {
                        setTargetConc(String(currentNum * 1000));
                      } else if (newUnit === "mg/mL" && concUnit === "mcg/mL") {
                        setTargetConc(String(round4(currentNum / 1000)));
                      }
                      setConcUnit(newUnit);
                      setActivePreset("");
                    }}
                    className="px-3 py-3 rounded-sm text-sm"
                    style={{
                      border: "1px solid #DDDBD5",
                      backgroundColor: "#FAFAF8",
                      color: "#000",
                      outline: "none",
                      minWidth: "90px",
                    }}
                  >
                    <option value="mg/mL">mg/mL</option>
                    <option value="mcg/mL">mcg/mL</option>
                  </select>
                </div>
                <p className="text-xs mt-1.5" style={{ color: "#999" }}>
                  Target working concentration
                </p>
              </div>
            </div>

            {/* Optional dose inputs */}
            <div
              className="mt-6 pt-6"
              style={{ borderTop: "1px solid #ECEAE4" }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: "#666666" }}
              >
                Optional: Per-Dose Calculation
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="desiredDose"
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: "#666666" }}
                  >
                    Dose Per Injection
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="desiredDose"
                      type="number"
                      min="0"
                      step="1"
                      value={desiredDose}
                      onChange={(e) => setDesiredDose(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-sm text-sm"
                      style={{
                        border: "1px solid #DDDBD5",
                        backgroundColor: "#FAFAF8",
                        color: "#000",
                        outline: "none",
                      }}
                      placeholder="e.g. 250"
                    />
                    <select
                      value={doseUnit}
                      onChange={(e) =>
                        setDoseUnit(e.target.value as "mcg" | "mg")
                      }
                      className="px-3 py-3 rounded-sm text-sm"
                      style={{
                        border: "1px solid #DDDBD5",
                        backgroundColor: "#FAFAF8",
                        color: "#000",
                        outline: "none",
                        minWidth: "70px",
                      }}
                    >
                      <option value="mcg">mcg</option>
                      <option value="mg">mg</option>
                    </select>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "#999" }}>
                    Leave blank to skip dose calculation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {isValid && results ? (
            <div className="space-y-4">
              {/* Primary answer — big display */}
              <div
                className="rounded-sm p-8 text-center"
                style={{
                  backgroundColor: "#010101",
                  border: "1px solid #2A2A28",
                }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: "#C9DD69" }}
                >
                  BAC Water to Add
                </p>
                <div
                  className="text-6xl md:text-7xl mb-2 tracking-tight"
                  style={{
                    fontWeight: 200,
                    color: "#F9F9F9",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {results.bacWaterMl}{" "}
                  <span className="text-3xl md:text-4xl" style={{ color: "#A0A0A0" }}>
                    mL
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#A0A0A0" }}>
                  Gives {results.actualConcMgMl} mg/mL ={" "}
                  {results.actualConcMcgMl} mcg/mL in a {vialMg} mg vial
                </p>
              </div>

              {/* Result cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className="rounded-sm p-5 text-center"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "#666666" }}
                  >
                    BAC Water
                  </p>
                  <p
                    className="text-2xl font-light tracking-tight"
                    style={{ color: "#000" }}
                  >
                    {results.bacWaterMl} mL
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#999" }}>
                    = {round2(results.bacWaterMl * 100)} units (100U syringe)
                  </p>
                </div>

                <div
                  className="rounded-sm p-5 text-center"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "#666666" }}
                  >
                    Concentration
                  </p>
                  <p
                    className="text-2xl font-light tracking-tight"
                    style={{ color: "#000" }}
                  >
                    {results.actualConcMgMl} mg/mL
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#999" }}>
                    {results.actualConcMcgMl} mcg/mL
                  </p>
                </div>

                <div
                  className="rounded-sm p-5 text-center"
                  style={{
                    backgroundColor:
                      results.dosesPerVial !== null
                        ? "#FFFFFF"
                        : "#FAFAF8",
                    border: "1px solid #ECEAE4",
                    opacity: results.dosesPerVial !== null ? 1 : 0.5,
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "#666666" }}
                  >
                    Doses / Vial
                  </p>
                  <p
                    className="text-2xl font-light tracking-tight"
                    style={{ color: "#000" }}
                  >
                    {results.dosesPerVial !== null
                      ? results.dosesPerVial
                      : "—"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#999" }}>
                    {results.dosesPerVial !== null
                      ? `at ${desiredDose} ${doseUnit} per dose`
                      : "Enter dose above"}
                  </p>
                </div>

                <div
                  className="rounded-sm p-5 text-center"
                  style={{
                    backgroundColor:
                      results.volumePerDoseMl !== null
                        ? "#FFFFFF"
                        : "#FAFAF8",
                    border: "1px solid #ECEAE4",
                    opacity: results.volumePerDoseMl !== null ? 1 : 0.5,
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "#666666" }}
                  >
                    Volume / Dose
                  </p>
                  <p
                    className="text-2xl font-light tracking-tight"
                    style={{ color: "#000" }}
                  >
                    {results.volumePerDoseMl !== null
                      ? `${results.volumePerDoseMl} mL`
                      : "—"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#999" }}>
                    {results.volumePerDoseUnits !== null
                      ? `${results.volumePerDoseUnits} units (100U syringe)`
                      : "Enter dose above"}
                  </p>
                </div>
              </div>

              {/* Multi-concentration table */}
              <div
                className="rounded-sm p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECEAE4",
                }}
              >
                <h3
                  className="text-sm font-medium mb-4"
                  style={{ color: "#000" }}
                >
                  Alternative Concentrations for {vialMg} mg Vial
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #ECEAE4" }}>
                        <th
                          className="text-left py-2 pr-4 text-xs uppercase tracking-widest font-medium"
                          style={{ color: "#666666" }}
                        >
                          Concentration
                        </th>
                        <th
                          className="text-right py-2 pr-4 text-xs uppercase tracking-widest font-medium"
                          style={{ color: "#666666" }}
                        >
                          BAC Water (mL)
                        </th>
                        <th
                          className="text-right py-2 pr-4 text-xs uppercase tracking-widest font-medium hidden md:table-cell"
                          style={{ color: "#666666" }}
                        >
                          BAC Water (units)
                        </th>
                        <th
                          className="text-right py-2 text-xs uppercase tracking-widest font-medium hidden md:table-cell"
                          style={{ color: "#666666" }}
                        >
                          Typical Use
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUICK_REF_TABLE.map((row) => {
                        const ml = vialMgNum > 0 ? round4(vialMgNum / row.concMgMl) : 0;
                        const isActive =
                          Math.abs(row.concMgMl - results.actualConcMgMl) < 0.001;
                        return (
                          <tr
                            key={row.concMgMl}
                            style={{
                              borderBottom: "1px solid #F0EEE8",
                              backgroundColor: isActive ? "#B8A44C11" : "transparent",
                            }}
                          >
                            <td
                              className="py-2.5 pr-4 font-medium"
                              style={{ color: isActive ? "#8A6A00" : "#000" }}
                            >
                              {row.label}
                              {isActive && (
                                <span
                                  className="ml-2 text-xs px-1.5 py-0.5 rounded-sm"
                                  style={{
                                    backgroundColor: "#B8A44C22",
                                    color: "#7A6020",
                                    border: "1px solid #B8A44C44",
                                  }}
                                >
                                  selected
                                </span>
                              )}
                            </td>
                            <td
                              className="py-2.5 pr-4 text-right font-mono"
                              style={{ color: isActive ? "#8A6A00" : "#333" }}
                            >
                              {ml} mL
                            </td>
                            <td
                              className="py-2.5 pr-4 text-right font-mono hidden md:table-cell"
                              style={{ color: "#555" }}
                            >
                              {round2(ml * 100)} U
                            </td>
                            <td
                              className="py-2.5 text-right text-xs hidden md:table-cell"
                              style={{ color: "#666666" }}
                            >
                              {row.note}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-sm p-8 text-center"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECEAE4",
              }}
            >
              <p className="text-sm" style={{ color: "#666666" }}>
                Enter a vial size and desired concentration to see results.
              </p>
            </div>
          )}

          {/* How to use */}
          <div
            className="mt-10 rounded-sm p-8"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECEAE4",
            }}
          >
            <h2 className="text-base font-medium mb-5" style={{ color: "#000" }}>
              How to Use This Calculator
            </h2>
            <ol className="space-y-3">
              {[
                {
                  step: "1",
                  text: "Enter the total mass (mg) printed on your lyophilized vial. This is the amount of dry peptide.",
                },
                {
                  step: "2",
                  text: "Enter your desired final concentration in mg/mL or mcg/mL. The calculator converts between units automatically.",
                },
                {
                  step: "3",
                  text: "Read the BAC water volume from the large display. This is exactly how many mL of bacteriostatic water to add.",
                },
                {
                  step: "4",
                  text: "(Optional) Enter your per-injection dose to see how many doses the vial contains and the exact injection volume in mL and insulin syringe units.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: "#B8A44C22", color: "#8A6A00" }}
                  >
                    {item.step}
                  </span>
                  <p className="text-sm pt-0.5" style={{ color: "#444", lineHeight: 1.65 }}>
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div
            className="mt-6 rounded-sm p-8"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECEAE4",
            }}
          >
            <h2 className="text-base font-medium mb-5" style={{ color: "#000" }}>
              Reconstitution Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: "Inject along the vial wall",
                  body: "Point the needle toward the glass, not directly at the lyophilized cake. This prevents protein denaturation from mechanical shear.",
                },
                {
                  title: "Swirl, don't vortex",
                  body: "Gently swirl the vial to dissolve. Vigorous vortexing can form bubbles and aggregate fragile peptide bonds.",
                },
                {
                  title: "Use BAC water for multi-dose vials",
                  body: "0.9% benzyl alcohol acts as a bacteriostatic preservative — safe for multiple draw-ups over 4 weeks at 4°C.",
                },
                {
                  title: "Use sterile saline for NAD+ and Epitalon",
                  body: "NAD+ and Epitalon should be reconstituted with sterile saline or PBS, not BAC water. Benzyl alcohol can oxidize the nicotinamide ring.",
                },
                {
                  title: "Label immediately after reconstitution",
                  body: "Write compound name, concentration (mg/mL), reconstitution date, and initials on the vial with a permanent marker.",
                },
                {
                  title: "Don't overfill — use exact volume",
                  body: "Adding more solvent than calculated lowers your concentration. Under-filling makes injection volumes tiny and error-prone.",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="p-4 rounded-sm"
                  style={{ backgroundColor: "#FAFAF8", border: "1px solid #ECEAE4" }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: "#000" }}>
                    {tip.title}
                  </p>
                  <p className="text-sm" style={{ color: "#666", lineHeight: 1.6 }}>
                    {tip.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick reference table */}
          <div
            className="mt-6 rounded-sm p-8"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECEAE4",
            }}
          >
            <h2 className="text-base font-medium mb-5" style={{ color: "#000" }}>
              Popular Reconstitution Reference Table
            </h2>
            <p className="text-sm mb-5" style={{ color: "#666" }}>
              Click any row to load it into the calculator.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid #ECEAE4" }}>
                    {["Compound", "Vial Size", "Target Conc.", "BAC Water", "Notes"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-3 text-xs uppercase tracking-widest font-medium"
                          style={{ color: "#666666" }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {CONCENTRATION_PRESETS.map((p) => {
                    const ml = round4(p.vialMg / p.targetConcMgPerMl);
                    const key = `${p.compound}-${p.vialMg}-${p.targetConcMgPerMl}`;
                    return (
                      <tr
                        key={key}
                        onClick={() => applyPreset(p)}
                        className="cursor-pointer transition-colors hover:bg-amber-50"
                        style={{
                          borderBottom: "1px solid #F0EEE8",
                          backgroundColor:
                            activePreset === key ? "#B8A44C0D" : undefined,
                        }}
                      >
                        <td
                          className="py-2.5 pr-3 font-medium"
                          style={{ color: "#000" }}
                        >
                          {p.compound}
                        </td>
                        <td className="py-2.5 pr-3" style={{ color: "#333" }}>
                          {p.vialMg} mg
                        </td>
                        <td className="py-2.5 pr-3 font-mono" style={{ color: "#333" }}>
                          {p.targetConcMgPerMl} mg/mL
                        </td>
                        <td
                          className="py-2.5 pr-3 font-mono font-medium"
                          style={{ color: "#B8A44C" }}
                        >
                          {ml} mL
                        </td>
                        <td
                          className="py-2.5 text-xs"
                          style={{ color: "#666666" }}
                        >
                          {p.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <div
            className="mt-6 rounded-sm p-6"
            style={{
              backgroundColor: "#FFF8E7",
              border: "1px solid #F0E0A0",
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: "#8A6A00" }}>
              Research Use Only
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#7A6020" }}>
              This calculator is provided for research planning purposes only.
              All peptide compounds are strictly for laboratory and academic
              research use. Not for human or veterinary administration. Not
              intended to diagnose, treat, cure, or prevent any condition.
              Verify all calculations before use.
            </p>
          </div>

          {/* Related tools */}
          <div className="mt-10">
            <p
              className="text-xs uppercase tracking-widest mb-5"
              style={{ color: "#666666" }}
            >
              Related Tools
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  href: "/tools/reconstitution-calculator",
                  title: "Reconstitution Calculator",
                  desc: "Full reconstitution calculator: BAC water, dose volume, doses per vial, syringe units.",
                },
                {
                  href: "/tools/cost-per-dose-calculator",
                  title: "Cost Per Dose Calculator",
                  desc: "Calculate cost per dose, doses per vial, weekly and monthly research costs.",
                },
                {
                  href: "/tools/unit-converter",
                  title: "Unit Converter",
                  desc: "Convert mcg ↔ mg, mL ↔ syringe units, nmol/L ↔ ng/mL, and dilution factors.",
                },
              ].map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group block rounded-sm p-5 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                    textDecoration: "none",
                  }}
                >
                  <p
                    className="text-sm font-medium mb-1 group-hover:opacity-70 transition-opacity"
                    style={{ color: "#000" }}
                  >
                    {t.title}
                  </p>
                  <p className="text-xs" style={{ color: "#666", lineHeight: 1.55 }}>
                    {t.desc}
                  </p>
                  <p
                    className="text-xs mt-3 font-medium"
                    style={{ color: "#B8A44C" }}
                  >
                    Open →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
