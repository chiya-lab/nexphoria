"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { KPIS } from "@/lib/mock-admin";
import PprAdminChart from "./PprAdminChart";

export default function PprAdminKpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((kpi) => {
        const up = kpi.deltaPct >= 0;
        // "good" intent: up is positive (green). For churn, lower is better, so
        // an up move is flagged bad.
        const positive = kpi.intent === "bad" ? !up : up;
        const deltaColor = positive ? "var(--ok)" : "var(--danger)";
        return (
          <div
            key={kpi.id}
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
          >
            <p
              className="text-[11px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
            >
              {kpi.label}
            </p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {kpi.value}
              </span>
              <span className="mb-1 flex items-center gap-0.5 text-xs font-medium" style={{ color: deltaColor }}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {Math.abs(kpi.deltaPct).toFixed(1)}%
              </span>
            </div>
            <div className="mt-3">
              <PprAdminChart variant="sparkline" data={kpi.spark} color={deltaColor} width={240} height={28} fill />
            </div>
          </div>
        );
      })}
    </div>
  );
}
