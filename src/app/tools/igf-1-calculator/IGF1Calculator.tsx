"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Data ─────────────────────────────────────────────────────────────────────

type GHRHCompound = {
  name: string;
  slug: string | null;
  category: "GHRH Analog";
  baseIGF1Pct: [number, number]; // [low, high] % elevation range from published data
  halfLifeHours: number;
  mechanism: string;
  keyStudy: string;
  notes: string;
};

type GHRPCompound = {
  name: string;
  slug: string | null;
  category: "GHRP / GHS";
  synergyMultiplier: [number, number]; // multiplier applied to GHRH base range
  halfLifeHours: number;
  mechanism: string;
  keyStudy: string;
  notes: string;
};

type StandaloneCompound = {
  name: string;
  slug: string | null;
  category: "Standalone GHS";
  baseIGF1Pct: [number, number];
  halfLifeHours: number;
  mechanism: string;
  keyStudy: string;
  notes: string;
};

// IGF-1 elevation data from published studies
const GHRH_COMPOUNDS: GHRHCompound[] = [
  {
    name: "Sermorelin",
    slug: "sermorelin",
    category: "GHRH Analog",
    baseIGF1Pct: [35, 50],
    halfLifeHours: 0.2,
    mechanism: "GHRH-R (Gs/cAMP/PKA/CREB) agonist — first 29 aa of native GHRH",
    keyStudy: "Sigalos & Pastuszak 2018 (Sexual Medicine Reviews): 35–50% IGF-1 increase across GHRH analog trials; Vittone 1997 NIA RCT: +38% IGF-1 at 6 months SC",
    notes: "Pulsatile GH pattern. Pituitary reserve required. Nocturnally timed dosing optimal.",
  },
  {
    name: "CJC-1295 No DAC (Mod GRF 1-29)",
    slug: "cjc-1295-no-dac",
    category: "GHRH Analog",
    baseIGF1Pct: [35, 55],
    halfLifeHours: 0.5,
    mechanism: "Modified GHRH(1-29) — Ala2→D-Ala, Phe6→2-methylPhe, Leu27→Nle, Met29→norleucine for DPP-IV resistance",
    keyStudy: "Alba 2006 (J Clin Endocrinol Metab): single-dose GH peak ~2-4 ng/mL at 30 min; IGF-1 elevation ~35–55% with repeat dosing (GHRP synergy studies)",
    notes: "Short half-life preserves pulsatility. Ideal stacking partner for ipamorelin or GHRP-2.",
  },
  {
    name: "CJC-1295 with DAC",
    slug: "cjc-1295-ipamorelin",
    category: "GHRH Analog",
    baseIGF1Pct: [50, 80],
    halfLifeHours: 192,
    mechanism: "GHRH(1-29) + Drug Affinity Complex (DAC) maleimide linker — binds albumin in vivo for ~8-day half-life",
    keyStudy: "Teichman 2006 (J Clin Endocrinol Metab): 2 mg SC produced 200% mean GH AUC increase; steady-state IGF-1 elevation 50–80% above baseline across dose cohorts",
    notes: "Continuous GH elevation vs pulsatile. Potentially blunts somatotroph sensitivity over time. Weekly or biweekly dosing in preclinical studies.",
  },
  {
    name: "Tesamorelin",
    slug: "tesamorelin",
    category: "GHRH Analog",
    baseIGF1Pct: [40, 55],
    halfLifeHours: 0.13,
    mechanism: "Full-length GHRH(1-44) with trans-3-hexenoic acid — DPP-IV resistant, 26–30 min half-life",
    keyStudy: "Falutz 2007 (NEJM): 2 mg SC/day, +46.2% IGF-1 vs placebo at 26 weeks; Lo 2010 (NEJM): +32% IGF-1 with visceral fat reduction",
    notes: "FDA-approved (EGRIFTA) for HIV-associated lipodystrophy. Highest clinical evidence base of any GHRH analog.",
  },
];

