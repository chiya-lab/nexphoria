"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ── Types ────────────────────────────────────────────────────────────────────
interface LabelData {
  compound: string;
  concentration: string;
  concUnit: "mg/mL" | "mcg/mL";
  lotNumber: string;
  reconDate: string;
  expiryDate: string;
  storageTemp: string;
  vehicle: string;
  researcher: string;
  notes: string;
  ruo: boolean;
}

// ── Stability database (reconstituted days at 4°C) ──────────────────────────
const STABILITY_DAYS: Record<string, number> = {
  "BPC-157": 21,
  "Semaglutide": 28,
  "Tirzepatide": 28,
  "Retatrutide": 28,
  "TB-500 (Thymosin Beta-4)": 14,
  "GHK-Cu": 21,
  "NAD+": 7,
  "Ipamorelin": 14,
  "CJC-1295 No DAC": 14,
  "CJC-1295 (DAC)": 14,
  "MK-677": 30,
  "GHRP-2": 14,
  "GHRP-6": 14,
  "Sermorelin": 14,
  "Tesamorelin": 3,
  "Hexarelin": 14,
  "Epitalon": 14,
  "SS-31 (Elamipretide)": 14,
  "MOTS-c": 14,
  "Selank": 14,
  "Semax": 14,
  "BPC-157 (Arginate)": 14,
  "PT-141 (Bremelanotide)": 21,
  "Melanotan II": 21,
  "Oxytocin": 14,
  "Kisspeptin-10": 7,
  "Kisspeptin-54": 14,
  "KPV": 21,
  "LL-37": 7,
  "Thymosin Alpha-1": 21,
  "AOD-9604": 21,
  "DSIP": 14,
  "Snap-8": 30,
  "Follistatin 344": 14,
  "Wolverine Blend": 21,
  "GLOW Blend": 21,
  "KLW Blend": 21,
};

const STORAGE_OPTIONS = [
  { value: "-80°C", label: "-80°C (Ultra-Cold Freezer)" },
  { value: "-20°C", label: "-20°C (Standard Freezer)" },
  { value: "4°C", label: "4°C (Refrigerator)" },
  { value: "RT", label: "Room Temperature" },
];

const VEHICLE_OPTIONS = [
  "BAC Water (0.9% Benzyl Alcohol)",
  "Sterile Water for Injection",
  "Sterile Saline (0.9% NaCl)",
  "PBS (pH 7.4)",
  "Acetic Acid (0.1%)",
  "DMSO",
  "Corn Oil",
  "Custom",
];

const COMPOUNDS = Object.keys(STABILITY_DAYS).sort();

// ── Date helpers ─────────────────────────────────────────────────────────────
function addDays(dateStr: string, days: number): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
}

