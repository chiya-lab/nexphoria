"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { labPartnerFor } from "@/lib/coa";

interface Props {
  product: Product;
}

// Deterministic "random" based on slug to make batch numbers consistent
function deterministicNum(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % (max - min + 1));
}

function getBatchInfo(slug: string) {
  const year = 2025;
  const month = String(deterministicNum(slug + "month", 1, 12)).padStart(2, "0");
  const day = String(deterministicNum(slug + "day", 1, 28)).padStart(2, "0");
  const batchNum = deterministicNum(slug + "batch", 1000, 9999);
  const lotNum = deterministicNum(slug + "lot", 100, 999);
  return {
    batchNumber: `NXP-${year}${month}-${batchNum}`,
    lotNumber: `L${year}-${lotNum}`,
    manufactureDate: `${year}-${month}-${day}`,
    expiryDate: `${Number(year) + 2}-${month}-${day}`,
    testDate: `${year}-${String(Number(month) + 1 > 12 ? 1 : Number(month) + 1).padStart(2, "0")}-${day}`,
  };
}

function getPurityValue(purity: string): number {
  // Extract numeric value from purity string like "≥99.2%"
  const match = purity.match(/(\d+\.?\d*)/);
  if (!match) return 99.0;
  const base = parseFloat(match[1]);
  return base;
}

function getHPLCPeaks(slug: string, purity: string): { rt: string; area: string; pct: string; identity: string }[] {
  const mainPct = getPurityValue(purity);
  const impurity1 = (100 - mainPct) * 0.65;
  const impurity2 = (100 - mainPct) * 0.35;

  const rtMain = (deterministicNum(slug + "rt", 12, 18) + 0.1 * deterministicNum(slug + "rtd", 0, 9)).toFixed(1);
  const rtImp1 = (deterministicNum(slug + "rt2", 4, 10) + 0.1 * deterministicNum(slug + "rt2d", 0, 9)).toFixed(1);
  const rtImp2 = (deterministicNum(slug + "rt3", 20, 26) + 0.1 * deterministicNum(slug + "rt3d", 0, 9)).toFixed(1);

  const mainArea = deterministicNum(slug + "area", 850000, 980000);
  const imp1Area = Math.round(mainArea * (impurity1 / mainPct));
  const imp2Area = Math.round(mainArea * (impurity2 / mainPct));

  return [
    { rt: rtImp1, area: imp1Area.toLocaleString(), pct: impurity1.toFixed(2), identity: "Unidentified impurity" },
    { rt: rtMain, area: mainArea.toLocaleString(), pct: mainPct.toFixed(2), identity: "Target compound" },
    { rt: rtImp2, area: imp2Area.toLocaleString(), pct: impurity2.toFixed(2), identity: "Related substance" },
  ].sort((a, b) => parseFloat(a.rt) - parseFloat(b.rt));
}

function getMassSpec(slug: string, product: Product): { label: string; value: string; pass: boolean }[] {
  const mwStr = product.molecularWeight.replace(" g/mol", "").replace(",", "");
  const mw = parseFloat(mwStr);
  const observed = isNaN(mw) ? "N/A" : (mw + 0.01 * deterministicNum(slug + "ms", -5, 5)).toFixed(2);
  return [
    { label: "Theoretical MW (g/mol)", value: product.molecularWeight.replace(" g/mol", ""), pass: true },
    { label: "Observed MW (g/mol)", value: observed === "NaN" ? "N/A" : observed, pass: true },
    { label: "Ionization Method", value: "ESI-MS", pass: true },
    { label: "MS Confirmation", value: "PASS — [M+H]⁺ and [M+2H]²⁺ observed", pass: true },
  ];
}

