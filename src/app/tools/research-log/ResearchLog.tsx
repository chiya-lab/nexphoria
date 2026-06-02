"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Types ────────────────────────────────────────────────────────────────────

type Route = "SC" | "IP" | "IV" | "IM" | "IN" | "Oral" | "Topical" | "Other";
type Outcome = "positive" | "neutral" | "negative" | "n/a";

type CompoundEntry = {
  compound: string;
  dose: string;
  unit: "mcg" | "mg" | "IU";
  route: Route;
  time: string; // HH:MM
};

type LogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  compounds: CompoundEntry[];
  observations: string;
  subjectiveNotes: string;
  outcome: Outcome;
  tags: string[];
  createdAt: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "nexphoria_research_log_v1";

const COMPOUND_OPTIONS = [
  "BPC-157",
  "TB-500",
  "GHK-Cu",
  "Wolverine Blend",
  "Ipamorelin",
  "CJC-1295 No DAC",
  "CJC-1295 w/DAC",
  "Sermorelin",
  "Tesamorelin",
  "Hexarelin",
  "MK-677",
  "Semaglutide",
  "Tirzepatide",
  "Retatrutide",
  "AOD-9604",
  "PT-141",
  "Melanotan II",
  "Epitalon",
  "NAD+",
  "SS-31",
  "MOTS-c",
  "Thymosin Alpha-1",
  "LL-37",
  "Kisspeptin-10",
  "Oxytocin",
  "KPV",
  "Selank",
  "Semax",
  "DSIP",
  "Snap-8",
  "Cerebrolysin",
  "Follistatin 344",
  "Custom / Other",
];

const ROUTES: Route[] = ["SC", "IP", "IV", "IM", "IN", "Oral", "Topical", "Other"];

const OUTCOME_LABELS: Record<Outcome, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  "n/a": "N/A",
};

const OUTCOME_COLORS: Record<Outcome, string> = {
  positive: "#4ade80",
  neutral: "#94a3b8",
  negative: "#f87171",
  "n/a": "#6b7280",
};

