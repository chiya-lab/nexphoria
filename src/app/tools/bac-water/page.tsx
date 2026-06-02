"use client";

import { useMemo, useState } from "react";
import PprToolHero from "@/components/tools/PprToolHero";
import PprToolFooter from "@/components/tools/PprToolFooter";

const BOTTLE_ML = 30; // standard bacteriostatic water bottle size

export default function BacWaterPage() {
  const [vials, setVials] = useState(3);
  const [mgPerVial, setMgPerVial] = useState(5);
  const [doseMcg, setDoseMcg] = useState(250);
  const [dosesPerDay, setDosesPerDay] = useState(1);
  const [days, setDays] = useState(30);

  const results = useMemo(() => {
    const totalMgAvailable = vials * mgPerVial;
    const dailyMg = (doseMcg / 1000) * dosesPerDay;
    const protocolMg = dailyMg * days;
    // Reconstitute to a 1 mg/mL working concentration: 1 mL of bac water per mg of peptide.
    const totalMlAt1 = totalMgAvailable;
    const bottlesNeeded = Math.ceil(totalMlAt1 / BOTTLE_ML);
    return { totalMgAvailable, protocolMg, totalMlAt1, bottlesNeeded };
  }, [vials, mgPerVial, doseMcg, dosesPerDay, days]);

  return (
    <div style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      <PprToolHero
        eyebrow="Bac-water calculator"
        title="Bacteriostatic water calculator."
        sub="Size the bacteriostatic water for a full protocol. Returns the total compound mass, the bac water needed at a 1 mg/mL working concentration, and how many 30 mL bottles to order."
      />

      <div className="mx-auto max-w-[760px] px-6">
        <div
          className="grid grid-cols-1 gap-6 rounded-lg p-7 md:grid-cols-2"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <div className="flex flex-col gap-5">
            <Field label="Total vials" value={vials} step={1} min={1} onChange={setVials} />
            <Field label="mg per vial" value={mgPerVial} step={0.5} min={0} onChange={setMgPerVial} />
            <Field label="Dose (mcg)" value={doseMcg} step={50} min={0} onChange={setDoseMcg} />
            <Field label="Doses per day" value={dosesPerDay} step={1} min={0} onChange={setDosesPerDay} />
            <Field label="Days of protocol" value={days} step={1} min={0} onChange={setDays} />
          </div>

          <div className="flex flex-col gap-4">
            <Stat label="Total compound mass" value={`${fmt(results.totalMgAvailable)} mg`} />
            <Stat label="Dosed over protocol" value={`${fmt(results.protocolMg)} mg`} />
            <Stat label="Bac water at 1 mg/mL" value={`${fmt(results.totalMlAt1)} mL`} highlight />
            <Stat label={`${BOTTLE_ML} mL bottles to order`} value={`${results.bottlesNeeded}`} highlight />
          </div>
        </div>

        {results.protocolMg > results.totalMgAvailable && (
          <p
            className="mt-4 rounded-md p-3 text-[13px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--warn)",
              border: "1px solid var(--steel)",
              backgroundColor: "var(--ink-2)",
            }}
          >
            Note: the protocol requires {fmt(results.protocolMg)} mg but only {fmt(results.totalMgAvailable)} mg
            is on hand across {vials} vial(s). Order additional vials to complete the protocol.
          </p>
        )}

        {/* Add bac water CTA */}
        <div
          className="mt-6 flex flex-col items-start gap-4 rounded-lg p-6 md:flex-row md:items-center md:justify-between"
          style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--steel)" }}
        >
          <div>
            <p
              style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--platinum)" }}
            >
              Need {results.bottlesNeeded} &times; {BOTTLE_ML} mL bacteriostatic water?
            </p>
            <p className="mt-1 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
              Add it to your order from the accessories shelf.
            </p>
          </div>
          <a
            href="/products?category=accessories"
            className="inline-flex flex-shrink-0 items-center justify-center rounded-md px-5 text-[14px] font-semibold transition-opacity hover:opacity-90"
            style={{ height: 46, backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
          >
            Add bac water to cart &rarr;
          </a>
        </div>

        <p
          className="mt-4 text-[12px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)", lineHeight: 1.6 }}
        >
          Bac water volume is computed for a 1 mg/mL working concentration; adjust if your protocol targets a
          different concentration. For research use only (RUO).
        </p>
      </div>

      <PprToolFooter />
    </div>
  );
}

function Field({
  label,
  value,
  step,
  min,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
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

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md p-4" style={{ backgroundColor: "var(--ink-3)" }}>
      <span
        className="text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-3)" }}
      >
        {label}
      </span>
      <p
        className="mt-1"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 600,
          color: highlight ? "var(--accent)" : "var(--platinum)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return (Math.round(n * 100) / 100).toString();
}