const GHRP_COMPOUNDS: GHRPCompound[] = [
  {
    name: "None (GHRH Analog alone)",
    slug: null,
    category: "GHRP / GHS",
    synergyMultiplier: [1.0, 1.0],
    halfLifeHours: 0,
    mechanism: "GHRH analog without GHRP stack",
    keyStudy: "Baseline: no synergy multiplier applied",
    notes: "Monotherapy GHRH alone. Lower GH pulse amplitude vs combination.",
  },
  {
    name: "Ipamorelin",
    slug: "cjc-1295-ipamorelin",
    category: "GHRP / GHS",
    synergyMultiplier: [1.8, 2.8],
    halfLifeHours: 2,
    mechanism: "Selective GHSR-1a agonist (D-2-Naphthylalanine structure) — no cortisol/ACTH activation at research doses",
    keyStudy: "Bowers 1998: GHRP + GHRH co-administration produces 8–12× GH amplification vs either alone; Johansen 1999: ipamorelin 2 µg/kg produced GH peaks of 60–80 ng/mL in swine; IGF-1 synergy multiplier ~1.8–2.8× vs GHRH alone",
    notes: "Cleanest GHRP profile — no cortisol, no appetite stimulation. Preferred stack partner.",
  },
  {
    name: "GHRP-2",
    slug: null,
    category: "GHRP / GHS",
    synergyMultiplier: [2.2, 3.5],
    halfLifeHours: 1.5,
    mechanism: "Potent GHSR-1a agonist — higher GH pulse amplitude than ipamorelin; modest cortisol + ACTH activation",
    keyStudy: "Arvat 1997 (Neuroendocrinology): GHRP-2 + GHRH produced GH peaks of 50–70 ng/mL; synergy multiplier 2.2–3.5× vs GHRH monotherapy in combined infusion studies",
    notes: "Higher GH peaks but activates HPA axis. Better for acute GH spike studies; less ideal for repeated daily protocols.",
  },
  {
    name: "GHRP-6",
    slug: null,
    category: "GHRP / GHS",
    synergyMultiplier: [2.0, 3.0],
    halfLifeHours: 1.5,
    mechanism: "Ghrelin-mimetic GHSR-1a agonist — activates NPY/AgRP arcuate circuit producing significant hunger signal",
    keyStudy: "Bowers 1984 (Endocrinology): original GHRP receptor characterization; GHRP-6 + GHRH synergy 2.0–3.0× IGF-1 elevation vs GHRH alone in rodent/human studies",
    notes: "Strong hunger side-effect in rodent models. GH/IGF-1 response similar to GHRP-2. Use fasted-state protocols for accurate GH readout.",
  },
  {
    name: "Hexarelin",
    slug: null,
    category: "GHRP / GHS",
    synergyMultiplier: [2.5, 4.0],
    halfLifeHours: 1.5,
    mechanism: "Most potent GHSR-1a synthetic peptide agonist; also binds CD36 (cardiac effects independent of GH)",
    keyStudy: "Ghigo 1994 (J Clin Endocrinol Metab): hexarelin produced highest GH peaks of any GHRP (70–90 ng/mL); combination with GHRH: synergy multiplier ~2.5–4.0×. Tachyphylaxis pronounced at 4 weeks.",
    notes: "Highest GH amplitude of any GHRP but significant tachyphylaxis (75–80% attenuation at 4 weeks). Best for short-duration study designs.",
  },
];

const STANDALONE_COMPOUNDS: StandaloneCompound[] = [
  {
    name: "MK-677 (Ibutamoren)",
    slug: "mk-677",
    category: "Standalone GHS",
    baseIGF1Pct: [40, 65],
    halfLifeHours: 24,
    mechanism: "Oral non-peptide GHSR-1a full agonist — 24-hour half-life, once-daily dosing",
    keyStudy: "Nass 2008 (Annals of Internal Medicine): 25 mg/day × 2 years, +39.9% IGF-1; Chapman 1996: 50 mg/day +52% IGF-1; Copinschi 1997: 25 mg/day +39% IGF-1",
    notes: "Oral administration. Continuous GH elevation. Sustained IGF-1 increase over weeks/months. Monitor glucose/insulin resistance.",
  },
];

