"use client";

import { useMemo, useState } from "react";
import PprToolHero from "@/components/tools/PprToolHero";
import PprToolFooter from "@/components/tools/PprToolFooter";

interface Preset {
  label: string;
  vialMg: number;
  bacMl: number;
  doseMcg: number;
}

const PRESETS: Preset[] = [
  { label: "BPC-157 5mg", vialMg: 5, bacMl: 2, doseMcg: 250 },
  { label: "TB-500 5mg", vialMg: 5, bacMl: 2, doseMcg: 500 },
  { label: "Semaglutide 5mg", vialMg: 5, bacMl: 2, doseMcg: 250 },
  { label: "GHK-Cu 50mg", vialMg: 50, bacMl: 5, doseMcg: 2000 },
];

const STEPS = [
  {
    n: "01",
    title: "Clean the vial cap",
    body: "Wipe the rubber stopper of both the peptide and bacteriostatic water vials with a fresh alcohol swab. Let it dry.",
  },
  {
    n: "02",
    title: "Draw the bac water",
    body: "Using a sterile syringe, draw the calculated volume of bacteriostatic water. Expel air bubbles before transferring.",
  },
  {
    n: "03",
    title: "Inject down the sidewall",
    body: "Angle the needle so the water runs slowly down the inner glass wall onto the lyophilized powder — not directly onto the pellet.",
  },
  {
    n: "04",
    title: "Swirl, never shake",
    body: "Gently swirl until fully dissolved. Shaking shears peptide bonds and denatures the compound. Store reconstituted vials at 2–8 °C.",
  },
];

export default function ReconstitutionPage() {
  const [vialMg, setVialMg] = useState(5);
  const [bacMl, setBacMl] = useState(2);
  const [doseMcg, setDoseMcg] = useState(250);

  const results = useMemo(() => {
    const concMgPerMl = bacMl > 0 ? vialMg / bacMl : 0; // mg/mL
    const doseMg = doseMcg / 1000;
    const volPerDoseMl = concMgPerMl > 0 ? doseMg / concMgPerMl : 0; // mL
    const units = volPerDoseMl * 100; // U-100 syringe: 1 mL = 100 units
    const dosesPerVial = doseMg > 0 ? vialMg / doseMg : 0;
    return { concMgPerMl, volPerDoseMl, units, dosesPerVial };
  }, [vialMg, bacMl, doseMcg]);

  const applyPreset = (p: Preset) => {
    setVialMg(p.vialMg);
    setBacMl(p.bacMl);
    setDoseMcg(p.doseMcg);
  };

  return (
    <div style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      <PprToolHero
        eyebrow="Reconstitution calculator"
        title="Reconstitution calculator."
        sub="Enter the vial mass, the bacteriostatic water you plan to add, and your target dose. Returns concentration, draw volume, syringe units, and doses per vial."
      />

      <div className="mx-auto max-w-[760px] px-6">
        {/* Presets */}
        <div className="mb-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-full px-4 py-1.5 text-[13px] transition-colors hover:border-[color:var(--accent)]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--silver-1)",
                border: "1px solid var(--steel)",
                backgroundColor: "var(--ink-2)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div
          className="grid grid-cols-1 gap-6 rounded-lg p-7 md:grid-cols-2"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <div className="flex flex-col gap-5">
            <NumberField label="Vial mass (mg)" value={vialMg} min={0} step={0.5} onChange={setVialMg} />
            <NumberField label="Bacteriostatic water (mL)" value={bacMl} min={0} step={0.5} onChange={setBacMl} />
            <NumberField label="Desired dose (mcg)" value={doseMcg} min={0} step={50} onChange={setDoseMcg} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultStat label="Concentration" value={results.concMgPerMl} unit="mg/mL" digits={2} />
            <ResultStat label="Volume / dose" value={results.volPerDoseMl} unit="mL" digits={3} />
            <ResultStat label="U-100 units" value={results.units} unit="units" digits={1} />
            <ResultStat label="Doses / vial" value={results.dosesPerVial} unit="doses" digits={1} />
          </div>
        </div>

        <p
          className="mt-4 text-[12px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)", lineHeight: 1.6 }}
        >
          For research use only (RUO). Not for human or veterinary use. Figures are calculated estimates;
          verify all dosing math independently against your study protocol.
        </p>

        {/* Explainer */}
        <h2
          className="mt-16"
          style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
        >
          How to reconstitute peptides
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-lg p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span
                className="text-[13px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.1em" }}
              >
                {s.n}
              </span>
              <h3
                className="mt-2"
                style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--platinum)" }}
              >
                {s.title}
              </h3>
              <p
                className="mt-2 text-[14px]"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <PprToolFooter />
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span
        className="text-[12px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
      >
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="rounded-md px-3 py-2.5 text-[16px] focus:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: "var(--ink)",
          border: "1px solid var(--steel)",
          color: "var(--platinum)",
          fontFamily: "var(--font-mono)",
        }}
      />
    </label>
  );
}

function ResultStat({
  label,
  value,
  unit,
  digits,
}: {
  label: string;
  value: number;
  unit: string;
  digits: number;
}) {
  const display = Number.isFinite(value) ? value.toFixed(digits) : "—";
  return (
    <div
      className="flex flex-col justify-center rounded-md p-4"
      style={{ backgroundColor: "var(--ink-3)" }}
    >
      <span
        className="text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-3)" }}
      >
        {label}
      </span>
      <span
        className="mt-1"
        style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--accent)", lineHeight: 1.1 }}
      >
        {display}
      </span>
      <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
        {unit}
      </span>
    </div>
  );
}
