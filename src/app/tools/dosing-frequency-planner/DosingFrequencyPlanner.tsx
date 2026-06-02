"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

type Compound = {
  name: string;
  recommendedFrequency: number;
  unit: string;
};

type StackEntry = {
  id: string;
  compound: string;
  dosePerInjection: number;
  frequencyPerWeek: number;
  preferredDays: Set<number>; // 0=Mon, 6=Sun
  autoDistribute: boolean;
};

const COMPOUNDS: Compound[] = [
  { name: "BPC-157", recommendedFrequency: 7, unit: "mcg" },
  { name: "TB-500", recommendedFrequency: 7, unit: "mcg" },
  { name: "Ipamorelin", recommendedFrequency: 7, unit: "mcg" },
  { name: "CJC-1295 No DAC", recommendedFrequency: 6, unit: "mcg" },
  { name: "CJC-1295 w/DAC", recommendedFrequency: 2, unit: "mcg" },
  { name: "Sermorelin", recommendedFrequency: 7, unit: "mcg" },
  { name: "Tesamorelin", recommendedFrequency: 7, unit: "mcg" },
  { name: "MK-677", recommendedFrequency: 7, unit: "mcg" },
  { name: "Semaglutide", recommendedFrequency: 1, unit: "mcg" },
  { name: "Tirzepatide", recommendedFrequency: 1, unit: "mcg" },
  { name: "Retatrutide", recommendedFrequency: 1, unit: "mcg" },
  { name: "AOD-9604", recommendedFrequency: 5, unit: "mcg" },
  { name: "GHK-Cu", recommendedFrequency: 5, unit: "mcg" },
  { name: "Epitalon", recommendedFrequency: 5, unit: "mcg" },
  { name: "Selank", recommendedFrequency: 7, unit: "mcg" },
  { name: "Semax", recommendedFrequency: 7, unit: "mcg" },
  { name: "NAD+", recommendedFrequency: 3, unit: "mcg" },
  { name: "PT-141", recommendedFrequency: 2, unit: "mcg" },
  { name: "Melanotan II", recommendedFrequency: 3, unit: "mcg" },
  { name: "Thymosin Alpha-1", recommendedFrequency: 3, unit: "mcg" },
  { name: "MOTS-c", recommendedFrequency: 3, unit: "mcg" },
  { name: "SS-31", recommendedFrequency: 5, unit: "mcg" },
  { name: "DSIP", recommendedFrequency: 5, unit: "mcg" },
  { name: "Kisspeptin-10", recommendedFrequency: 3, unit: "mcg" },
  { name: "Oxytocin", recommendedFrequency: 3, unit: "mcg" },
  { name: "KPV", recommendedFrequency: 7, unit: "mcg" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function autoDistributeDays(frequency: number): Set<number> {
  const days = new Set<number>();
  if (frequency >= 7) {
    for (let i = 0; i < 7; i++) days.add(i);
    return days;
  }
  const interval = 7 / frequency;
  for (let i = 0; i < frequency; i++) {
    days.add(Math.round(i * interval) % 7);
  }
  return days;
}

export default function DosingFrequencyPlanner() {
  const [stack, setStack] = useState<StackEntry[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<string>(COMPOUNDS[0].name);
  const [dosePerInjection, setDosePerInjection] = useState<string>("250");
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number>(7);
  const [autoDistribute, setAutoDistribute] = useState<boolean>(true);
  const [preferredDays, setPreferredDays] = useState<Set<number>>(new Set([0, 2, 4]));

  const addToStack = () => {
    const newEntry: StackEntry = {
      id: Date.now().toString(),
      compound: selectedCompound,
      dosePerInjection: parseFloat(dosePerInjection) || 0,
      frequencyPerWeek,
      preferredDays: autoDistribute ? autoDistributeDays(frequencyPerWeek) : new Set(preferredDays),
      autoDistribute,
    };
    setStack([...stack, newEntry]);
  };

  const removeFromStack = (id: string) => {
    setStack(stack.filter((e) => e.id !== id));
  };

  const togglePreferredDay = (day: number) => {
    const newDays = new Set(preferredDays);
    if (newDays.has(day)) {
      newDays.delete(day);
    } else {
      newDays.add(day);
    }
    setPreferredDays(newDays);
  };

  // Build calendar grid
  const calendar = useMemo(() => {
    const grid: { [day: number]: { compound: string; dose: number }[] } = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    };
    stack.forEach((entry) => {
      entry.preferredDays.forEach((day) => {
        grid[day].push({ compound: entry.compound, dose: entry.dosePerInjection });
      });
    });
    return grid;
  }, [stack]);

  // Warnings
  const warnings = useMemo(() => {
    const w: string[] = [];
    // Check for 4+ injections on a single day
    Object.entries(calendar).forEach(([day, entries]) => {
      if (entries.length >= 4) {
        w.push(`⚠️ ${DAYS[parseInt(day)]}: ${entries.length} injections. Consider spacing across multiple days to reduce injection site rotation pressure.`);
      }
    });
    // Check for GHK-Cu on same day as other SC peptides
    Object.entries(calendar).forEach(([day, entries]) => {
      const hasGHKCu = entries.some((e) => e.compound === "GHK-Cu");
      const hasOtherSC = entries.some((e) => e.compound !== "GHK-Cu");
      if (hasGHKCu && hasOtherSC) {
        w.push(`💡 ${DAYS[parseInt(day)]}: GHK-Cu may cause blue color staining at injection site. Consider separate injection area if mixing with other SC peptides.`);
      }
    });
    return w;
  }, [calendar]);

  // Per-compound summary
  const summary = useMemo(() => {
    return stack.map((entry) => {
      const totalWeeklyDose = entry.dosePerInjection * entry.frequencyPerWeek;
      const compound = COMPOUNDS.find((c) => c.name === entry.compound);
      const recommendedFreq = compound?.recommendedFrequency || 0;
      return {
        compound: entry.compound,
        totalWeeklyDose,
        dosesPerWeek: entry.frequencyPerWeek,
        recommendedFreq,
      };
    });
  }, [stack]);

  // Export protocol
  const exportProtocol = () => {
    let text = "=== WEEKLY DOSING PROTOCOL ===\n\n";
    text += "MY STACK:\n";
    stack.forEach((entry) => {
      text += `• ${entry.compound}: ${entry.dosePerInjection} mcg × ${entry.frequencyPerWeek}/week\n`;
    });
    text += "\n--- WEEKLY CALENDAR ---\n\n";
    DAYS.forEach((day, idx) => {
      const entries = calendar[idx];
      text += `${day}:\n`;
      if (entries.length === 0) {
        text += "  (rest day)\n";
      } else {
        entries.forEach((e) => {
          text += `  • ${e.compound}: ${e.dose} mcg\n`;
        });
      }
      text += "\n";
    });
    text += "\n--- SUMMARY ---\n";
    summary.forEach((s) => {
      text += `${s.compound}: ${s.totalWeeklyDose} mcg/week | ${s.dosesPerWeek}×/week (rec: ${s.recommendedFreq}×/week)\n`;
    });
    if (warnings.length > 0) {
      text += "\n--- WARNINGS ---\n";
      warnings.forEach((w) => {
        text += `${w}\n`;
      });
    }
    text += "\n--- NOTES ---\n";
    text += "• Rotate injection sites daily\n";
    text += "• Store reconstituted peptides at 2-8°C\n";
    text += "• For research use only\n";
    return text;
  };

  const handleExport = () => {
    const protocol = exportProtocol();
    navigator.clipboard.writeText(protocol);
    alert("Protocol copied to clipboard!");
  };

  const compound = COMPOUNDS.find((c) => c.name === selectedCompound);

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Dosing Frequency Planner" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#d4af37" }}>
            Tool
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight font-bold"
            style={{ color: "#ffffff", lineHeight: 1.05 }}
          >
            Dosing Frequency Planner
          </h1>
          <p className="text-base md:text-lg max-w-2xl" style={{ fontWeight: 300, color: "#9ca3af", lineHeight: 1.65 }}>
            Plan your weekly injection schedule across multiple compounds with auto-distribute, stacking warnings, and exportable protocol summary.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-8">
        {/* Add compound to stack */}
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
            Add Compound to Stack
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase tracking-wider block mb-2" style={{ color: "#9ca3af" }}>
                Compound
              </label>
              <select
                value={selectedCompound}
                onChange={(e) => setSelectedCompound(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#ffffff",
                }}
              >
                {COMPOUNDS.map((c) => (
                  <option key={c.name} value={c.name} style={{ backgroundColor: "#1a1a1a" }}>
                    {c.name} (rec: {c.recommendedFrequency}×/week)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider block mb-2" style={{ color: "#9ca3af" }}>
                Dose per Injection (mcg)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={dosePerInjection}
                onChange={(e) => setDosePerInjection(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#ffffff",
                }}
                placeholder="e.g. 250"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider block mb-2" style={{ color: "#9ca3af" }}>
              Frequency per Week
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setFrequencyPerWeek(n)}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: frequencyPerWeek === n ? "#d4af37" : "rgba(255,255,255,0.1)",
                    color: frequencyPerWeek === n ? "#0a0a0a" : "#ffffff",
                    border: frequencyPerWeek === n ? "none" : "1px solid rgba(255,255,255,0.2)",
                    fontWeight: frequencyPerWeek === n ? 600 : 400,
                  }}
                >
                  {n}×
                </button>
              ))}
            </div>
            {compound && (
              <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
                Recommended: {compound.recommendedFrequency}× per week
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={autoDistribute}
                onChange={(e) => setAutoDistribute(e.target.checked)}
                style={{ accentColor: "#d4af37" }}
              />
              <span className="text-sm" style={{ color: "#ffffff" }}>
                Auto-distribute across week
              </span>
            </label>

            {!autoDistribute && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#9ca3af" }}>
                  Select Preferred Days
                </p>
                <div className="flex gap-2">
                  {DAYS.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => togglePreferredDay(idx)}
                      className="px-3 py-2 rounded-lg text-xs transition-all"
                      style={{
                        backgroundColor: preferredDays.has(idx) ? "#d4af37" : "rgba(255,255,255,0.1)",
                        color: preferredDays.has(idx) ? "#0a0a0a" : "#ffffff",
                        border: preferredDays.has(idx) ? "none" : "1px solid rgba(255,255,255,0.2)",
                        fontWeight: preferredDays.has(idx) ? 600 : 400,
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={addToStack}
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#d4af37", color: "#0a0a0a" }}
          >
            Add to Stack
          </button>
        </div>

        {/* Current stack */}
        {stack.length > 0 && (
          <div
            className="rounded-2xl p-6 md:p-8 space-y-4"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              My Stack ({stack.length} compound{stack.length !== 1 ? "s" : ""})
            </h2>
            <div className="space-y-3">
              {stack.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: "#ffffff" }}>
                      {entry.compound}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                      {entry.dosePerInjection} mcg × {entry.frequencyPerWeek}×/week on{" "}
                      {Array.from(entry.preferredDays)
                        .sort()
                        .map((d) => DAYS[d])
                        .join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromStack(entry.id)}
                    className="ml-4 text-sm hover:opacity-70 transition-opacity"
                    style={{ color: "#ef4444" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly calendar */}
        {stack.length > 0 && (
          <div
            className="rounded-2xl p-6 md:p-8 space-y-6"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              Weekly Calendar
            </h2>
            <div className="grid grid-cols-7 gap-3">
              {DAYS.map((day, idx) => {
                const entries = calendar[idx];
                return (
                  <div
                    key={idx}
                    className="rounded-lg p-3 min-h-[120px]"
                    style={{
                      backgroundColor: entries.length > 0 ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${entries.length > 0 ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <p className="text-xs font-semibold mb-2" style={{ color: "#d4af37" }}>
                      {day}
                    </p>
                    {entries.length === 0 ? (
                      <p className="text-xs" style={{ color: "#6b7280" }}>
                        Rest
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {entries.map((e, i) => (
                          <div
                            key={i}
                            className="text-xs p-1.5 rounded"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ffffff" }}
                          >
                            <p className="font-medium text-[10px]">{e.compound}</p>
                            <p style={{ color: "#9ca3af" }}>{e.dose} mcg</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        {stack.length > 0 && (
          <div
            className="rounded-2xl p-6 md:p-8 space-y-4"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              Per-Compound Summary
            </h2>
            <div className="space-y-3">
              {summary.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <p className="font-medium mb-1" style={{ color: "#ffffff" }}>
                    {s.compound}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p style={{ color: "#9ca3af" }}>Weekly Total</p>
                      <p style={{ color: "#ffffff" }}>{s.totalWeeklyDose} mcg</p>
                    </div>
                    <div>
                      <p style={{ color: "#9ca3af" }}>Doses/Week</p>
                      <p style={{ color: "#ffffff" }}>{s.dosesPerWeek}×</p>
                    </div>
                    <div>
                      <p style={{ color: "#9ca3af" }}>Recommended</p>
                      <p style={{ color: s.dosesPerWeek === s.recommendedFreq ? "#10b981" : "#f59e0b" }}>
                        {s.recommendedFreq}×/week
                        {s.dosesPerWeek !== s.recommendedFreq && (
                          <span className="ml-1">
                            {s.dosesPerWeek < s.recommendedFreq ? "↑" : "↓"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div
            className="rounded-2xl p-6 md:p-8 space-y-4"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              Stacking Warnings
            </h2>
            <div className="space-y-2">
              {warnings.map((w, idx) => (
                <p key={idx} className="text-sm" style={{ color: "#fca5a5" }}>
                  {w}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Export */}
        {stack.length > 0 && (
          <div
            className="rounded-2xl p-6 md:p-8 space-y-4"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              Export Protocol
            </h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Copy your complete weekly dosing protocol to clipboard as plain text.
            </p>
            <button
              onClick={handleExport}
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#d4af37", color: "#0a0a0a" }}
            >
              Copy to Clipboard
            </button>
          </div>
        )}

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#d4af37" }}>
            Ready to Order?
          </p>
          <h3 className="text-2xl mb-3 tracking-tight font-semibold" style={{ color: "#ffffff" }}>
            Research-grade compounds, independently verified.
          </h3>
          <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
            Every lot tested by independent laboratories. COA ships with every order.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#d4af37", color: "#0a0a0a", textDecoration: "none" }}
          >
            Browse Catalog
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
          <strong style={{ color: "#9ca3af" }}>Research Use Only.</strong> This planner produces
          research-planning estimates only. All compounds supplied by Nexphoria are for in vitro
          research use only. Nothing here constitutes medical advice or human-dosing guidance.
        </p>
      </div>
    </div>
  );
}
