"use client";

import { useState } from "react";
import PprToolHero from "@/components/tools/PprToolHero";
import PprToolFooter from "@/components/tools/PprToolFooter";

export default function DoseConverterPage() {
  return (
    <div style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      <PprToolHero
        eyebrow="Dose converter"
        title="Dose converter."
        sub="Four independent converters for the units that come up at the bench: mass, international units, syringe volume, and body-weight dosing."
      />

      <div className="mx-auto max-w-[760px] px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <McgMgConverter />
          <IuMgConverter />
          <MlUnitsConverter />
          <MgPerKgConverter />
        </div>
      </div>

      <PprToolFooter />
    </div>
  );
}

function CalcCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-lg p-6"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <h2
        style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--platinum)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
      >
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="rounded-md px-3 py-2 text-[15px] focus:outline-none focus-visible:ring-2"
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

function Output({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="mt-1 rounded-md p-4" style={{ backgroundColor: "var(--ink-3)" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 32,
          fontWeight: 600,
          color: "var(--accent)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
      <span className="ml-2 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
        {unit}
      </span>
    </div>
  );
}

function fmt(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits).replace(/\.?0+$/, "") || "0";
}

/** mcg ↔ mg. */
function McgMgConverter() {
  const [mcg, setMcg] = useState(500);
  return (
    <CalcCard title="mcg → mg">
      <Field label="Micrograms (mcg)" value={mcg} step={50} onChange={setMcg} />
      <Output value={fmt(mcg / 1000)} unit="mg" />
    </CalcCard>
  );
}

/** IU ↔ mg, using a user-supplied IU-per-mg potency factor. */
function IuMgConverter() {
  const [iu, setIu] = useState(10);
  const [iuPerMg, setIuPerMg] = useState(3);
  return (
    <CalcCard title="IU → mg">
      <Field label="International units (IU)" value={iu} onChange={setIu} />
      <Field label="Potency (IU per mg)" value={iuPerMg} step={0.1} onChange={setIuPerMg} />
      <Output value={fmt(iuPerMg > 0 ? iu / iuPerMg : NaN)} unit="mg" />
    </CalcCard>
  );
}

/** mL ↔ U-100 syringe units. */
function MlUnitsConverter() {
  const [ml, setMl] = useState(0.25);
  return (
    <CalcCard title="mL → U-100 units">
      <Field label="Volume (mL)" value={ml} step={0.05} onChange={setMl} />
      <Output value={fmt(ml * 100, 1)} unit="units" />
    </CalcCard>
  );
}

/** mg/kg dosing: subject weight + dose per kg → total mg. */
function MgPerKgConverter() {
  const [weightKg, setWeightKg] = useState(75);
  const [dosePerKg, setDosePerKg] = useState(0.1);
  return (
    <CalcCard title="mg/kg → total mg">
      <Field label="Subject weight (kg)" value={weightKg} onChange={setWeightKg} />
      <Field label="Dose (mg per kg)" value={dosePerKg} step={0.01} onChange={setDosePerKg} />
      <Output value={fmt(weightKg * dosePerKg)} unit="mg total" />
    </CalcCard>
  );
}
