"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { products } from "@/lib/products";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Types ───────────────────────────────────────────────────────────────────

type ResearchGoal = {
  id: string;
  label: string;
  description: string;
  defaultSlugs: string[];
  icon: string;
};

type CycleLength = "3-month" | "6-month" | "custom";

type Route = "SC" | "IM" | "IV" | "Oral" | "Intranasal" | "Topical";
type Frequency = "Daily" | "2x/day" | "Every other day" | "3x/week" | "2x/week" | "Weekly";
type DoseUnit = "mcg" | "mg" | "IU";

type CompoundEntry = {
  id: string;
  slug: string;
  customName: string;
  dose: string;
  unit: DoseUnit;
  route: Route;
  frequency: Frequency;
  washoutWeeks: number;
  rationale: string;
};

type StudyMeta = {
  studyTitle: string;
  researcherInitials: string;
  institution: string;
  startDate: string;
  species: "Mouse" | "Rat" | "In vitro" | "Other";
  objective: string;
};

type Biomarker = { label: string; selected: boolean; custom?: boolean };

// ─── Constants ───────────────────────────────────────────────────────────────

const RESEARCH_GOALS: ResearchGoal[] = [
  {
    id: "recovery",
    label: "Tissue & Recovery Research",
    description: "Tendon, ligament, muscle repair, angiogenesis, wound healing",
    defaultSlugs: ["bpc-157", "tb-500", "ghk-cu"],
    icon: "⬡",
  },
  {
    id: "gh-axis",
    label: "GH Axis Research",
    description: "Growth hormone pulse, IGF-1 elevation, body composition",
    defaultSlugs: ["cjc-1295-ipamorelin", "mk-677"],
    icon: "◈",
  },
  {
    id: "metabolic",
    label: "Metabolic & Weight Research",
    description: "GLP-1/GIP agonism, fat loss, insulin sensitivity",
    defaultSlugs: ["semaglutide", "tirzepatide"],
    icon: "◉",
  },
  {
    id: "longevity",
    label: "Longevity & Anti-Aging",
    description: "Telomere biology, mitochondrial function, NAD+ pathways",
    defaultSlugs: ["nad-plus", "epitalon", "ghk-cu"],
    icon: "◇",
  },
  {
    id: "cognitive",
    label: "Cognitive & Nootropic",
    description: "BDNF, anxiety, focus, sleep architecture research",
    defaultSlugs: ["semax", "selank", "dsip"],
    icon: "◎",
  },
  {
    id: "immune",
    label: "Immune & Inflammatory",
    description: "NF-κB modulation, T-cell research, cytokine studies",
    defaultSlugs: ["thymosin-alpha-1", "kpv", "bpc-157"],
    icon: "△",
  },
  {
    id: "custom",
    label: "Custom Stack",
    description: "Select any compounds for a custom research design",
    defaultSlugs: [],
    icon: "✦",
  },
];

