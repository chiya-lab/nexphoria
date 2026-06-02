"use client";

import { useMemo, useState } from "react";

type Preset = { label: string; vialMg: number; bacMl: number; doseUg: number };

const PRESETS: Preset[] = [
  { label: "Standard BPC-157 (250µg)", vialMg: 5, bacMl: 2, doseUg: 250 },
  { label: "TB-500 (2mg)", vialMg: 10, bacMl: 3, doseUg: 2000 },
  { label: "GHK-Cu (1mg)", vialMg: 50, bacMl: 5, doseUg: 1000 },
];

function parsePositive(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function PprReconCalculator() {
  const [vialMg, setVialMg] = useState("5");
  const [bacMl, setBacMl] = useState("2");
  const [doseUg, setDoseUg] = useState("250");

  const v = parsePositive(vialMg);
  const w = parsePositive(bacMl);
  const d = parsePositive(doseUg);
  const valid = v > 0 && w > 0 && d > 0;

  const result = useMemo(() => {
    if (!valid) return null;
    const concMgMl = v / w; // mg/mL
    const concUgMl = concMgMl * 1000; // µg/mL
    const volMl = d / concUgMl; // mL per dose
    const units = volMl * 100; // U-100 syringe units
    const dosesPerVial = (v * 1000) / d;
    return { concMgMl, volMl, units, dosesPerVial };
  }, [v, w, d, valid]);

  const warnings: string[] = [];
  if (result) {
    if (result.volMl < 0.05) warnings.push("Draw volume below 0.05 mL — hard to measure accurately on a U-100 syringe. Consider more BAC water.");
    if (result.volMl > 1) warnings.push("Draw volume above 1 mL exceeds a standard U-100 syringe. Consider less BAC water or split the dose.");
  }

  const mono = { fontFamily: "var(--font-mono)" } as const;
  const body = { fontFamily: "var(--font-body)" } as const;

  const applyPreset = (p: Preset) => {
    setVialMg(String(p.vialMg));
    setBacMl(String(p.bacMl));
    setDoseUg(String(p.doseUg));
  };

  const fields: { label: string; unit: string; value: string; set: (s: string) => void }[] = [
    { label: "Vial amount", unit: "mg", value: vialMg, set: setVialMg },
    { label: "BAC water", unit: "mL", value: bacMl, set: setBacMl },
    { label: "Desired dose", unit: "µg", value: doseUg, set: setDoseUg },
  ];

  const outputs = result
    ? [
        { label: "Volume per dose", value: `${result.volMl.toFixed(3)} mL` },
        { label: "U-100 syringe units", value: `${result.units.toFixed(1)} U` },
        { label: "Doses per vial", value: `${result.dosesPerVial.toFixed(1)}` },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      {/* Inputs */}
      <div
        className="flex flex-col gap-5 rounded-lg px-5 py-5"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <h3 className="text-[13px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
          Reconstitution inputs
        </h3>

        {fields.map((f) => {
          const invalid = parsePositive(f.value) === 0;
          return (
            <label key={f.label} className="flex flex-col gap-1.5">
              <span className="text-[12px]" style={{ ...body, color: "var(--silver-1)" }}>
                {f.label} <span style={{ color: "var(--silver-2)" }}>({f.unit})</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="rounded-md px-3 py-2 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  ...mono,
                  backgroundColor: "var(--ink)",
                  color: "var(--platinum)",
                  border: `1px solid ${invalid ? "var(--danger)" : "var(--steel)"}`,
                }}
              />
            </label>
          );
        })}

        {!valid && (
          <p className="text-[12px]" style={{ ...mono, color: "var(--danger)" }}>
            Enter positive numbers for all three fields.
          </p>
        )}

        {/* Presets */}
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-[11px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
            Presets
          </span>
          <div className="flex flex-col gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:border-[var(--silver-2)] focus:outline-none focus-visible:ring-2"
                style={{ ...body, backgroundColor: "var(--ink)", color: "var(--silver-1)", border: "1px solid var(--steel)" }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Outputs */}
      <div className="flex flex-col gap-5">
        <div
          className="flex flex-col gap-2 rounded-lg px-6 py-6"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <span className="text-[12px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
            Concentration
          </span>
          <div className="text-[32px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
            {result ? `${result.concMgMl.toFixed(2)} mg/mL` : "—"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {outputs.length > 0
            ? outputs.map((o) => (
                <div
                  key={o.label}
                  className="flex flex-col gap-1.5 rounded-lg px-4 py-4"
                  style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
                >
                  <span className="text-[11px] uppercase" style={{ ...mono, letterSpacing: "0.06em", color: "var(--silver-2)" }}>
                    {o.label}
                  </span>
                  <span className="text-[18px]" style={{ ...mono, color: "var(--platinum)" }}>
                    {o.value}
                  </span>
                </div>
              ))
            : null}
        </div>

        {warnings.map((msg) => (
          <p
            key={msg}
            className="rounded-md px-4 py-3 text-[13px]"
            style={{
              ...body,
              color: "var(--warn)",
              backgroundColor: "color-mix(in srgb, var(--warn) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--warn) 35%, transparent)",
            }}
          >
            {msg}
          </p>
        ))}

        <p className="text-[11px]" style={{ ...mono, color: "var(--silver-2)" }}>
          For research calculation only. Not medical guidance.
        </p>
      </div>
    </div>
  );
}
