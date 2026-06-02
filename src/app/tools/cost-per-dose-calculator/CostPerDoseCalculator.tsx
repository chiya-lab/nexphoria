"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// Product catalog data — slug, name, vial size (mg), price ($)
// Multi-dosage products listed once per size variant for full selection
const CATALOG_PRODUCTS = [
  // Recovery & Healing
  { slug: "bpc-157",           name: "BPC-157",                    sizeMg: 10,  price: 120,  category: "Recovery & Healing" },
  { slug: "tb-500",            name: "TB-500",                     sizeMg: 5,   price: 90,   category: "Recovery & Healing" },
  { slug: "tb-500-10",         name: "TB-500",                     sizeMg: 10,  price: 168,  category: "Recovery & Healing" },
  { slug: "ghk-cu",            name: "GHK-Cu",                     sizeMg: 50,  price: 96,   category: "Recovery & Healing" },
  { slug: "ghk-cu-100",        name: "GHK-Cu",                     sizeMg: 100, price: 156,  category: "Recovery & Healing" },
  { slug: "ll-37",             name: "LL-37",                      sizeMg: 5,   price: 144,  category: "Recovery & Healing" },
  { slug: "ll-37-10",          name: "LL-37",                      sizeMg: 10,  price: 264,  category: "Recovery & Healing" },
  { slug: "aod-9604",          name: "AOD-9604",                   sizeMg: 5,   price: 69,   category: "Recovery & Healing" },
  { slug: "aod-9604-10",       name: "AOD-9604",                   sizeMg: 10,  price: 99,   category: "Recovery & Healing" },

  // GH Axis
  { slug: "ipamorelin",        name: "Ipamorelin",                 sizeMg: 5,   price: 90,   category: "GH Axis" },
  { slug: "ipamorelin-10",     name: "Ipamorelin",                 sizeMg: 10,  price: 168,  category: "GH Axis" },
  { slug: "cjc-1295",          name: "CJC-1295 (with DAC)",        sizeMg: 5,   price: 120,  category: "GH Axis" },
  { slug: "cjc-1295-10",       name: "CJC-1295 (with DAC)",        sizeMg: 10,  price: 120,  category: "GH Axis" },
  { slug: "cjc-1295-no-dac",   name: "CJC-1295 No DAC",           sizeMg: 5,   price: 120,  category: "GH Axis" },
  { slug: "cjc-1295-no-dac-10",name: "CJC-1295 No DAC",           sizeMg: 10,  price: 199,  category: "GH Axis" },
  { slug: "cjc-1295-ipamorelin", name: "CJC-1295 / Ipamorelin",   sizeMg: 10,  price: 108,  category: "GH Axis" },
  { slug: "sermorelin",        name: "Sermorelin",                 sizeMg: 5,   price: 96,   category: "GH Axis" },
  { slug: "sermorelin-10",     name: "Sermorelin",                 sizeMg: 10,  price: 168,  category: "GH Axis" },
  { slug: "tesamorelin",       name: "Tesamorelin",                sizeMg: 5,   price: 180,  category: "GH Axis" },
  { slug: "tesamorelin-10",    name: "Tesamorelin",                sizeMg: 10,  price: 300,  category: "GH Axis" },
  { slug: "mk-677",            name: "MK-677 (Ibutamoren)",       sizeMg: 25,  price: 89,   category: "GH Axis" },

  // Metabolic / GLP-1
  { slug: "semaglutide",       name: "Semaglutide",               sizeMg: 5,   price: 120,  category: "Metabolic" },
  { slug: "tirzepatide",       name: "Tirzepatide",               sizeMg: 10,  price: 180,  category: "Metabolic" },
  { slug: "tirzepatide-15",    name: "Tirzepatide",               sizeMg: 15,  price: 240,  category: "Metabolic" },
  { slug: "tirzepatide-30",    name: "Tirzepatide",               sizeMg: 30,  price: 360,  category: "Metabolic" },
  { slug: "retatrutide",       name: "Retatrutide",               sizeMg: 10,  price: 300,  category: "Metabolic" },
  { slug: "retatrutide-15",    name: "Retatrutide",               sizeMg: 15,  price: 360,  category: "Metabolic" },
  { slug: "mots-c",            name: "MOTS-c",                    sizeMg: 10,  price: 240,  category: "Metabolic" },

  // Longevity
  { slug: "epitalon",          name: "Epitalon",                  sizeMg: 10,  price: 120,  category: "Longevity" },
  { slug: "epitalon-50",       name: "Epitalon",                  sizeMg: 50,  price: 480,  category: "Longevity" },
  { slug: "nad-plus",          name: "NAD+",                      sizeMg: 50,  price: 96,   category: "Longevity" },
  { slug: "nad-plus-100",      name: "NAD+",                      sizeMg: 100, price: 156,  category: "Longevity" },
  { slug: "ss-31",             name: "SS-31 (Elamipretide)",      sizeMg: 5,   price: 144,  category: "Longevity" },
  { slug: "ss-31-10",          name: "SS-31 (Elamipretide)",      sizeMg: 10,  price: 264,  category: "Longevity" },
  { slug: "thymosin-alpha-1",  name: "Thymosin Alpha-1",          sizeMg: 5,   price: 99,   category: "Longevity" },

  // Nootropics / Neuro
  { slug: "selank",            name: "Selank",                    sizeMg: 5,   price: 96,   category: "Nootropics" },
  { slug: "semax",             name: "Semax",                     sizeMg: 5,   price: 108,  category: "Nootropics" },
  { slug: "dsip",              name: "DSIP",                      sizeMg: 5,   price: 89,   category: "Nootropics" },
  { slug: "kpv",               name: "KPV",                       sizeMg: 10,  price: 79,   category: "Nootropics" },

  // Hormonal / Reproductive
  { slug: "pt-141",            name: "PT-141",                    sizeMg: 10,  price: 120,  category: "Hormonal" },
  { slug: "melanotan-ii",      name: "Melanotan-II",              sizeMg: 10,  price: 99,   category: "Hormonal" },
  { slug: "kisspeptin",        name: "Kisspeptin-10",             sizeMg: 5,   price: 120,  category: "Hormonal" },
  { slug: "oxytocin",          name: "Oxytocin",                  sizeMg: 5,   price: 96,   category: "Hormonal" },

  // Blends
  { slug: "wolverine-blend",   name: "Wolverine Stack",           sizeMg: 10,  price: 219,  category: "Blends" },
  { slug: "snap-8",            name: "Snap-8",                    sizeMg: 10,  price: 89,   category: "Blends" },
];

