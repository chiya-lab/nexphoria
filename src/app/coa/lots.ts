/**
 * Mock COA lot dataset for the public /coa lookup tool.
 *
 * Three released lots are published. Any other lot number resolves to a
 * not-found state. Values are illustrative reference data, not live QC records.
 */

export interface MassSpecRow {
  species: string;
  observed: string;
  expected: string;
  delta: string;
}

export interface TestResult {
  label: string;
  method: string;
  value: string;
  spec: string;
  pass: boolean;
}

export interface ChromatogramPeak {
  /** Retention time in minutes. */
  rt: number;
  /** Relative peak height, 0–1 (visual only). */
  height: number;
  /** Area percent. */
  areaPct: number;
  identity: string;
}

export interface CustodyStep {
  label: string;
  date: string;
}

export interface CoaLot {
  lot: string;
  compound: string;
  sequenceMw: string;
  manufactured: string;
  released: string;
  qcInitials: string;
  purityPct: number;
  results: TestResult[];
  massSpec: MassSpecRow[];
  chromatogram: ChromatogramPeak[];
  custody: CustodyStep[];
}

const NX_241_A: CoaLot = {
  lot: "NX-241-A",
  compound: "BPC-157",
  sequenceMw: "1419.5 g/mol",
  manufactured: "2026-01-12",
  released: "2026-02-22",
  qcInitials: "AB",
  purityPct: 99.4,
  results: [
    { label: "HPLC purity", method: "RP-HPLC, UV 214 nm", value: "99.4%", spec: "≥ 98%", pass: true },
    {
      label: "Mass spectrometry",
      method: "ESI-MS",
      value: "[M+H]⁺ 1420.5 Da observed (expected 1419.5, Δ 1.0, within 5 ppm)",
      spec: "Within 5 ppm",
      pass: true,
    },
    { label: "Water content", method: "Karl Fischer", value: "1.8%", spec: "< 5%", pass: true },
    { label: "Acetate", method: "Ion chromatography", value: "4.2%", spec: "≤ 5%", pass: true },
    { label: "Microbial", method: "Plate count", value: "< 10 CFU/g", spec: "< 100 CFU/g", pass: true },
    { label: "Endotoxin", method: "LAL (kinetic)", value: "0.12 EU/mg", spec: "< 0.5 EU/mg", pass: true },
  ],
  massSpec: [
    { species: "[M+H]⁺", observed: "1420.5", expected: "1419.5", delta: "1.0" },
    { species: "[M+2H]²⁺", observed: "710.8", expected: "710.3", delta: "0.5" },
    { species: "[M+3H]³⁺", observed: "474.2", expected: "473.8", delta: "0.4" },
    { species: "[M+Na]⁺", observed: "1442.5", expected: "1441.5", delta: "1.0" },
    { species: "[M+H−H₂O]⁺", observed: "1402.5", expected: "1401.5", delta: "1.0" },
  ],
  chromatogram: [
    { rt: 3.2, height: 0.06, areaPct: 0.22, identity: "Solvent front" },
    { rt: 9.7, height: 0.1, areaPct: 0.38, identity: "Related substance" },
    { rt: 14.6, height: 0.97, areaPct: 99.4, identity: "Target compound" },
    { rt: 22.1, height: 0.05, areaPct: 0.0, identity: "Baseline" },
  ],
  custody: [
    { label: "Synthesized", date: "2026-01-12" },
    { label: "QC tested", date: "2026-02-18" },
    { label: "Released", date: "2026-02-22" },
    { label: "Shipped to 3PL", date: "2026-02-24" },
  ],
};