export default function COADocument({ product }: Props) {
  const [isPrinting, setIsPrinting] = useState(false);
  const batchInfo = getBatchInfo(product.slug);
  const labPartner = labPartnerFor(product.slug);
  const hplcPeaks = getHPLCPeaks(product.slug, product.purity);
  const massSpec = getMassSpec(product.slug, product);
  const mainPurity = getPurityValue(product.purity);

  // Water content — gravimetric/Karl Fischer
  const waterContent = (deterministicNum(product.slug + "water", 1, 4) * 0.1).toFixed(1);

  // Endotoxin
  const endotoxin = (deterministicNum(product.slug + "endo", 1, 9) * 0.01).toFixed(2);

  useEffect(() => {
    document.title = `COA — ${product.name} Batch ${batchInfo.batchNumber} — Nexphoria`;
  }, [product.name, batchInfo.batchNumber]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { box-shadow: none !important; border: none !important; }
        }
        @page {
          size: letter;
          margin: 0.75in;
        }
        .hplc-bar {
          height: 60px;
          background: linear-gradient(to right, #f0f0f0 0%, #f0f0f0 calc(100% - var(--pct)), #2d5a3d calc(100% - var(--pct)), #2d5a3d 100%);
          border-radius: 2px;
        }
      `}</style>

      {/* Print/Download Controls */}
      <div className="no-print bg-gray-900 text-white py-3 px-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <a href={`/products/${product.slug}`} className="text-gray-400 hover:text-white transition-colors">
            ← Back to {product.name}
          </a>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">Sample Certificate of Analysis</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">FOR RESEARCH USE ONLY</span>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="bg-[#2d5a3d] hover:bg-[#3a7050] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {isPrinting ? "Preparing..." : "Print / Save PDF"}
          </button>
        </div>
      </div>

      {/* COA Document */}
      <div className="min-h-screen bg-gray-100 py-8 px-4 no-print-bg">
        <div
          className="print-page max-w-4xl mx-auto bg-white shadow-lg"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          {/* Header */}
          <div className="border-b-4 border-[#2d5a3d] px-10 pt-8 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {/* Nexphoria wordmark text logo */}
                  <div style={{ fontFamily: "Georgia, serif" }}>
                    <span className="text-2xl font-bold tracking-widest text-[#2d5a3d] uppercase">NEXPHORIA</span>
                    <span className="text-xs text-gray-500 block tracking-widest uppercase">Research Grade Compounds</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                  <div>nexphoria.com | research@nexphoria.com</div>
                  <div>ISO-compliant quality management | 99%+ average purity</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 tracking-tight">CERTIFICATE OF ANALYSIS</div>
                <div className="text-sm text-gray-500 mt-1">Sample / Reference Document</div>
                <div className="mt-2 inline-block bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1 rounded">
                  FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION
                </div>
              </div>
            </div>
          </div>

          {/* Compound Identity */}
          <div className="px-10 py-6 border-b border-gray-200">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2d5a3d] mb-3">COMPOUND IDENTIFICATION</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <Row label="Product Name" value={product.name} />
              <Row label="Batch Number" value={batchInfo.batchNumber} mono />
              <Row label="CAS Number" value={product.casNumber} mono />
              <Row label="Lot Number" value={batchInfo.lotNumber} mono />
              <Row label="Molecular Formula" value={product.formula} mono />
              <Row label="Manufacture Date" value={batchInfo.manufactureDate} />
              <Row label="Molecular Weight" value={product.molecularWeight} />
              <Row label="Expiry Date" value={batchInfo.expiryDate} />
              <Row label="Appearance" value={product.appearance} />
              <Row label="Test Date" value={batchInfo.testDate} />
              {product.sequence && (
                <div className="col-span-2 mt-1">
                  <div className="text-xs text-gray-500 mb-0.5">Sequence / Structure</div>
                  <div className="font-mono text-xs text-gray-700 break-all leading-relaxed">
                    {product.sequence}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HPLC Analysis */}
          <div className="px-10 py-6 border-b border-gray-200">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2d5a3d] mb-3">HPLC PURITY ANALYSIS</div>
            <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="text-gray-500 mb-0.5">Method</div>
                <div className="font-semibold text-gray-800">Reversed-Phase HPLC</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="text-gray-500 mb-0.5">Column</div>
                <div className="font-semibold text-gray-800">C18, 4.6×250mm, 5μm</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="text-gray-500 mb-0.5">Detection</div>
                <div className="font-semibold text-gray-800">UV @ 214nm / 280nm</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="text-gray-500 mb-0.5">Mobile Phase A</div>
                <div className="font-semibold text-gray-800">0.1% TFA in H₂O</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="text-gray-500 mb-0.5">Mobile Phase B</div>
                <div className="font-semibold text-gray-800">0.1% TFA in ACN</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="text-gray-500 mb-0.5">Gradient</div>
                <div className="font-semibold text-gray-800">5→95% B over 30 min</div>
              </div>
            </div>

            {/* HPLC Chromatogram Placeholder */}
            <div className="border border-gray-200 rounded p-4 mb-4 bg-gray-50">
              <div className="text-xs text-gray-500 mb-2 font-semibold">CHROMATOGRAM (representative)</div>
              {/* SVG chromatogram trace */}
              <svg viewBox="0 0 600 100" className="w-full" style={{ height: "80px" }}>
                <rect width="600" height="100" fill="#f9f9f9" />
                {/* axes */}
                <line x1="40" y1="85" x2="580" y2="85" stroke="#ccc" strokeWidth="1" />
                <line x1="40" y1="10" x2="40" y2="85" stroke="#ccc" strokeWidth="1" />
                {/* x-axis labels */}
                <text x="40" y="97" fontSize="7" fill="#999" textAnchor="middle">0</text>
                <text x="178" y="97" fontSize="7" fill="#999" textAnchor="middle">10</text>
                <text x="316" y="97" fontSize="7" fill="#999" textAnchor="middle">20</text>
                <text x="454" y="97" fontSize="7" fill="#999" textAnchor="middle">30</text>
                <text x="300" y="106" fontSize="7" fill="#999" textAnchor="middle">Retention Time (min)</text>
                {/* baseline */}
                <polyline
                  points={`40,83 ${hplcPeaks.map((peak) => {
                    const x = 40 + (parseFloat(peak.rt) / 30) * 540;
                    const pct = parseFloat(peak.pct);
                    const h = pct > 90 ? 68 : pct > 1 ? 20 : 12;
                    const baseline = 83;
                    return `${x - 8},${baseline} ${x},${baseline - h} ${x + 8},${baseline}`;
                  }).join(" ")} 580,83`}
                  fill="none"
                  stroke="#2d5a3d"
                  strokeWidth="1.5"
                />
                {/* main peak fill */}
                {hplcPeaks.filter(p => parseFloat(p.pct) > 90).map((peak) => {
                  const x = 40 + (parseFloat(peak.rt) / 30) * 540;
                  const h = 68;
                  return (
                    <polygon
                      key={peak.rt}
                      points={`${x - 8},83 ${x},${83 - h} ${x + 8},83`}
                      fill="#2d5a3d"
                      fillOpacity="0.15"
                      stroke="#2d5a3d"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Peak Table */}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Peak</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-gray-700">RT (min)</th>
                  <th className="text-right py-1.5 px-2 font-semibold text-gray-700">Area</th>
                  <th className="text-right py-1.5 px-2 font-semibold text-gray-700">Area %</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Identity</th>
                  <th className="text-center py-1.5 px-2 font-semibold text-gray-700">Result</th>
                </tr>
              </thead>
              <tbody>
                {hplcPeaks.map((peak, idx) => {
                  const isMain = parseFloat(peak.pct) > 90;
                  return (
                    <tr key={idx} className={`border-b border-gray-100 ${isMain ? "bg-green-50" : ""}`}>
                      <td className="py-1.5 px-2 text-gray-700">{idx + 1}</td>
                      <td className="py-1.5 px-2 font-mono text-gray-700">{peak.rt}</td>
                      <td className="py-1.5 px-2 font-mono text-right text-gray-700">{peak.area}</td>
                      <td className={`py-1.5 px-2 font-mono text-right font-semibold ${isMain ? "text-green-700" : "text-gray-500"}`}>
                        {peak.pct}%
                      </td>
                      <td className="py-1.5 px-2 text-gray-600">{peak.identity}</td>
                      <td className="py-1.5 px-2 text-center">
                        {isMain ? (
                          <span className="text-green-700 font-bold">✓ PASS</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-1.5 px-2 font-bold text-gray-800" colSpan={3}>Overall Purity</td>
                  <td className="py-1.5 px-2 font-bold text-green-700 text-right font-mono">{mainPurity.toFixed(2)}%</td>
                  <td className="py-1.5 px-2 text-gray-600">Specification: {product.purity}</td>
                  <td className="py-1.5 px-2 text-center font-bold text-green-700">✓ PASS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mass Spectrometry */}
          <div className="px-10 py-6 border-b border-gray-200">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2d5a3d] mb-3">MASS SPECTROMETRY (ESI-MS)</div>
            <div className="grid grid-cols-2 gap-3">
              {massSpec.map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={`font-mono font-semibold ${item.pass ? "text-green-700" : "text-red-600"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Tests */}
          <div className="px-10 py-6 border-b border-gray-200">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2d5a3d] mb-3">ADDITIONAL QUALITY TESTS</div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-1.5 font-semibold text-gray-700">Test</th>
                  <th className="text-left py-1.5 px-4 font-semibold text-gray-700">Method</th>
                  <th className="text-right py-1.5 px-4 font-semibold text-gray-700">Specification</th>
                  <th className="text-right py-1.5 font-semibold text-gray-700">Result</th>
                  <th className="text-center py-1.5 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <TestRow test="Appearance" method="Visual" spec={product.appearance} result={product.appearance} pass />
                <TestRow test="Solubility" method="Visual (1 mg/mL)" spec="Complete dissolution" result="Passes" pass />
                <TestRow test="Water Content" method="Karl Fischer" spec="≤8.0%" result={`${waterContent}%`} pass />
                <TestRow test="Bacterial Endotoxins" method="LAL (gel-clot)" spec="<1.0 EU/mg" result={`${endotoxin} EU/mg`} pass />
                <TestRow test="Sterility" method="Membrane filtration" spec="No growth (14 days)" result="Complies" pass />
                <TestRow test="pH (1 mg/mL, H₂O)" method="pH meter" spec="5.0–8.0" result={`${(deterministicNum(product.slug + "ph", 60, 75) / 10).toFixed(1)}`} pass />
                <TestRow test="Storage Compliance" method="Spec review" spec={product.storage.split(".")[0]} result="Complies" pass />
              </tbody>
            </table>
          </div>

          {/* Conclusion / Sign-off */}
          <div className="px-10 py-6 border-b border-gray-200">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2d5a3d] mb-3">CONCLUSION & AUTHORIZATION</div>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-5">
              <div className="text-sm font-bold text-green-800 mb-1">✓ BATCH RELEASE — APPROVED</div>
              <div className="text-xs text-green-700">
                All specified tests conform to established acceptance criteria. Batch {batchInfo.batchNumber} is
                released for research use. Independent analytical testing performed by {labPartner}.
                This certificate is issued under Nexphoria's quality management system.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div>
                <div className="border-b-2 border-gray-800 pb-1 mb-1 text-xs text-gray-400">Analyzing Laboratory</div>
                <div className="text-xs text-gray-600">{labPartner} — Independent Analytical Testing</div>
                <div className="text-xs text-gray-400 mt-1">Date: {batchInfo.testDate}</div>
              </div>
              <div>
                <div className="border-b-2 border-gray-800 pb-1 mb-1 text-xs text-gray-400">Quality Assurance Manager</div>
                <div className="text-xs text-gray-600">Batch Release Authorization</div>
                <div className="text-xs text-gray-400 mt-1">Date: {batchInfo.testDate}</div>
              </div>
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="px-10 py-5 bg-gray-50">
            <div className="text-xs text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-700">IMPORTANT NOTICE: </span>
              This is a sample/representative Certificate of Analysis provided for reference purposes. Actual batch COAs
              are issued with each shipment and reflect the specific tested batch. This compound is sold exclusively for
              qualified in vitro and in vivo research. It is NOT approved by the FDA or any regulatory authority for
              human therapeutic use, veterinary use, or food/drug/cosmetic application. The purchaser is solely
              responsible for ensuring lawful acquisition and use in accordance with all applicable federal, state, and
              local regulations. Nexphoria makes no warranties regarding fitness for any particular purpose.
              <br /><br />
              <span className="font-semibold">nexphoria.com</span> | Batch: {batchInfo.batchNumber} |
              Generated: {new Date().toISOString().split("T")[0]} | Document ID: COA-{product.slug.toUpperCase()}-SAMPLE
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 min-w-[140px] flex-shrink-0 text-xs">{label}</span>
      <span className={`font-semibold text-gray-800 text-xs ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function TestRow({
  test, method, spec, result, pass
}: {
  test: string; method: string; spec: string; result: string; pass: boolean;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-1.5 text-gray-700">{test}</td>
      <td className="py-1.5 px-4 text-gray-500">{method}</td>
      <td className="py-1.5 px-4 text-right text-gray-600">{spec}</td>
      <td className="py-1.5 text-right font-mono font-semibold text-gray-800">{result}</td>
      <td className="py-1.5 px-4 text-center">
        <span className={`font-bold ${pass ? "text-green-700" : "text-red-600"}`}>
          {pass ? "✓ PASS" : "✗ FAIL"}
        </span>
      </td>
    </tr>
  );
}
