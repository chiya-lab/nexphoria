"use client";

import { FUNNEL } from "@/lib/mock-admin";

export default function PprAdminFunnel() {
  const top = FUNNEL[0].count;

  return (
    <div className="rounded-xl p-4 lg:p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Conversion funnel
        </h2>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--silver-2)" }}>
          Visitor → purchase, with stage-to-stage drop-off
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {FUNNEL.map((stage, i) => {
          const widthPct = (stage.count / top) * 100;
          const prev = i > 0 ? FUNNEL[i - 1].count : null;
          const stepConv = prev ? (stage.count / prev) * 100 : 100;
          const dropOff = prev ? 100 - stepConv : 0;
          const overall = (stage.count / top) * 100;
          return (
            <div key={stage.id}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span style={{ color: "var(--silver-1)" }}>{stage.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  {stage.count.toLocaleString("en-US")} · {overall.toFixed(1)}% of top
                </span>
              </div>
              <div className="relative h-7 overflow-hidden rounded-md" style={{ backgroundColor: "var(--ink-3)" }}>
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${widthPct}%`,
                    background: "linear-gradient(90deg, var(--accent), var(--accent-glow))",
                    opacity: 0.85,
                  }}
                />
              </div>
              {prev && (
                <div className="mt-0.5 flex justify-end text-[10px]" style={{ fontFamily: "var(--font-mono)", color: dropOff > 60 ? "var(--warn)" : "var(--silver-3)" }}>
                  {stepConv.toFixed(1)}% step conv · −{dropOff.toFixed(1)}% drop
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