// Duration modifier: longer administration → higher/stabilized elevation
function getDurationModifier(weeks: number): [number, number] {
  if (weeks <= 2) return [0.6, 0.75];  // acute: not yet at steady state
  if (weeks <= 4) return [0.8, 0.92];  // building
  if (weeks <= 8) return [0.9, 1.0];   // near peak
  if (weeks <= 12) return [1.0, 1.1];  // steady state (some sensitization possible)
  return [0.85, 1.05]; // very long: tachyphylaxis and feedback modulation
}

function getDurationLabel(weeks: number): string {
  if (weeks <= 2) return "Acute (1-2 weeks) — Building phase";
  if (weeks <= 4) return "Short-term (3-4 weeks) — Approaching steady state";
  if (weeks <= 8) return "Medium-term (5-8 weeks) — Near-peak IGF-1 elevation";
  if (weeks <= 12) return "Optimal (9-12 weeks) — Steady-state, maximum elevation window";
  return "Extended (13+ weeks) — Watch for tachyphylaxis and feedback modulation";
}

function formatRange(low: number, high: number): string {
  return `${Math.round(low)}%–${Math.round(high)}%`;
}

function ReferenceBar({ low, high, max = 200 }: { low: number; high: number; max?: number }) {
  const leftPct = (low / max) * 100;
  const widthPct = ((high - low) / max) * 100;
  const midPct = ((low + high) / 2 / max) * 100;

  return (
    <div className="relative w-full h-5 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
      {/* Range bar */}
      <div
        className="absolute top-0 h-full rounded-sm"
        style={{
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          backgroundColor: "rgba(212,175,55,0.35)",
          border: "1px solid rgba(212,175,55,0.6)",
        }}
      />
      {/* Midpoint marker */}
      <div
        className="absolute top-0 h-full w-0.5"
        style={{
          left: `${midPct}%`,
          backgroundColor: "#d4af37",
        }}
      />
      {/* Baseline label */}
      <div
        className="absolute top-0 h-full w-px"
        style={{ left: "0%", backgroundColor: "rgba(255,255,255,0.2)" }}
      />
    </div>
  );
}

