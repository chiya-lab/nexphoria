"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Types ────────────────────────────────────────────────────────────────────

type CycleLength = 12 | 24; // weeks

type WeekPhase = "active" | "washout" | "off";

type CompoundEntry = {
  id: string;
  slug: string;
  name: string;
  color: string;
  dose: string;
  unit: string;
  route: string;
  frequency: string;
  // Which weeks (1-indexed) are active for this compound
  activeWeeks: Set<number>;
  washoutWeeks: number; // washout period in weeks
};

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPOUND_OPTIONS: { slug: string; name: string; defaultDose: string; defaultUnit: string; defaultRoute: string; defaultFreq: string; washoutWeeks: number }[] = [
  { slug: "bpc-157", name: "BPC-157", defaultDose: "250", defaultUnit: "mcg", defaultRoute: "SC/IP", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "tb-500", name: "TB-500", defaultDose: "300", defaultUnit: "mcg", defaultRoute: "SC", defaultFreq: "2×/week", washoutWeeks: 2 },
  { slug: "ghk-cu", name: "GHK-Cu", defaultDose: "200", defaultUnit: "mcg", defaultRoute: "SC", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "ipamorelin", name: "Ipamorelin", defaultDose: "100", defaultUnit: "mcg", defaultRoute: "SC", defaultFreq: "3×/day", washoutWeeks: 2 },
  { slug: "cjc-1295-no-dac", name: "CJC-1295 No DAC", defaultDose: "100", defaultUnit: "mcg", defaultRoute: "SC", defaultFreq: "3×/day", washoutWeeks: 2 },
  { slug: "cjc-1295", name: "CJC-1295 (DAC)", defaultDose: "2", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "1×/week", washoutWeeks: 4 },
  { slug: "mk-677", name: "MK-677", defaultDose: "25", defaultUnit: "mg", defaultRoute: "Oral", defaultFreq: "Daily", washoutWeeks: 4 },
  { slug: "semaglutide", name: "Semaglutide", defaultDose: "0.5", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "1×/week", washoutWeeks: 5 },
  { slug: "tirzepatide", name: "Tirzepatide", defaultDose: "5", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "1×/week", washoutWeeks: 5 },
  { slug: "retatrutide", name: "Retatrutide", defaultDose: "4", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "1×/week", washoutWeeks: 5 },
  { slug: "sermorelin", name: "Sermorelin", defaultDose: "300", defaultUnit: "mcg", defaultRoute: "SC", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "tesamorelin", name: "Tesamorelin", defaultDose: "1", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "epitalon", name: "Epitalon", defaultDose: "10", defaultUnit: "mg", defaultRoute: "SC/IP", defaultFreq: "Daily ×10d", washoutWeeks: 8 },
  { slug: "nad-plus", name: "NAD+", defaultDose: "100", defaultUnit: "mg", defaultRoute: "IV/SC", defaultFreq: "3×/week", washoutWeeks: 2 },
  { slug: "selank", name: "Selank", defaultDose: "300", defaultUnit: "mcg", defaultRoute: "IN", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "semax", name: "Semax", defaultDose: "300", defaultUnit: "mcg", defaultRoute: "IN", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "pt-141", name: "PT-141", defaultDose: "1", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "2–3×/week", washoutWeeks: 2 },
  { slug: "melanotan-ii", name: "Melanotan-II", defaultDose: "0.5", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "Daily", washoutWeeks: 4 },
  { slug: "dsip", name: "DSIP", defaultDose: "300", defaultUnit: "mcg", defaultRoute: "IP", defaultFreq: "EOD", washoutWeeks: 2 },
  { slug: "aod-9604", name: "AOD-9604", defaultDose: "300", defaultUnit: "mcg", defaultRoute: "SC/IP", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "tb-500", name: "TB-500 + BPC-157 Blend", defaultDose: "500", defaultUnit: "mcg", defaultRoute: "SC", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "mots-c", name: "MOTS-c", defaultDose: "5", defaultUnit: "mg", defaultRoute: "IP", defaultFreq: "3×/week", washoutWeeks: 2 },
  { slug: "ss-31", name: "SS-31 (Elamipretide)", defaultDose: "3", defaultUnit: "mg/kg", defaultRoute: "SC", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "thymosin-alpha-1", name: "Thymosin Alpha-1", defaultDose: "1.6", defaultUnit: "mg", defaultRoute: "SC", defaultFreq: "2×/week", washoutWeeks: 2 },
  { slug: "oxytocin", name: "Oxytocin", defaultDose: "40", defaultUnit: "IU", defaultRoute: "IN", defaultFreq: "Daily", washoutWeeks: 1 },
  { slug: "kisspeptin", name: "Kisspeptin-10", defaultDose: "1", defaultUnit: "nmol/kg", defaultRoute: "IV/SC", defaultFreq: "Pulsatile", washoutWeeks: 2 },
  { slug: "kpv", name: "KPV", defaultDose: "1", defaultUnit: "mg/kg", defaultRoute: "IP/Oral", defaultFreq: "Daily", washoutWeeks: 2 },
  { slug: "ll-37", name: "LL-37", defaultDose: "0.5", defaultUnit: "mg/kg", defaultRoute: "IP", defaultFreq: "Daily", washoutWeeks: 2 },
];

