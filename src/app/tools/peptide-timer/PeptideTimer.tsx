"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Compound reference data ────────────────────────────────────────────────
const COMPOUNDS = [
  // GH Secretagogues
  { name: "BPC-157", category: "Recovery & Healing", halfLifeHours: 4, defaultFreqPerDay: 2, defaultDoseUnit: "mcg", defaultDose: 250, notes: "Typically 2×/day SC/IP" },
  { name: "TB-500 (Thymosin Beta-4)", category: "Recovery & Healing", halfLifeHours: 8, defaultFreqPerDay: 0.43, defaultDoseUnit: "mg", defaultDose: 5, notes: "~3×/week SC" },
  { name: "GHK-Cu", category: "Recovery & Healing", halfLifeHours: 0.5, defaultFreqPerDay: 1, defaultDoseUnit: "mcg", defaultDose: 100, notes: "Daily SC" },
  { name: "CJC-1295 No DAC", category: "GH Secretagogues", halfLifeHours: 0.5, defaultFreqPerDay: 3, defaultDoseUnit: "mcg", defaultDose: 100, notes: "3×/day pulsatile, or pre-sleep" },
  { name: "CJC-1295 w/DAC", category: "GH Secretagogues", halfLifeHours: 192, defaultFreqPerDay: 0.14, defaultDoseUnit: "mcg", defaultDose: 2000, notes: "2×/week SC" },
  { name: "Ipamorelin", category: "GH Secretagogues", halfLifeHours: 2, defaultFreqPerDay: 3, defaultDoseUnit: "mcg", defaultDose: 100, notes: "3×/day, 20–30 min pre-sleep" },
  { name: "GHRP-2", category: "GH Secretagogues", halfLifeHours: 1.5, defaultFreqPerDay: 3, defaultDoseUnit: "mcg", defaultDose: 100, notes: "3×/day SC/IP" },
  { name: "GHRP-6", category: "GH Secretagogues", halfLifeHours: 1.5, defaultFreqPerDay: 3, defaultDoseUnit: "mcg", defaultDose: 100, notes: "3×/day SC/IP" },
  { name: "Hexarelin", category: "GH Secretagogues", halfLifeHours: 1, defaultFreqPerDay: 2, defaultDoseUnit: "mcg", defaultDose: 100, notes: "2×/day, max 12 weeks due to tachyphylaxis" },
  { name: "Sermorelin", category: "GH Secretagogues", halfLifeHours: 0.2, defaultFreqPerDay: 1, defaultDoseUnit: "mcg", defaultDose: 200, notes: "Pre-sleep SC (matches nocturnal GH surge)" },
  { name: "Tesamorelin", category: "GH Secretagogues", halfLifeHours: 0.13, defaultFreqPerDay: 1, defaultDoseUnit: "mg", defaultDose: 2, notes: "Daily pre-sleep SC" },
  { name: "MK-677 (Ibutamoren)", category: "GH Secretagogues", halfLifeHours: 24, defaultFreqPerDay: 1, defaultDoseUnit: "mg", defaultDose: 25, notes: "Daily oral — 24h sustained GH elevation" },
  // GLP-1 / Metabolic
  { name: "Semaglutide", category: "GLP-1 / Metabolic", halfLifeHours: 168, defaultFreqPerDay: 0.14, defaultDoseUnit: "mg", defaultDose: 1, notes: "Weekly SC injection" },
  { name: "Tirzepatide", category: "GLP-1 / Metabolic", halfLifeHours: 120, defaultFreqPerDay: 0.14, defaultDoseUnit: "mg", defaultDose: 5, notes: "Weekly SC injection" },
  { name: "Retatrutide", category: "GLP-1 / Metabolic", halfLifeHours: 168, defaultFreqPerDay: 0.14, defaultDoseUnit: "mg", defaultDose: 4, notes: "Weekly SC injection" },
  { name: "AOD-9604", category: "GLP-1 / Metabolic", halfLifeHours: 0.5, defaultFreqPerDay: 1, defaultDoseUnit: "mcg", defaultDose: 300, notes: "Daily SC (morning, fasted)" },
  // Cognitive / Nootropic
  { name: "Selank", category: "Cognitive / Nootropic", halfLifeHours: 0.13, defaultFreqPerDay: 2, defaultDoseUnit: "mcg", defaultDose: 250, notes: "2×/day intranasal" },
  { name: "Semax", category: "Cognitive / Nootropic", halfLifeHours: 0.17, defaultFreqPerDay: 2, defaultDoseUnit: "mcg", defaultDose: 200, notes: "2×/day intranasal" },
  { name: "DSIP", category: "Cognitive / Nootropic", halfLifeHours: 0.5, defaultFreqPerDay: 1, defaultDoseUnit: "mcg", defaultDose: 200, notes: "1×/day pre-sleep SC/IP" },
  // Longevity / Anti-Aging
  { name: "Epitalon", category: "Longevity / Anti-Aging", halfLifeHours: 1, defaultFreqPerDay: 0.29, defaultDoseUnit: "mcg", defaultDose: 100, notes: "Every 3–4 days SC/IP" },
  { name: "NAD+", category: "Longevity / Anti-Aging", halfLifeHours: 0.03, defaultFreqPerDay: 1, defaultDoseUnit: "mg", defaultDose: 100, notes: "Daily IV or SC" },
  { name: "MOTS-c", category: "Longevity / Anti-Aging", halfLifeHours: 0.5, defaultFreqPerDay: 0.71, defaultDoseUnit: "mg", defaultDose: 10, notes: "5×/week SC/IP" },
  { name: "SS-31 (Elamipretide)", category: "Longevity / Anti-Aging", halfLifeHours: 0.5, defaultFreqPerDay: 1, defaultDoseUnit: "mg", defaultDose: 3, notes: "Daily SC" },
  // Hormonal / Endocrine
  { name: "PT-141 (Bremelanotide)", category: "Hormonal / Endocrine", halfLifeHours: 2.7, defaultFreqPerDay: 0.5, defaultDoseUnit: "mg", defaultDose: 1.75, notes: "Max 2×/week SC" },
  { name: "Melanotan II", category: "Hormonal / Endocrine", halfLifeHours: 1, defaultFreqPerDay: 1, defaultDoseUnit: "mg", defaultDose: 1, notes: "Daily SC during loading" },
  { name: "Kisspeptin-10", category: "Hormonal / Endocrine", halfLifeHours: 0.08, defaultFreqPerDay: 2, defaultDoseUnit: "nmol/kg", defaultDose: 1, notes: "Pulsatile — 2–3×/day IV/SC" },
  { name: "Oxytocin", category: "Hormonal / Endocrine", halfLifeHours: 0.08, defaultFreqPerDay: 2, defaultDoseUnit: "IU", defaultDose: 20, notes: "Intranasal 2×/day" },
  // Immune / GI
  { name: "KPV", category: "Immune / GI", halfLifeHours: 1, defaultFreqPerDay: 2, defaultDoseUnit: "mg/kg", defaultDose: 0.1, notes: "2×/day IP/SC" },
  { name: "Thymosin Alpha-1", category: "Immune / GI", halfLifeHours: 2, defaultFreqPerDay: 0.43, defaultDoseUnit: "mg", defaultDose: 1.6, notes: "3×/week SC" },
];

