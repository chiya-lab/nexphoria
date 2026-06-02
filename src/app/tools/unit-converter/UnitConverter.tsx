"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Tab definitions ────────────────────────────────────────────────────────
type Tab = "mass" | "syringe" | "concentration" | "dilution";

const TABS: { id: Tab; label: string; sub: string }[] = [
  { id: "mass", label: "Mass Units", sub: "mcg / mg / g / IU" },
  { id: "syringe", label: "Syringe Units", sub: "mL ↔ U (insulin)" },
  { id: "concentration", label: "Concentration", sub: "nmol/L ↔ ng/mL" },
  { id: "dilution", label: "Dilution Factor", sub: "Stock → Working" },
];

// ─── Molecular weights for common peptides (Da = g/mol) ─────────────────────
const PEPTIDE_MW: { name: string; mw: number; slug: string }[] = [
  { name: "BPC-157", mw: 1419.5, slug: "bpc-157" },
  { name: "TB-500 (Thymosin β4)", mw: 4963.5, slug: "tb-500" },
  { name: "Semaglutide", mw: 4113.6, slug: "semaglutide" },
  { name: "Tirzepatide", mw: 4813.5, slug: "tirzepatide" },
  { name: "Retatrutide", mw: 4767.4, slug: "retatrutide" },
  { name: "Ipamorelin", mw: 711.9, slug: "ipamorelin" },
  { name: "CJC-1295 No DAC", mw: 3367.0, slug: "cjc-1295-no-dac" },
  { name: "CJC-1295/Ipamorelin blend", mw: 711.9, slug: "cjc-1295-ipamorelin" },
  { name: "GHRP-2", mw: 817.9, slug: "ghrp-2" },
  { name: "Sermorelin", mw: 3357.9, slug: "sermorelin" },
  { name: "Tesamorelin", mw: 5136.5, slug: "tesamorelin" },
  { name: "MK-677 (Ibutamoren)", mw: 624.8, slug: "mk-677" },
  { name: "GHK-Cu", mw: 340.4, slug: "ghk-cu" },
  { name: "NAD+", mw: 663.4, slug: "nad-plus" },
  { name: "Epithalon", mw: 390.4, slug: "epitalon" },
  { name: "MOTS-c", mw: 2174.6, slug: "mots-c" },
  { name: "PT-141 (Bremelanotide)", mw: 1025.2, slug: "pt-141" },
  { name: "Melanotan II", mw: 1024.2, slug: "melanotan-2" },
  { name: "Kisspeptin-10", mw: 1302.5, slug: "kisspeptin" },
  { name: "Oxytocin", mw: 1007.2, slug: "oxytocin" },
  { name: "KPV", mw: 357.4, slug: "kpv" },
  { name: "Selank", mw: 751.9, slug: "selank" },
  { name: "Semax", mw: 813.0, slug: "semax" },
  { name: "DSIP", mw: 848.9, slug: "dsip" },
  { name: "Snap-8", mw: 1075.2, slug: "snap-8" },
  { name: "SS-31", mw: 639.8, slug: "ss-31" },
  { name: "AOD-9604", mw: 1815.1, slug: "aod9604" },
  { name: "Follistatin 344", mw: 37000, slug: "follistatin-344" },
];

// ─── IU conversion factors (IU per mg) ─────────────────────────────────────
const IU_FACTORS: { name: string; iuPerMg: number }[] = [
  { name: "HCG (hCG)", iuPerMg: 9500 },
  { name: "HGH (Somatropin)", iuPerMg: 3 },
  { name: "EPO (Erythropoietin)", iuPerMg: 200000 },
  { name: "Insulin (standard)", iuPerMg: 28.6 },
  { name: "FSH", iuPerMg: 25000 },
  { name: "LH", iuPerMg: 12000 },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
function fmt(n: number, maxDec = 6): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  // Use toPrecision for small numbers
  if (n !== 0 && Math.abs(n) < 0.001) return n.toPrecision(4);
  // Strip trailing zeros
  return parseFloat(n.toFixed(maxDec)).toString();
}