// Unique colors for up to 8 compounds
const COMPOUND_COLORS = [
  "#4A90E2", // blue
  "#E2844A", // orange
  "#7ED492", // green
  "#B48AE2", // purple
  "#E2C84A", // yellow
  "#E26A6A", // red
  "#4AE2D4", // teal
  "#E27EC4", // pink
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function addWeeksToDate(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Phase legend colors ──────────────────────────────────────────────────────
function getWeekBg(entry: CompoundEntry, week: number, totalWeeks: number): string {
  if (entry.activeWeeks.has(week)) return entry.color;
  // Check if this is a washout week (washoutWeeks after last active week)
  const sortedActive = Array.from(entry.activeWeeks).sort((a, b) => a - b);
  if (sortedActive.length > 0) {
    const lastActive = sortedActive[sortedActive.length - 1];
    if (week > lastActive && week <= lastActive + entry.washoutWeeks) {
      // Washout zone
      return entry.color + "44"; // 27% opacity
    }
  }
  return "transparent";
}

function getWeekLabel(entry: CompoundEntry, week: number): string {
  if (entry.activeWeeks.has(week)) return "●";
  const sortedActive = Array.from(entry.activeWeeks).sort((a, b) => a - b);
  if (sortedActive.length > 0) {
    const lastActive = sortedActive[sortedActive.length - 1];
    if (week > lastActive && week <= lastActive + entry.washoutWeeks) {
      return "W";
    }
  }
  return "";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PeptideCyclePlanner() {
  const [cycleLength, setCycleLength] = useState<CycleLength>(12);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [compounds, setCompounds] = useState<CompoundEntry[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>(COMPOUND_OPTIONS[0].slug + "_" + COMPOUND_OPTIONS[0].name);
  const [showPrint, setShowPrint] = useState(false);

  const totalWeeks = cycleLength;
  const parsedStart = new Date(startDate + "T12:00:00");
  const endDate = addWeeksToDate(parsedStart, totalWeeks);

  // Add a compound
  function addCompound() {
    if (compounds.length >= 8) return;
    const parts = selectedSlug.split("_");
    const slug = parts[0];
    const name = parts.slice(1).join("_");
    const opt = COMPOUND_OPTIONS.find((o) => o.slug === slug && o.name === name);
    if (!opt) return;

    // Default: active weeks 1 through (totalWeeks - washoutWeeks)
    const activeCount = Math.max(1, totalWeeks - opt.washoutWeeks);
    const defaultActive = new Set<number>(
      Array.from({ length: activeCount }, (_, i) => i + 1)
    );

    const entry: CompoundEntry = {
      id: generateId(),
      slug: opt.slug,
      name: opt.name,
      color: COMPOUND_COLORS[compounds.length % COMPOUND_COLORS.length],
      dose: opt.defaultDose,
      unit: opt.defaultUnit,
      route: opt.defaultRoute,
      frequency: opt.defaultFreq,
      activeWeeks: defaultActive,
      washoutWeeks: opt.washoutWeeks,
    };
    setCompounds((prev) => [...prev, entry]);
  }

  function removeCompound(id: string) {
    setCompounds((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleWeek(id: string, week: number) {
    setCompounds((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newSet = new Set(c.activeWeeks);
        if (newSet.has(week)) {
          newSet.delete(week);
        } else {
          newSet.add(week);
        }
        return { ...c, activeWeeks: newSet };
      })
    );
  }

  // Quick-set ranges
  function setRange(id: string, start: number, end: number) {
    setCompounds((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newSet = new Set<number>(
          Array.from({ length: end - start + 1 }, (_, i) => start + i)
        );
        return { ...c, activeWeeks: newSet };
      })
    );
  }

  function updateField(id: string, field: keyof CompoundEntry, value: unknown) {
    setCompounds((prev) =>
      prev.map((c) => (c.id !== id ? c : { ...c, [field]: value }))
    );
  }

  // Get week start date label
  function getWeekDate(week: number): string {
    const d = addWeeksToDate(parsedStart, week - 1);
    return formatDateShort(d);
  }

  // Export as text
  function copyAsText() {
    const lines: string[] = [
      `NEXPHORIA RESEARCH CYCLE PROTOCOL`,
      `Generated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      ``,
      `CYCLE OVERVIEW`,
      `──────────────────────────────────`,
      `Duration: ${cycleLength}-Week ${cycleLength === 12 ? "3-Month" : "6-Month"} Research Cycle`,
      `Start Date: ${formatDateFull(parsedStart)}`,
      `End Date: ${formatDateFull(endDate)}`,
      `Compounds: ${compounds.length}`,
      ``,
    ];

    compounds.forEach((c) => {
      const sortedWeeks = Array.from(c.activeWeeks).sort((a, b) => a - b);
      lines.push(`COMPOUND: ${c.name}`);
      lines.push(`  Dose: ${c.dose} ${c.unit} | Route: ${c.route} | Frequency: ${c.frequency}`);
      lines.push(`  Active Weeks: ${sortedWeeks.join(", ")}`);
      lines.push(`  Washout Period: ${c.washoutWeeks} week${c.washoutWeeks !== 1 ? "s" : ""}`);
      if (sortedWeeks.length > 0) {
        const lastActive = sortedWeeks[sortedWeeks.length - 1];
        const washoutEnd = Math.min(lastActive + c.washoutWeeks, totalWeeks);
        if (washoutEnd > lastActive) {
          lines.push(`  Washout Weeks: ${Array.from({ length: washoutEnd - lastActive }, (_, i) => lastActive + 1 + i).join(", ")}`);
        }
      }
      lines.push(``);
    });

    lines.push(`WEEKLY CALENDAR`);
    lines.push(`──────────────────────────────────`);
    const header = `Week | Date     | ${compounds.map((c) => c.name.substring(0, 12).padEnd(12)).join(" | ")}`;
    lines.push(header);
    lines.push("─".repeat(header.length));

    for (let w = 1; w <= totalWeeks; w++) {
      const row = [
        `W${String(w).padStart(2, "0")} `,
        getWeekDate(w).padEnd(9),
        ...compounds.map((c) => {
          const lbl = getWeekLabel(c, w);
          if (lbl === "●") return "ACTIVE      ";
          if (lbl === "W") return "WASHOUT     ";
          return "            ";
        }),
      ];
      lines.push(row.join(" | "));
    }

    lines.push(``);
    lines.push(`DISCLAIMER: For Research Use Only. Not for human use. Not for clinical application.`);

    navigator.clipboard
      .writeText(lines.join("\n"))
      .catch(() => {
        const el = document.createElement("textarea");
        el.value = lines.join("\n");
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      });
    alert("Protocol copied to clipboard.");
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "#F9F9F9" }}>
      {/* Hero */}
      <section
        className="px-6 py-16 md:py-20"
        style={{ borderBottom: "1px solid #1A1A18" }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Peptide Cycle Planner" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>
            Research Tools
          </p>
          <h1
            className="text-3xl md:text-4xl mb-4 tracking-tight"
            style={{ fontWeight: 200 }}
          >
            Peptide Cycle Planner
          </h1>
          <p className="text-base max-w-2xl" style={{ color: "#A0A090", lineHeight: 1.7 }}>
            Plan a complete 3-month or 6-month research cycle. Set a start date, add compounds, assign active weeks, and visualize washout periods on a calendar-style grid. Print or export your protocol.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Step 1: Cycle Setup ─────────────────────────────────────────── */}
          <div
            className="rounded-sm p-6 md:p-8"
            style={{ backgroundColor: "#111110", border: "1px solid #222220" }}
          >
            <h2 className="text-base font-medium mb-6" style={{ color: "#F9F9F9" }}>
              Step 1 — Cycle Setup
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Cycle length */}
              <div>
                <label className="text-xs uppercase tracking-widest mb-3 block" style={{ color: "#6B6B60" }}>
                  Cycle Length
                </label>
                <div className="flex gap-3">
                  {([12, 24] as CycleLength[]).map((len) => (
                    <button
                      key={len}
                      onClick={() => setCycleLength(len)}
                      className="flex-1 py-2.5 rounded-sm text-sm font-medium transition-all"
                      style={{
                        backgroundColor: cycleLength === len ? "#d4af37" : "#1A1A18",
                        color: cycleLength === len ? "#000" : "#A0A090",
                        border: `1px solid ${cycleLength === len ? "#d4af37" : "#2A2A28"}`,
                      }}
                    >
                      {len}w ({len === 12 ? "3-Month" : "6-Month"})
                    </button>
                  ))}
                </div>
              </div>

              {/* Start date */}
              <div>
                <label className="text-xs uppercase tracking-widest mb-3 block" style={{ color: "#6B6B60" }}>
                  Cycle Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-sm text-sm"
                  style={{
                    backgroundColor: "#1A1A18",
                    color: "#F9F9F9",
                    border: "1px solid #2A2A28",
                    outline: "none",
                  }}
                />
              </div>

              {/* Summary */}
              <div>
                <label className="text-xs uppercase tracking-widest mb-3 block" style={{ color: "#6B6B60" }}>
                  Cycle Summary
                </label>
                <div
                  className="py-2.5 px-3 rounded-sm text-sm"
                  style={{ backgroundColor: "#1A1A18", border: "1px solid #2A2A28" }}
                >
                  <span style={{ color: "#d4af37" }}>{formatDateFull(parsedStart)}</span>
                  <span style={{ color: "#6B6B60" }}> → </span>
                  <span style={{ color: "#d4af37" }}>{formatDateFull(endDate)}</span>
                  <div className="mt-1 text-xs" style={{ color: "#6B6B60" }}>
                    {totalWeeks} weeks · {compounds.length} compound{compounds.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Step 2: Add Compounds ───────────────────────────────────────── */}
          <div
            className="rounded-sm p-6 md:p-8"
            style={{ backgroundColor: "#111110", border: "1px solid #222220" }}
          >
            <h2 className="text-base font-medium mb-6" style={{ color: "#F9F9F9" }}>
              Step 2 — Add Compounds
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="flex-1 py-2.5 px-3 rounded-sm text-sm"
                style={{
                  backgroundColor: "#1A1A18",
                  color: "#F9F9F9",
                  border: "1px solid #2A2A28",
                  outline: "none",
                }}
              >
                {COMPOUND_OPTIONS.map((opt) => (
                  <option key={`${opt.slug}_${opt.name}`} value={`${opt.slug}_${opt.name}`}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addCompound}
                disabled={compounds.length >= 8}
                className="px-6 py-2.5 rounded-sm text-sm font-medium transition-all"
                style={{
                  backgroundColor: compounds.length >= 8 ? "#1A1A18" : "#d4af37",
                  color: compounds.length >= 8 ? "#6B6B60" : "#000",
                  border: `1px solid ${compounds.length >= 8 ? "#2A2A28" : "#d4af37"}`,
                  cursor: compounds.length >= 8 ? "not-allowed" : "pointer",
                }}
              >
                + Add to Cycle
              </button>
            </div>
            <p className="text-xs" style={{ color: "#6B6B60" }}>
              Add up to 8 compounds. Each compound gets a unique color on the calendar.
            </p>

            {/* Compound list */}
            {compounds.length > 0 && (
              <div className="mt-6 space-y-4">
                {compounds.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-sm p-4"
                    style={{
                      backgroundColor: "#0A0A0A",
                      border: `1px solid ${c.color}44`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-sm font-medium" style={{ color: c.color }}>
                          {c.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCompound(c.id)}
                        className="text-xs px-2 py-1 rounded-sm"
                        style={{ color: "#6B6B60", border: "1px solid #2A2A28" }}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Dose/Route/Freq fields */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#6B6B60" }}>Dose</label>
                        <input
                          type="text"
                          value={c.dose}
                          onChange={(e) => updateField(c.id, "dose", e.target.value)}
                          className="w-full py-1.5 px-2 rounded-sm text-xs"
                          style={{ backgroundColor: "#1A1A18", color: "#F9F9F9", border: "1px solid #2A2A28", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#6B6B60" }}>Unit</label>
                        <input
                          type="text"
                          value={c.unit}
                          onChange={(e) => updateField(c.id, "unit", e.target.value)}
                          className="w-full py-1.5 px-2 rounded-sm text-xs"
                          style={{ backgroundColor: "#1A1A18", color: "#F9F9F9", border: "1px solid #2A2A28", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#6B6B60" }}>Route</label>
                        <input
                          type="text"
                          value={c.route}
                          onChange={(e) => updateField(c.id, "route", e.target.value)}
                          className="w-full py-1.5 px-2 rounded-sm text-xs"
                          style={{ backgroundColor: "#1A1A18", color: "#F9F9F9", border: "1px solid #2A2A28", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#6B6B60" }}>Frequency</label>
                        <input
                          type="text"
                          value={c.frequency}
                          onChange={(e) => updateField(c.id, "frequency", e.target.value)}
                          className="w-full py-1.5 px-2 rounded-sm text-xs"
                          style={{ backgroundColor: "#1A1A18", color: "#F9F9F9", border: "1px solid #2A2A28", outline: "none" }}
                        />
                      </div>
                    </div>

                    {/* Washout period */}
                    <div className="flex items-center gap-4 mb-4">
                      <label className="text-xs" style={{ color: "#6B6B60" }}>
                        Washout Period:
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateField(c.id, "washoutWeeks", Math.max(0, c.washoutWeeks - 1))}
                          className="w-6 h-6 flex items-center justify-center rounded-sm text-sm"
                          style={{ backgroundColor: "#1A1A18", color: "#A0A090", border: "1px solid #2A2A28" }}
                        >
                          −
                        </button>
                        <span className="text-sm w-8 text-center" style={{ color: "#F9F9F9" }}>
                          {c.washoutWeeks}w
                        </span>
                        <button
                          onClick={() => updateField(c.id, "washoutWeeks", Math.min(8, c.washoutWeeks + 1))}
                          className="w-6 h-6 flex items-center justify-center rounded-sm text-sm"
                          style={{ backgroundColor: "#1A1A18", color: "#A0A090", border: "1px solid #2A2A28" }}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs" style={{ color: "#6B6B60" }}>
                        (appended automatically after last active week)
                      </span>
                    </div>

                    {/* Quick range buttons */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs" style={{ color: "#6B6B60" }}>Quick set:</span>
                      {[
                        { label: "Wk 1–4", start: 1, end: 4 },
                        { label: "Wk 1–6", start: 1, end: 6 },
                        { label: "Wk 1–8", start: 1, end: 8 },
                        { label: "Wk 1–10", start: 1, end: Math.min(10, totalWeeks) },
                        { label: "Wk 1–12", start: 1, end: Math.min(12, totalWeeks) },
                        ...(totalWeeks === 24 ? [
                          { label: "Wk 1–16", start: 1, end: 16 },
                          { label: "Wk 1–20", start: 1, end: 20 },
                        ] : []),
                        { label: "Full Cycle", start: 1, end: Math.max(1, totalWeeks - c.washoutWeeks) },
                        { label: "Clear", start: 0, end: -1 },
                      ].map((btn) => (
                        <button
                          key={btn.label}
                          onClick={() => {
                            if (btn.start === 0) {
                              setCompounds((prev) =>
                                prev.map((comp) => comp.id !== c.id ? comp : { ...comp, activeWeeks: new Set() })
                              );
                            } else {
                              setRange(c.id, btn.start, btn.end);
                            }
                          }}
                          className="text-xs px-2 py-1 rounded-sm"
                          style={{
                            backgroundColor: "#1A1A18",
                            color: btn.label === "Clear" ? "#E26A6A" : "#A0A090",
                            border: `1px solid ${btn.label === "Clear" ? "#E26A6A44" : "#2A2A28"}`,
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {/* Week toggle grid */}
                    <div>
                      <label className="text-xs mb-2 block" style={{ color: "#6B6B60" }}>
                        Active Weeks (click to toggle):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
                          const isActive = c.activeWeeks.has(week);
                          const sortedActive = Array.from(c.activeWeeks).sort((a, b) => a - b);
                          const lastActive = sortedActive.length > 0 ? sortedActive[sortedActive.length - 1] : 0;
                          const isWashout = !isActive && lastActive > 0 && week > lastActive && week <= lastActive + c.washoutWeeks;
                          return (
                            <button
                              key={week}
                              onClick={() => toggleWeek(c.id, week)}
                              title={`Week ${week}: ${formatDateShort(addWeeksToDate(parsedStart, week - 1))}`}
                              className="w-8 h-8 text-xs rounded-sm font-medium transition-all flex items-center justify-center"
                              style={{
                                backgroundColor: isActive ? c.color : isWashout ? c.color + "33" : "#1A1A18",
                                color: isActive ? "#000" : isWashout ? c.color : "#6B6B60",
                                border: `1px solid ${isActive ? c.color : isWashout ? c.color + "55" : "#2A2A28"}`,
                                fontWeight: isActive ? 700 : 400,
                              }}
                            >
                              {week}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Step 3: Calendar View ───────────────────────────────────────── */}
          {compounds.length > 0 && (
            <div
              className="rounded-sm p-6 md:p-8"
              style={{ backgroundColor: "#111110", border: "1px solid #222220" }}
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-base font-medium" style={{ color: "#F9F9F9" }}>
                  Step 3 — Cycle Calendar
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={copyAsText}
                    className="text-xs px-4 py-2 rounded-sm font-medium transition-all"
                    style={{
                      backgroundColor: "#1A1A18",
                      color: "#A0A090",
                      border: "1px solid #2A2A28",
                    }}
                  >
                    Copy as Text
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="text-xs px-4 py-2 rounded-sm font-medium transition-all"
                    style={{
                      backgroundColor: "#d4af37",
                      color: "#000",
                      border: "1px solid #d4af37",
                    }}
                  >
                    Print Protocol
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {compounds.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.color }} />
                    <span className="text-xs" style={{ color: "#A0A090" }}>{c.name}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#444440" }} />
                  <span className="text-xs" style={{ color: "#6B6B60" }}>Washout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#1A1A18", border: "1px solid #2A2A28" }} />
                  <span className="text-xs" style={{ color: "#6B6B60" }}>Off</span>
                </div>
              </div>

              {/* Calendar grid — scrollable on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs" style={{ minWidth: "600px" }}>
                  <thead>
                    <tr>
                      <th
                        className="text-left py-2 pr-4 font-medium sticky left-0"
                        style={{
                          color: "#6B6B60",
                          backgroundColor: "#111110",
                          width: "160px",
                          minWidth: "160px",
                        }}
                      >
                        Compound
                      </th>
                      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                        <th
                          key={week}
                          className="py-2 text-center font-medium"
                          style={{
                            color: "#6B6B60",
                            width: "32px",
                            minWidth: "32px",
                            padding: "4px 2px",
                          }}
                        >
                          {week}
                        </th>
                      ))}
                    </tr>
                    {/* Date row */}
                    <tr>
                      <td
                        className="py-1 pr-4 sticky left-0"
                        style={{ color: "#6B6B60", backgroundColor: "#111110", fontSize: "9px" }}
                      >
                        Week Start
                      </td>
                      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                        <td
                          key={week}
                          className="text-center"
                          style={{
                            color: "#444440",
                            fontSize: "8px",
                            padding: "2px 1px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDateShort(addWeeksToDate(parsedStart, week - 1)).replace(" ", "\n")}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, idx) => (
                      <tr key={c.id} style={{ borderTop: "1px solid #1A1A18" }}>
                        <td
                          className="py-2 pr-4 sticky left-0"
                          style={{
                            color: c.color,
                            backgroundColor: "#111110",
                            fontWeight: 500,
                            fontSize: "11px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "160px",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                          </div>
                        </td>
                        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
                          const isActive = c.activeWeeks.has(week);
                          const sortedActive = Array.from(c.activeWeeks).sort((a, b) => a - b);
                          const lastActive = sortedActive.length > 0 ? sortedActive[sortedActive.length - 1] : 0;
                          const isWashout = !isActive && lastActive > 0 && week > lastActive && week <= lastActive + c.washoutWeeks;
                          const bgColor = isActive ? c.color : isWashout ? c.color + "33" : "transparent";
                          const cellLabel = isActive ? "●" : isWashout ? "W" : "";

                          return (
                            <td
                              key={week}
                              title={`${c.name} — Week ${week} (${formatDateShort(addWeeksToDate(parsedStart, week - 1))}): ${isActive ? "Active" : isWashout ? "Washout" : "Off"}`}
                              className="text-center"
                              style={{
                                backgroundColor: bgColor,
                                color: isActive ? "#000" : isWashout ? c.color : "#333330",
                                padding: "6px 2px",
                                fontSize: "9px",
                                fontWeight: isActive ? 700 : 400,
                                border: "1px solid #111110",
                              }}
                            >
                              {cellLabel}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phase summary per compound */}
              <div className="mt-8 space-y-3">
                <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6B6B60" }}>
                  Phase Summary
                </h3>
                {compounds.map((c) => {
                  const sortedActive = Array.from(c.activeWeeks).sort((a, b) => a - b);
                  const activeCount = sortedActive.length;
                  const firstActive = sortedActive[0] ?? 0;
                  const lastActive = sortedActive[sortedActive.length - 1] ?? 0;
                  const washoutEnd = lastActive > 0 ? Math.min(lastActive + c.washoutWeeks, totalWeeks) : 0;
                  return (
                    <div
                      key={c.id}
                      className="flex flex-wrap items-center gap-4 py-3 px-4 rounded-sm"
                      style={{
                        backgroundColor: "#0A0A0A",
                        border: `1px solid ${c.color}33`,
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-xs font-medium" style={{ color: c.color }}>{c.name}</span>
                      </div>
                      <span className="text-xs" style={{ color: "#A0A090" }}>
                        {activeCount > 0 ? (
                          <>
                            <span style={{ color: "#d4af37" }}>Active:</span>{" "}
                            Wk {firstActive}–{lastActive}
                            {activeCount !== lastActive - firstActive + 1 && " (non-consecutive)"}
                          </>
                        ) : (
                          <span style={{ color: "#6B6B60" }}>No active weeks set</span>
                        )}
                      </span>
                      {activeCount > 0 && c.washoutWeeks > 0 && washoutEnd > lastActive && (
                        <span className="text-xs" style={{ color: "#A0A090" }}>
                          <span style={{ color: "#6B6B60" }}>Washout:</span>{" "}
                          Wk {lastActive + 1}–{washoutEnd}
                          {" "}({c.washoutWeeks}w)
                        </span>
                      )}
                      <span className="text-xs ml-auto" style={{ color: "#6B6B60" }}>
                        {c.dose} {c.unit} · {c.route} · {c.frequency}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Printable protocol section (visible only when printing) */}
              <div className="print:block hidden mt-8 text-black">
                <hr className="my-4" />
                <h3 className="text-sm font-bold mb-2">NEXPHORIA — Research Cycle Protocol</h3>
                <p className="text-xs mb-4">
                  {cycleLength}-Week {cycleLength === 12 ? "3-Month" : "6-Month"} Cycle &nbsp;·&nbsp;
                  Start: {formatDateFull(parsedStart)} &nbsp;·&nbsp;
                  End: {formatDateFull(endDate)}
                </p>
                <p className="text-xs italic">
                  FOR RESEARCH USE ONLY. Not for human use. Not for clinical, diagnostic, or therapeutic application.
                </p>
              </div>
            </div>
          )}

          {/* ── Empty state ─────────────────────────────────────────────────── */}
          {compounds.length === 0 && (
            <div
              className="rounded-sm p-12 text-center"
              style={{ backgroundColor: "#111110", border: "1px dashed #222220" }}
            >
              <div className="text-4xl mb-4" style={{ color: "#2A2A28" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="8" y1="14" x2="8" y2="14"/>
                  <line x1="12" y1="14" x2="12" y2="14"/>
                  <line x1="16" y1="14" x2="16" y2="14"/>
                  <line x1="8" y1="18" x2="8" y2="18"/>
                  <line x1="12" y1="18" x2="12" y2="18"/>
                  <line x1="16" y1="18" x2="16" y2="18"/>
                </svg>
              </div>
              <p className="text-sm mb-2" style={{ color: "#6B6B60" }}>No compounds added yet.</p>
              <p className="text-xs" style={{ color: "#444440" }}>
                Select a compound above and click "Add to Cycle" to build your calendar.
              </p>
            </div>
          )}

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2 mb-6" />

          {/* ── RUO Disclaimer ──────────────────────────────────────────────── */}
          <div
            className="rounded-sm p-5"
            style={{ backgroundColor: "#0F0F0D", border: "1px solid #1A1A18" }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "#4A4A40" }}>
              <strong style={{ color: "#6B6B60" }}>Research Use Only.</strong>{" "}
              This tool is provided for informational and research planning purposes only. All compounds referenced are for in vitro and animal research. Not for human consumption, clinical use, or therapeutic application. Nexphoria makes no claims regarding efficacy or safety for any purpose other than qualified research. Always comply with applicable regulations regarding acquisition, handling, and disposal of research compounds.
            </p>
          </div>

          {/* ── Related Tools ───────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6B6B60" }}>
              Related Tools
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { href: "/tools/dosing-frequency-planner", title: "Dosing Frequency Planner", desc: "Weekly injection schedule for multiple compounds." },
                { href: "/tools/half-life-calculator", title: "Half-Life Calculator", desc: "Clearance milestones, decay curve, dosing interval." },
                { href: "/tools/protocol-template-generator", title: "Protocol Template Generator", desc: "Printable research protocol document with rationale." },
                { href: "/tools/stack-builder", title: "Stack Builder", desc: "Goal-based compound stacks with synergy rationale." },
                { href: "/tools/igf-1-calculator", title: "IGF-1 Response Calculator", desc: "Estimate IGF-1 elevation from GH secretagogue stacking." },
                { href: "/tools/reconstitution-calculator", title: "Reconstitution Calculator", desc: "BAC water volume, dose volume, and doses per vial." },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block rounded-sm p-4 transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "#111110",
                    border: "1px solid #1A1A18",
                    textDecoration: "none",
                  }}
                >
                  <div className="text-sm font-medium mb-1" style={{ color: "#F9F9F9" }}>
                    {tool.title}
                  </div>
                  <div className="text-xs" style={{ color: "#6B6B60" }}>
                    {tool.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