type FreqUnit = "per_day" | "per_week" | "every_n_hours" | "every_n_days";

interface TrackedCompound {
  id: string;
  compoundName: string;
  dose: string;
  doseUnit: string;
  freqValue: number;
  freqUnit: FreqUnit;
  lastInjection: number | null; // timestamp ms
  notes: string;
  color: string;
}

const COLORS = [
  "#d4af37", // gold
  "#60a5fa", // blue
  "#34d399", // green
  "#f87171", // red
  "#a78bfa", // purple
  "#fb923c", // orange
  "#f472b6", // pink
  "#38bdf8", // sky
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function freqToHours(freqValue: number, freqUnit: FreqUnit): number {
  switch (freqUnit) {
    case "per_day": return 24 / freqValue;
    case "per_week": return 168 / freqValue;
    case "every_n_hours": return freqValue;
    case "every_n_days": return freqValue * 24;
  }
}

function formatDuration(ms: number): { text: string; detail: string } {
  const totalSec = Math.abs(ms) / 1000;
  if (totalSec < 60) return { text: `${Math.round(totalSec)}s`, detail: `${Math.round(totalSec)} seconds` };
  const totalMin = totalSec / 60;
  if (totalMin < 60) {
    const m = Math.floor(totalMin);
    const s = Math.round((totalMin - m) * 60);
    return { text: `${m}m ${s}s`, detail: `${m} min ${s} sec` };
  }
  const totalHrs = totalMin / 60;
  if (totalHrs < 48) {
    const h = Math.floor(totalHrs);
    const m = Math.round((totalHrs - h) * 60);
    return { text: `${h}h ${m}m`, detail: `${h} hr ${m} min` };
  }
  const days = Math.floor(totalHrs / 24);
  const hrs = Math.round(totalHrs % 24);
  return { text: `${days}d ${hrs}h`, detail: `${days} days ${hrs} hr` };
}

type Status = "due_now" | "due_soon" | "on_track" | "overdue";
interface CompoundStatus {
  elapsed: number; // ms since last
  remaining: number; // ms until next
  intervalMs: number;
  progressPct: number; // 0-100
  status: Status;
}

function getStatus(compound: TrackedCompound, now: number): CompoundStatus | null {
  if (!compound.lastInjection) return null;
  const intervalMs = freqToHours(compound.freqValue, compound.freqUnit) * 3600 * 1000;
  const elapsed = now - compound.lastInjection;
  const remaining = intervalMs - elapsed;
  const progressPct = Math.min(100, (elapsed / intervalMs) * 100);

  let status: Status;
  if (remaining <= 0) status = "overdue";
  else if (remaining < intervalMs * 0.1) status = "due_soon"; // <10% remaining
  else if (remaining < intervalMs * 0.2) status = "due_soon";
  else status = "on_track";

  return { elapsed, remaining, intervalMs, progressPct, status };
}

const STATUS_STYLES: Record<Status, { bg: string; text: string; label: string; ring: string }> = {
  on_track: { bg: "bg-emerald-900/30", text: "text-emerald-400", label: "On Track", ring: "ring-emerald-500/40" },
  due_soon: { bg: "bg-amber-900/30", text: "text-amber-400", label: "Due Soon", ring: "ring-amber-500/40" },
  due_now: { bg: "bg-orange-900/30", text: "text-orange-400", label: "Due Now", ring: "ring-orange-500/40" },
  overdue: { bg: "bg-red-900/30", text: "text-red-400", label: "Overdue", ring: "ring-red-500/40" },
};

const CATEGORIES = ["All", ...Array.from(new Set(COMPOUNDS.map((c) => c.category)))];

const LS_KEY = "nexphoria_peptide_timers_v2";

function loadTracked(): TrackedCompound[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTracked(items: TrackedCompound[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export default function PeptideTimer() {
  const [tracked, setTracked] = useState<TrackedCompound[]>([]);
  const [now, setNow] = useState<number>(Date.now());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form state
  const [formCompound, setFormCompound] = useState(COMPOUNDS[0].name);
  const [formDose, setFormDose] = useState(String(COMPOUNDS[0].defaultDose));
  const [formDoseUnit, setFormDoseUnit] = useState(COMPOUNDS[0].defaultDoseUnit);
  const [formFreqValue, setFormFreqValue] = useState(2);
  const [formFreqUnit, setFormFreqUnit] = useState<FreqUnit>("per_day");
  const [formNotes, setFormNotes] = useState("");

  // Live tick every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load from localStorage
  useEffect(() => {
    setTracked(loadTracked());
  }, []);

  const saveAndSet = useCallback((items: TrackedCompound[]) => {
    setTracked(items);
    saveTracked(items);
  }, []);

  // Pre-fill form when compound changes
  useEffect(() => {
    const c = COMPOUNDS.find((x) => x.name === formCompound);
    if (c) {
      setFormDose(String(c.defaultDose));
      setFormDoseUnit(c.defaultDoseUnit);
      const hrsPerDose = 24 / c.defaultFreqPerDay;
      if (c.defaultFreqPerDay >= 1) {
        setFormFreqValue(Math.round(c.defaultFreqPerDay));
        setFormFreqUnit("per_day");
      } else {
        setFormFreqValue(Math.round(hrsPerDose));
        setFormFreqUnit("every_n_hours");
      }
    }
  }, [formCompound]);

  function openAddForm() {
    setEditId(null);
    setFormCompound(COMPOUNDS[0].name);
    setFormNotes("");
    setShowAddForm(true);
  }

  function openEditForm(item: TrackedCompound) {
    setEditId(item.id);
    setFormCompound(item.compoundName);
    setFormDose(item.dose);
    setFormDoseUnit(item.doseUnit);
    setFormFreqValue(item.freqValue);
    setFormFreqUnit(item.freqUnit);
    setFormNotes(item.notes);
    setShowAddForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      saveAndSet(
        tracked.map((t) =>
          t.id === editId
            ? { ...t, compoundName: formCompound, dose: formDose, doseUnit: formDoseUnit, freqValue: formFreqValue, freqUnit: formFreqUnit, notes: formNotes }
            : t
        )
      );
    } else {
      const newItem: TrackedCompound = {
        id: generateId(),
        compoundName: formCompound,
        dose: formDose,
        doseUnit: formDoseUnit,
        freqValue: formFreqValue,
        freqUnit: formFreqUnit,
        lastInjection: null,
        notes: formNotes,
        color: COLORS[tracked.length % COLORS.length],
      };
      saveAndSet([...tracked, newItem]);
    }
    setShowAddForm(false);
    setEditId(null);
  }

  function logInjection(id: string) {
    saveAndSet(tracked.map((t) => (t.id === id ? { ...t, lastInjection: Date.now() } : t)));
  }

  function removeCompound(id: string) {
    saveAndSet(tracked.filter((t) => t.id !== id));
  }

  function clearLastInjection(id: string) {
    saveAndSet(tracked.map((t) => (t.id === id ? { ...t, lastInjection: null } : t)));
  }

  const filteredCategories = CATEGORIES.filter((c) => c === "All" || COMPOUNDS.some((x) => x.category === c));

  const overdueCount = tracked.filter((t) => {
    const s = getStatus(t, now);
    return s && s.status === "overdue";
  }).length;

  const dueSoonCount = tracked.filter((t) => {
    const s = getStatus(t, now);
    return s && s.status === "due_soon";
  }).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="bg-zinc-900 border-b border-white/10 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Injection Timer" }]} />
          <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] mb-2">Research Tools</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Peptide Injection Timer</h1>
              <p className="text-zinc-400 max-w-xl">
                Track injection timing for multiple research compounds simultaneously. Live countdown to next dose, dosing-window status, and per-compound history — all stored locally in your browser.
              </p>
            </div>
            <button
              onClick={openAddForm}
              className="shrink-0 bg-[#d4af37] text-zinc-900 font-bold px-5 py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              Add Compound
            </button>
          </div>

          {/* Alert Strip */}
          {(overdueCount > 0 || dueSoonCount > 0) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {overdueCount > 0 && (
                <div className="flex items-center gap-2 bg-red-900/40 text-red-300 px-4 py-2 rounded-lg text-sm font-medium ring-1 ring-red-500/40">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"/>
                  {overdueCount} compound{overdueCount > 1 ? "s" : ""} overdue
                </div>
              )}
              {dueSoonCount > 0 && (
                <div className="flex items-center gap-2 bg-amber-900/40 text-amber-300 px-4 py-2 rounded-lg text-sm font-medium ring-1 ring-amber-500/40">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"/>
                  {dueSoonCount} due soon
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Empty state */}
        {tracked.length === 0 && !showAddForm && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg width="28" height="28" fill="none" stroke="#d4af37" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No compounds tracked yet</h2>
            <p className="text-zinc-400 mb-6 max-w-sm mx-auto">Add a compound to start tracking injection timing and get live countdown to your next dose.</p>
            <button onClick={openAddForm} className="bg-[#d4af37] text-zinc-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
              Add Your First Compound
            </button>
          </div>
        )}

        {/* Tracked compounds grid */}
        {tracked.length > 0 && (
          <div className="grid gap-4 mb-10">
            {tracked.map((item) => {
              const s = getStatus(item, now);
              const style = s ? STATUS_STYLES[s.status] : null;
              const intervalHrs = freqToHours(item.freqValue, item.freqUnit);
              const freqLabel =
                item.freqUnit === "per_day" ? `${item.freqValue}×/day` :
                item.freqUnit === "per_week" ? `${item.freqValue}×/week` :
                item.freqUnit === "every_n_hours" ? `Every ${item.freqValue}h` :
                `Every ${item.freqValue}d`;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 ${s ? style!.bg : "bg-zinc-900"} ${s ? `ring-1 ${style!.ring}` : "border-white/10"}`}
                  style={{ borderColor: item.color + "33" }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Color dot + name */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1 w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg leading-tight">{item.compoundName}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-400">
                          <span>{item.dose} {item.doseUnit}</span>
                          <span className="text-zinc-600">·</span>
                          <span>{freqLabel}</span>
                          <span className="text-zinc-600">·</span>
                          <span>t½ = {COMPOUNDS.find(c => c.name === item.compoundName)?.halfLifeHours ? formatDuration(COMPOUNDS.find(c => c.name === item.compoundName)!.halfLifeHours * 3600000).text : "—"}</span>
                        </div>
                        {item.notes && <p className="text-xs text-zinc-500 mt-1">{item.notes}</p>}
                      </div>
                    </div>

                    {/* Status + timer */}
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      {s ? (
                        <>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${s.status === "overdue" ? "bg-red-500/20 text-red-300" : s.status === "due_soon" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                            {STATUS_STYLES[s.status].label}
                          </span>
                          <div className="text-right">
                            {s.remaining > 0 ? (
                              <>
                                <p className="text-xs text-zinc-500">Next dose in</p>
                                <p className={`text-2xl font-mono font-bold ${style!.text}`}>{formatDuration(s.remaining).text}</p>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-zinc-500">Overdue by</p>
                                <p className="text-2xl font-mono font-bold text-red-400">{formatDuration(-s.remaining).text}</p>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500">Since last: {formatDuration(s.elapsed).text}</p>
                        </>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">No injection logged yet</span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {s && (
                    <div className="mt-4">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${s.status === "overdue" ? "bg-red-500" : s.status === "due_soon" ? "bg-amber-400" : "bg-emerald-500"}`}
                          style={{ width: `${s.progressPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-600 mt-1">
                        <span>Injected</span>
                        <span>{Math.round(s.progressPct)}% of interval</span>
                        <span>Next dose ({formatDuration(s.intervalMs).text} interval)</span>
                      </div>
                    </div>
                  )}

                  {/* Last injection time */}
                  {item.lastInjection && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Last injection: {new Date(item.lastInjection).toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => logInjection(item.id)}
                      className="bg-[#d4af37] text-zinc-900 text-sm font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      Log Injection Now
                    </button>
                    <button
                      onClick={() => openEditForm(item)}
                      className="bg-white/5 hover:bg-white/10 text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    {item.lastInjection && (
                      <button
                        onClick={() => clearLastInjection(item.id)}
                        className="bg-white/5 hover:bg-white/10 text-sm px-4 py-2 rounded-lg transition-colors text-zinc-400"
                      >
                        Clear Timer
                      </button>
                    )}
                    <button
                      onClick={() => removeCompound(item.id)}
                      className="bg-white/5 hover:bg-red-900/30 text-sm px-4 py-2 rounded-lg transition-colors text-red-400 ml-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit form */}
        {showAddForm && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold mb-6">{editId ? "Edit Compound" : "Add Compound to Timer"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Compound select */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Compound</label>
                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${categoryFilter === cat ? "bg-[#d4af37] text-zinc-900 font-bold" : "bg-white/5 hover:bg-white/10 text-zinc-400"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  value={formCompound}
                  onChange={(e) => setFormCompound(e.target.value)}
                >
                  {COMPOUNDS
                    .filter((c) => categoryFilter === "All" || c.category === categoryFilter)
                    .map((c) => (
                      <option key={c.name} value={c.name}>{c.name} — {c.category}</option>
                    ))
                  }
                </select>
                {(() => {
                  const c = COMPOUNDS.find((x) => x.name === formCompound);
                  return c ? <p className="text-xs text-zinc-500 mt-1">{c.notes}</p> : null;
                })()}
              </div>

              {/* Dose */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Dose</label>
                  <input
                    type="number"
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                    value={formDose}
                    onChange={(e) => setFormDose(e.target.value)}
                    min="0"
                    step="any"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Unit</label>
                  <select
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                    value={formDoseUnit}
                    onChange={(e) => setFormDoseUnit(e.target.value)}
                  >
                    <option>mcg</option>
                    <option>mg</option>
                    <option>IU</option>
                    <option>nmol/kg</option>
                    <option>mg/kg</option>
                    <option>mcg/kg</option>
                  </select>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Dosing Frequency</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                    value={formFreqValue}
                    onChange={(e) => setFormFreqValue(Number(e.target.value))}
                    min="1"
                    step="1"
                    required
                  />
                  <select
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                    value={formFreqUnit}
                    onChange={(e) => setFormFreqUnit(e.target.value as FreqUnit)}
                  >
                    <option value="per_day">times per day</option>
                    <option value="per_week">times per week</option>
                    <option value="every_n_hours">every N hours</option>
                    <option value="every_n_days">every N days</option>
                  </select>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  → Dosing interval: {formatDuration(freqToHours(formFreqValue, formFreqUnit) * 3600 * 1000).detail}
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Notes (optional)</label>
                <input
                  type="text"
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  placeholder="e.g. Pre-sleep injection, left abdomen, batch 24Q3"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-[#d4af37] text-zinc-900 font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors">
                  {editId ? "Save Changes" : "Add to Timer"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditId(null); }}
                  className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* How to use */}
        {tracked.length > 0 && (
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 mb-10">
            <h2 className="font-bold text-lg mb-4 text-[#d4af37]">How to use this tool</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-zinc-400">
              <div>
                <p className="font-semibold text-white mb-1">1. Add compounds</p>
                <p>Select each compound from your protocol, set dose and frequency. The interval auto-populates from published research protocols.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">2. Log each injection</p>
                <p>After each injection, tap "Log Injection Now." The timer resets and counts down to your next dose based on your dosing interval.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">3. Read the status</p>
                <p><span className="text-emerald-400 font-medium">On Track</span> → &gt;20% time remaining. <span className="text-amber-400 font-medium">Due Soon</span> → &lt;20% remaining. <span className="text-red-400 font-medium">Overdue</span> → past interval window.</p>
              </div>
            </div>
          </div>
        )}

        {/* Reference table */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden mb-10">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-bold text-lg">Compound Reference: Default Intervals</h2>
            <p className="text-sm text-zinc-400 mt-1">Published typical dosing intervals for common research peptides.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-300">Compound</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-300">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-300">t½</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-300">Default Interval</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-300">Notes</th>
                </tr>
              </thead>
              <tbody>
                {COMPOUNDS.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800/20"}>
                    <td className="px-4 py-2.5 font-medium">{c.name}</td>
                    <td className="px-4 py-2.5 text-zinc-400">{c.category}</td>
                    <td className="px-4 py-2.5 font-mono text-zinc-300">{formatDuration(c.halfLifeHours * 3600000).text}</td>
                    <td className="px-4 py-2.5 font-mono text-[#d4af37]">{formatDuration(freqToHours(c.defaultFreqPerDay >= 1 ? Math.round(c.defaultFreqPerDay) : 1, c.defaultFreqPerDay >= 1 ? "per_day" : "every_n_hours") * 3600000).text}</td>
                    <td className="px-4 py-2.5 text-zinc-500 text-xs">{c.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { href: "/tools/half-life-calculator", title: "Half-Life Calculator", desc: "Clearance milestones + decay curve" },
            { href: "/tools/dosing-frequency-planner", title: "Dosing Frequency Planner", desc: "Weekly injection schedule" },
            { href: "/tools/peptide-cycle-planner", title: "Cycle Planner", desc: "12 or 24-week cycle calendar" },
            { href: "/tools/protocol-template-generator", title: "Protocol Generator", desc: "Printable research protocol doc" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="bg-zinc-900 border border-white/10 rounded-xl p-4 hover:border-[#d4af37]/30 hover:bg-zinc-800 transition-all">
              <p className="font-semibold text-sm">{t.title}</p>
              <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
            </Link>
          ))}
        </div>

        {/* Catalog rail */}
        <ToolCatalogCTA className="py-2" />

        {/* Disclaimer */}
        <p className="text-xs text-zinc-600 text-center border-t border-white/5 pt-6">
          For Research Use Only. Timing intervals shown are from published preclinical studies and do not constitute medical advice. All data stored locally in your browser — nothing is sent to Nexphoria servers. Always follow your institutional research protocols.
        </p>
      </div>
    </div>
  );
}