function parseNum(s: string): number {
  const v = parseFloat(s.replace(/,/g, ""));
  return isNaN(v) ? 0 : v;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Tab 1: Mass unit conversions mcg ↔ mg ↔ g + IU */
function MassTab() {
  const [input, setInput] = useState("500");
  const [fromUnit, setFromUnit] = useState<"mcg" | "mg" | "g">("mcg");
  const [iuSubstance, setIuSubstance] = useState(IU_FACTORS[1]);
  const [showIU, setShowIU] = useState(false);

  const val = parseNum(input);

  // Convert to mcg first
  const toMcg = fromUnit === "mcg" ? val : fromUnit === "mg" ? val * 1000 : val * 1_000_000;
  const toMg = toMcg / 1000;
  const toG = toMcg / 1_000_000;
  const toIU = toMg * iuSubstance.iuPerMg;

  const selectStyle = {
    backgroundColor: "#1A1A18",
    color: "#F9F9F9",
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-1" style={{ color: "#F9F9F9" }}>
        Mass Unit Converter
      </h2>
      <p className="text-sm mb-6" style={{ color: "#666666" }}>
        Convert between micrograms (mcg), milligrams (mg), and grams (g). Optionally convert to International Units (IU) for compounds with known activity factors.
      </p>

      {/* Input row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-40">
          <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#666666" }}>
            Value
          </label>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-sm px-3 py-2 text-sm"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #333",
              color: "#F9F9F9",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#666666" }}>
            From Unit
          </label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as "mcg" | "mg" | "g")} style={selectStyle}>
            <option value="mcg">mcg (micrograms)</option>
            <option value="mg">mg (milligrams)</option>
            <option value="g">g (grams)</option>
          </select>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Micrograms (mcg)", value: fmt(toMcg, 3) },
          { label: "Milligrams (mg)", value: fmt(toMg, 6) },
          { label: "Grams (g)", value: fmt(toG, 9) },
        ].map((r) => (
          <div
            key={r.label}
            className="rounded-sm p-4"
            style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28" }}
          >
            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: "#666666" }}>
              {r.label}
            </p>
            <p className="text-xl font-light" style={{ color: "#C9DD69" }}>
              {r.value}
            </p>
          </div>
        ))}
      </div>

      {/* IU toggle */}
      <button
        onClick={() => setShowIU(!showIU)}
        className="text-xs mb-4 flex items-center gap-1.5"
        style={{ color: "#B8A44C", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span
          className="inline-block w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold"
          style={{ border: "1px solid #B8A44C", color: showIU ? "#C9DD69" : "#555" }}
        >
          {showIU ? "✓" : ""}
        </span>
        Also convert to International Units (IU)
      </button>

      {showIU && (
        <div
          className="rounded-sm p-5"
          style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28" }}
        >
          <div className="flex flex-wrap gap-3 items-end mb-4">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#666666" }}>
                Substance
              </label>
              <select
                value={iuSubstance.name}
                onChange={(e) => {
                  const found = IU_FACTORS.find((f) => f.name === e.target.value);
                  if (found) setIuSubstance(found);
                }}
                style={selectStyle}
              >
                {IU_FACTORS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs pb-2" style={{ color: "#666" }}>
              Factor: {iuSubstance.iuPerMg.toLocaleString()} IU/mg
            </div>
          </div>
          <p className="text-2xl font-light" style={{ color: "#C9DD69" }}>
            {fmt(toIU, 2)} IU
          </p>
          <p className="text-xs mt-1" style={{ color: "#666" }}>
            = {fmt(toMg, 6)} mg × {iuSubstance.iuPerMg.toLocaleString()} IU/mg
          </p>
        </div>
      )}

      {/* Reference table */}
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-3" style={{ color: "#A0A0A0" }}>
          Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2A28" }}>
                {["mcg", "mg", "g"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs uppercase tracking-wider" style={{ color: "#666" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [1, 0.001, 0.000001],
                [100, 0.1, 0.0001],
                [250, 0.25, 0.00025],
                [500, 0.5, 0.0005],
                [1000, 1, 0.001],
                [2000, 2, 0.002],
                [5000, 5, 0.005],
                [10000, 10, 0.01],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1A1A18" }}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 px-3" style={{ color: j === 0 ? "#F9F9F9" : "#A0A0A0" }}>
                      {typeof cell === "number" ? cell.toString() : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Tab 2: mL ↔ insulin syringe units */
function SyringeTab() {
  const [mlInput, setMlInput] = useState("0.1");
  const [unitsInput, setUnitsInput] = useState("10");
  const [syringeSize, setSyringeSize] = useState<100 | 50 | 30>(100);

  const mlToUnits = useCallback(
    (ml: number) => ml * syringeSize,
    [syringeSize]
  );
  const unitsToMl = useCallback(
    (u: number) => u / syringeSize,
    [syringeSize]
  );

  const selectStyle = {
    backgroundColor: "#1A1A18",
    color: "#F9F9F9",
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  };

  const mlVal = parseNum(mlInput);
  const unitVal = parseNum(unitsInput);

  return (
    <div>
      <h2 className="text-lg font-medium mb-1" style={{ color: "#F9F9F9" }}>
        Syringe Unit Converter
      </h2>
      <p className="text-sm mb-6" style={{ color: "#666666" }}>
        Convert between mL (milliliters) and insulin syringe units (U). Insulin syringes come in 100U/mL, 50U/mL, and 30U/mL scales — make sure you select the right one.
      </p>

      {/* Syringe selector */}
      <div className="mb-6">
        <label className="block text-xs mb-2 uppercase tracking-wider" style={{ color: "#666666" }}>
          Syringe Scale
        </label>
        <div className="flex gap-3 flex-wrap">
          {([100, 50, 30] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSyringeSize(s)}
              className="px-4 py-2 rounded-sm text-sm transition-all"
              style={{
                backgroundColor: syringeSize === s ? "#C9DD69" : "#1A1A18",
                color: syringeSize === s ? "#000" : "#A0A0A0",
                border: `1px solid ${syringeSize === s ? "#C9DD69" : "#333"}`,
                fontWeight: syringeSize === s ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {s}U/mL syringe
            </button>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "#666" }}>
          Most research syringes are 100U/mL. Verify your syringe label.
        </p>
      </div>

      {/* Two-way converters */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* mL → Units */}
        <div
          className="rounded-sm p-5"
          style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28" }}
        >
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#666666" }}>
            mL → Syringe Units
          </p>
          <input
            type="number"
            value={mlInput}
            onChange={(e) => setMlInput(e.target.value)}
            className="w-full rounded-sm px-3 py-2 text-sm mb-3"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #333",
              color: "#F9F9F9",
              outline: "none",
            }}
            placeholder="mL"
            step="0.01"
          />
          <p className="text-3xl font-light" style={{ color: "#C9DD69" }}>
            {fmt(mlToUnits(mlVal), 2)} U
          </p>
          <p className="text-xs mt-1" style={{ color: "#555" }}>
            {fmt(mlVal, 4)} mL × {syringeSize} = {fmt(mlToUnits(mlVal), 2)} units
          </p>
        </div>

        {/* Units → mL */}
        <div
          className="rounded-sm p-5"
          style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28" }}
        >
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#666666" }}>
            Syringe Units → mL
          </p>
          <input
            type="number"
            value={unitsInput}
            onChange={(e) => setUnitsInput(e.target.value)}
            className="w-full rounded-sm px-3 py-2 text-sm mb-3"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #333",
              color: "#F9F9F9",
              outline: "none",
            }}
            placeholder="Units"
            step="1"
          />
          <p className="text-3xl font-light" style={{ color: "#C9DD69" }}>
            {fmt(unitsToMl(unitVal), 4)} mL
          </p>
          <p className="text-xs mt-1" style={{ color: "#555" }}>
            {fmt(unitVal, 1)} units ÷ {syringeSize} = {fmt(unitsToMl(unitVal), 4)} mL
          </p>
        </div>
      </div>

      {/* Reference table */}
      <h3 className="text-sm font-medium mb-3" style={{ color: "#A0A0A0" }}>
        Reference Table ({syringeSize}U/mL syringe)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2A28" }}>
              {["Volume (mL)", "Syringe Units (U)", "Tick marks"].map((h) => (
                <th key={h} className="text-left py-2 px-3 text-xs uppercase tracking-wider" style={{ color: "#666" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0].map((ml) => {
              const u = ml * syringeSize;
              return (
                <tr key={ml} style={{ borderBottom: "1px solid #1A1A18" }}>
                  <td className="py-2 px-3" style={{ color: "#F9F9F9" }}>{ml} mL</td>
                  <td className="py-2 px-3" style={{ color: "#C9DD69" }}>{u} U</td>
                  <td className="py-2 px-3 text-xs" style={{ color: "#666" }}>
                    {Number.isInteger(u / 5) ? `${u / 5} × 5-unit marks` : `between marks`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="mt-6 rounded-sm p-4 text-xs"
        style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28", color: "#666666" }}
      >
        <strong style={{ color: "#C9DD69" }}>Important:</strong> Insulin syringes are calibrated for their specific scale (U/mL). A 100U/mL syringe and a 50U/mL syringe have different tick-mark spacing. Using the wrong scale will result in incorrect dosing volumes. Always verify syringe packaging before use.
      </div>
    </div>
  );
}

/** Tab 3: nmol/L ↔ ng/mL concentration */
function ConcentrationTab() {
  const [input, setInput] = useState("10");
  const [fromUnit, setFromUnit] = useState<"nmol" | "ngml">("nmol");
  const [selectedPeptide, setSelectedPeptide] = useState(PEPTIDE_MW[0]);
  const [customMw, setCustomMw] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const mw = useCustom && parseNum(customMw) > 0 ? parseNum(customMw) : selectedPeptide.mw;
  const val = parseNum(input);

  // nmol/L × MW(g/mol) = µg/L = ng/mL (since 1 µg/L = 1 ng/mL numerically)
  // ng/mL ÷ MW(g/mol) = nmol/L
  const nmolL = fromUnit === "nmol" ? val : (val / mw) * 1000;
  const ngMl = fromUnit === "nmol" ? (val * mw) / 1000 : val;
  const pmolL = nmolL * 1000;
  const umolL = nmolL / 1000;
  const ugMl = ngMl / 1000;

  const selectStyle = {
    backgroundColor: "#1A1A18",
    color: "#F9F9F9",
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    width: "100%",
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-1" style={{ color: "#F9F9F9" }}>
        Concentration Unit Converter
      </h2>
      <p className="text-sm mb-6" style={{ color: "#666666" }}>
        Convert between molar (nmol/L, pmol/L, µmol/L) and mass-based (ng/mL, µg/mL) concentration units. Requires the molecular weight of the compound.
      </p>

      {/* Inputs row */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#666666" }}>
            Value
          </label>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-sm px-3 py-2 text-sm"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #333",
              color: "#F9F9F9",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#666666" }}>
            From Unit
          </label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as "nmol" | "ngml")} style={selectStyle}>
            <option value="nmol">nmol/L (nanomolar)</option>
            <option value="ngml">ng/mL</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#666666" }}>
            MW Used: {fmt(mw, 1)} Da
          </label>
          {!useCustom ? (
            <select
              value={selectedPeptide.name}
              onChange={(e) => {
                const found = PEPTIDE_MW.find((p) => p.name === e.target.value);
                if (found) setSelectedPeptide(found);
              }}
              style={selectStyle}
            >
              {PEPTIDE_MW.map((p) => (
                <option key={p.slug} value={p.name}>
                  {p.name} ({p.mw.toLocaleString()} Da)
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              placeholder="Mol. weight (Da)"
              value={customMw}
              onChange={(e) => setCustomMw(e.target.value)}
              className="w-full rounded-sm px-3 py-2 text-sm"
              style={{
                backgroundColor: "#1A1A18",
                border: "1px solid #333",
                color: "#F9F9F9",
                outline: "none",
              }}
            />
          )}
          <button
            onClick={() => { setUseCustom(!useCustom); setCustomMw(""); }}
            className="text-xs mt-1.5"
            style={{ color: "#B8A44C", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {useCustom ? "← Use peptide selector" : "Enter custom MW →"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { label: "pmol/L", value: fmt(pmolL, 3), highlight: false },
          { label: "nmol/L", value: fmt(nmolL, 4), highlight: fromUnit === "nmol" },
          { label: "µmol/L", value: fmt(umolL, 6), highlight: false },
          { label: "ng/mL", value: fmt(ngMl, 4), highlight: fromUnit === "ngml" },
          { label: "µg/mL", value: fmt(ugMl, 6), highlight: false },
          { label: "mg/L", value: fmt(ugMl / 1000, 8), highlight: false },
        ].map((r) => (
          <div
            key={r.label}
            className="rounded-sm p-4"
            style={{
              backgroundColor: r.highlight ? "#161A0D" : "#0D0D0C",
              border: `1px solid ${r.highlight ? "#3D4A20" : "#2A2A28"}`,
            }}
          >
            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: "#666666" }}>
              {r.label}
            </p>
            <p
              className="text-xl font-light"
              style={{ color: r.highlight ? "#C9DD69" : "#F9F9F9" }}
            >
              {r.value}
            </p>
          </div>
        ))}
      </div>

      {/* Formula note */}
      <div
        className="rounded-sm p-4 text-xs"
        style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28", color: "#666666" }}
      >
        <strong style={{ color: "#B8A44C" }}>Formula:</strong>{" "}
        ng/mL = nmol/L × MW (Da) ÷ 1000{" "}
        <span style={{ color: "#555" }}>|</span>{" "}
        nmol/L = ng/mL ÷ MW (Da) × 1000<br />
        <span className="mt-1 block" style={{ color: "#666" }}>
          Example: {fmt(nmolL, 3)} nmol/L × {fmt(mw, 1)} Da ÷ 1000 = {fmt(ngMl, 4)} ng/mL
        </span>
      </div>

      {/* MW reference table */}
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-3" style={{ color: "#A0A0A0" }}>
          Peptide Molecular Weight Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2A28" }}>
                {["Compound", "MW (Da)", "Category"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs uppercase tracking-wider" style={{ color: "#666" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PEPTIDE_MW.map((p) => (
                <tr
                  key={p.slug}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => { setSelectedPeptide(p); setUseCustom(false); }}
                  style={{ borderBottom: "1px solid #1A1A18" }}
                >
                  <td className="py-2 px-3" style={{ color: selectedPeptide.slug === p.slug ? "#C9DD69" : "#F9F9F9" }}>
                    {p.name}
                    {selectedPeptide.slug === p.slug && (
                      <span className="ml-2 text-xs" style={{ color: "#C9DD69" }}>← in use</span>
                    )}
                  </td>
                  <td className="py-2 px-3" style={{ color: "#A0A0A0" }}>
                    {p.mw.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-xs" style={{ color: "#666" }}>
                    {p.mw < 1000 ? "Small molecule" : p.mw < 5000 ? "Peptide" : "Large peptide/protein"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-2" style={{ color: "#555" }}>
          Click any row to use that compound's MW in calculations above.
        </p>
      </div>
    </div>
  );
}

/** Tab 4: Dilution factor calculator */
function DilutionTab() {
  const [stockConc, setStockConc] = useState("1"); // mg/mL
  const [stockUnit, setStockUnit] = useState<"mg/mL" | "mcg/mL" | "µmol/L" | "nmol/L">("mg/mL");
  const [targetConc, setTargetConc] = useState("0.1");
  const [targetUnit, setTargetUnit] = useState<"mg/mL" | "mcg/mL" | "µmol/L" | "nmol/L">("mg/mL");
  const [finalVolume, setFinalVolume] = useState("1"); // mL

  // Normalize to mg/mL
  function toMgMl(val: number, unit: string) {
    if (unit === "mg/mL") return val;
    if (unit === "mcg/mL") return val / 1000;
    return val; // nmol/L, µmol/L — not comparable without MW, show warning
  }

  const stockMgMl = toMgMl(parseNum(stockConc), stockUnit);
  const targetMgMl = toMgMl(parseNum(targetConc), targetUnit);
  const finalVol = parseNum(finalVolume);

  const molarUnits = stockUnit.includes("mol") || targetUnit.includes("mol");
  const compatible = !molarUnits;

  // C1V1 = C2V2 → V1 = C2V2 / C1
  const V1 = compatible && stockMgMl > 0 ? (targetMgMl * finalVol) / stockMgMl : NaN;
  const diluentVol = finalVol - V1;
  const dilutionFactor = compatible && targetMgMl > 0 ? stockMgMl / targetMgMl : NaN;

  const selectStyle = {
    backgroundColor: "#1A1A18",
    color: "#F9F9F9",
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  };

  const unitOpts = ["mg/mL", "mcg/mL"];

  return (
    <div>
      <h2 className="text-lg font-medium mb-1" style={{ color: "#F9F9F9" }}>
        Dilution Factor Calculator
      </h2>
      <p className="text-sm mb-6" style={{ color: "#666666" }}>
        Use the C₁V₁ = C₂V₂ formula to calculate how much stock solution to add and how much diluent (BAC water, saline, etc.) to reach your target working concentration.
      </p>

      {/* Stock concentration */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#666666" }}>
          Stock (C₁) — Your reconstituted vial concentration
        </p>
        <div className="flex gap-3">
          <input
            type="number"
            value={stockConc}
            onChange={(e) => setStockConc(e.target.value)}
            className="flex-1 rounded-sm px-3 py-2 text-sm"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #333",
              color: "#F9F9F9",
              outline: "none",
            }}
          />
          <select value={stockUnit} onChange={(e) => setStockUnit(e.target.value as any)} style={selectStyle}>
            {unitOpts.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Target concentration */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#666666" }}>
          Target (C₂) — Desired working concentration
        </p>
        <div className="flex gap-3">
          <input
            type="number"
            value={targetConc}
            onChange={(e) => setTargetConc(e.target.value)}
            className="flex-1 rounded-sm px-3 py-2 text-sm"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #333",
              color: "#F9F9F9",
              outline: "none",
            }}
          />
          <select value={targetUnit} onChange={(e) => setTargetUnit(e.target.value as any)} style={selectStyle}>
            {unitOpts.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Final volume */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#666666" }}>
          Final Volume (V₂) — Total working solution needed (mL)
        </p>
        <input
          type="number"
          value={finalVolume}
          onChange={(e) => setFinalVolume(e.target.value)}
          className="w-32 rounded-sm px-3 py-2 text-sm"
          style={{
            backgroundColor: "#1A1A18",
            border: "1px solid #333",
            color: "#F9F9F9",
            outline: "none",
          }}
          step="0.1"
        />
        <span className="ml-2 text-sm" style={{ color: "#666666" }}>mL</span>
      </div>

      {/* Results */}
      {!compatible ? (
        <div
          className="rounded-sm p-4 text-sm"
          style={{ backgroundColor: "#1A0A00", border: "1px solid #5A2A00", color: "#FF8C42" }}
        >
          Molar units (nmol/L, µmol/L) are not directly comparable with mass units (mg/mL, mcg/mL) without a molecular weight. Use the Concentration tab to convert first.
        </div>
      ) : V1 <= 0 || !isFinite(V1) ? (
        <div
          className="rounded-sm p-4 text-sm"
          style={{ backgroundColor: "#1A0A00", border: "1px solid #5A2A00", color: "#FF8C42" }}
        >
          {stockMgMl <= targetMgMl
            ? "Target concentration must be lower than stock concentration for a dilution."
            : "Enter valid values above."}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Stock to Add (V₁)", value: `${fmt(V1, 4)} mL`, sub: `(${fmt(V1 * 1000, 2)} µL)` },
            { label: "Diluent to Add", value: `${fmt(diluentVol, 4)} mL`, sub: `(${fmt(diluentVol * 1000, 2)} µL)` },
            { label: "Dilution Factor", value: `1 : ${fmt(dilutionFactor, 1)}`, sub: `${fmt(1 / dilutionFactor * 100, 2)}% of stock` },
          ].map((r) => (
            <div
              key={r.label}
              className="rounded-sm p-4"
              style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28" }}
            >
              <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: "#666666" }}>
                {r.label}
              </p>
              <p className="text-xl font-light" style={{ color: "#C9DD69" }}>
                {r.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                {r.sub}
              </p>
            </div>
          ))}
        </div>
      )}

      {compatible && isFinite(V1) && V1 > 0 && (
        <div
          className="rounded-sm p-5 text-sm"
          style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28" }}
        >
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#B8A44C" }}>
            Preparation Protocol
          </p>
          <ol className="list-decimal list-inside space-y-1.5" style={{ color: "#A0A0A0" }}>
            <li>Begin with a clean {fmt(finalVol, 2)} mL total volume container.</li>
            <li>
              Add <strong style={{ color: "#F9F9F9" }}>{fmt(V1, 4)} mL ({fmt(V1 * 1000, 2)} µL)</strong> of stock solution ({fmt(parseNum(stockConc), 3)} {stockUnit}).
            </li>
            <li>
              Add <strong style={{ color: "#F9F9F9" }}>{fmt(diluentVol, 4)} mL ({fmt(diluentVol * 1000, 2)} µL)</strong> of diluent (BAC water, saline, or buffer).
            </li>
            <li>
              Gently swirl to mix. Do not vortex or shake vigorously.
            </li>
            <li>
              Final concentration: <strong style={{ color: "#C9DD69" }}>{fmt(parseNum(targetConc), 4)} {targetUnit}</strong> in {fmt(finalVol, 2)} mL.
            </li>
          </ol>
        </div>
      )}

      {/* Formula note */}
      <div
        className="mt-5 rounded-sm p-4 text-xs"
        style={{ backgroundColor: "#0D0D0C", border: "1px solid #2A2A28", color: "#666666" }}
      >
        <strong style={{ color: "#B8A44C" }}>Formula:</strong>{" "}
        C₁V₁ = C₂V₂ → V₁ = C₂ × V₂ / C₁ — where C₁ = stock concentration, V₁ = stock volume to add, C₂ = target concentration, V₂ = final volume.
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function UnitConverter() {
  const [activeTab, setActiveTab] = useState<Tab>("mass");

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
              { label: "Unit Converter" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
            Research Tools
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Unit Converter
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Research-grade unit conversions: mass (mcg/mg/g/IU), insulin syringe volume (mL ↔ U), peptide concentration (nmol/L ↔ ng/mL), and dilution factor calculations.
          </p>
        </div>
      </section>

      {/* Tab bar */}
      <div
        className="sticky top-0 z-20 px-6 overflow-x-auto"
        style={{ backgroundColor: "#0A0A08", borderBottom: "1px solid #1A1A18" }}
      >
        <div className="max-w-4xl mx-auto flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-5 py-4 text-left transition-all"
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "#C9DD69" : "transparent"}`,
                cursor: "pointer",
              }}
            >
              <span
                className="block text-sm font-medium"
                style={{ color: activeTab === tab.id ? "#C9DD69" : "#A0A0A0" }}
              >
                {tab.label}
              </span>
              <span className="block text-xs mt-0.5" style={{ color: "#555" }}>
                {tab.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <section className="px-6 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-sm p-6 md:p-8"
            style={{ backgroundColor: "#010101", border: "1px solid #1A1A18" }}
          >
            {activeTab === "mass" && <MassTab />}
            {activeTab === "syringe" && <SyringeTab />}
            {activeTab === "concentration" && <ConcentrationTab />}
            {activeTab === "dilution" && <DilutionTab />}
          </div>

          {/* Cross-tool links */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {
                href: "/tools/reconstitution-calculator",
                title: "Reconstitution Calculator",
                desc: "BAC water volume, dose per injection, vials per cycle",
              },
              {
                href: "/tools/half-life-calculator",
                title: "Half-Life Calculator",
                desc: "Clearance milestones, dosing frequency, decay curve",
              },
              {
                href: "/guides/storage",
                title: "Storage Guide",
                desc: "Temperature classes, stability windows, freeze-thaw limits",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-sm p-5 hover:-translate-y-0.5 transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECEAE4",
                  textDecoration: "none",
                }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "#000" }}>
                  {link.title}
                </p>
                <p className="text-xs" style={{ color: "#666666" }}>
                  {link.desc}
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: "#B8A44C" }}>
                  Open →
                </p>
              </Link>
            ))}
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <p className="text-xs mt-8 text-center" style={{ color: "#555" }}>
            All calculations are for research planning purposes only. Verify critical measurements independently before use.
            For research use only — not intended for human administration.{" "}
            <Link href="/legal/disclaimer" className="underline" style={{ color: "#777" }}>
              Full disclaimer
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