const NX_240_C: CoaLot = {
  lot: "NX-240-C",
  compound: "TB-500 (Thymosin β4 frag.)",
  sequenceMw: "889.0 g/mol",
  manufactured: "2025-12-04",
  released: "2026-01-16",
  qcInitials: "RK",
  purityPct: 98.9,
  results: [
    { label: "HPLC purity", method: "RP-HPLC, UV 214 nm", value: "98.9%", spec: "≥ 98%", pass: true },
    {
      label: "Mass spectrometry",
      method: "ESI-MS",
      value: "[M+H]⁺ 890.1 Da observed (expected 890.0, Δ 0.1, within 5 ppm)",
      spec: "Within 5 ppm",
      pass: true,
    },
    { label: "Water content", method: "Karl Fischer", value: "2.4%", spec: "< 5%", pass: true },
    { label: "Acetate", method: "Ion chromatography", value: "3.7%", spec: "≤ 5%", pass: true },
    { label: "Microbial", method: "Plate count", value: "< 10 CFU/g", spec: "< 100 CFU/g", pass: true },
    { label: "Endotoxin", method: "LAL (kinetic)", value: "0.21 EU/mg", spec: "< 0.5 EU/mg", pass: true },
  ],
  massSpec: [
    { species: "[M+H]⁺", observed: "890.1", expected: "890.0", delta: "0.1" },
    { species: "[M+2H]²⁺", observed: "445.6", expected: "445.5", delta: "0.1" },
    { species: "[M+Na]⁺", observed: "912.1", expected: "912.0", delta: "0.1" },
    { species: "[M+K]⁺", observed: "928.1", expected: "928.0", delta: "0.1" },
    { species: "[M+H−H₂O]⁺", observed: "872.1", expected: "872.0", delta: "0.1" },
  ],
  chromatogram: [
    { rt: 3.0, height: 0.07, areaPct: 0.3, identity: "Solvent front" },
    { rt: 8.4, height: 0.13, areaPct: 0.6, identity: "Related substance" },
    { rt: 12.9, height: 0.95, areaPct: 98.9, identity: "Target compound" },
    { rt: 19.8, height: 0.05, areaPct: 0.2, identity: "Late-eluting impurity" },
  ],
  custody: [
    { label: "Synthesized", date: "2025-12-04" },
    { label: "QC tested", date: "2026-01-11" },
    { label: "Released", date: "2026-01-16" },
    { label: "Shipped to 3PL", date: "2026-01-19" },
  ],
};

const NX_239_B: CoaLot = {
  lot: "NX-239-B",
  compound: "GHK-Cu",
  sequenceMw: "402.9 g/mol",
  manufactured: "2025-11-09",
  released: "2025-12-15",
  qcInitials: "AB",
  purityPct: 99.7,
  results: [
    { label: "HPLC purity", method: "RP-HPLC, UV 214 nm", value: "99.7%", spec: "≥ 98%", pass: true },
    {
      label: "Mass spectrometry",
      method: "ESI-MS",
      value: "[M+H]⁺ 403.9 Da observed (expected 403.9, Δ 0.0, within 5 ppm)",
      spec: "Within 5 ppm",
      pass: true,
    },
    { label: "Water content", method: "Karl Fischer", value: "1.1%", spec: "< 5%", pass: true },
    { label: "Acetate", method: "Ion chromatography", value: "2.9%", spec: "≤ 5%", pass: true },
    { label: "Microbial", method: "Plate count", value: "< 10 CFU/g", spec: "< 100 CFU/g", pass: true },
    { label: "Endotoxin", method: "LAL (kinetic)", value: "0.08 EU/mg", spec: "< 0.5 EU/mg", pass: true },
  ],
  massSpec: [
    { species: "[M+H]⁺", observed: "403.9", expected: "403.9", delta: "0.0" },
    { species: "[M+2H]²⁺", observed: "202.5", expected: "202.5", delta: "0.0" },
    { species: "[M+Na]⁺", observed: "425.9", expected: "425.9", delta: "0.0" },
    { species: "[M−Cu+2H]⁺", observed: "341.4", expected: "341.4", delta: "0.0" },
    { species: "[M+H−H₂O]⁺", observed: "385.9", expected: "385.9", delta: "0.0" },
  ],
  chromatogram: [
    { rt: 2.8, height: 0.05, areaPct: 0.15, identity: "Solvent front" },
    { rt: 7.1, height: 0.08, areaPct: 0.15, identity: "Related substance" },
    { rt: 11.4, height: 0.99, areaPct: 99.7, identity: "Target compound" },
    { rt: 18.5, height: 0.04, areaPct: 0.0, identity: "Baseline" },
  ],
  custody: [
    { label: "Synthesized", date: "2025-11-09" },
    { label: "QC tested", date: "2025-12-10" },
    { label: "Released", date: "2025-12-15" },
    { label: "Shipped to 3PL", date: "2025-12-18" },
  ],
};

const LOTS: Record<string, CoaLot> = {
  "NX-241-A": NX_241_A,
  "NX-240-C": NX_240_C,
  "NX-239-B": NX_239_B,
};

export const SAMPLE_LOT_NUMBERS = Object.keys(LOTS);

export function lookupLot(input: string): CoaLot | null {
  const key = input.trim().toUpperCase();
  return LOTS[key] ?? null;
}