// Quick presets: [productIndex, doseMcg, frequency/week]
const PRESETS = [
  { label: "BPC-157 500 mcg daily",        productKey: "bpc-157",         doseMcg: 500,  freqPerWeek: 7 },
  { label: "Semaglutide 500 mcg/week",     productKey: "semaglutide",     doseMcg: 500,  freqPerWeek: 1 },
  { label: "Tirzepatide 2.5 mg/week",      productKey: "tirzepatide",     doseMcg: 2500, freqPerWeek: 1 },
  { label: "Ipamorelin 300 mcg 3×/day",    productKey: "ipamorelin",      doseMcg: 300,  freqPerWeek: 21 },
  { label: "TB-500 2 mg 2×/week",          productKey: "tb-500",          doseMcg: 2000, freqPerWeek: 2 },
  { label: "GHK-Cu 200 mcg daily",         productKey: "ghk-cu",          doseMcg: 200,  freqPerWeek: 7 },
  { label: "Epitalon 5 mg daily × 10 days",productKey: "epitalon",        doseMcg: 5000, freqPerWeek: 7 },
  { label: "NAD+ 100 mg 3×/week",          productKey: "nad-plus-100",    doseMcg: 100000, freqPerWeek: 3 },
];

type ProductEntry = typeof CATALOG_PRODUCTS[number];