const PRESET_TAGS = [
  "Baseline",
  "Week 1",
  "Week 2",
  "Week 4",
  "Week 8",
  "Week 12",
  "Loading Phase",
  "Maintenance",
  "Washout",
  "Blood Draw",
  "Weigh-In",
  "Imaging",
  "Side Effect",
  "Protocol Change",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function blankCompound(): CompoundEntry {
  return { compound: "", dose: "", unit: "mcg", route: "SC", time: "" };
}

function blankEntry(): Omit<LogEntry, "id" | "createdAt"> {
  return {
    date: todayISO(),
    compounds: [blankCompound()],
    observations: "",
    subjectiveNotes: "",
    outcome: "n/a",
    tags: [],
  };
}

function entriesToCSV(entries: LogEntry[]): string {
  const headers = [
    "Date",
    "Compounds",
    "Doses",
    "Routes",
    "Times",
    "Observations",
    "Subjective Notes",
    "Outcome",
    "Tags",
  ];
  const rows = entries.map((e) => [
    e.date,
    e.compounds.map((c) => c.compound || "(unnamed)").join("; "),
    e.compounds.map((c) => `${c.dose} ${c.unit}`).join("; "),
    e.compounds.map((c) => c.route).join("; "),
    e.compounds.map((c) => c.time || "—").join("; "),
    `"${e.observations.replace(/"/g, '""')}"`,
    `"${e.subjectiveNotes.replace(/"/g, '""')}"`,
    e.outcome,
    e.tags.join("; "),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResearchLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // View state
  const [view, setView] = useState<"log" | "new" | "edit" | "detail">("log");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<Omit<LogEntry, "id" | "createdAt">>(blankEntry());
  const [tagInput, setTagInput] = useState("");
  const [customCompound, setCustomCompound] = useState<Record<number, string>>({});

  // Filters
  const [filterCompound, setFilterCompound] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterOutcome, setFilterOutcome] = useState<Outcome | "">("");
  const [searchText, setSearchText] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LogEntry[];
        setEntries(parsed.sort((a, b) => b.createdAt - a.createdAt));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage
  const persist = useCallback((next: LogEntry[]) => {
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  // ── Form helpers ─────────────────────────────────────────────────────────

  function openNew() {
    setForm(blankEntry());
    setCustomCompound({});
    setTagInput("");
    setEditingId(null);
    setView("new");
  }

  function openEdit(id: string) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    const { id: _id, createdAt: _ca, ...rest } = entry;
    setForm(rest);
    setCustomCompound({});
    setTagInput("");
    setEditingId(id);
    setView("edit");
  }

  function openDetail(id: string) {
    setDetailId(id);
    setView("detail");
  }

  function updateCompound(idx: number, patch: Partial<CompoundEntry>) {
    setForm((f) => ({
      ...f,
      compounds: f.compounds.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  }

  function addCompound() {
    setForm((f) => ({ ...f, compounds: [...f.compounds, blankCompound()] }));
  }

  function removeCompound(idx: number) {
    setForm((f) => ({
      ...f,
      compounds: f.compounds.filter((_, i) => i !== idx),
    }));
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  }

  function addCustomTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  function saveEntry() {
    if (view === "edit" && editingId) {
      const updated = entries.map((e) =>
        e.id === editingId ? { ...e, ...form } : e
      );
      persist(updated.sort((a, b) => b.createdAt - a.createdAt));
    } else {
      const entry: LogEntry = { ...form, id: uid(), createdAt: Date.now() };
      persist([entry, ...entries]);
    }
    setView("log");
  }

  function deleteEntry(id: string) {
    if (!confirm("Delete this log entry? This cannot be undone.")) return;
    persist(entries.filter((e) => e.id !== id));
    if (view === "detail" && detailId === id) setView("log");
  }

  // ── Filtered entries ─────────────────────────────────────────────────────

  const filtered = entries.filter((e) => {
    if (filterCompound && !e.compounds.some((c) => c.compound === filterCompound)) return false;
    if (filterTag && !e.tags.includes(filterTag)) return false;
    if (filterOutcome && e.outcome !== filterOutcome) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      if (
        !e.date.includes(q) &&
        !e.observations.toLowerCase().includes(q) &&
        !e.subjectiveNotes.toLowerCase().includes(q) &&
        !e.compounds.some((c) => c.compound.toLowerCase().includes(q)) &&
        !e.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  // ── Export ───────────────────────────────────────────────────────────────

  function exportCSV() {
    const csv = entriesToCSV(entries);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexphoria-research-log-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printLog() {
    window.print();
  }

  // ── Detail entry ─────────────────────────────────────────────────────────

  const detailEntry = entries.find((e) => e.id === detailId) ?? null;

  // ── All unique compound names used ───────────────────────────────────────

  const usedCompounds = Array.from(
    new Set(entries.flatMap((e) => e.compounds.map((c) => c.compound)).filter(Boolean))
  ).sort();

  const usedTags = Array.from(new Set(entries.flatMap((e) => e.tags))).sort();

  if (!loaded) {
    return (
      <div style={{ backgroundColor: "#010101", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#A0A0A0" }}>Loading…</p>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: "#010101", minHeight: "100vh" }} className="research-log-root">
      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-body { background: white !important; color: black !important; padding: 20px; }
          .print-entry { border: 1px solid #ccc; margin-bottom: 16px; padding: 12px; border-radius: 4px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="no-print relative px-6 pt-32 pb-14 md:pt-40 md:pb-18" style={{ backgroundColor: "#010101" }}>
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Research Tools", href: "/tools" },
              { label: "Research Log" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>
            Tools
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl mb-4 tracking-tight" style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}>
                Research Log
              </h1>
              <p className="text-base max-w-xl" style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}>
                Log compounds, doses, routes, and observations. Stored locally in your browser — no account or network access required.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {entries.length > 0 && (
                <>
                  <button
                    onClick={exportCSV}
                    className="px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-70"
                    style={{ border: "1px solid #3A3A38", color: "#A0A0A0", backgroundColor: "transparent" }}
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={printLog}
                    className="px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-70"
                    style={{ border: "1px solid #3A3A38", color: "#A0A0A0", backgroundColor: "transparent" }}
                  >
                    Print
                  </button>
                </>
              )}
              <button
                onClick={openNew}
                className="px-5 py-2 text-sm rounded-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#d4af37", color: "#000" }}
              >
                + New Entry
              </button>
            </div>
          </div>

          {/* Stats strip */}
          {entries.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Entries", value: entries.length },
                { label: "Compounds Logged", value: usedCompounds.length },
                { label: "Positive Outcomes", value: entries.filter((e) => e.outcome === "positive").length },
                { label: "Observation Days", value: new Set(entries.map((e) => e.date)).size },
              ].map((s) => (
                <div key={s.label} className="rounded-sm px-5 py-4" style={{ border: "1px solid #2A2A28", backgroundColor: "#0E0E0C" }}>
                  <p className="text-2xl font-light mb-1" style={{ color: "#d4af37" }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "#666660" }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Form View (New / Edit) ── */}
      {(view === "new" || view === "edit") && (
        <section className="no-print px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-sm p-8" style={{ border: "1px solid #2A2A28", backgroundColor: "#0E0E0C" }}>
              <h2 className="text-xl font-light mb-8" style={{ color: "#F9F9F9" }}>
                {view === "edit" ? "Edit Entry" : "New Log Entry"}
              </h2>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "#666660" }}>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-sm text-sm"
                  style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9", colorScheme: "dark" }}
                />
              </div>

              {/* Compounds */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-widest" style={{ color: "#666660" }}>Compounds</label>
                  <button
                    onClick={addCompound}
                    className="text-xs px-3 py-1 rounded-sm transition-opacity hover:opacity-70"
                    style={{ border: "1px solid #3A3A38", color: "#A0A0A0" }}
                  >
                    + Add Compound
                  </button>
                </div>
                <div className="space-y-3">
                  {form.compounds.map((c, idx) => (
                    <div key={idx} className="rounded-sm p-4" style={{ border: "1px solid #2A2A28", backgroundColor: "#161614" }}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {/* Compound name */}
                        <div className="col-span-2 md:col-span-2">
                          <label className="block text-xs mb-1.5" style={{ color: "#555550" }}>Compound</label>
                          <select
                            value={c.compound === "" ? "" : COMPOUND_OPTIONS.includes(c.compound) ? c.compound : "Custom / Other"}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "Custom / Other") {
                                updateCompound(idx, { compound: customCompound[idx] || "" });
                              } else {
                                updateCompound(idx, { compound: val });
                                setCustomCompound((prev) => { const n = { ...prev }; delete n[idx]; return n; });
                              }
                            }}
                            className="w-full px-3 py-2 rounded-sm text-sm"
                            style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9" }}
                          >
                            <option value="">Select…</option>
                            {COMPOUND_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                          {(c.compound === "" || (!COMPOUND_OPTIONS.includes(c.compound) && c.compound !== "")) && (
                            <input
                              type="text"
                              placeholder="Custom compound name…"
                              value={customCompound[idx] ?? c.compound}
                              onChange={(e) => {
                                setCustomCompound((prev) => ({ ...prev, [idx]: e.target.value }));
                                updateCompound(idx, { compound: e.target.value });
                              }}
                              className="w-full px-3 py-2 rounded-sm text-sm mt-2"
                              style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9" }}
                            />
                          )}
                        </div>

                        {/* Dose + Unit */}
                        <div>
                          <label className="block text-xs mb-1.5" style={{ color: "#555550" }}>Dose</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              placeholder="0"
                              value={c.dose}
                              onChange={(e) => updateCompound(idx, { dose: e.target.value })}
                              className="flex-1 min-w-0 px-3 py-2 rounded-sm text-sm"
                              style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9" }}
                            />
                            <select
                              value={c.unit}
                              onChange={(e) => updateCompound(idx, { unit: e.target.value as "mcg" | "mg" | "IU" })}
                              className="px-2 py-2 rounded-sm text-xs"
                              style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9" }}
                            >
                              <option value="mcg">mcg</option>
                              <option value="mg">mg</option>
                              <option value="IU">IU</option>
                            </select>
                          </div>
                        </div>

                        {/* Route */}
                        <div>
                          <label className="block text-xs mb-1.5" style={{ color: "#555550" }}>Route</label>
                          <select
                            value={c.route}
                            onChange={(e) => updateCompound(idx, { route: e.target.value as Route })}
                            className="w-full px-3 py-2 rounded-sm text-sm"
                            style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9" }}
                          >
                            {ROUTES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Time + remove */}
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="block text-xs mb-1.5" style={{ color: "#555550" }}>Time (optional)</label>
                          <input
                            type="time"
                            value={c.time}
                            onChange={(e) => updateCompound(idx, { time: e.target.value })}
                            className="px-3 py-2 rounded-sm text-sm"
                            style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9", colorScheme: "dark" }}
                          />
                        </div>
                        {form.compounds.length > 1 && (
                          <button
                            onClick={() => removeCompound(idx)}
                            className="ml-auto text-xs px-3 py-2 rounded-sm transition-opacity hover:opacity-70 mt-4"
                            style={{ border: "1px solid #3A3A38", color: "#f87171" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: "#666660" }}>Outcome</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.entries(OUTCOME_LABELS) as [Outcome, string][]).map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setForm((f) => ({ ...f, outcome: k }))}
                      className="px-4 py-2 rounded-sm text-sm transition-opacity"
                      style={{
                        border: `1px solid ${form.outcome === k ? OUTCOME_COLORS[k] : "#3A3A38"}`,
                        color: form.outcome === k ? OUTCOME_COLORS[k] : "#666660",
                        backgroundColor: form.outcome === k ? `${OUTCOME_COLORS[k]}15` : "transparent",
                        fontWeight: form.outcome === k ? 600 : 400,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "#666660" }}>
                  Observations <span className="normal-case" style={{ color: "#444440" }}>(objective — what was measured / recorded)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Body weight: 24.8g. Locomotor activity: normal. Injection site: no inflammation. HPLC vial 3 verified…"
                  value={form.observations}
                  onChange={(e) => setForm((f) => ({ ...f, observations: e.target.value }))}
                  className="w-full px-4 py-3 rounded-sm text-sm resize-y"
                  style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9", lineHeight: 1.6 }}
                />
              </div>

              {/* Subjective notes */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "#666660" }}>
                  Notes <span className="normal-case" style={{ color: "#444440" }}>(free-form — unexpected events, protocol deviations, ideas…)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Noticed slight erythema at injection site by hour 2. Consider reducing concentration next vial. Weather 72°F/ambient storage…"
                  value={form.subjectiveNotes}
                  onChange={(e) => setForm((f) => ({ ...f, subjectiveNotes: e.target.value }))}
                  className="w-full px-4 py-3 rounded-sm text-sm resize-y"
                  style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9", lineHeight: 1.6 }}
                />
              </div>

              {/* Tags */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: "#666660" }}>Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className="px-3 py-1.5 rounded-sm text-xs transition-opacity"
                      style={{
                        border: `1px solid ${form.tags.includes(t) ? "#d4af37" : "#2A2A28"}`,
                        color: form.tags.includes(t) ? "#d4af37" : "#555550",
                        backgroundColor: form.tags.includes(t) ? "#d4af3715" : "transparent",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom tag…"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                    className="flex-1 px-3 py-2 rounded-sm text-sm"
                    style={{ backgroundColor: "#1A1A18", border: "1px solid #3A3A38", color: "#F9F9F9" }}
                  />
                  <button
                    onClick={addCustomTag}
                    className="px-4 py-2 text-xs rounded-sm transition-opacity hover:opacity-70"
                    style={{ border: "1px solid #3A3A38", color: "#A0A0A0" }}
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs"
                        style={{ backgroundColor: "#d4af3720", border: "1px solid #d4af3740", color: "#d4af37" }}
                      >
                        {t}
                        <button
                          onClick={() => toggleTag(t)}
                          className="opacity-60 hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4" style={{ borderTop: "1px solid #2A2A28" }}>
                <button
                  onClick={() => setView("log")}
                  className="px-5 py-2.5 text-sm rounded-sm transition-opacity hover:opacity-70"
                  style={{ border: "1px solid #3A3A38", color: "#A0A0A0", backgroundColor: "transparent" }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEntry}
                  className="px-6 py-2.5 text-sm rounded-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#d4af37", color: "#000" }}
                >
                  {view === "edit" ? "Save Changes" : "Save Entry"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Detail View ── */}
      {view === "detail" && detailEntry && (
        <section className="no-print px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setView("log")}
              className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#A0A0A0" }}
            >
              ← Back to Log
            </button>
            <div className="rounded-sm p-8" style={{ border: "1px solid #2A2A28", backgroundColor: "#0E0E0C" }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#666660" }}>
                    {formatDate(detailEntry.date)}
                  </p>
                  <h2 className="text-xl font-light" style={{ color: "#F9F9F9" }}>
                    {detailEntry.compounds.map((c) => c.compound || "—").join(" + ")}
                  </h2>
                </div>
                <span
                  className="px-3 py-1 rounded-sm text-xs font-medium"
                  style={{
                    backgroundColor: `${OUTCOME_COLORS[detailEntry.outcome]}15`,
                    border: `1px solid ${OUTCOME_COLORS[detailEntry.outcome]}40`,
                    color: OUTCOME_COLORS[detailEntry.outcome],
                  }}
                >
                  {OUTCOME_LABELS[detailEntry.outcome]}
                </span>
              </div>

              {/* Compounds table */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#666660" }}>Compounds Administered</p>
                <div className="rounded-sm overflow-hidden" style={{ border: "1px solid #2A2A28" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: "#161614", borderBottom: "1px solid #2A2A28" }}>
                        {["Compound", "Dose", "Route", "Time"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs uppercase tracking-widest font-normal" style={{ color: "#555550" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detailEntry.compounds.map((c, i) => (
                        <tr key={i} style={{ borderBottom: i < detailEntry.compounds.length - 1 ? "1px solid #2A2A28" : "none" }}>
                          <td className="px-4 py-3" style={{ color: "#F9F9F9" }}>{c.compound || "—"}</td>
                          <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>{c.dose ? `${c.dose} ${c.unit}` : "—"}</td>
                          <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>{c.route}</td>
                          <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>{c.time || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Observations */}
              {detailEntry.observations && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#666660" }}>Observations</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#C8C8C0", whiteSpace: "pre-wrap" }}>{detailEntry.observations}</p>
                </div>
              )}

              {/* Notes */}
              {detailEntry.subjectiveNotes && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#666660" }}>Notes</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#C8C8C0", whiteSpace: "pre-wrap" }}>{detailEntry.subjectiveNotes}</p>
                </div>
              )}

              {/* Tags */}
              {detailEntry.tags.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#666660" }}>Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailEntry.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-sm text-xs"
                        style={{ backgroundColor: "#d4af3710", border: "1px solid #d4af3730", color: "#d4af37" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4" style={{ borderTop: "1px solid #2A2A28" }}>
                <button
                  onClick={() => deleteEntry(detailEntry.id)}
                  className="px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-70"
                  style={{ border: "1px solid #f87171", color: "#f87171", backgroundColor: "transparent" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => openEdit(detailEntry.id)}
                  className="px-5 py-2.5 text-sm rounded-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#d4af37", color: "#000" }}
                >
                  Edit Entry
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Log View ── */}
      {view === "log" && (
        <section className="px-6 py-10" ref={printRef}>
          <div className="max-w-4xl mx-auto">

            {/* Empty state */}
            {entries.length === 0 && (
              <div
                className="no-print rounded-sm p-16 text-center"
                style={{ border: "1px dashed #2A2A28" }}
              >
                <div className="mb-6" style={{ color: "#3A3A38" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="text-lg font-light mb-2" style={{ color: "#555550" }}>No entries yet</h3>
                <p className="text-sm mb-8" style={{ color: "#3A3A38" }}>Start by logging your first compound administration.</p>
                <button
                  onClick={openNew}
                  className="px-6 py-3 rounded-sm text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#d4af37", color: "#000" }}
                >
                  + New Log Entry
                </button>
              </div>
            )}

            {entries.length > 0 && (
              <>
                {/* Filters */}
                <div className="no-print mb-8 flex flex-wrap gap-3 items-end">
                  {/* Search */}
                  <div className="flex-1 min-w-48">
                    <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#444440" }}>Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Date, compound, keyword…"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-sm text-sm pr-8"
                        style={{ backgroundColor: "#161614", border: "1px solid #2A2A28", color: "#F9F9F9" }}
                      />
                      {searchText && (
                        <button
                          onClick={() => setSearchText("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
                          style={{ color: "#A0A0A0" }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Compound filter */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#444440" }}>Compound</label>
                    <select
                      value={filterCompound}
                      onChange={(e) => setFilterCompound(e.target.value)}
                      className="px-3 py-2.5 rounded-sm text-sm"
                      style={{ backgroundColor: "#161614", border: "1px solid #2A2A28", color: filterCompound ? "#F9F9F9" : "#555550" }}
                    >
                      <option value="">All compounds</option>
                      {usedCompounds.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tag filter */}
                  {usedTags.length > 0 && (
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#444440" }}>Tag</label>
                      <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="px-3 py-2.5 rounded-sm text-sm"
                        style={{ backgroundColor: "#161614", border: "1px solid #2A2A28", color: filterTag ? "#F9F9F9" : "#555550" }}
                      >
                        <option value="">All tags</option>
                        {usedTags.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Outcome filter */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#444440" }}>Outcome</label>
                    <select
                      value={filterOutcome}
                      onChange={(e) => setFilterOutcome(e.target.value as Outcome | "")}
                      className="px-3 py-2.5 rounded-sm text-sm"
                      style={{ backgroundColor: "#161614", border: "1px solid #2A2A28", color: filterOutcome ? "#F9F9F9" : "#555550" }}
                    >
                      <option value="">All outcomes</option>
                      {(Object.entries(OUTCOME_LABELS) as [Outcome, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear filters */}
                  {(filterCompound || filterTag || filterOutcome || searchText) && (
                    <button
                      onClick={() => { setFilterCompound(""); setFilterTag(""); setFilterOutcome(""); setSearchText(""); }}
                      className="px-4 py-2.5 text-xs rounded-sm transition-opacity hover:opacity-70"
                      style={{ border: "1px solid #2A2A28", color: "#666660" }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* Results count */}
                {(filterCompound || filterTag || filterOutcome || searchText) && (
                  <p className="no-print text-xs mb-4" style={{ color: "#444440" }}>
                    {filtered.length} of {entries.length} entries
                  </p>
                )}

                {/* Entry list */}
                {filtered.length === 0 ? (
                  <div className="no-print text-center py-16">
                    <p className="text-sm" style={{ color: "#444440" }}>No entries match the current filters.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((entry) => (
                      <div
                        key={entry.id}
                        className="print-entry rounded-sm p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                        style={{ border: "1px solid #2A2A28", backgroundColor: "#0E0E0C" }}
                        onClick={() => openDetail(entry.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Date + outcome */}
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs" style={{ color: "#666660" }}>{formatDate(entry.date)}</span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-sm"
                                style={{
                                  backgroundColor: `${OUTCOME_COLORS[entry.outcome]}15`,
                                  border: `1px solid ${OUTCOME_COLORS[entry.outcome]}30`,
                                  color: OUTCOME_COLORS[entry.outcome],
                                }}
                              >
                                {OUTCOME_LABELS[entry.outcome]}
                              </span>
                            </div>

                            {/* Compound summary */}
                            <p className="text-sm font-medium mb-1.5 truncate" style={{ color: "#F9F9F9" }}>
                              {entry.compounds.map((c) => c.compound || "—").join(" + ")}
                            </p>

                            {/* Doses */}
                            <p className="text-xs mb-2 truncate" style={{ color: "#555550" }}>
                              {entry.compounds.map((c) => `${c.dose ? `${c.dose} ${c.unit}` : "—"} ${c.route}`).join(" · ")}
                            </p>

                            {/* Observations preview */}
                            {entry.observations && (
                              <p className="text-xs line-clamp-2" style={{ color: "#444440" }}>
                                {entry.observations}
                              </p>
                            )}
                          </div>

                          {/* Tags + actions */}
                          <div className="flex flex-col items-end gap-2 no-print flex-shrink-0">
                            {entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 justify-end max-w-40">
                                {entry.tags.slice(0, 3).map((t) => (
                                  <span
                                    key={t}
                                    className="text-xs px-2 py-0.5 rounded-sm"
                                    style={{ backgroundColor: "#d4af3710", border: "1px solid #d4af3720", color: "#d4af3780" }}
                                  >
                                    {t}
                                  </span>
                                ))}
                                {entry.tags.length > 3 && (
                                  <span className="text-xs" style={{ color: "#444440" }}>+{entry.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={(ev) => { ev.stopPropagation(); openEdit(entry.id); }}
                                className="text-xs px-2.5 py-1 rounded-sm transition-opacity hover:opacity-70"
                                style={{ border: "1px solid #2A2A28", color: "#555550" }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={(ev) => { ev.stopPropagation(); deleteEntry(entry.id); }}
                                className="text-xs px-2.5 py-1 rounded-sm transition-opacity hover:opacity-70"
                                style={{ border: "1px solid #f8717140", color: "#f8717170" }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Disclaimer + Related Tools ── */}
      <section className="no-print px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <div className="rounded-sm p-6 mb-10" style={{ backgroundColor: "#0E0E0C", border: "1px solid #1E1E1C" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#444440" }}>Research Use Only</p>
            <p className="text-xs leading-relaxed" style={{ color: "#444440" }}>
              This tool is provided for informational and research-planning purposes only. All data is stored exclusively in your browser&apos;s localStorage — nothing is transmitted to Nexphoria or any third party. This is not a medical record and should not be used for clinical patient tracking.
            </p>
          </div>

          {/* Related tools */}
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#444440" }}>Related Tools</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { href: "/tools/reconstitution-calculator", label: "Reconstitution Calculator" },
              { href: "/tools/dosing-frequency-planner", label: "Dosing Frequency Planner" },
              { href: "/tools/protocol-template-generator", label: "Protocol Template Generator" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block px-5 py-4 rounded-sm transition-opacity hover:opacity-70 text-sm"
                style={{ border: "1px solid #2A2A28", color: "#A0A0A0", backgroundColor: "#0E0E0C" }}
              >
                {t.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