export default function IGF1Calculator() {
  const [mode, setMode] = useState<"stack" | "standalone">("stack");
  const [selectedGHRH, setSelectedGHRH] = useState<string>("Sermorelin");
  const [selectedGHRP, setSelectedGHRP] = useState<string>("Ipamorelin");
  const [selectedStandalone, setSelectedStandalone] = useState<string>("MK-677 (Ibutamoren)");
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number>(7); // doses/week
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [baselineIGF1, setBaselineIGF1] = useState<string>("150");

  const ghrhCompound = useMemo(() =>
    GHRH_COMPOUNDS.find(c => c.name === selectedGHRH)!, [selectedGHRH]);

  const ghrpCompound = useMemo(() =>
    GHRP_COMPOUNDS.find(c => c.name === selectedGHRP)!, [selectedGHRP]);

  const standaloneCompound = useMemo(() =>
    STANDALONE_COMPOUNDS.find(c => c.name === selectedStandalone)!, [selectedStandalone]);

  const durationMod = useMemo(() => getDurationModifier(durationWeeks), [durationWeeks]);

  // Frequency adjustment: less frequent = less total GH stimulation
  const freqModifier = useMemo((): [number, number] => {
    const ratio = frequencyPerWeek / 7;
    if (ratio >= 1) return [1.0, 1.0];
    if (ratio >= 0.71) return [0.92, 0.97]; // 5-6×/week
    if (ratio >= 0.43) return [0.82, 0.90]; // 3-4×/week
    if (ratio >= 0.29) return [0.70, 0.80]; // 2×/week
    return [0.55, 0.68]; // 1×/week
  }, [frequencyPerWeek]);

  const stackResults = useMemo(() => {
    const [ghrhLow, ghrhHigh] = ghrhCompound.baseIGF1Pct;
    const [synLow, synHigh] = ghrpCompound.synergyMultiplier;
    const [durLow, durHigh] = durationMod;
    const [frqLow, frqHigh] = freqModifier;

    const rawLow = ghrhLow * synLow * durLow * frqLow;
    const rawHigh = ghrhHigh * synHigh * durHigh * frqHigh;

    const baseline = parseFloat(baselineIGF1) || 0;
    const absLow = baseline > 0 ? baseline * (1 + rawLow / 100) : null;
    const absHigh = baseline > 0 ? baseline * (1 + rawHigh / 100) : null;

    return {
      pctLow: rawLow,
      pctHigh: rawHigh,
      absLow,
      absHigh,
    };
  }, [ghrhCompound, ghrpCompound, durationMod, freqModifier, baselineIGF1]);

  const standaloneResults = useMemo(() => {
    const [baseLow, baseHigh] = standaloneCompound.baseIGF1Pct;
    const [durLow, durHigh] = durationMod;
    const [frqLow, frqHigh] = freqModifier;

    const rawLow = baseLow * durLow * frqLow;
    const rawHigh = baseHigh * durHigh * frqHigh;

    const baseline = parseFloat(baselineIGF1) || 0;
    const absLow = baseline > 0 ? baseline * (1 + rawLow / 100) : null;
    const absHigh = baseline > 0 ? baseline * (1 + rawHigh / 100) : null;

    return {
      pctLow: rawLow,
      pctHigh: rawHigh,
      absLow,
      absHigh,
    };
  }, [standaloneCompound, durationMod, freqModifier, baselineIGF1]);

  const activeResults = mode === "stack" ? stackResults : standaloneResults;
  const confidenceColor = activeResults.pctHigh > 120 ? "#ef4444" : activeResults.pctHigh > 60 ? "#d4af37" : "#4ade80";

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
              { label: "IGF-1 Response Estimator" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
            Research Tool
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            IGF-1 Response<br />Estimator
          </h1>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Estimate IGF-1 % elevation from GH secretagogue stacking based on published clinical
            and preclinical pharmacology data. Includes GHRH analog + GHRP synergy modeling,
            duration modifiers, and dosing frequency adjustments. Research reference only.
          </p>

          <div
            className="mt-8 flex flex-wrap gap-4 text-xs"
            style={{ color: "#606060" }}
          >
            {[
              { label: "4 GHRH Analogs", icon: "◈" },
              { label: "5 GHRP Compounds", icon: "◈" },
              { label: "Synergy modeling", icon: "◈" },
              { label: "Duration & frequency modifiers", icon: "◈" },
            ].map((f) => (
              <span key={f.label} className="flex items-center gap-1.5">
                <span style={{ color: "#d4af37" }}>{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog rail */}
      <ToolCatalogCTA className="py-2" />

      {/* Disclaimer */}
      <div className="px-6 py-3" style={{ backgroundColor: "#1A1A18" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-center" style={{ color: "#606060" }}>
            ⚠️ Research reference only — estimates are based on published study data and should
            not be used to guide human dosing decisions. All output is illustrative.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Mode toggle */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#999" }}>
              Compound Mode
            </p>
            <div className="flex gap-2">
              {[
                { id: "stack" as const, label: "GHRH Analog + GHRP Stack" },
                { id: "standalone" as const, label: "Standalone GHS (MK-677, etc.)" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="px-4 py-2 rounded-sm text-sm font-medium transition-all"
                  style={{
                    backgroundColor: mode === m.id ? "#010101" : "transparent",
                    color: mode === m.id ? "#F9F9F9" : "#666",
                    border: `1px solid ${mode === m.id ? "#010101" : "#DDD"}`,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compound Selection */}
          <div
            className="rounded-sm p-6 space-y-5"
            style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "#999" }}>
              {mode === "stack" ? "Compound Selection" : "Standalone GHS Selection"}
            </p>

            {mode === "stack" ? (
              <div className="grid md:grid-cols-2 gap-4">
                {/* GHRH Analog */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "#333" }}>
                    GHRH Analog
                  </label>
                  <select
                    value={selectedGHRH}
                    onChange={(e) => setSelectedGHRH(e.target.value)}
                    className="w-full rounded-sm px-3 py-2.5 text-sm"
                    style={{
                      border: "1px solid #DDD",
                      backgroundColor: "#FAFAFA",
                      color: "#111",
                      outline: "none",
                    }}
                  >
                    {GHRH_COMPOUNDS.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {ghrhCompound && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs" style={{ color: "#666" }}>
                        Mono IGF-1 elevation: <span className="font-semibold" style={{ color: "#333" }}>
                          {formatRange(...ghrhCompound.baseIGF1Pct)}
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: "#999" }}>
                        Half-life: {ghrhCompound.halfLifeHours < 1
                          ? `${Math.round(ghrhCompound.halfLifeHours * 60)} min`
                          : `${ghrhCompound.halfLifeHours}h`}
                      </p>
                    </div>
                  )}
                </div>

                {/* GHRP */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "#333" }}>
                    GHRP / GH Secretagogue
                  </label>
                  <select
                    value={selectedGHRP}
                    onChange={(e) => setSelectedGHRP(e.target.value)}
                    className="w-full rounded-sm px-3 py-2.5 text-sm"
                    style={{
                      border: "1px solid #DDD",
                      backgroundColor: "#FAFAFA",
                      color: "#111",
                      outline: "none",
                    }}
                  >
                    {GHRP_COMPOUNDS.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {ghrpCompound && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs" style={{ color: "#666" }}>
                        Synergy multiplier: <span className="font-semibold" style={{ color: "#333" }}>
                          {ghrpCompound.synergyMultiplier[0] === 1.0 && ghrpCompound.synergyMultiplier[1] === 1.0
                            ? "1× (no stack)"
                            : `${ghrpCompound.synergyMultiplier[0]}–${ghrpCompound.synergyMultiplier[1]}×`
                          }
                        </span>
                      </p>
                      {ghrpCompound.halfLifeHours > 0 && (
                        <p className="text-xs" style={{ color: "#999" }}>
                          Half-life: {ghrpCompound.halfLifeHours < 1
                            ? `${Math.round(ghrpCompound.halfLifeHours * 60)} min`
                            : `${ghrpCompound.halfLifeHours}h`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#333" }}>
                  Standalone GH Secretagogue
                </label>
                <select
                  value={selectedStandalone}
                  onChange={(e) => setSelectedStandalone(e.target.value)}
                  className="w-full rounded-sm px-3 py-2.5 text-sm"
                  style={{
                    border: "1px solid #DDD",
                    backgroundColor: "#FAFAFA",
                    color: "#111",
                    outline: "none",
                  }}
                >
                  {STANDALONE_COMPOUNDS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {standaloneCompound && (
                  <div className="mt-3 p-3 rounded-sm" style={{ backgroundColor: "#F5F5F0", border: "1px solid #E8E8E0" }}>
                    <p className="text-xs" style={{ color: "#444", lineHeight: 1.6 }}>
                      <strong>Mechanism:</strong> {standaloneCompound.mechanism}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#666" }}>
                      <strong>Published range:</strong> {formatRange(...standaloneCompound.baseIGF1Pct)} IGF-1 elevation at therapeutic doses
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Protocol Parameters */}
          <div
            className="rounded-sm p-6 space-y-5"
            style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "#999" }}>
              Protocol Parameters
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Dosing frequency */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#333" }}>
                  Dosing Frequency
                </label>
                <select
                  value={frequencyPerWeek}
                  onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
                  className="w-full rounded-sm px-3 py-2.5 text-sm"
                  style={{
                    border: "1px solid #DDD",
                    backgroundColor: "#FAFAFA",
                    color: "#111",
                    outline: "none",
                  }}
                >
                  <option value={7}>Daily (7×/week)</option>
                  <option value={6}>6×/week</option>
                  <option value={5}>5×/week</option>
                  <option value={3}>3×/week</option>
                  <option value={2}>2×/week</option>
                  <option value={1}>1×/week</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#333" }}>
                  Duration (weeks)
                </label>
                <select
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full rounded-sm px-3 py-2.5 text-sm"
                  style={{
                    border: "1px solid #DDD",
                    backgroundColor: "#FAFAFA",
                    color: "#111",
                    outline: "none",
                  }}
                >
                  <option value={1}>1 week</option>
                  <option value={2}>2 weeks</option>
                  <option value={4}>4 weeks</option>
                  <option value={6}>6 weeks</option>
                  <option value={8}>8 weeks</option>
                  <option value={12}>12 weeks</option>
                  <option value={16}>16 weeks</option>
                  <option value={24}>24 weeks</option>
                </select>
                <p className="text-xs mt-1.5" style={{ color: "#999" }}>
                  {getDurationLabel(durationWeeks).split(" — ")[1]}
                </p>
              </div>

              {/* Baseline IGF-1 */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#333" }}>
                  Baseline IGF-1 (ng/mL)
                  <span className="font-normal ml-1" style={{ color: "#737373" }}>(optional)</span>
                </label>
                <input
                  type="number"
                  value={baselineIGF1}
                  onChange={(e) => setBaselineIGF1(e.target.value)}
                  placeholder="e.g. 150"
                  min={0}
                  max={600}
                  className="w-full rounded-sm px-3 py-2.5 text-sm"
                  style={{
                    border: "1px solid #DDD",
                    backgroundColor: "#FAFAFA",
                    color: "#111",
                    outline: "none",
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: "#999" }}>
                  Age 40: ~100–150 ng/mL typical
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#010101", border: "1px solid #2A2A28" }}
          >
            <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "#606060" }}>
              Estimated IGF-1 Response
            </p>

            {/* Main result */}
            <div className="mb-6">
              <div
                className="text-5xl md:text-6xl tracking-tight mb-2"
                style={{ fontWeight: 200, color: confidenceColor, lineHeight: 1 }}
              >
                {formatRange(activeResults.pctLow, activeResults.pctHigh)}
              </div>
              <p className="text-sm" style={{ color: "#808080" }}>
                Estimated IGF-1 elevation above baseline
              </p>
            </div>

            {/* Visual bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "#505050" }}>
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
                <span>150%</span>
                <span>200%</span>
              </div>
              <ReferenceBar
                low={activeResults.pctLow}
                high={activeResults.pctHigh}
                max={200}
              />
            </div>

            {/* Absolute IGF-1 if baseline provided */}
            {activeResults.absLow !== null && activeResults.absHigh !== null && (
              <div
                className="mb-6 rounded-sm p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-xs mb-1.5" style={{ color: "#606060" }}>
                  Estimated absolute IGF-1 at steady state
                </p>
                <p className="text-2xl" style={{ fontWeight: 200, color: "#F9F9F9" }}>
                  {Math.round(activeResults.absLow)}–{Math.round(activeResults.absHigh)} ng/mL
                </p>
                <p className="text-xs mt-1" style={{ color: "#505050" }}>
                  Based on {baselineIGF1} ng/mL baseline
                </p>
              </div>
            )}

            {/* Calculation breakdown */}
            <div
              className="rounded-sm p-4 space-y-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#404040" }}>
                Calculation Breakdown
              </p>
              {mode === "stack" ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#606060" }}>GHRH analog base range:</span>
                    <span style={{ color: "#A0A0A0" }}>{formatRange(...ghrhCompound.baseIGF1Pct)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#606060" }}>GHRP synergy multiplier:</span>
                    <span style={{ color: "#A0A0A0" }}>
                      {ghrpCompound.synergyMultiplier[0] === 1.0
                        ? "1.0× (none)"
                        : `${ghrpCompound.synergyMultiplier[0]}–${ghrpCompound.synergyMultiplier[1]}×`}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#606060" }}>Base IGF-1 elevation range:</span>
                  <span style={{ color: "#A0A0A0" }}>{formatRange(...standaloneCompound.baseIGF1Pct)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span style={{ color: "#606060" }}>Duration modifier ({durationWeeks}w):</span>
                <span style={{ color: "#A0A0A0" }}>{durationMod[0].toFixed(2)}–{durationMod[1].toFixed(2)}×</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#606060" }}>Frequency modifier ({frequencyPerWeek}×/wk):</span>
                <span style={{ color: "#A0A0A0" }}>{freqModifier[0].toFixed(2)}–{freqModifier[1].toFixed(2)}×</span>
              </div>
            </div>
          </div>

          {/* Compound Details */}
          {mode === "stack" && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* GHRH detail */}
              <div
                className="rounded-sm p-5"
                style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest" style={{ color: "#999" }}>
                    GHRH Analog
                  </p>
                  {ghrhCompound.slug && (
                    <Link
                      href={`/products/${ghrhCompound.slug}`}
                      className="text-xs"
                      style={{ color: "#B8A44C" }}
                    >
                      View Product →
                    </Link>
                  )}
                </div>
                <h3 className="text-base font-medium mb-2" style={{ color: "#111" }}>{ghrhCompound.name}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#555" }}>
                  {ghrhCompound.mechanism}
                </p>
                <div
                  className="rounded-sm p-3 text-xs"
                  style={{ backgroundColor: "#F5F5F0", color: "#666", lineHeight: 1.6 }}
                >
                  <strong>Key study:</strong> {ghrhCompound.keyStudy}
                </div>
                {ghrhCompound.notes && (
                  <p className="text-xs mt-2.5" style={{ color: "#666666", lineHeight: 1.5 }}>
                    📋 {ghrhCompound.notes}
                  </p>
                )}
              </div>

              {/* GHRP detail */}
              <div
                className="rounded-sm p-5"
                style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest" style={{ color: "#999" }}>
                    GHRP / GHS
                  </p>
                  {ghrpCompound.slug && (
                    <Link
                      href={`/products/${ghrpCompound.slug}`}
                      className="text-xs"
                      style={{ color: "#B8A44C" }}
                    >
                      View Product →
                    </Link>
                  )}
                </div>
                <h3 className="text-base font-medium mb-2" style={{ color: "#111" }}>{ghrpCompound.name}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#555" }}>
                  {ghrpCompound.mechanism}
                </p>
                <div
                  className="rounded-sm p-3 text-xs"
                  style={{ backgroundColor: "#F5F5F0", color: "#666", lineHeight: 1.6 }}
                >
                  <strong>Key study:</strong> {ghrpCompound.keyStudy}
                </div>
                {ghrpCompound.notes && (
                  <p className="text-xs mt-2.5" style={{ color: "#666666", lineHeight: 1.5 }}>
                    📋 {ghrpCompound.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {mode === "standalone" && (
            <div
              className="rounded-sm p-5"
              style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest" style={{ color: "#999" }}>
                  Compound Details
                </p>
                {standaloneCompound.slug && (
                  <Link
                    href={`/products/${standaloneCompound.slug}`}
                    className="text-xs"
                    style={{ color: "#B8A44C" }}
                  >
                    View Product →
                  </Link>
                )}
              </div>
              <h3 className="text-base font-medium mb-2" style={{ color: "#111" }}>{standaloneCompound.name}</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#555" }}>
                {standaloneCompound.mechanism}
              </p>
              <div
                className="rounded-sm p-3 text-xs"
                style={{ backgroundColor: "#F5F5F0", color: "#666", lineHeight: 1.6 }}
              >
                <strong>Key studies:</strong> {standaloneCompound.keyStudy}
              </div>
              {standaloneCompound.notes && (
                <p className="text-xs mt-2.5" style={{ color: "#666666", lineHeight: 1.5 }}>
                  📋 {standaloneCompound.notes}
                </p>
              )}
            </div>
          )}

          {/* IGF-1 Reference Table */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#999" }}>
              Published IGF-1 Elevation Reference — All GH Secretagogues
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid #ECEAE4" }}>
                    {["Compound", "Type", "IGF-1 Range", "Duration", "Key Study"].map((h) => (
                      <th
                        key={h}
                        className="text-left pb-2 pr-4 font-medium"
                        style={{ color: "#666" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...GHRH_COMPOUNDS.map(c => ({
                      name: c.name, type: "GHRH Analog",
                      range: formatRange(...c.baseIGF1Pct),
                      duration: "4–12 weeks",
                      study: c.keyStudy.split(":")[0],
                    })),
                    ...STANDALONE_COMPOUNDS.map(c => ({
                      name: c.name, type: "Standalone GHS",
                      range: formatRange(...c.baseIGF1Pct),
                      duration: "8–24 weeks",
                      study: c.keyStudy.split(":")[0],
                    })),
                    { name: "GHRH + Ipamorelin", type: "Stack", range: "65–155%", duration: "8–12 weeks", study: "Bowers 1998; Johansen 1999" },
                    { name: "GHRH + GHRP-2", type: "Stack", range: "80–195%", duration: "4–8 weeks", study: "Arvat 1997" },
                    { name: "GHRH + Hexarelin", type: "Stack", range: "90–220%", duration: "2–4 weeks", study: "Ghigo 1994" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F0EEE8" }}>
                      <td className="py-2 pr-4 font-medium" style={{ color: "#222" }}>{row.name}</td>
                      <td className="py-2 pr-4" style={{ color: "#666" }}>{row.type}</td>
                      <td className="py-2 pr-4 font-medium" style={{ color: "#d4af37" }}>{row.range}</td>
                      <td className="py-2 pr-4" style={{ color: "#666666" }}>{row.duration}</td>
                      <td className="py-2" style={{ color: "#999" }}>{row.study}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-4" style={{ color: "#737373" }}>
              * Stack ranges assume optimal frequency (5–7×/week) and 8–12 week duration.
              Actual results vary by species, sex, age, pituitary reserve, and somatostatin tone.
            </p>
          </div>

          {/* Research Design Notes */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#fff", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#999" }}>
              Research Design Considerations
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Pituitary Reserve",
                  body: "GHRH analogs require intact somatotroph function. Verify baseline GH response before attributing IGF-1 changes to the compound. Use GHRH stimulation test as inclusion criterion.",
                },
                {
                  title: "IGF-1 as Biomarker",
                  body: "IGF-1 has ~18-hour half-life — ideal for monitoring GH axis activity. Measure at consistent time (morning fasted) for reproducible comparisons. ELISA coefficient of variation typically 6–8%.",
                },
                {
                  title: "Somatostatin Tone",
                  body: "Endogenous somatostatin blunts GH pulse amplitude. GHRP co-administration partially overcomes somatostatin inhibition. High-fat diet models may have elevated somatostatin baseline.",
                },
                {
                  title: "Tachyphylaxis",
                  body: "GHRP compounds (especially hexarelin) show significant receptor desensitization. Build washout periods (2–3 weeks) between study arms. Rotate compounds in long-duration protocols.",
                },
                {
                  title: "Sex Differences",
                  body: "Female rodents typically show higher GH pulse frequency but lower amplitude vs males. Estradiol sensitizes GHRHr. Use sex-matched controls and report sex as variable.",
                },
                {
                  title: "Combination Controls",
                  body: "Always include: vehicle control, GHRH analog alone, GHRP alone, and GHRH+GHRP combination. This 2×2 design quantifies additive vs synergistic effects.",
                },
              ].map((note) => (
                <div
                  key={note.title}
                  className="rounded-sm p-4"
                  style={{ backgroundColor: "#F8F8F4", border: "1px solid #ECEAE4" }}
                >
                  <h4 className="text-sm font-medium mb-1.5" style={{ color: "#111" }}>{note.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{note.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "#F8F8F4", border: "1px solid #ECEAE4" }}
          >
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#999" }}>
              Related Tools
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { href: "/tools/stack-builder", label: "Research Stack Builder", desc: "Pre-built GH axis stacks" },
                { href: "/tools/half-life-calculator", label: "Half-Life Calculator", desc: "Clearance & dosing timing" },
                { href: "/tools/dosing-frequency-planner", label: "Dosing Frequency Planner", desc: "Weekly schedule builder" },
              ].map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="block rounded-sm p-4 transition-colors"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ECEAE4",
                    textDecoration: "none",
                  }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: "#111" }}>{t.label}</p>
                  <p className="text-xs" style={{ color: "#666666" }}>{t.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-sm p-5"
            style={{
              backgroundColor: "rgba(1,1,1,0.04)",
              border: "1px solid #E0DED8",
            }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "#666666" }}>
              <strong style={{ color: "#555" }}>Research Use Only Disclaimer:</strong>{" "}
              All estimates in this tool are derived from published preclinical and clinical pharmacology
              studies and represent population-level ranges, not individual predictions. IGF-1 response
              is influenced by species, age, sex, baseline pituitary function, diet, exercise, and
              concomitant compounds. This tool is intended solely as a reference for qualified
              researchers designing study protocols. It does not constitute medical advice and should
              not be used to guide human self-administration decisions.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
