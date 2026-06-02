"use client";

import { COHORTS, type CohortRow } from "@/lib/mock-admin";

/** Map a retention % to a cell background on the accent ramp. */
function cellStyle(value: number | null): { backgroundColor: string; color: string } {
  if (value === null) return { backgroundColor: "transparent", color: "var(--silver-3)" };
  // 0 → faint, 100 → full accent. Use rgba over the acid-green base.
  const alpha = 0.08 + (value / 100) * 0.62;
  const color = value > 55 ? "var(--ink)" : "var(--silver-1)";
  return { backgroundColor: `rgba(184, 224, 79, ${alpha.toFixed(3)})`, color };
}

export default function PprAdminCohorts() {
  const weekCount = COHORTS[0]?.retention.length ?? 12;

  return (
    <div className="rounded-xl p-4 lg:p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Weekly cohort retention
        </h2>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--silver-2)" }}>
          % of each signup cohort still active by week. Darker = higher retention.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-[11px]" style={{ minWidth: 720 }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 px-2 py-1.5 text-left" style={{ backgroundColor: "var(--ink-2)", color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>
                Cohort
              </th>
              <th className="px-2 py-1.5 text-right" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>Size</th>
              {Array.from({ length: weekCount }).map((_, w) => (
                <th key={w} className="px-2 py-1.5 text-center" style={{ color: "var(--silver-3)", fontFamily: "var(--font-mono)" }}>
                  W{w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((row: CohortRow) => (
              <tr key={row.cohort}>
                <td className="sticky left-0 z-10 whitespace-nowrap px-2 py-1.5" style={{ backgroundColor: "var(--ink-2)", color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}>
                  {row.cohort}
                </td>
                <td className="px-2 py-1.5 text-right" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>{row.size}</td>
                {row.retention.map((v, w) => {
                  const s = cellStyle(v);
                  return (
                    <td key={w} className="px-2 py-1.5 text-center" style={{ backgroundColor: s.backgroundColor, color: s.color, fontFamily: "var(--font-mono)", borderRadius: 2 }}>
                      {v === null ? "" : `${v.toFixed(0)}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