// ── Generate lot number ───────────────────────────────────────────────────────
function generateLotNumber(compound: string): string {
  const prefix = compound.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NXP-${prefix}${year}${month}-${rand}`;
}

// ── Label Preview Component ──────────────────────────────────────────────────
function LabelPreview({ label, index }: { label: LabelData; index: number }) {
  const expiryDays = label.compound ? STABILITY_DAYS[label.compound] : null;
  const computedExpiry =
    label.reconDate && expiryDays && !label.expiryDate
      ? addDays(label.reconDate, expiryDays)
      : label.expiryDate;

  const isExpiringSoon =
    computedExpiry
      ? new Date(computedExpiry + "T00:00:00") <= new Date(Date.now() + 5 * 86400000)
      : false;

  return (
    /* 1"×2.5" cryo label = 96×240px @96dpi */
    <div
      className="label-card border-2 border-gray-300 bg-white text-black print:border-gray-700"
      style={{
        width: "240px",
        minHeight: "96px",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "8px",
        lineHeight: "1.2",
        padding: "4px 6px",
        position: "relative",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: "#1a1a1a",
          color: "#d4af37",
          fontSize: "6px",
          fontWeight: "bold",
          letterSpacing: "0.08em",
          padding: "1px 3px",
          marginBottom: "3px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>NEXPHORIA RESEARCH</span>
        <span style={{ color: "#aaa" }}>RUO</span>
      </div>

      {/* Compound name */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: "bold",
          color: "#111",
          marginBottom: "2px",
          borderBottom: "0.5px solid #ccc",
          paddingBottom: "2px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label.compound || "[ Compound Name ]"}
      </div>

      {/* Concentration + vehicle row */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "2px" }}>
        <div>
          <span style={{ color: "#555", fontWeight: "bold" }}>Conc: </span>
          <span>
            {label.concentration
              ? `${label.concentration} ${label.concUnit}`
              : "—"}
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <span style={{ color: "#555", fontWeight: "bold" }}>Vehicle: </span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {label.vehicle || "—"}
          </span>
        </div>
      </div>

      {/* Lot + storage row */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "2px" }}>
        <div>
          <span style={{ color: "#555", fontWeight: "bold" }}>Lot: </span>
          <span>{label.lotNumber || "—"}</span>
        </div>
        <div>
          <span style={{ color: "#555", fontWeight: "bold" }}>Store: </span>
          <span>{label.storageTemp || "—"}</span>
        </div>
      </div>

      {/* Dates row */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "2px" }}>
        <div>
          <span style={{ color: "#555", fontWeight: "bold" }}>Recon: </span>
          <span>{formatDateShort(label.reconDate)}</span>
        </div>
        <div>
          <span
            style={{
              color: "#555",
              fontWeight: "bold",
            }}
          >
            Exp:{" "}
          </span>
          <span
            style={{
              color: isExpiringSoon ? "#cc0000" : "inherit",
              fontWeight: isExpiringSoon ? "bold" : "normal",
            }}
          >
            {formatDateShort(computedExpiry || "")}
          </span>
        </div>
        <div>
          <span style={{ color: "#555", fontWeight: "bold" }}>By: </span>
          <span>{label.researcher || "—"}</span>
        </div>
      </div>

      {/* Notes */}
      {label.notes && (
        <div
          style={{
            fontSize: "7px",
            color: "#444",
            borderTop: "0.5px solid #ddd",
            paddingTop: "2px",
            marginTop: "1px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label.notes}
        </div>
      )}

      {/* Label number badge */}
      <div
        style={{
          position: "absolute",
          top: "3px",
          right: "4px",
          fontSize: "6px",
          color: "#999",
        }}
      >
        #{index + 1}
      </div>
    </div>
  );
}

// ── Empty label state ─────────────────────────────────────────────────────────
const emptyLabel = (): LabelData => ({
  compound: "",
  concentration: "",
  concUnit: "mg/mL",
  lotNumber: "",
  reconDate: new Date().toISOString().slice(0, 10),
  expiryDate: "",
  storageTemp: "4°C",
  vehicle: "",
  researcher: "",
  notes: "",
  ruo: true,
});

// ── Main Component ────────────────────────────────────────────────────────────
export default function PeptideLabelGenerator() {
  const [labels, setLabels] = useState<LabelData[]>([emptyLabel()]);
  const [editingIndex, setEditingIndex] = useState<number>(0);
  const [customCompound, setCustomCompound] = useState(false);
  const [customVehicle, setCustomVehicle] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const updateLabel = useCallback(
    (idx: number, field: keyof LabelData, value: string | boolean) => {
      setLabels((prev) =>
        prev.map((l, i) => {
          if (i !== idx) return l;
          const updated = { ...l, [field]: value };
          // Auto-fill lot number when compound selected
          if (field === "compound" && typeof value === "string" && value && !l.lotNumber) {
            updated.lotNumber = generateLotNumber(value);
          }
          // Auto-fill storage when compound selected
          if (field === "compound" && typeof value === "string") {
            const specialCold = [
              "Semaglutide", "Tirzepatide", "Retatrutide", "GHK-Cu",
              "Snap-8", "SS-31 (Elamipretide)", "NAD+",
            ];
            const needsFreezer = specialCold.some((c) => value.includes(c.split(" ")[0]));
            updated.storageTemp = needsFreezer ? "-20°C" : "4°C";
          }
          return updated;
        })
      );
    },
    []
  );

  const addLabel = () => {
    const newLabel = emptyLabel();
    // Pre-fill researcher from last label
    if (labels.length > 0) {
      newLabel.researcher = labels[labels.length - 1].researcher;
      newLabel.storageTemp = labels[labels.length - 1].storageTemp;
    }
    setLabels((prev) => [...prev, newLabel]);
    setEditingIndex(labels.length);
  };

  const duplicateLabel = (idx: number) => {
    const copy = { ...labels[idx], lotNumber: generateLotNumber(labels[idx].compound || "NXP") };
    setLabels((prev) => [
      ...prev.slice(0, idx + 1),
      copy,
      ...prev.slice(idx + 1),
    ]);
    setEditingIndex(idx + 1);
  };

  const removeLabel = (idx: number) => {
    if (labels.length === 1) return;
    setLabels((prev) => prev.filter((_, i) => i !== idx));
    setEditingIndex(Math.max(0, idx - 1));
  };

  const handlePrint = () => {
    window.print();
  };

  const copyPlainText = () => {
    const lines = labels
      .map(
        (l, i) =>
          `LABEL ${i + 1}\n` +
          `Compound: ${l.compound || "—"}\n` +
          `Concentration: ${l.concentration ? l.concentration + " " + l.concUnit : "—"}\n` +
          `Vehicle: ${l.vehicle || "—"}\n` +
          `Lot #: ${l.lotNumber || "—"}\n` +
          `Storage: ${l.storageTemp || "—"}\n` +
          `Reconstituted: ${l.reconDate || "—"}\n` +
          `Expires: ${l.expiryDate || (l.reconDate && STABILITY_DAYS[l.compound] ? addDays(l.reconDate, STABILITY_DAYS[l.compound]) : "—")}\n` +
          `Researcher: ${l.researcher || "—"}\n` +
          (l.notes ? `Notes: ${l.notes}\n` : "") +
          `RUO — Not for human use`
      )
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const current = labels[editingIndex] ?? labels[0];

  return (
    <>
      {/* Print stylesheet */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-labels, #print-labels * { visibility: visible !important; }
          #print-labels {
            position: fixed !important;
            top: 0; left: 0;
            width: 100%;
            display: flex !important;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px;
            background: white;
          }
          .label-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
        }
      `}</style>

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Research Tools", href: "/tools" },
                { label: "Vial Label Generator" },
              ]}
            />
            <div className="mt-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {/* Tag icon */}
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">
                  Research Tools
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Peptide Vial Label Generator
                </h1>
                <p className="text-zinc-400 max-w-2xl">
                  Generate printable 1″×2.5″ cryo labels for your research peptide vials. Enter
                  compound details, concentration, lot number, and reconstitution date — the
                  expiry date is auto-calculated from published stability windows. Print a
                  sheet of labels for your entire experiment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* ── Left: Form ─────────────────────────────────────────── */}
            <div>
              {/* Label tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {labels.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => setEditingIndex(i)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      i === editingIndex
                        ? "border-amber-400 bg-amber-400/10 text-amber-400"
                        : "border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    {l.compound ? l.compound.split(" ")[0] : `Label ${i + 1}`}
                  </button>
                ))}
                <button
                  onClick={addLabel}
                  className="px-3 py-1 text-sm rounded-lg border border-dashed border-white/20 text-zinc-500 hover:text-white hover:border-white/40 transition-colors"
                >
                  + Add Label
                </button>
              </div>

              {/* Form card */}
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold">Label #{editingIndex + 1}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateLabel(editingIndex)}
                      className="text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 px-2 py-1 rounded transition-colors"
                    >
                      Duplicate
                    </button>
                    {labels.length > 1 && (
                      <button
                        onClick={() => removeLabel(editingIndex)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 px-2 py-1 rounded transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Compound */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                    Compound Name *
                  </label>
                  <div className="flex gap-2">
                    {!customCompound ? (
                      <select
                        value={current.compound}
                        onChange={(e) => {
                          if (e.target.value === "__custom__") {
                            setCustomCompound(true);
                            updateLabel(editingIndex, "compound", "");
                          } else {
                            updateLabel(editingIndex, "compound", e.target.value);
                          }
                        }}
                        className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                      >
                        <option value="">-- Select compound --</option>
                        {COMPOUNDS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="__custom__">Custom compound…</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter compound name"
                        value={current.compound}
                        onChange={(e) => updateLabel(editingIndex, "compound", e.target.value)}
                        className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                      />
                    )}
                    <button
                      onClick={() => setCustomCompound(!customCompound)}
                      className="text-xs text-zinc-400 hover:text-amber-400 border border-white/10 px-2 py-1 rounded transition-colors"
                    >
                      {customCompound ? "List" : "Custom"}
                    </button>
                  </div>
                  {current.compound && STABILITY_DAYS[current.compound] && (
                    <p className="text-xs text-green-400 mt-1">
                      ✓ Auto-expiry: {STABILITY_DAYS[current.compound]}d at 4°C reconstituted
                    </p>
                  )}
                </div>

                {/* Concentration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Concentration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1"
                      value={current.concentration}
                      onChange={(e) => updateLabel(editingIndex, "concentration", e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Unit
                    </label>
                    <select
                      value={current.concUnit}
                      onChange={(e) => updateLabel(editingIndex, "concUnit", e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    >
                      <option value="mg/mL">mg/mL</option>
                      <option value="mcg/mL">mcg/mL (μg/mL)</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                    Reconstitution Vehicle
                  </label>
                  <div className="flex gap-2">
                    {!customVehicle ? (
                      <select
                        value={current.vehicle}
                        onChange={(e) => {
                          if (e.target.value === "Custom") {
                            setCustomVehicle(true);
                            updateLabel(editingIndex, "vehicle", "");
                          } else {
                            updateLabel(editingIndex, "vehicle", e.target.value);
                          }
                        }}
                        className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                      >
                        <option value="">-- Select vehicle --</option>
                        {VEHICLE_OPTIONS.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter vehicle"
                        value={current.vehicle}
                        onChange={(e) => updateLabel(editingIndex, "vehicle", e.target.value)}
                        className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                      />
                    )}
                    <button
                      onClick={() => setCustomVehicle(!customVehicle)}
                      className="text-xs text-zinc-400 hover:text-amber-400 border border-white/10 px-2 py-1 rounded transition-colors"
                    >
                      {customVehicle ? "List" : "Custom"}
                    </button>
                  </div>
                </div>

                {/* Lot Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Lot Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="NXP-BPC2601-4521"
                        value={current.lotNumber}
                        onChange={(e) => updateLabel(editingIndex, "lotNumber", e.target.value)}
                        className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50 font-mono"
                      />
                      <button
                        onClick={() =>
                          updateLabel(editingIndex, "lotNumber", generateLotNumber(current.compound || "NXP"))
                        }
                        title="Generate lot number"
                        className="text-xs text-zinc-400 hover:text-amber-400 border border-white/10 px-2 py-1 rounded transition-colors"
                      >
                        ↺
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Storage Temp
                    </label>
                    <select
                      value={current.storageTemp}
                      onChange={(e) => updateLabel(editingIndex, "storageTemp", e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    >
                      {STORAGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Reconstitution Date
                    </label>
                    <input
                      type="date"
                      value={current.reconDate}
                      onChange={(e) => updateLabel(editingIndex, "reconDate", e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Expiry Date{" "}
                      <span className="text-zinc-500 normal-case font-normal">(auto if blank)</span>
                    </label>
                    <input
                      type="date"
                      value={current.expiryDate}
                      onChange={(e) => updateLabel(editingIndex, "expiryDate", e.target.value)}
                      placeholder="Auto-calculated"
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                {/* Researcher + Notes */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Researcher Initials
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. J.D."
                      maxLength={6}
                      value={current.researcher}
                      onChange={(e) => updateLabel(editingIndex, "researcher", e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aliquot #3"
                      maxLength={40}
                      value={current.notes}
                      onChange={(e) => updateLabel(editingIndex, "notes", e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                {/* Apply to all */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const r = current.researcher;
                      const s = current.storageTemp;
                      const v = current.vehicle;
                      setLabels((prev) =>
                        prev.map((l) => ({ ...l, researcher: r, storageTemp: s, vehicle: v || l.vehicle }))
                      );
                    }}
                    className="text-xs text-zinc-400 hover:text-amber-400 border border-white/10 hover:border-amber-400/30 px-3 py-1.5 rounded transition-colors"
                  >
                    Apply researcher/storage/vehicle to all labels
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right: Preview ─────────────────────────────────────── */}
            <div>
              <h2 className="text-white font-semibold mb-4">
                Label Preview{" "}
                <span className="text-zinc-500 text-sm font-normal">
                  ({labels.length} label{labels.length !== 1 ? "s" : ""})
                </span>
              </h2>

              {/* Labels grid preview */}
              <div className="bg-zinc-800 rounded-xl p-6 mb-4 overflow-auto">
                <div className="flex flex-wrap gap-3" id="print-labels" ref={printRef}>
                  {labels.map((l, i) => (
                    <div
                      key={i}
                      onClick={() => setEditingIndex(i)}
                      className={`cursor-pointer rounded transition-all ${
                        i === editingIndex
                          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-800"
                          : "hover:ring-1 hover:ring-white/20 hover:ring-offset-1 hover:ring-offset-zinc-800"
                      }`}
                    >
                      <LabelPreview label={l} index={i} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Print / copy buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Labels
                </button>
                <button
                  onClick={copyPlainText}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  {copied ? (
                    <><span className="text-green-400">✓</span> Copied!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg> Copy as Text</>
                  )}
                </button>
              </div>

              {/* Print tips */}
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">🖨️ Print Tips</h3>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex gap-2">
                    <span className="text-amber-400 flex-shrink-0">•</span>
                    <span>
                      <strong className="text-zinc-300">Avery 60508 or similar</strong> — 1″×2.5″ cryo-resistant labels are standard for research vials
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 flex-shrink-0">•</span>
                    <span>
                      In your browser print dialog: set <strong className="text-zinc-300">Scale to 100%</strong> (no shrink) and disable headers/footers
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 flex-shrink-0">•</span>
                    <span>
                      Labels print on white background — will show up on standard white label stock
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 flex-shrink-0">•</span>
                    <span>
                      <strong className="text-zinc-300">Expiry dates shown in red</strong> when within 5 days — useful visual warning
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 flex-shrink-0">•</span>
                    <span>
                      Use <strong className="text-zinc-300">Duplicate</strong> to quickly create multiple vials of the same compound with different lot/aliquot notes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Stability Reference Table ──────────────────────────────────── */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">
              Auto-Expiry Reference
              <span className="ml-2 text-sm font-normal text-zinc-400">
                — reconstituted stability at 4°C (used for automatic expiry calculation)
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Object.entries(STABILITY_DAYS).map(([compound, days]) => (
                <button
                  key={compound}
                  onClick={() => {
                    updateLabel(editingIndex, "compound", compound);
                    // Auto-select vehicle
                    const nacVehicles: Record<string, string> = {
                      "NAD+": "Sterile Saline (0.9% NaCl)",
                      "SS-31 (Elamipretide)": "Sterile Saline (0.9% NaCl)",
                      "Follistatin 344": "PBS (pH 7.4)",
                      "Oxytocin": "Sterile Saline (0.9% NaCl)",
                      "Epitalon": "Sterile Saline (0.9% NaCl)",
                    };
                    if (nacVehicles[compound]) {
                      updateLabel(editingIndex, "vehicle", nacVehicles[compound]);
                    } else {
                      updateLabel(editingIndex, "vehicle", "BAC Water (0.9% Benzyl Alcohol)");
                    }
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-400/30 rounded-lg px-3 py-2.5 text-left transition-colors group"
                >
                  <div className="text-sm text-zinc-200 group-hover:text-white font-medium">
                    {compound}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {days}d at 4°C reconstituted
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              Click any compound above to load it into the current label. Stability values are
              based on published data and manufacturer guidance. Always verify with your lot
              COA and actual reconstitution conditions.
            </p>
          </div>

          {/* ── Labeling Best Practices ────────────────────────────────────── */}
          <div className="mt-12 bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Vial Labeling Best Practices</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Minimum Required Fields",
                  items: [
                    "Compound name (full name, not abbreviation)",
                    "Concentration (mg/mL or mcg/mL)",
                    "Lot number (from supplier COA)",
                    "Reconstitution date",
                    "Expiry date",
                    "Storage temperature",
                    "Researcher initials",
                  ],
                  color: "text-amber-400",
                },
                {
                  title: "Cryo Label Requirements",
                  items: [
                    "Use cryo-resistant label stock (-80°C rated)",
                    "Avery 60508, ULINE S-11189, or equivalent",
                    "Write on label BEFORE applying to frozen vial",
                    "Let printer ink dry before cryo use",
                    "Avoid smudge-prone inkjet on cryo stock",
                    "Verify label adhesion before first freeze",
                  ],
                  color: "text-blue-400",
                },
                {
                  title: "Documentation Protocol",
                  items: [
                    "Log every vial in your lab notebook",
                    "Record COA lot number — match to label",
                    "Photo-document label before first use",
                    "Update expiry if freeze-thaw cycle used",
                    "Label both vial AND storage box/rack",
                    "Include RUO notation on all labels",
                  ],
                  color: "text-green-400",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className={`text-sm font-bold ${section.color} mb-3`}>{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-zinc-400">
                        <span className={`${section.color} flex-shrink-0 mt-0.5`}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools ──────────────────────────────────────────────── */}
          <div className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">Related Research Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  href: "/tools/vial-inventory-tracker",
                  title: "Vial Inventory Tracker",
                  desc: "Track stock levels, expiry, and low-stock alerts",
                },
                {
                  href: "/tools/reconstitution-calculator",
                  title: "Reconstitution Calculator",
                  desc: "Calculate BAC water volume and dose per injection",
                },
                {
                  href: "/tools/peptide-stability-checker",
                  title: "Stability Checker",
                  desc: "Check storage conditions and degradation risk",
                },
                {
                  href: "/guides/storage",
                  title: "Storage Guide",
                  desc: "Comprehensive peptide storage reference by compound",
                },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-400/20 rounded-xl p-4 transition-colors group"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors mb-1">
                    {tool.title}
                  </div>
                  <div className="text-xs text-zinc-500">{tool.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2 mt-10" />

          {/* ── Disclaimer ─────────────────────────────────────────────────── */}
          <div className="mt-10 bg-zinc-900/50 border border-white/5 rounded-xl p-5">
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong className="text-zinc-400">Research Use Only (RUO).</strong> All labels generated by
              this tool include a Research Use Only designation. These compounds are not approved for
              human use, clinical administration, or use in any diagnostic procedure. Stability values
              are provided for reference based on published literature and manufacturer guidance; actual
              stability may vary depending on reconstitution conditions, storage equipment calibration,
              and compound batch characteristics. Always verify expiry with your own stability data.
              Nexphoria assumes no liability for labeling errors or misuse.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
