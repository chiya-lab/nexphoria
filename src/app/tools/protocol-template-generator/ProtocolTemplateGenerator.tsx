"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { products } from "@/lib/products";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Types ──────────────────────────────────────────────────────────────────

type Route = "SC" | "IM" | "IV" | "Oral" | "Intranasal" | "Topical";
type Frequency =
  | "Daily"
  | "2x/day"
  | "Every other day"
  | "3x/week"
  | "2x/week"
  | "Weekly";

type CompoundEntry = {
  id: string;
  slug: string;
  customName: string;
  dose: string;
  unit: "mcg" | "mg" | "IU";
  route: Route;
  frequency: Frequency;
  rationale: string;
  reconNote: string;
  storageNote: string;
};

type ProtocolMeta = {
  studyTitle: string;
  researcherInitials: string;
  institution: string;
  startDate: string;
  cycleLength: "3-month" | "6-month" | "custom";
  customWeeks: string;
  subjectSpecies: "Mouse" | "Rat" | "In vitro" | "Other";
  studyObjective: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const ROUTES: Route[] = ["SC", "IM", "IV", "Oral", "Intranasal", "Topical"];
const FREQUENCIES: Frequency[] = [
  "Daily",
  "2x/day",
  "Every other day",
  "3x/week",
  "2x/week",
  "Weekly",
];

const PRODUCT_OPTIONS = products
  .filter((p) => !p.comingSoon)
  .sort((a, b) => a.name.localeCompare(b.name));

const ROUTE_NOTES: Record<Route, string> = {
  SC: "Subcutaneous injection. Rotate injection sites (abdomen, flank, scruff). Use 27–31G needle.",
  IM: "Intramuscular injection. Suitable for aqueous solutions. Rotate between muscle groups.",
  IV: "Intravenous injection. Use lateral tail vein in rodents. Filter through 0.22 μm prior to administration.",
  Oral: "Oral gavage. Administer in aqueous vehicle; confirm compound oral bioavailability before use.",
  Intranasal: "Intranasal delivery. Anesthetize if needed; administer 5–10 μL per naris for rodents.",
  Topical: "Topical application. Apply to shaved/depilated skin area; avoid ingestion by subject.",
};

const BIOMARKERS = [
  "Body weight (weekly)",
  "IGF-1 (serum, weeks 0/4/8/12)",
  "Fasting glucose (weeks 0/4/8/12)",
  "Insulin (fasting, ELISA)",
  "CBC / differential",
  "CMP / hepatic panel",
  "Inflammatory markers (IL-6, TNF-α)",
  "DEXA body composition (start + end)",
  "Behavioral / behavioral scoring",
  "Tissue harvest (endpoint)",
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const freqToDays: Record<Frequency, string[]> = {
  "Daily": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "2x/day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "Every other day": ["Mon", "Wed", "Fri", "Sun"],
  "3x/week": ["Mon", "Wed", "Fri"],
  "2x/week": ["Mon", "Thu"],
  "Weekly": ["Mon"],
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function blankEntry(): CompoundEntry {
  return {
    id: uid(),
    slug: "",
    customName: "",
    dose: "",
    unit: "mcg",
    route: "SC",
    frequency: "Daily",
    rationale: "",
    reconNote: "",
    storageNote: "",
  };
}

// ─── Print styles ─────────────────────────────────────────────────────────────

const PRINT_STYLES = `
@media print {
  body { background: white !important; color: black !important; }
  .no-print { display: none !important; }
  .print-section { break-inside: avoid; }
  .print-page { background: white; color: black; padding: 0; }
}
`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProtocolTemplateGenerator() {
  const [meta, setMeta] = useState<ProtocolMeta>({
    studyTitle: "",
    researcherInitials: "",
    institution: "",
    startDate: "",
    cycleLength: "3-month",
    customWeeks: "8",
    subjectSpecies: "Mouse",
    studyObjective: "",
  });

  const [compounds, setCompounds] = useState<CompoundEntry[]>([blankEntry()]);
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>([
    "Body weight (weekly)",
    "IGF-1 (serum, weeks 0/4/8/12)",
  ]);
  const [customBiomarker, setCustomBiomarker] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // ── Compound helpers ───────────────────────────────────────────────────────

  function addCompound() {
    if (compounds.length >= 5) return;
    setCompounds((prev) => [...prev, blankEntry()]);
  }

  function removeCompound(id: string) {
    setCompounds((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCompound(id: string, patch: Partial<CompoundEntry>) {
    setCompounds((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...patch };
        // Auto-fill notes from product if slug changes
        if (patch.slug !== undefined) {
          const prod = products.find((p) => p.slug === patch.slug);
          if (prod) {
            updated.customName = prod.name;
            updated.reconNote = prod.reconstitution || "";
            updated.storageNote = prod.storage || "";
          }
        }
        return updated;
      })
    );
  }

  // ── Biomarker helpers ─────────────────────────────────────────────────────

  function toggleBiomarker(b: string) {
    setSelectedBiomarkers((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  function addCustomBiomarker() {
    const trimmed = customBiomarker.trim();
    if (!trimmed || selectedBiomarkers.includes(trimmed)) return;
    setSelectedBiomarkers((prev) => [...prev, trimmed]);
    setCustomBiomarker("");
  }

  // ── Cycle weeks ───────────────────────────────────────────────────────────

  function cycleWeeks() {
    if (meta.cycleLength === "3-month") return 12;
    if (meta.cycleLength === "6-month") return 24;
    return parseInt(meta.customWeeks) || 8;
  }

  // ── Plain text export ─────────────────────────────────────────────────────

  function buildPlainText() {
    const weeks = cycleWeeks();
    const lines: string[] = [];
    lines.push("═".repeat(60));
    lines.push("RESEARCH PROTOCOL DOCUMENT");
    lines.push("Generated by Nexphoria Protocol Template Generator");
    lines.push(`Date Generated: ${new Date().toLocaleDateString()}`);
    lines.push("═".repeat(60));
    lines.push("");
    lines.push("STUDY INFORMATION");
    lines.push("─".repeat(40));
    lines.push(`Title: ${meta.studyTitle || "(untitled)"}`);
    lines.push(`Researcher: ${meta.researcherInitials || "—"}`);
    lines.push(`Institution: ${meta.institution || "—"}`);
    lines.push(`Start Date: ${meta.startDate || "—"}`);
    lines.push(`Cycle Length: ${weeks} weeks`);
    lines.push(`Subject Species: ${meta.subjectSpecies}`);
    lines.push(`Objective: ${meta.studyObjective || "—"}`);
    lines.push("");
    lines.push("COMPOUND TABLE");
    lines.push("─".repeat(40));
    compounds.forEach((c, i) => {
      const name = c.customName || c.slug || `Compound ${i + 1}`;
      lines.push(`${i + 1}. ${name}`);
      lines.push(`   Dose: ${c.dose || "—"} ${c.unit}`);
      lines.push(`   Route: ${c.route}`);
      lines.push(`   Frequency: ${c.frequency}`);
      lines.push(`   Rationale: ${c.rationale || "—"}`);
      lines.push("");
    });
    lines.push("RECONSTITUTION NOTES");
    lines.push("─".repeat(40));
    compounds.forEach((c, i) => {
      const name = c.customName || c.slug || `Compound ${i + 1}`;
      lines.push(`${i + 1}. ${name}: ${c.reconNote || "Reconstitute per manufacturer specification."}`);
    });
    lines.push("");
    lines.push("STORAGE REQUIREMENTS");
    lines.push("─".repeat(40));
    compounds.forEach((c, i) => {
      const name = c.customName || c.slug || `Compound ${i + 1}`;
      lines.push(`${i + 1}. ${name}: ${c.storageNote || "Store per manufacturer specification."}`);
    });
    lines.push("");
    lines.push("BIOMARKER TRACKING");
    lines.push("─".repeat(40));
    selectedBiomarkers.forEach((b) => lines.push(`• ${b}`));
    lines.push("");
    lines.push("WEEKLY SCHEDULE (Days of Administration)");
    lines.push("─".repeat(40));
    const header = ["Compound".padEnd(24), ...DAYS_OF_WEEK.map((d) => d.padEnd(5))].join(" ");
    lines.push(header);
    compounds.forEach((c) => {
      const name = (c.customName || c.slug || "—").slice(0, 22).padEnd(24);
      const days = DAYS_OF_WEEK.map((d) =>
        (freqToDays[c.frequency] || []).includes(d) ? "✓".padEnd(5) : " ".padEnd(5)
      ).join(" ");
      lines.push(name + " " + days);
    });
    lines.push("");
    lines.push("─".repeat(60));
    lines.push("FOR RESEARCH USE ONLY. Not for human therapeutic use.");
    lines.push("This document is a template for research planning purposes.");
    lines.push("Nexphoria compounds are sold exclusively for in vitro and");
    lines.push("preclinical research by qualified scientists.");
    lines.push("═".repeat(60));
    return lines.join("\n");
  }

  async function copyText() {
    const text = buildPlainText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handlePrint() {
    window.print();
  }

  const weeks = cycleWeeks();
  const isReady =
    meta.studyTitle.trim() &&
    compounds.some((c) => c.customName || c.slug);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: "#080808", minHeight: "100vh", color: "#F9F9F9" }}>
      <style>{PRINT_STYLES}</style>

      {/* ── Header ── */}
      <div
        className="no-print"
        style={{ borderBottom: "1px solid #1E1E1C", backgroundColor: "#0A0A08" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Protocol Template Generator" },
            ]}
          />
        </div>
      </div>

      {/* ── Hero ── */}
      <div
        className="no-print"
        style={{
          borderBottom: "1px solid #1E1E1C",
          padding: "48px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          className="eyebrow"
          style={{ color: "#C9DD69", marginBottom: "12px", fontSize: "11px" }}
        >
          Research Tools
        </p>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 38px)",
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "#F9F9F9",
            marginBottom: "12px",
          }}
        >
          Protocol Template Generator
        </h1>
        <p style={{ color: "#A0A0A0", maxWidth: "520px", margin: "0 auto", fontSize: "15px" }}>
          Build a printable research protocol document. Select compounds, doses, routes, and cycle
          length — export to print or plain text.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="no-print">
          {/* ────────────────────────────────────────────────────────────────
              SECTION 1: Study Metadata
          ──────────────────────────────────────────────────────────────── */}
          <section
            style={{
              backgroundColor: "#111110",
              border: "1px solid #2A2A28",
              borderRadius: "2px",
              padding: "28px",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#C9DD69",
                marginBottom: "20px",
              }}
            >
              1 — Study Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Study Title</label>
                <input
                  type="text"
                  placeholder="e.g. BPC-157 Tendon Repair Study — 12 Week"
                  value={meta.studyTitle}
                  onChange={(e) => setMeta((p) => ({ ...p, studyTitle: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Researcher Initials</label>
                <input
                  type="text"
                  placeholder="e.g. M.K."
                  value={meta.researcherInitials}
                  onChange={(e) => setMeta((p) => ({ ...p, researcherInitials: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Institution / Lab</label>
                <input
                  type="text"
                  placeholder="e.g. Dept. of Biochemistry"
                  value={meta.institution}
                  onChange={(e) => setMeta((p) => ({ ...p, institution: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input
                  type="date"
                  value={meta.startDate}
                  onChange={(e) => setMeta((p) => ({ ...p, startDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Subject Species</label>
                <select
                  value={meta.subjectSpecies}
                  onChange={(e) =>
                    setMeta((p) => ({
                      ...p,
                      subjectSpecies: e.target.value as ProtocolMeta["subjectSpecies"],
                    }))
                  }
                  style={selectStyle}
                >
                  <option>Mouse</option>
                  <option>Rat</option>
                  <option>In vitro</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Cycle Length</label>
                <select
                  value={meta.cycleLength}
                  onChange={(e) =>
                    setMeta((p) => ({
                      ...p,
                      cycleLength: e.target.value as ProtocolMeta["cycleLength"],
                    }))
                  }
                  style={selectStyle}
                >
                  <option value="3-month">3-Month Research Cycle (12 wk)</option>
                  <option value="6-month">6-Month Research Cycle (24 wk)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {meta.cycleLength === "custom" && (
                <div>
                  <label style={labelStyle}>Weeks</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={meta.customWeeks}
                    onChange={(e) => setMeta((p) => ({ ...p, customWeeks: e.target.value }))}
                    style={{ ...inputStyle, width: "100px" }}
                  />
                </div>
              )}
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Study Objective (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the research objective..."
                  value={meta.studyObjective}
                  onChange={(e) => setMeta((p) => ({ ...p, studyObjective: e.target.value }))}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
            </div>
          </section>

          {/* ────────────────────────────────────────────────────────────────
              SECTION 2: Compounds
          ──────────────────────────────────────────────────────────────── */}
          <section
            style={{
              backgroundColor: "#111110",
              border: "1px solid #2A2A28",
              borderRadius: "2px",
              padding: "28px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9DD69" }}>
                2 — Compounds ({compounds.length}/5)
              </h2>
              {compounds.length < 5 && (
                <button onClick={addCompound} style={addBtnStyle}>
                  + Add Compound
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {compounds.map((c, idx) => (
                <CompoundRow
                  key={c.id}
                  entry={c}
                  index={idx}
                  onChange={(patch) => updateCompound(c.id, patch)}
                  onRemove={() => removeCompound(c.id)}
                  canRemove={compounds.length > 1}
                />
              ))}
            </div>
          </section>

          {/* ────────────────────────────────────────────────────────────────
              SECTION 3: Biomarkers
          ──────────────────────────────────────────────────────────────── */}
          <section
            style={{
              backgroundColor: "#111110",
              border: "1px solid #2A2A28",
              borderRadius: "2px",
              padding: "28px",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9DD69", marginBottom: "16px" }}>
              3 — Biomarker Tracking
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {BIOMARKERS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBiomarker(b)}
                  style={{
                    padding: "5px 12px",
                    fontSize: "12px",
                    borderRadius: "2px",
                    border: selectedBiomarkers.includes(b) ? "1px solid #C9DD69" : "1px solid #333",
                    backgroundColor: selectedBiomarkers.includes(b) ? "#C9DD6918" : "transparent",
                    color: selectedBiomarkers.includes(b) ? "#C9DD69" : "#888",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {selectedBiomarkers.includes(b) ? "✓ " : ""}{b}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Add custom biomarker..."
                value={customBiomarker}
                onChange={(e) => setCustomBiomarker(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomBiomarker()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={addCustomBiomarker} style={addBtnStyle}>
                Add
              </button>
            </div>
            {selectedBiomarkers.filter((b) => !BIOMARKERS.includes(b)).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                {selectedBiomarkers
                  .filter((b) => !BIOMARKERS.includes(b))
                  .map((b) => (
                    <span
                      key={b}
                      style={{
                        padding: "5px 12px",
                        fontSize: "12px",
                        borderRadius: "2px",
                        border: "1px solid #C9DD69",
                        backgroundColor: "#C9DD6918",
                        color: "#C9DD69",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {b}
                      <button
                        onClick={() => toggleBiomarker(b)}
                        style={{ background: "none", border: "none", color: "#C9DD69", cursor: "pointer", fontSize: "14px", padding: 0, lineHeight: 1 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </section>

          {/* Generate button */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
            <button
              onClick={() => setGenerated(true)}
              disabled={!isReady}
              style={{
                padding: "14px 32px",
                backgroundColor: isReady ? "#C9DD69" : "#333",
                color: isReady ? "#000" : "#666",
                border: "none",
                borderRadius: "2px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: isReady ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              Generate Protocol →
            </button>
            {!isReady && (
              <p style={{ color: "#666", fontSize: "12px", alignSelf: "center" }}>
                Enter a study title and at least one compound to generate.
              </p>
            )}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────
            GENERATED PROTOCOL DOCUMENT
        ──────────────────────────────────────────────────────────────── */}
        {generated && (
          <>
            {/* Action buttons */}
            <div
              className="no-print"
              style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}
            >
              <button onClick={handlePrint} style={actionBtnStyle}>
                🖨 Print Protocol
              </button>
              <button onClick={copyText} style={{ ...actionBtnStyle, backgroundColor: copied ? "#2A4A1A" : "#1A1A18", color: copied ? "#C9DD69" : "#F9F9F9" }}>
                {copied ? "✓ Copied!" : "Copy as Text"}
              </button>
              <button
                onClick={() => setGenerated(false)}
                style={{ ...actionBtnStyle, backgroundColor: "transparent", border: "1px solid #333", color: "#666666" }}
              >
                ← Edit Protocol
              </button>
            </div>

            {/* Document */}
            <div
              ref={printRef}
              className="print-page"
              style={{
                backgroundColor: "#fff",
                color: "#111",
                borderRadius: "2px",
                padding: "48px",
                fontFamily: "'Times New Roman', serif",
                lineHeight: 1.6,
                border: "1px solid #2A2A28",
              }}
            >
              {/* Document Header */}
              <div
                style={{
                  borderBottom: "3px solid #000",
                  paddingBottom: "20px",
                  marginBottom: "28px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: "6px" }}>
                      Research Protocol Document — For Research Use Only
                    </div>
                    <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                      {meta.studyTitle || "Untitled Research Protocol"}
                    </h1>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "11px", color: "#555" }}>
                    <div>Nexphoria.com</div>
                    <div>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                  </div>
                </div>
              </div>

              {/* Study Info Table */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Study Information</DocSectionHeader>
                <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                  <tbody>
                    {[
                      ["Researcher", meta.researcherInitials || "—"],
                      ["Institution / Lab", meta.institution || "—"],
                      ["Start Date", meta.startDate ? new Date(meta.startDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"],
                      ["Cycle Length", `${weeks} weeks (${meta.cycleLength === "custom" ? "custom" : meta.cycleLength + " research cycle"})`],
                      ["Subject Species", meta.subjectSpecies],
                    ].map(([label, value]) => (
                      <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "6px 0", fontWeight: 700, width: "160px", color: "#333" }}>{label}</td>
                        <td style={{ padding: "6px 0", color: "#111" }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {meta.studyObjective && (
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px" }}>Objective: </span>
                    <span style={{ fontSize: "12px", color: "#333" }}>{meta.studyObjective}</span>
                  </div>
                )}
              </div>

              {/* Compound Table */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Compound Table</DocSectionHeader>
                <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#111", color: "#fff" }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Compound</th>
                      <th style={thStyle}>Dose</th>
                      <th style={thStyle}>Route</th>
                      <th style={thStyle}>Frequency</th>
                      <th style={{ ...thStyle, width: "35%" }}>Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, idx) => {
                      const name = c.customName || c.slug || `Compound ${idx + 1}`;
                      return (
                        <tr key={c.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={tdStyle}>{idx + 1}</td>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{name}</td>
                          <td style={tdStyle}>{c.dose ? `${c.dose} ${c.unit}` : "—"}</td>
                          <td style={tdStyle}>{c.route}</td>
                          <td style={tdStyle}>{c.frequency}</td>
                          <td style={{ ...tdStyle, color: "#444" }}>{c.rationale || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Reconstitution Notes */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Reconstitution Notes</DocSectionHeader>
                <div style={{ fontSize: "11px" }}>
                  {compounds.map((c, idx) => {
                    const name = c.customName || c.slug || `Compound ${idx + 1}`;
                    return (
                      <div key={c.id} style={{ marginBottom: "10px", paddingLeft: "12px", borderLeft: "3px solid #ddd" }}>
                        <div style={{ fontWeight: 700, marginBottom: "3px" }}>{idx + 1}. {name}</div>
                        <div style={{ color: "#333" }}>
                          {c.reconNote || "Reconstitute with bacteriostatic water. Add solvent slowly along vial wall. Gently swirl — do not vortex. Label vial with compound name, concentration, and date."}
                        </div>
                        <div style={{ marginTop: "4px", color: "#555", fontSize: "10.5px" }}>
                          <em>Route note: {ROUTE_NOTES[c.route]}</em>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Storage Requirements */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Storage Requirements</DocSectionHeader>
                <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th style={thStyle}>Compound</th>
                      <th style={thStyle}>Lyophilized</th>
                      <th style={thStyle}>After Reconstitution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, idx) => {
                      const name = c.customName || c.slug || `Compound ${idx + 1}`;
                      const storageRaw = c.storageNote || "Store at −20°C, desiccated, protected from light.";
                      return (
                        <tr key={c.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{name}</td>
                          <td style={tdStyle}>{storageRaw.split(".")[0]}.</td>
                          <td style={tdStyle}>4°C up to 30 days; −20°C up to 6 months. Avoid repeated freeze-thaw cycles.</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Weekly Schedule Grid */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Weekly Schedule (Days of Administration)</DocSectionHeader>
                <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#111", color: "#fff" }}>
                      <th style={{ ...thStyle, width: "30%" }}>Compound</th>
                      {DAYS_OF_WEEK.map((d) => (
                        <th key={d} style={{ ...thStyle, textAlign: "center" }}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, idx) => {
                      const name = c.customName || c.slug || `Compound ${idx + 1}`;
                      const activeDays = freqToDays[c.frequency] || [];
                      return (
                        <tr key={c.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{name}</td>
                          {DAYS_OF_WEEK.map((d) => (
                            <td key={d} style={{ ...tdStyle, textAlign: "center" }}>
                              {activeDays.includes(d) ? "●" : ""}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p style={{ fontSize: "10px", color: "#777", marginTop: "6px" }}>
                  ● = administration day | Frequency: {compounds.map((c) => `${c.customName || c.slug || "—"} (${c.frequency})`).join(", ")}
                </p>
              </div>

              {/* Biomarker Tracking */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Biomarker Tracking Schedule</DocSectionHeader>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 24px", fontSize: "11px" }}>
                  {selectedBiomarkers.map((b) => (
                    <div key={b} style={{ padding: "5px 0", borderBottom: "1px solid #eee", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#555" }}>☐</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Timeline */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Protocol Timeline ({weeks}-Week Cycle)</DocSectionHeader>
                <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th style={thStyle}>Phase</th>
                      <th style={thStyle}>Weeks</th>
                      <th style={thStyle}>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildTimeline(weeks).map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #ddd", backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{row.phase}</td>
                        <td style={tdStyle}>{row.weekRange}</td>
                        <td style={tdStyle}>{row.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Record Keeping */}
              <div className="print-section" style={{ marginBottom: "28px" }}>
                <DocSectionHeader>Record Keeping</DocSectionHeader>
                <div style={{ fontSize: "11px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {[
                    "Vial label: compound / concentration / date reconstituted / initials",
                    "Daily log: date / time / dose administered / injection site / subject ID",
                    "Storage log: fridge/freezer temp check (weekly)",
                    "Adverse event log: any unexpected observations",
                    "Batch/lot numbers recorded for all compounds",
                    "COA filed for each lot ordered",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", padding: "5px 0", borderBottom: "1px solid #eee" }}>
                      <span style={{ color: "#555" }}>☐</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catalog rail */}
              <ToolCatalogCTA className="py-2" />

              {/* Disclaimer */}
              <div
                style={{
                  borderTop: "2px solid #000",
                  paddingTop: "16px",
                  marginTop: "32px",
                  fontSize: "9.5px",
                  color: "#555",
                  lineHeight: 1.5,
                }}
              >
                <strong>FOR RESEARCH USE ONLY.</strong> This protocol document is generated as a planning template for qualified researchers. All compounds referenced are sold exclusively for in vitro and preclinical research purposes by verified research professionals. These compounds are not approved by the FDA or any regulatory authority for human therapeutic use, and are not intended for use in clinical practice, diagnostic procedures, or as a drug, food, or cosmetic. Researchers are responsible for compliance with all applicable institutional, local, state, and federal regulations. Nexphoria makes no representations regarding the clinical safety or efficacy of any compound described herein. This document does not constitute medical advice.
                <br /><br />
                <strong>Document generated by Nexphoria Protocol Template Generator</strong> · nexphoria.com · {new Date().toLocaleDateString()}
              </div>
            </div>
          </>
        )}

        {/* ── Back to tools ── */}
        <div className="no-print" style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #1E1E1C" }}>
          <Link href="/tools" style={{ color: "#B8A44C", fontSize: "13px", textDecoration: "none" }}>
            ← Back to Research Tools
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompoundRow({
  entry,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  entry: CompoundEntry;
  index: number;
  onChange: (patch: Partial<CompoundEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const prod = products.find((p) => p.slug === entry.slug);
  const displayName = entry.customName || prod?.name || "";

  return (
    <div
      style={{
        border: "1px solid #2A2A28",
        borderRadius: "2px",
        padding: "20px",
        backgroundColor: "#0D0D0B",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#C9DD69", letterSpacing: "0.06em" }}>
          COMPOUND {index + 1}
        </span>
        {canRemove && (
          <button onClick={onRemove} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>
            ×
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
        {/* Catalog selector */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>Select from Catalog (or type below)</label>
          <select
            value={entry.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            style={selectStyle}
          >
            <option value="">— Select compound —</option>
            {PRODUCT_OPTIONS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} ({p.size})
              </option>
            ))}
          </select>
        </div>

        {/* Custom name override */}
        <div>
          <label style={labelStyle}>Compound Name</label>
          <input
            type="text"
            placeholder="e.g. BPC-157"
            value={displayName}
            onChange={(e) => onChange({ customName: e.target.value, slug: "" })}
            style={inputStyle}
          />
        </div>

        {/* Dose */}
        <div>
          <label style={labelStyle}>Dose</label>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              placeholder="e.g. 200"
              value={entry.dose}
              onChange={(e) => onChange({ dose: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            />
            <select
              value={entry.unit}
              onChange={(e) => onChange({ unit: e.target.value as CompoundEntry["unit"] })}
              style={{ ...selectStyle, width: "70px" }}
            >
              <option>mcg</option>
              <option>mg</option>
              <option>IU</option>
            </select>
          </div>
        </div>

        {/* Route */}
        <div>
          <label style={labelStyle}>Route</label>
          <select
            value={entry.route}
            onChange={(e) => onChange({ route: e.target.value as Route })}
            style={selectStyle}
          >
            {ROUTES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label style={labelStyle}>Frequency</label>
          <select
            value={entry.frequency}
            onChange={(e) => onChange({ frequency: e.target.value as Frequency })}
            style={selectStyle}
          >
            {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>

        {/* Rationale */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>Rationale / Mechanism (shown in document)</label>
          <input
            type="text"
            placeholder="e.g. BPC-157 upregulates VEGF via eNOS pathway; preclinical tendon repair data (Sikiric 2018)"
            value={entry.rationale}
            onChange={(e) => onChange({ rationale: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Recon note */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>Reconstitution Note (auto-filled from catalog)</label>
          <textarea
            rows={2}
            value={entry.reconNote}
            onChange={(e) => onChange({ reconNote: e.target.value })}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", fontSize: "12px" }}
          />
        </div>
      </div>
    </div>
  );
}

function DocSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "13px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        borderBottom: "2px solid #111",
        paddingBottom: "6px",
        marginBottom: "12px",
        color: "#111",
      }}
    >
      {children}
    </h2>
  );
}

// ─── Timeline builder ─────────────────────────────────────────────────────────

function buildTimeline(weeks: number) {
  if (weeks <= 4) {
    return [
      { phase: "Baseline", weekRange: "Week 0", activity: "Baseline measurements, compound reconstitution, subject acclimatization" },
      { phase: "Active", weekRange: `Weeks 1–${weeks}`, activity: "Daily/scheduled compound administration per protocol" },
      { phase: "Endpoint", weekRange: `Week ${weeks}`, activity: "Final biomarker collection, tissue harvest, data analysis" },
    ];
  }
  if (weeks <= 12) {
    const mid = Math.round(weeks / 2);
    return [
      { phase: "Baseline", weekRange: "Week 0", activity: "Baseline measurements, randomization, compound reconstitution" },
      { phase: "Loading Phase", weekRange: `Weeks 1–${Math.min(4, Math.round(weeks * 0.33))}`, activity: "Full dose administration; monitor for tolerability" },
      { phase: "Maintenance Phase", weekRange: `Weeks ${Math.min(4, Math.round(weeks * 0.33)) + 1}–${weeks - 1}`, activity: "Continued compound administration per scheduled frequency" },
      { phase: "Mid-Study Check", weekRange: `Week ${mid}`, activity: "Interim biomarker collection; assess response, adjust if needed" },
      { phase: "Endpoint / Washout", weekRange: `Week ${weeks}`, activity: "Final biomarker collection, tissue harvest, compound clearance" },
    ];
  }
  // 6-month or longer
  const q1 = Math.round(weeks * 0.25);
  const q2 = Math.round(weeks * 0.5);
  const q3 = Math.round(weeks * 0.75);
  return [
    { phase: "Baseline", weekRange: "Week 0", activity: "Baseline measurements, randomization, compound reconstitution" },
    { phase: "Loading Phase", weekRange: `Weeks 1–4`, activity: "Full dose administration; monitor for tolerability, record adverse events" },
    { phase: "Phase 1 Active", weekRange: `Weeks 5–${q1}`, activity: "Continued administration; Q1 biomarker collection at week " + q1 },
    { phase: "Phase 2 Active", weekRange: `Weeks ${q1 + 1}–${q2}`, activity: "Mid-cycle biomarker panel; assess primary endpoints at week " + q2 },
    { phase: "Phase 3 Active", weekRange: `Weeks ${q2 + 1}–${q3}`, activity: "Continued administration; Q3 biomarker collection at week " + q3 },
    { phase: "Endpoint / Washout", weekRange: `Weeks ${q3 + 1}–${weeks}`, activity: "Final biomarker collection, tissue harvest, washout monitoring, data lock" },
  ];
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#666666",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  backgroundColor: "#1A1A18",
  border: "1px solid #333",
  borderRadius: "2px",
  color: "#F9F9F9",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const addBtnStyle: React.CSSProperties = {
  padding: "9px 16px",
  backgroundColor: "#1E1E1C",
  border: "1px solid #333",
  borderRadius: "2px",
  color: "#C9DD69",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#1A1A18",
  border: "1px solid #333",
  borderRadius: "2px",
  color: "#F9F9F9",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: "10.5px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "7px 10px",
  fontSize: "11px",
  color: "#222",
  verticalAlign: "top",
};