const ROUTES: Route[] = ["SC", "IM", "IV", "Oral", "Intranasal", "Topical"];
const FREQUENCIES: Frequency[] = [
  "Daily",
  "2x/day",
  "Every other day",
  "3x/week",
  "2x/week",
  "Weekly",
];
const DOSE_UNITS: DoseUnit[] = ["mcg", "mg", "IU"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FREQ_DAYS: Record<Frequency, number[]> = {
  Daily: [0, 1, 2, 3, 4, 5, 6],
  "2x/day": [0, 1, 2, 3, 4, 5, 6],
  "Every other day": [0, 2, 4, 6],
  "3x/week": [0, 2, 4],
  "2x/week": [0, 3],
  Weekly: [0],
};

const DEFAULT_COMPOUND_PARAMS: Record<
  string,
  { dose: string; unit: DoseUnit; route: Route; frequency: Frequency }
> = {
  "bpc-157":           { dose: "250", unit: "mcg", route: "SC", frequency: "Daily" },
  "tb-500":            { dose: "500", unit: "mcg", route: "SC", frequency: "3x/week" },
  "ghk-cu":            { dose: "200", unit: "mcg", route: "SC", frequency: "3x/week" },
  "cjc-1295-ipamorelin": { dose: "300", unit: "mcg", route: "SC", frequency: "Daily" },
  "mk-677":            { dose: "25",  unit: "mg",  route: "Oral", frequency: "Daily" },
  "semaglutide":       { dose: "100", unit: "mcg", route: "SC", frequency: "Weekly" },
  "tirzepatide":       { dose: "100", unit: "mcg", route: "SC", frequency: "Weekly" },
  "retatrutide":       { dose: "100", unit: "mcg", route: "SC", frequency: "Weekly" },
  "nad-plus":          { dose: "100", unit: "mg",  route: "IV",  frequency: "3x/week" },
  "epitalon":          { dose: "100", unit: "mcg", route: "SC", frequency: "Daily" },
  "semax":             { dose: "300", unit: "mcg", route: "Intranasal", frequency: "Daily" },
  "selank":            { dose: "300", unit: "mcg", route: "Intranasal", frequency: "Daily" },
  "dsip":              { dose: "200", unit: "mcg", route: "SC", frequency: "3x/week" },
  "thymosin-alpha-1":  { dose: "500", unit: "mcg", route: "SC", frequency: "3x/week" },
  "kpv":               { dose: "100", unit: "mcg", route: "SC", frequency: "Daily" },
  "ipamorelin":        { dose: "300", unit: "mcg", route: "SC", frequency: "Daily" },
  "sermorelin":        { dose: "300", unit: "mcg", route: "SC", frequency: "Daily" },
  "tesamorelin":       { dose: "1000", unit: "mcg", route: "SC", frequency: "Daily" },
  "pt-141":            { dose: "1000", unit: "mcg", route: "SC", frequency: "2x/week" },
  "melanotan-2":       { dose: "500", unit: "mcg", route: "SC", frequency: "3x/week" },
  "mots-c":            { dose: "5",   unit: "mg",  route: "SC", frequency: "3x/week" },
  "ss-31":             { dose: "3",   unit: "mg",  route: "SC", frequency: "Daily" },
  "aod-9604":          { dose: "300", unit: "mcg", route: "SC", frequency: "Daily" },
  "oxytocin":          { dose: "1000", unit: "mcg", route: "Intranasal", frequency: "Daily" },
  "kisspeptin-10":     { dose: "100", unit: "mcg", route: "SC", frequency: "3x/week" },
};

const ROUTE_NOTES: Record<Route, string> = {
  SC: "Subcutaneous. Rotate injection sites (abdomen, flank, dorsal scruff). Use 27–31G × ½\" needle.",
  IM: "Intramuscular. Alternate muscle groups each injection. Use 25–27G × ⅝\" needle.",
  IV: "Intravenous. Lateral tail vein in rodents. Filter through 0.22 μm syringe filter before use.",
  Oral: "Oral gavage or direct oral administration. Confirm compound oral bioavailability before use.",
  Intranasal:
    "Intranasal delivery. Limit to 5–10 μL per naris in rodents. Administer with subject horizontal.",
  Topical: "Topical application. Prepare in aqueous carrier; apply to shaved/depilated skin.",
};

const DEFAULT_BIOMARKERS: Biomarker[] = [
  { label: "Body weight (weekly)", selected: true },
  { label: "IGF-1 (serum, wks 0/4/8/12)", selected: false },
  { label: "Fasting glucose", selected: false },
  { label: "Fasting insulin (ELISA)", selected: false },
  { label: "CBC / differential", selected: true },
  { label: "CMP / hepatic panel", selected: false },
  { label: "IL-6 & TNF-α (Luminex)", selected: false },
  { label: "DEXA body composition (start + end)", selected: false },
  { label: "HbA1c", selected: false },
  { label: "Total & free testosterone", selected: false },
  { label: "LH / FSH", selected: false },
  { label: "Cortisol / ACTH", selected: false },
];

const PRODUCT_OPTIONS = products
  .filter((p) => !p.comingSoon)
  .sort((a, b) => a.name.localeCompare(b.name));

const GOAL_BIOMARKERS: Record<string, string[]> = {
  recovery: ["Body weight (weekly)", "CBC / differential", "IGF-1 (serum, wks 0/4/8/12)"],
  "gh-axis": ["IGF-1 (serum, wks 0/4/8/12)", "Body weight (weekly)", "DEXA body composition (start + end)"],
  metabolic: ["Fasting glucose", "Fasting insulin (ELISA)", "Body weight (weekly)", "HbA1c", "DEXA body composition (start + end)"],
  longevity: ["Body weight (weekly)", "CBC / differential", "CMP / hepatic panel"],
  cognitive: ["Body weight (weekly)", "CBC / differential"],
  immune: ["IL-6 & TNF-α (Luminex)", "CBC / differential", "Body weight (weekly)"],
  custom: ["Body weight (weekly)"],
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getCycleTotalWeeks(cl: CycleLength, customWeeks: string): number {
  if (cl === "3-month") return 13;
  if (cl === "6-month") return 26;
  return Math.max(1, parseInt(customWeeks) || 12);
}

function getCompoundName(slug: string, customName: string): string {
  if (customName) return customName;
  const p = products.find((x) => x.slug === slug);
  return p ? p.name : slug;
}

function getCompoundRecon(slug: string): string {
  const p = products.find((x) => x.slug === slug);
  return p ? p.reconstitution : "Reconstitute with bacteriostatic water. Gently swirl to dissolve. Do not vortex.";
}

function getCompoundStorage(slug: string): string {
  const p = products.find((x) => x.slug === slug);
  return p ? p.storage : "Store lyophilized at −20°C, desiccated. Reconstituted: 4°C up to 30 days.";
}

// Pill badge component
function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-block text-xs px-2 py-0.5 rounded-sm font-medium"
      style={{
        backgroundColor: (color || "#d4af37") + "22",
        color: color || "#d4af37",
        border: `1px solid ${(color || "#d4af37")}44`,
      }}
    >
      {children}
    </span>
  );
}