function fmt$(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  if (n < 10) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

function fmtInt(n: number): string {
  return n >= 10000 ? n.toLocaleString() : String(Math.round(n));
}

export default function CostPerDoseCalculator() {
  const [selectedKey, setSelectedKey] = useState<string>("bpc-157");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [customSizeMg, setCustomSizeMg] = useState<string>("");
  const [doseMcg, setDoseMcg] = useState<string>("500");
  const [freqPerWeek, setFreqPerWeek] = useState<string>("7");
  const [useCustom, setUseCustom] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("");

  // Resolve selected product
  const selectedProduct = CATALOG_PRODUCTS.find((p) => p.slug === selectedKey);

  const resolvedPrice = useCustom
    ? parseFloat(customPrice) || 0
    : selectedProduct?.price ?? 0;
  const resolvedSizeMg = useCustom
    ? parseFloat(customSizeMg) || 0
    : selectedProduct?.sizeMg ?? 0;

  const doseMcgNum = parseFloat(doseMcg) || 0;
  const freqNum = parseFloat(freqPerWeek) || 0;

  // Core math
  const vialMcg = resolvedSizeMg * 1000;
  const costPerDose = doseMcgNum > 0 && resolvedPrice > 0 && vialMcg > 0
    ? (resolvedPrice / vialMcg) * doseMcgNum
    : 0;
  const dosesPerVial = doseMcgNum > 0 && vialMcg > 0
    ? Math.floor(vialMcg / doseMcgNum)
    : 0;
  const weeklyDoses = freqNum;
  const weeklyCost = costPerDose * weeklyDoses;
  const monthlyCost = weeklyCost * 4.33;
  const annualCost = weeklyCost * 52;
  const vialsDuration = dosesPerVial > 0 && freqNum > 0
    ? (dosesPerVial / freqNum)
    : 0;

  const isValid = resolvedPrice > 0 && resolvedSizeMg > 0 && doseMcgNum > 0;

  const applyPreset = useCallback((p: typeof PRESETS[0]) => {
    setSelectedKey(p.productKey);
    setDoseMcg(String(p.doseMcg));
    setFreqPerWeek(String(p.freqPerWeek));
    setUseCustom(false);
    setActivePreset(p.label);
  }, []);

  // Group products by category for select
  const categories = Array.from(new Set(CATALOG_PRODUCTS.map((p) => p.category)));

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
              { label: "Cost Per Dose Calculator" },
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
            Cost Per Dose Calculator
          </h1>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Enter a compound, vial size, dose, and dosing frequency to instantly
            calculate your true cost per dose, doses per vial, weekly spend, and
            monthly research budget.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Presets */}
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#666666" }}
            >
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="text-xs px-3 py-1.5 rounded-sm transition-all"
                  style={{
                    border: `1px solid ${activePreset === p.label ? "#B8A44C" : "#DDDBD5"}`,
                    backgroundColor: activePreset === p.label ? "#B8A44C18" : "transparent",
                    color: activePreset === p.label ? "#5A7040" : "#555555",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input card */}
          <div
            className="rounded-sm p-7"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECEAE4" }}
          >
            {/* Mode toggle */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setUseCustom(false)}
                className="text-sm px-4 py-2 rounded-sm transition-all"
                style={{
                  border: `1px solid ${!useCustom ? "#B8A44C" : "#DDDBD5"}`,
                  backgroundColor: !useCustom ? "#B8A44C18" : "transparent",
                  color: !useCustom ? "#5A7040" : "#777",
                  fontWeight: !useCustom ? 500 : 400,
                }}
              >
                Catalog Product
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className="text-sm px-4 py-2 rounded-sm transition-all"
                style={{
                  border: `1px solid ${useCustom ? "#B8A44C" : "#DDDBD5"}`,
                  backgroundColor: useCustom ? "#B8A44C18" : "transparent",
                  color: useCustom ? "#5A7040" : "#777",
                  fontWeight: useCustom ? 500 : 400,
                }}
              >
                Custom Entry
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Product / Price / Size */}
              {!useCustom ? (
                <div className="md:col-span-2">
                  <label
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: "#666666" }}
                  >
                    Compound
                  </label>
                  <select
                    value={selectedKey}
                    onChange={(e) => {
                      setSelectedKey(e.target.value);
                      setActivePreset("");
                    }}
                    className="w-full px-4 py-3 rounded-sm text-sm"
                    style={{
                      border: "1px solid #DDDBD5",
                      backgroundColor: "#FAFAF8",
                      color: "#111",
                      outline: "none",
                    }}
                  >
                    {categories.map((cat) => (
                      <optgroup key={cat} label={cat}>
                        {CATALOG_PRODUCTS.filter((p) => p.category === cat).map(
                          (p) => (
                            <option key={p.slug} value={p.slug}>
                              {p.name} — {p.sizeMg}mg vial — ${p.price}
                            </option>
                          )
                        )}
                      </optgroup>
                    ))}
                  </select>
                  {selectedProduct && (
                    <p className="text-xs mt-1.5" style={{ color: "#666666" }}>
                      Selected: {selectedProduct.sizeMg}mg vial at $
                      {selectedProduct.price}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: "#666666" }}
                    >
                      Vial Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 120"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm text-sm"
                      style={{
                        border: "1px solid #DDDBD5",
                        backgroundColor: "#FAFAF8",
                        color: "#111",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: "#666666" }}
                    >
                      Vial Size (mg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="e.g. 10"
                      value={customSizeMg}
                      onChange={(e) => setCustomSizeMg(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm text-sm"
                      style={{
                        border: "1px solid #DDDBD5",
                        backgroundColor: "#FAFAF8",
                        color: "#111",
                        outline: "none",
                      }}
                    />
                  </div>
                </>
              )}

              {/* Dose */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#666666" }}
                >
                  Dose (mcg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 500"
                  value={doseMcg}
                  onChange={(e) => {
                    setDoseMcg(e.target.value);
                    setActivePreset("");
                  }}
                  className="w-full px-4 py-3 rounded-sm text-sm"
                  style={{
                    border: "1px solid #DDDBD5",
                    backgroundColor: "#FAFAF8",
                    color: "#111",
                    outline: "none",
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: "#737373" }}>
                  1 mg = 1,000 mcg &nbsp;|&nbsp; 0.5 mg = 500 mcg
                </p>
              </div>

              {/* Frequency */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#666666" }}
                >
                  Doses per Week
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 7"
                  value={freqPerWeek}
                  onChange={(e) => {
                    setFreqPerWeek(e.target.value);
                    setActivePreset("");
                  }}
                  className="w-full px-4 py-3 rounded-sm text-sm"
                  style={{
                    border: "1px solid #DDDBD5",
                    backgroundColor: "#FAFAF8",
                    color: "#111",
                    outline: "none",
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: "#737373" }}>
                  Daily = 7 &nbsp;|&nbsp; 3×/day = 21 &nbsp;|&nbsp; Weekly = 1
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          {isValid ? (
            <>
              {/* Primary results row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Cost Per Dose",
                    value: fmt$(costPerDose),
                    sub: `${doseMcgNum.toLocaleString()} mcg`,
                    accent: true,
                  },
                  {
                    label: "Doses Per Vial",
                    value: fmtInt(dosesPerVial),
                    sub: `${resolvedSizeMg}mg vial`,
                    accent: false,
                  },
                  {
                    label: "Weekly Cost",
                    value: fmt$(weeklyCost),
                    sub: `${freqNum}× per week`,
                    accent: false,
                  },
                  {
                    label: "Monthly Cost",
                    value: fmt$(monthlyCost),
                    sub: "4.33 weeks/mo",
                    accent: false,
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-sm p-5 text-center"
                    style={{
                      backgroundColor: card.accent ? "#010101" : "#FFFFFF",
                      border: card.accent ? "1px solid #2A2A28" : "1px solid #ECEAE4",
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: card.accent ? "#C9DD69" : "#888888" }}
                    >
                      {card.label}
                    </p>
                    <p
                      className="text-2xl md:text-3xl mb-1"
                      style={{
                        fontWeight: 300,
                        color: card.accent ? "#F9F9F9" : "#111111",
                        lineHeight: 1.1,
                      }}
                    >
                      {card.value}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: card.accent ? "#888888" : "#AAAAAA" }}
                    >
                      {card.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Extended breakdown */}
              <div
                className="rounded-sm p-7"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECEAE4" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-5"
                  style={{ color: "#666666" }}
                >
                  Extended Breakdown
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Vial Content",
                      value: `${resolvedSizeMg} mg = ${(resolvedSizeMg * 1000).toLocaleString()} mcg`,
                    },
                    {
                      label: "Vial Price",
                      value: `$${resolvedPrice.toFixed(2)}`,
                    },
                    {
                      label: "Price Per Microgram",
                      value: `${fmt$(resolvedPrice / vialMcg)} / mcg`,
                    },
                    {
                      label: "Dose Size",
                      value: `${doseMcgNum.toLocaleString()} mcg${doseMcgNum >= 1000 ? ` (${(doseMcgNum / 1000).toFixed(3)} mg)` : ""}`,
                    },
                    {
                      label: "Cost Per Dose",
                      value: fmt$(costPerDose),
                    },
                    {
                      label: "Doses Per Vial",
                      value: `${fmtInt(dosesPerVial)} doses`,
                    },
                    {
                      label: "One Vial Lasts",
                      value:
                        vialsDuration > 0
                          ? vialsDuration >= 7
                            ? `${(vialsDuration / 7).toFixed(1)} weeks (${Math.round(vialsDuration)} days)`
                            : `${vialsDuration.toFixed(1)} days`
                          : "—",
                    },
                    {
                      label: "Weekly Cost",
                      value: `${fmt$(weeklyCost)} (${freqNum} dose${freqNum !== 1 ? "s" : ""}/week)`,
                    },
                    {
                      label: "Monthly Cost (4.33 wks)",
                      value: fmt$(monthlyCost),
                    },
                    {
                      label: "Annual Cost",
                      value: fmt$(annualCost),
                    },
                    {
                      label: "Vials Per Month",
                      value:
                        dosesPerVial > 0
                          ? `${((freqNum * 4.33) / dosesPerVial).toFixed(2)} vials/month`
                          : "—",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2"
                      style={{ borderBottom: "1px solid #F0EEE8" }}
                    >
                      <span className="text-sm" style={{ color: "#555555" }}>
                        {row.label}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#111111" }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-vial planner */}
              {dosesPerVial > 0 && (
                <div
                  className="rounded-sm p-7"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECEAE4" }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-5"
                    style={{ color: "#666666" }}
                  >
                    Multi-Vial Planner
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["Vials", "Total Doses", "Duration", "Total Cost"].map(
                            (h) => (
                              <th
                                key={h}
                                className="text-left text-xs uppercase tracking-widest pb-3 pr-6"
                                style={{ color: "#666666", fontWeight: 500 }}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 5, 10].map((qty) => {
                          const totalDoses = dosesPerVial * qty;
                          const totalCost = resolvedPrice * qty;
                          const durationDays = freqNum > 0 ? (totalDoses / freqNum) * 7 : 0;
                          const durationLabel =
                            durationDays >= 7
                              ? `${(durationDays / 7).toFixed(1)} weeks`
                              : `${Math.round(durationDays)} days`;
                          return (
                            <tr key={qty}>
                              <td
                                className="py-2.5 pr-6 font-medium"
                                style={{ color: "#111", borderBottom: "1px solid #F0EEE8" }}
                              >
                                {qty}
                              </td>
                              <td
                                className="py-2.5 pr-6"
                                style={{ color: "#444", borderBottom: "1px solid #F0EEE8" }}
                              >
                                {fmtInt(totalDoses)}
                              </td>
                              <td
                                className="py-2.5 pr-6"
                                style={{ color: "#444", borderBottom: "1px solid #F0EEE8" }}
                              >
                                {freqNum > 0 ? durationLabel : "—"}
                              </td>
                              <td
                                className="py-2.5 pr-6 font-medium"
                                style={{ color: "#111", borderBottom: "1px solid #F0EEE8" }}
                              >
                                ${totalCost.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className="rounded-sm p-10 text-center"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECEAE4" }}
            >
              <p className="text-4xl mb-3" style={{ color: "#DDDBD5" }}>
                —
              </p>
              <p className="text-sm" style={{ color: "#737373" }}>
                Fill in all fields above to see your cost breakdown.
              </p>
            </div>
          )}

          {/* Related tools */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                href: "/tools/reconstitution-calculator",
                title: "Reconstitution Calculator",
                desc: "Calculate BAC water volume, dose volume, and doses per vial.",
              },
              {
                href: "/tools/dosing-frequency-planner",
                title: "Dosing Frequency Planner",
                desc: "Build a weekly schedule across multiple compounds.",
              },
              {
                href: "/tools/stack-builder",
                title: "Research Stack Builder",
                desc: "Get a full compound stack with monthly cost estimate.",
              },
              {
                href: "/tools/half-life-calculator",
                title: "Half-Life Calculator",
                desc: "Calculate clearance milestones and dosing interval.",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block rounded-sm p-5 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECEAE4",
                  textDecoration: "none",
                }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#111" }}
                >
                  {t.title}
                </p>
                <p className="text-xs" style={{ color: "#777" }}>
                  {t.desc}
                </p>
                <p
                  className="text-xs mt-2 font-medium"
                  style={{ color: "#B8A44C" }}
                >
                  Open →
                </p>
              </Link>
            ))}
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <div
            className="rounded-sm p-5"
            style={{ backgroundColor: "#F8F7F2", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "#666666" }}>
              <strong style={{ color: "#555" }}>Research Use Only.</strong> All
              pricing shown reflects Nexphoria catalog pricing for qualified
              researchers. Cost calculations are estimates based on the dose and
              frequency entered. Actual cost may vary by protocol design, vial
              size ordered, and reconstitution volume. Nexphoria compounds are
              sold for laboratory and in vitro/in vivo research purposes only.
              Not intended for human therapeutic use.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