// Step indicator
function StepBar({ current, total }: { current: number; total: number }) {
  const labels = ["Goal & Compounds", "Cycle Setup", "Doses & Schedule", "Generate Protocol"];
  return (
    <div className="flex items-start gap-0 mb-10 overflow-x-auto pb-1">
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                style={{
                  backgroundColor: done ? "#d4af37" : active ? "#d4af37" : "#1a1a18",
                  color: done || active ? "#000" : "#555",
                  border: done || active ? "none" : "1px solid #2a2a28",
                }}
              >
                {done ? "✓" : step}
              </div>
              <span
                className="text-xs mt-1 text-center whitespace-nowrap"
                style={{ color: active ? "#d4af37" : done ? "#888" : "#555" }}
              >
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className="h-px flex-1 mx-2 mt-[-16px]"
                style={{ backgroundColor: done ? "#d4af37" : "#2a2a28" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PeptideResearchPlanner() {
  const [step, setStep] = useState(1);

  // Step 1: Goal + Compounds
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [compounds, setCompounds] = useState<CompoundEntry[]>([]);
  const [addSlug, setAddSlug] = useState<string>("");

  // Step 2: Cycle Setup
  const [cycleLength, setCycleLength] = useState<CycleLength>("3-month");
  const [customWeeks, setCustomWeeks] = useState("12");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [studyMeta, setStudyMeta] = useState<StudyMeta>({
    studyTitle: "",
    researcherInitials: "",
    institution: "",
    startDate: new Date().toISOString().split("T")[0],
    species: "Mouse",
    objective: "",
  });

  // Step 3: Biomarkers
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(DEFAULT_BIOMARKERS);
  const [customBiomarker, setCustomBiomarker] = useState("");

  // Derived
  const totalWeeks = useMemo(
    () => getCycleTotalWeeks(cycleLength, customWeeks),
    [cycleLength, customWeeks]
  );

  const startDateObj = useMemo(() => {
    const d = new Date(startDate + "T00:00:00");
    return isNaN(d.getTime()) ? new Date() : d;
  }, [startDate]);

  const endDateObj = useMemo(() => addDays(startDateObj, totalWeeks * 7 - 1), [startDateObj, totalWeeks]);

  // ── Step 1 Handlers ──────────────────────────────────────────────────────

  function selectGoal(goalId: string) {
    setSelectedGoalId(goalId);
    const goal = RESEARCH_GOALS.find((g) => g.id === goalId);
    if (!goal) return;
    const newCompounds: CompoundEntry[] = goal.defaultSlugs.map((slug) => {
      const defaults = DEFAULT_COMPOUND_PARAMS[slug];
      const p = products.find((x) => x.slug === slug);
      return {
        id: uid(),
        slug,
        customName: "",
        dose: defaults?.dose || "250",
        unit: defaults?.unit || "mcg",
        route: defaults?.route || "SC",
        frequency: defaults?.frequency || "Daily",
        washoutWeeks: 2,
        rationale: p ? p.tagline : "",
      };
    });
    setCompounds(newCompounds);
    // Pre-select relevant biomarkers
    const recommended = GOAL_BIOMARKERS[goalId] || [];
    setBiomarkers(
      DEFAULT_BIOMARKERS.map((bm) => ({
        ...bm,
        selected: recommended.includes(bm.label),
      }))
    );
  }

  function addCompound() {
    if (!addSlug) return;
    if (compounds.some((c) => c.slug === addSlug)) return;
    if (compounds.length >= 8) return;
    const defaults = DEFAULT_COMPOUND_PARAMS[addSlug];
    const p = products.find((x) => x.slug === addSlug);
    setCompounds((prev) => [
      ...prev,
      {
        id: uid(),
        slug: addSlug,
        customName: "",
        dose: defaults?.dose || "250",
        unit: defaults?.unit || "mcg",
        route: defaults?.route || "SC",
        frequency: defaults?.frequency || "Daily",
        washoutWeeks: 2,
        rationale: p ? p.tagline : "",
      },
    ]);
    setAddSlug("");
  }

  function removeCompound(id: string) {
    setCompounds((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCompound<K extends keyof CompoundEntry>(
    id: string,
    field: K,
    value: CompoundEntry[K]
  ) {
    setCompounds((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  // ── Step 3 Handlers ──────────────────────────────────────────────────────

  function toggleBiomarker(label: string) {
    setBiomarkers((prev) =>
      prev.map((bm) => (bm.label === label ? { ...bm, selected: !bm.selected } : bm))
    );
  }

  function addCustomBiomarker() {
    const trimmed = customBiomarker.trim();
    if (!trimmed) return;
    setBiomarkers((prev) => [...prev, { label: trimmed, selected: true, custom: true }]);
    setCustomBiomarker("");
  }

  // ── Print ────────────────────────────────────────────────────────────────

  function handlePrint() {
    window.print();
  }

  // ── Copy as Text ─────────────────────────────────────────────────────────

  function handleCopyText() {
    const lines: string[] = [];
    const title = studyMeta.studyTitle || "Peptide Research Protocol";
    lines.push("═".repeat(60));
    lines.push(title.toUpperCase());
    lines.push("═".repeat(60));
    lines.push(`Researcher: ${studyMeta.researcherInitials || "—"}`);
    lines.push(`Institution: ${studyMeta.institution || "—"}`);
    lines.push(`Species: ${studyMeta.species}`);
    lines.push(`Cycle: ${cycleLength === "custom" ? customWeeks + " weeks" : cycleLength} (${totalWeeks} weeks)`);
    lines.push(`Start: ${formatDate(startDateObj)} → End: ${formatDate(endDateObj)}`);
    if (studyMeta.objective) lines.push(`Objective: ${studyMeta.objective}`);
    lines.push("");
    lines.push("COMPOUNDS");
    lines.push("─".repeat(40));
    compounds.forEach((c, i) => {
      const name = getCompoundName(c.slug, c.customName);
      lines.push(`${i + 1}. ${name}`);
      lines.push(`   Dose: ${c.dose} ${c.unit} | Route: ${c.route} | Freq: ${c.frequency}`);
      if (c.rationale) lines.push(`   Rationale: ${c.rationale}`);
    });
    lines.push("");
    lines.push("BIOMARKERS TO TRACK");
    lines.push("─".repeat(40));
    biomarkers.filter((b) => b.selected).forEach((b) => lines.push(`• ${b.label}`));
    lines.push("");
    lines.push("WEEKLY SCHEDULE (Days of week per compound)");
    lines.push("─".repeat(40));
    compounds.forEach((c) => {
      const name = getCompoundName(c.slug, c.customName);
      const dayIndices = FREQ_DAYS[c.frequency] || [0];
      const dayNames = dayIndices.map((i) => DAYS[i]).join(", ");
      lines.push(`${name}: ${dayNames} (${c.frequency})`);
    });
    lines.push("");
    lines.push("DISCLAIMER: For research use only. Not for human therapeutic use.");
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {
      const el = document.createElement("textarea");
      el.value = lines.join("\n");
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    alert("Protocol copied to clipboard!");
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: "#0a0a09", minHeight: "100vh" }}>
      {/* Print styles */}
      <style>{`
        @media print {
          nav, header, footer, .no-print { display: none !important; }
          .print-doc { background: white !important; color: black !important; padding: 24px !important; }
          .print-doc * { color: black !important; background: white !important; border-color: #ddd !important; }
          .print-gold { color: #b8860b !important; }
          body { background: white; }
        }
      `}</style>

      {/* Hero */}
      <div
        className="no-print"
        style={{
          background: "linear-gradient(to bottom, #111110 0%, #0a0a09 100%)",
          borderBottom: "1px solid #1e1e1c",
          paddingTop: "48px",
          paddingBottom: "40px",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Research Planner" },
            ]}
          />
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge>Super-Tool</Badge>
              <Badge color="#B8A44C">4-Step Wizard</Badge>
            </div>
            <h1
              className="text-4xl mb-3 tracking-tight"
              style={{ fontWeight: 200, color: "#F9F9F9" }}
            >
              Peptide Research Planner
            </h1>
            <p className="text-base" style={{ color: "#A0A0A0", maxWidth: "600px" }}>
              The all-in-one protocol generator. Select your research goal, configure your cycle,
              set doses and schedule — then generate a complete printable protocol document.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 no-print">
        <StepBar current={step} total={4} />

        {/* ── STEP 1: Goal & Compounds ── */}
        {step === 1 && (
          <div>
            <h2
              className="text-2xl mb-2 tracking-tight"
              style={{ fontWeight: 300, color: "#F9F9F9" }}
            >
              Step 1: Select Research Goal & Compounds
            </h2>
            <p className="text-sm mb-8" style={{ color: "#666666" }}>
              Choose a research goal to auto-populate a recommended compound stack, or build a custom stack.
            </p>

            {/* Goal grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {RESEARCH_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => selectGoal(goal.id)}
                  className="text-left p-4 rounded-sm transition-all"
                  style={{
                    backgroundColor:
                      selectedGoalId === goal.id ? "#1e1c0e" : "#141412",
                    border: `1px solid ${selectedGoalId === goal.id ? "#d4af37" : "#2a2a28"}`,
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: "#d4af37", fontSize: "16px" }}>{goal.icon}</span>
                    <span
                      className="font-medium text-sm"
                      style={{ color: selectedGoalId === goal.id ? "#d4af37" : "#F9F9F9" }}
                    >
                      {goal.label}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    {goal.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Compound stack */}
            {selectedGoalId && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#d4af37" }}>
                    Compound Stack ({compounds.length}/8 max)
                  </h3>
                </div>

                {compounds.length === 0 && (
                  <p className="text-sm mb-4" style={{ color: "#666" }}>
                    No compounds selected. Add compounds below.
                  </p>
                )}

                <div className="space-y-3 mb-6">
                  {compounds.map((c, i) => {
                    const p = products.find((x) => x.slug === c.slug);
                    const name = p?.name || c.customName || c.slug;
                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-sm"
                        style={{
                          backgroundColor: "#141412",
                          border: "1px solid #2a2a28",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: "#d4af37", color: "#000" }}
                            >
                              {i + 1}
                            </span>
                            <div>
                              <div className="font-medium text-sm" style={{ color: "#F9F9F9" }}>
                                {name}
                              </div>
                              {p && (
                                <div className="text-xs mt-0.5" style={{ color: "#666666" }}>
                                  {p.category} · {p.size}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeCompound(c.id)}
                            className="text-xs px-2 py-1 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: "#1a1a18", color: "#666666", border: "1px solid #333" }}
                          >
                            Remove
                          </button>
                        </div>
                        {/* Rationale field */}
                        <div className="mt-3">
                          <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                            Rationale (optional)
                          </label>
                          <input
                            type="text"
                            value={c.rationale}
                            onChange={(e) => updateCompound(c.id, "rationale", e.target.value)}
                            placeholder="Why this compound is included..."
                            className="w-full text-xs px-3 py-2 rounded-sm"
                            style={{
                              backgroundColor: "#0e0e0c",
                              border: "1px solid #2a2a28",
                              color: "#F9F9F9",
                              outline: "none",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add compound */}
                {compounds.length < 8 && (
                  <div className="flex gap-2">
                    <select
                      value={addSlug}
                      onChange={(e) => setAddSlug(e.target.value)}
                      className="flex-1 text-sm px-3 py-2 rounded-sm"
                      style={{
                        backgroundColor: "#141412",
                        border: "1px solid #2a2a28",
                        color: addSlug ? "#F9F9F9" : "#666",
                        outline: "none",
                      }}
                    >
                      <option value="">Add a compound...</option>
                      {PRODUCT_OPTIONS.filter((p) => !compounds.some((c) => c.slug === p.slug)).map(
                        (p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.name} — {p.size}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      onClick={addCompound}
                      disabled={!addSlug}
                      className="px-4 py-2 rounded-sm text-sm font-medium transition-opacity"
                      style={{
                        backgroundColor: addSlug ? "#d4af37" : "#2a2a28",
                        color: addSlug ? "#000" : "#555",
                        cursor: addSlug ? "pointer" : "not-allowed",
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Next */}
            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedGoalId || compounds.length === 0}
                className="px-6 py-3 rounded-sm font-medium transition-opacity"
                style={{
                  backgroundColor:
                    selectedGoalId && compounds.length > 0 ? "#d4af37" : "#2a2a28",
                  color: selectedGoalId && compounds.length > 0 ? "#000" : "#555",
                  cursor:
                    selectedGoalId && compounds.length > 0 ? "pointer" : "not-allowed",
                }}
              >
                Continue to Cycle Setup →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Cycle Setup ── */}
        {step === 2 && (
          <div>
            <h2
              className="text-2xl mb-2 tracking-tight"
              style={{ fontWeight: 300, color: "#F9F9F9" }}
            >
              Step 2: Cycle Setup & Study Info
            </h2>
            <p className="text-sm mb-8" style={{ color: "#666666" }}>
              Set your research cycle length, start date, and study metadata for the protocol document.
            </p>

            {/* Cycle length */}
            <div className="mb-8">
              <label className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "#d4af37" }}>
                Cycle Length
              </label>
              <div className="flex gap-3">
                {(["3-month", "6-month", "custom"] as CycleLength[]).map((cl) => (
                  <button
                    key={cl}
                    onClick={() => setCycleLength(cl)}
                    className="px-4 py-2 rounded-sm text-sm font-medium transition-all"
                    style={{
                      backgroundColor: cycleLength === cl ? "#d4af37" : "#141412",
                      color: cycleLength === cl ? "#000" : "#F9F9F9",
                      border: `1px solid ${cycleLength === cl ? "#d4af37" : "#2a2a28"}`,
                      cursor: "pointer",
                    }}
                  >
                    {cl === "custom" ? "Custom" : cl.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
              {cycleLength === "custom" && (
                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={customWeeks}
                    onChange={(e) => setCustomWeeks(e.target.value)}
                    className="w-24 text-sm px-3 py-2 rounded-sm"
                    style={{
                      backgroundColor: "#141412",
                      border: "1px solid #2a2a28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                  <span className="text-sm" style={{ color: "#666666" }}>
                    weeks total
                  </span>
                </div>
              )}
              <div className="mt-3 text-sm" style={{ color: "#666666" }}>
                Total: <strong style={{ color: "#F9F9F9" }}>{totalWeeks} weeks</strong>
              </div>
            </div>

            {/* Start date */}
            <div className="mb-8">
              <label className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "#d4af37" }}>
                Cycle Start Date
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm px-3 py-2 rounded-sm"
                  style={{
                    backgroundColor: "#141412",
                    border: "1px solid #2a2a28",
                    color: "#F9F9F9",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
                <span className="text-sm" style={{ color: "#666666" }}>
                  →&nbsp;
                  <span style={{ color: "#F9F9F9" }}>
                    End: {formatDate(endDateObj)}
                  </span>
                </span>
              </div>
            </div>

            {/* Study metadata */}
            <div
              className="p-5 rounded-sm mb-8"
              style={{ backgroundColor: "#141412", border: "1px solid #2a2a28" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#d4af37" }}
              >
                Study Information (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                    Study Title
                  </label>
                  <input
                    type="text"
                    value={studyMeta.studyTitle}
                    onChange={(e) =>
                      setStudyMeta((m) => ({ ...m, studyTitle: e.target.value }))
                    }
                    placeholder="e.g., BPC-157 Tendon Repair Model"
                    className="w-full text-sm px-3 py-2 rounded-sm"
                    style={{
                      backgroundColor: "#0e0e0c",
                      border: "1px solid #2a2a28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                    Researcher Initials
                  </label>
                  <input
                    type="text"
                    value={studyMeta.researcherInitials}
                    onChange={(e) =>
                      setStudyMeta((m) => ({ ...m, researcherInitials: e.target.value }))
                    }
                    placeholder="e.g., M.K."
                    className="w-full text-sm px-3 py-2 rounded-sm"
                    style={{
                      backgroundColor: "#0e0e0c",
                      border: "1px solid #2a2a28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                    Institution
                  </label>
                  <input
                    type="text"
                    value={studyMeta.institution}
                    onChange={(e) =>
                      setStudyMeta((m) => ({ ...m, institution: e.target.value }))
                    }
                    placeholder="e.g., University Lab"
                    className="w-full text-sm px-3 py-2 rounded-sm"
                    style={{
                      backgroundColor: "#0e0e0c",
                      border: "1px solid #2a2a28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                    Subject Species
                  </label>
                  <select
                    value={studyMeta.species}
                    onChange={(e) =>
                      setStudyMeta((m) => ({
                        ...m,
                        species: e.target.value as StudyMeta["species"],
                      }))
                    }
                    className="w-full text-sm px-3 py-2 rounded-sm"
                    style={{
                      backgroundColor: "#0e0e0c",
                      border: "1px solid #2a2a28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  >
                    <option>Mouse</option>
                    <option>Rat</option>
                    <option>In vitro</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                    Study Objective
                  </label>
                  <textarea
                    value={studyMeta.objective}
                    onChange={(e) =>
                      setStudyMeta((m) => ({ ...m, objective: e.target.value }))
                    }
                    rows={2}
                    placeholder="Brief description of the research objective..."
                    className="w-full text-sm px-3 py-2 rounded-sm resize-none"
                    style={{
                      backgroundColor: "#0e0e0c",
                      border: "1px solid #2a2a28",
                      color: "#F9F9F9",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-sm text-sm"
                style={{
                  backgroundColor: "#141412",
                  border: "1px solid #2a2a28",
                  color: "#666666",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-sm font-medium"
                style={{
                  backgroundColor: "#d4af37",
                  color: "#000",
                  cursor: "pointer",
                }}
              >
                Continue to Doses & Schedule →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Doses & Schedule ── */}
        {step === 3 && (
          <div>
            <h2
              className="text-2xl mb-2 tracking-tight"
              style={{ fontWeight: 300, color: "#F9F9F9" }}
            >
              Step 3: Doses, Routes & Biomarkers
            </h2>
            <p className="text-sm mb-8" style={{ color: "#666666" }}>
              Fine-tune doses, routes, and frequencies for each compound. Select biomarkers to track.
            </p>

            {/* Compound config */}
            <div className="space-y-4 mb-10">
              {compounds.map((c, i) => {
                const name = getCompoundName(c.slug, c.customName);
                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-sm"
                    style={{ backgroundColor: "#141412", border: "1px solid #2a2a28" }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#d4af37", color: "#000" }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium" style={{ color: "#F9F9F9" }}>
                        {name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Dose */}
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                          Dose
                        </label>
                        <input
                          type="number"
                          value={c.dose}
                          min="0"
                          onChange={(e) => updateCompound(c.id, "dose", e.target.value)}
                          className="w-full text-sm px-3 py-2 rounded-sm"
                          style={{
                            backgroundColor: "#0e0e0c",
                            border: "1px solid #2a2a28",
                            color: "#F9F9F9",
                            outline: "none",
                          }}
                        />
                      </div>
                      {/* Unit */}
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                          Unit
                        </label>
                        <select
                          value={c.unit}
                          onChange={(e) =>
                            updateCompound(c.id, "unit", e.target.value as DoseUnit)
                          }
                          className="w-full text-sm px-3 py-2 rounded-sm"
                          style={{
                            backgroundColor: "#0e0e0c",
                            border: "1px solid #2a2a28",
                            color: "#F9F9F9",
                            outline: "none",
                          }}
                        >
                          {DOSE_UNITS.map((u) => (
                            <option key={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                      {/* Route */}
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                          Route
                        </label>
                        <select
                          value={c.route}
                          onChange={(e) =>
                            updateCompound(c.id, "route", e.target.value as Route)
                          }
                          className="w-full text-sm px-3 py-2 rounded-sm"
                          style={{
                            backgroundColor: "#0e0e0c",
                            border: "1px solid #2a2a28",
                            color: "#F9F9F9",
                            outline: "none",
                          }}
                        >
                          {ROUTES.map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      {/* Frequency */}
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                          Frequency
                        </label>
                        <select
                          value={c.frequency}
                          onChange={(e) =>
                            updateCompound(c.id, "frequency", e.target.value as Frequency)
                          }
                          className="w-full text-sm px-3 py-2 rounded-sm"
                          style={{
                            backgroundColor: "#0e0e0c",
                            border: "1px solid #2a2a28",
                            color: "#F9F9F9",
                            outline: "none",
                          }}
                        >
                          {FREQUENCIES.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Route note */}
                    <p className="mt-2 text-xs" style={{ color: "#666" }}>
                      <span style={{ color: "#d4af37" }}>Note: </span>
                      {ROUTE_NOTES[c.route]}
                    </p>
                    {/* Washout */}
                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-xs" style={{ color: "#666" }}>
                        Washout period:
                      </label>
                      <select
                        value={c.washoutWeeks}
                        onChange={(e) =>
                          updateCompound(c.id, "washoutWeeks", parseInt(e.target.value))
                        }
                        className="text-sm px-3 py-1 rounded-sm"
                        style={{
                          backgroundColor: "#0e0e0c",
                          border: "1px solid #2a2a28",
                          color: "#F9F9F9",
                          outline: "none",
                        }}
                      >
                        {[0, 1, 2, 3, 4, 6, 8].map((w) => (
                          <option key={w} value={w}>
                            {w === 0 ? "None" : `${w} week${w > 1 ? "s" : ""}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Biomarkers */}
            <div
              className="p-5 rounded-sm mb-8"
              style={{ backgroundColor: "#141412", border: "1px solid #2a2a28" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#d4af37" }}
              >
                Biomarkers to Track
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {biomarkers.map((bm) => (
                  <label
                    key={bm.label}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={bm.selected}
                      onChange={() => toggleBiomarker(bm.label)}
                      className="rounded"
                      style={{ accentColor: "#d4af37" }}
                    />
                    <span
                      className="text-sm group-hover:opacity-80 transition-opacity"
                      style={{ color: bm.selected ? "#F9F9F9" : "#888" }}
                    >
                      {bm.label}
                      {bm.custom && (
                        <span
                          className="ml-2 text-xs px-1.5 py-0.5 rounded-sm"
                          style={{ backgroundColor: "#d4af3722", color: "#d4af37" }}
                        >
                          custom
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customBiomarker}
                  onChange={(e) => setCustomBiomarker(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomBiomarker()}
                  placeholder="Add custom biomarker..."
                  className="flex-1 text-sm px-3 py-2 rounded-sm"
                  style={{
                    backgroundColor: "#0e0e0c",
                    border: "1px solid #2a2a28",
                    color: "#F9F9F9",
                    outline: "none",
                  }}
                />
                <button
                  onClick={addCustomBiomarker}
                  className="px-4 py-2 rounded-sm text-sm font-medium"
                  style={{ backgroundColor: "#d4af37", color: "#000", cursor: "pointer" }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-sm text-sm"
                style={{
                  backgroundColor: "#141412",
                  border: "1px solid #2a2a28",
                  color: "#666666",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-sm font-medium"
                style={{ backgroundColor: "#d4af37", color: "#000", cursor: "pointer" }}
              >
                Generate Protocol →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Generated Protocol ── */}
        {step === 4 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl tracking-tight"
                style={{ fontWeight: 300, color: "#F9F9F9" }}
              >
                Your Research Protocol
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-4 py-2 rounded-sm text-sm font-medium"
                  style={{
                    backgroundColor: "#141412",
                    border: "1px solid #2a2a28",
                    color: "#d4af37",
                    cursor: "pointer",
                  }}
                >
                  Copy Text
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-sm text-sm font-medium"
                  style={{ backgroundColor: "#d4af37", color: "#000", cursor: "pointer" }}
                >
                  Print Protocol
                </button>
              </div>
            </div>

            {/* Protocol Document */}
            <div
              className="rounded-sm print-doc"
              style={{
                backgroundColor: "#fafaf5",
                padding: "40px",
                fontFamily: "'Georgia', serif",
                color: "#1a1a18",
              }}
            >
              {/* Header */}
              <div
                style={{
                  borderBottom: "3px solid #1a1a18",
                  paddingBottom: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: "#b8860b",
                        marginBottom: "4px",
                        fontFamily: "sans-serif",
                      }}
                    >
                      NEXPHORIA · RESEARCH PROTOCOL
                    </div>
                    <h1
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        margin: 0,
                        color: "#1a1a18",
                      }}
                    >
                      {studyMeta.studyTitle || "Peptide Research Protocol"}
                    </h1>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "11px",
                      fontFamily: "sans-serif",
                      color: "#555",
                    }}
                  >
                    <div>
                      Generated:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    {studyMeta.researcherInitials && (
                      <div>Researcher: {studyMeta.researcherInitials}</div>
                    )}
                    {studyMeta.institution && <div>{studyMeta.institution}</div>}
                  </div>
                </div>
              </div>

              {/* Study info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                }}
              >
                {[
                  { label: "Species", value: studyMeta.species },
                  {
                    label: "Cycle Length",
                    value: `${cycleLength === "custom" ? customWeeks + " weeks" : cycleLength.replace("-", " ")} (${totalWeeks} wks)`,
                  },
                  {
                    label: "Study Window",
                    value: `${formatDate(startDateObj)} → ${formatDate(endDateObj)}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      backgroundColor: "#f0f0e8",
                      padding: "10px 14px",
                      borderLeft: "3px solid #b8860b",
                    }}
                  >
                    <div style={{ color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {item.label}
                    </div>
                    <div style={{ fontWeight: 600, color: "#1a1a18", marginTop: "2px" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {studyMeta.objective && (
                <div
                  style={{
                    backgroundColor: "#f8f8f0",
                    padding: "12px 16px",
                    borderLeft: "3px solid #1a1a18",
                    marginBottom: "24px",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                  }}
                >
                  <strong>Study Objective:</strong> {studyMeta.objective}
                </div>
              )}

              {/* Compound table */}
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "6px",
                  }}
                >
                  1. Compound Specifications
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#1a1a18" }}>
                      {["#", "Compound", "Dose", "Route", "Frequency", "Washout", "Rationale"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              color: "#fff",
                              padding: "7px 10px",
                              textAlign: "left",
                              fontSize: "10px",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, i) => {
                      const name = getCompoundName(c.slug, c.customName);
                      return (
                        <tr
                          key={c.id}
                          style={{ backgroundColor: i % 2 === 0 ? "#fafaf5" : "#f3f3eb" }}
                        >
                          <td style={{ padding: "7px 10px", fontWeight: 700, color: "#b8860b" }}>
                            {i + 1}
                          </td>
                          <td style={{ padding: "7px 10px", fontWeight: 600 }}>{name}</td>
                          <td style={{ padding: "7px 10px" }}>
                            {c.dose} {c.unit}
                          </td>
                          <td style={{ padding: "7px 10px" }}>{c.route}</td>
                          <td style={{ padding: "7px 10px" }}>{c.frequency}</td>
                          <td style={{ padding: "7px 10px" }}>
                            {c.washoutWeeks === 0 ? "None" : `${c.washoutWeeks}w`}
                          </td>
                          <td
                            style={{
                              padding: "7px 10px",
                              color: "#666",
                              fontSize: "11px",
                              maxWidth: "180px",
                            }}
                          >
                            {c.rationale || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Weekly schedule */}
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "6px",
                  }}
                >
                  2. Weekly Injection Schedule
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "11px",
                    fontFamily: "sans-serif",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0e8" }}>
                      <th
                        style={{
                          padding: "6px 8px",
                          textAlign: "left",
                          fontWeight: 700,
                          borderBottom: "2px solid #ccc",
                        }}
                      >
                        Compound
                      </th>
                      {DAYS.map((d) => (
                        <th
                          key={d}
                          style={{
                            padding: "6px 4px",
                            textAlign: "center",
                            fontWeight: 700,
                            borderBottom: "2px solid #ccc",
                          }}
                        >
                          {d}
                        </th>
                      ))}
                      <th
                        style={{
                          padding: "6px 8px",
                          textAlign: "center",
                          fontWeight: 700,
                          borderBottom: "2px solid #ccc",
                        }}
                      >
                        /wk
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, i) => {
                      const name = getCompoundName(c.slug, c.customName);
                      const activeDays = new Set(FREQ_DAYS[c.frequency] || [0]);
                      return (
                        <tr
                          key={c.id}
                          style={{ backgroundColor: i % 2 === 0 ? "#fafaf5" : "#f3f3eb" }}
                        >
                          <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                            {name}
                            <div style={{ fontSize: "10px", color: "#666666", fontWeight: 400 }}>
                              {c.dose} {c.unit} {c.route}
                            </div>
                          </td>
                          {DAYS.map((_, di) => (
                            <td
                              key={di}
                              style={{
                                padding: "6px 4px",
                                textAlign: "center",
                                color: activeDays.has(di) ? "#b8860b" : "#ccc",
                                fontWeight: activeDays.has(di) ? 700 : 400,
                              }}
                            >
                              {activeDays.has(di) ? "●" : "·"}
                            </td>
                          ))}
                          <td
                            style={{
                              padding: "6px 8px",
                              textAlign: "center",
                              fontWeight: 700,
                              color: "#b8860b",
                            }}
                          >
                            {activeDays.size}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Reconstitution notes */}
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "6px",
                  }}
                >
                  3. Reconstitution & Storage
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0e8" }}>
                      {["Compound", "Reconstitution Protocol", "Storage"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "7px 10px",
                            textAlign: "left",
                            fontWeight: 700,
                            borderBottom: "2px solid #ccc",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compounds.map((c, i) => {
                      const name = getCompoundName(c.slug, c.customName);
                      const recon = getCompoundRecon(c.slug);
                      const storage = getCompoundStorage(c.slug);
                      return (
                        <tr
                          key={c.id}
                          style={{ backgroundColor: i % 2 === 0 ? "#fafaf5" : "#f3f3eb" }}
                        >
                          <td style={{ padding: "8px 10px", fontWeight: 600, verticalAlign: "top" }}>
                            {name}
                          </td>
                          <td style={{ padding: "8px 10px", color: "#444", verticalAlign: "top" }}>
                            {recon}
                          </td>
                          <td style={{ padding: "8px 10px", color: "#444", verticalAlign: "top" }}>
                            {storage}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Biomarker tracking */}
              {biomarkers.some((b) => b.selected) && (
                <div style={{ marginBottom: "28px" }}>
                  <h2
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: "10px",
                      fontFamily: "sans-serif",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "6px",
                    }}
                  >
                    4. Biomarker Tracking Checklist
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      fontSize: "12px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {biomarkers
                      .filter((b) => b.selected)
                      .map((b) => (
                        <div
                          key={b.label}
                          style={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              border: "1.5px solid #1a1a18",
                              flexShrink: 0,
                              borderRadius: "2px",
                            }}
                          />
                          <span>{b.label}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Protocol timeline */}
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "6px",
                  }}
                >
                  5. Protocol Timeline
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0e8" }}>
                      {["Phase", "Weeks", "Activity"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "7px 10px",
                            textAlign: "left",
                            fontWeight: 700,
                            borderBottom: "2px solid #ccc",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const loadingEnd = Math.min(2, Math.floor(totalWeeks * 0.15));
                      const maintenanceEnd = totalWeeks - Math.max(0, ...compounds.map((c) => c.washoutWeeks));
                      const phases = [
                        {
                          phase: "Baseline",
                          weeks: "Pre-study (wk 0)",
                          activity: "Baseline measurements, acclimation, initial biomarker draw",
                        },
                        {
                          phase: "Loading",
                          weeks: `Wk 1–${loadingEnd || 1}`,
                          activity: `Initiate all compounds at full dose. Daily monitoring for tolerance.`,
                        },
                        {
                          phase: "Maintenance",
                          weeks: `Wk ${(loadingEnd || 1) + 1}–${maintenanceEnd}`,
                          activity: "Continue dosing per schedule. Biomarker draws at scheduled intervals.",
                        },
                        ...(compounds.some((c) => c.washoutWeeks > 0)
                          ? [
                              {
                                phase: "Washout",
                                weeks: `Wk ${maintenanceEnd + 1}–${totalWeeks}`,
                                activity: `Cease administration. Allow clearance (${Math.max(...compounds.map((c) => c.washoutWeeks))} weeks). Terminal sample collection at end.`,
                              },
                            ]
                          : []),
                        {
                          phase: "Endpoint",
                          weeks: `Wk ${totalWeeks}`,
                          activity: "Final biomarker draws, tissue harvest (if applicable), data compilation.",
                        },
                      ];
                      return phases.map((row, i) => (
                        <tr
                          key={row.phase}
                          style={{ backgroundColor: i % 2 === 0 ? "#fafaf5" : "#f3f3eb" }}
                        >
                          <td
                            style={{
                              padding: "8px 10px",
                              fontWeight: 700,
                              color: "#b8860b",
                              verticalAlign: "top",
                            }}
                          >
                            {row.phase}
                          </td>
                          <td
                            style={{
                              padding: "8px 10px",
                              verticalAlign: "top",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.weeks}
                          </td>
                          <td style={{ padding: "8px 10px", color: "#444", verticalAlign: "top" }}>
                            {row.activity}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Record keeping */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "6px",
                  }}
                >
                  6. Record Keeping Checklist
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {[
                    "Subject ID, cage, housing conditions",
                    "Vial lot number for each compound",
                    "Date & time of each injection",
                    "Injection site rotated and documented",
                    "Reconstitution date + volume added",
                    "Storage temperature verified daily",
                    "Adverse observations noted immediately",
                    "Biomarker draw dates and results filed",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "1.5px solid #1a1a18",
                          flexShrink: 0,
                          borderRadius: "2px",
                        }}
                      />
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
                  borderTop: "2px solid #1a1a18",
                  paddingTop: "16px",
                  fontSize: "10px",
                  fontFamily: "sans-serif",
                  color: "#666666",
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: "#c00" }}>RESEARCH USE ONLY (RUO).</strong> All
                compounds described herein are intended solely for laboratory research by
                qualified researchers. Not approved for human therapeutic use, veterinary
                use, or consumption. Not intended to diagnose, treat, cure, or prevent any
                disease. Nexphoria assumes no liability for misuse. This protocol template is
                provided for research documentation purposes only. Users are solely
                responsible for compliance with all applicable laws and institutional
                guidelines. Generated by Nexphoria Research Tools — nexphoria.com/tools
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-sm text-sm"
                style={{
                  backgroundColor: "#141412",
                  border: "1px solid #2a2a28",
                  color: "#666666",
                  cursor: "pointer",
                }}
              >
                ← Edit Protocol
              </button>
              <button
                onClick={() => { setStep(1); setSelectedGoalId(""); setCompounds([]); }}
                className="px-4 py-2 rounded-sm text-sm"
                style={{
                  backgroundColor: "#141412",
                  border: "1px solid #2a2a28",
                  color: "#666666",
                  cursor: "pointer",
                }}
              >
                Start New Protocol
              </button>
              <div className="flex-1" />
              <button
                onClick={handleCopyText}
                className="px-4 py-2 rounded-sm text-sm font-medium"
                style={{
                  backgroundColor: "#141412",
                  border: "1px solid #d4af37",
                  color: "#d4af37",
                  cursor: "pointer",
                }}
              >
                Copy as Text
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-sm text-sm font-medium"
                style={{ backgroundColor: "#d4af37", color: "#000", cursor: "pointer" }}
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related tools */}
      <div className="no-print" style={{ borderTop: "1px solid #1e1e1c", marginTop: "80px" }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "#666666" }}>
            Related Tools
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                href: "/tools/dosing-frequency-planner",
                label: "Dosing Frequency Planner",
                desc: "Weekly injection calendar",
              },
              {
                href: "/tools/peptide-cycle-planner",
                label: "Cycle Calendar",
                desc: "Week-by-week compound calendar",
              },
              {
                href: "/tools/protocol-template-generator",
                label: "Protocol Template",
                desc: "Advanced protocol with custom metadata",
              },
              {
                href: "/tools/reconstitution-calculator",
                label: "Reconstitution Calculator",
                desc: "BAC water volume & dose math",
              },
              {
                href: "/tools/half-life-calculator",
                label: "Half-Life Calculator",
                desc: "Clearance & dosing interval",
              },
              {
                href: "/tools/stack-builder",
                label: "Stack Builder",
                desc: "Goal-based compound recommendations",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-4 rounded-sm group"
                style={{
                  backgroundColor: "#141412",
                  border: "1px solid #2a2a28",
                  textDecoration: "none",
                }}
              >
                <div
                  className="text-sm font-medium mb-1 group-hover:opacity-70 transition-opacity"
                  style={{ color: "#F9F9F9" }}
                >
                  {t.label}
                </div>
                <div className="text-xs" style={{ color: "#666" }}>
                  {t.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
