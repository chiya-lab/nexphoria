"use client";

import { useMemo, useState } from "react";
import { COA_QUEUE, type CoaQueueItem, type CoaStatus } from "@/lib/mock-admin";
import { StatusBadge } from "./adminTableUi";

function statusTone(s: CoaStatus): "warn" | "ok" | "danger" {
  if (s === "Pending") return "warn";
  if (s === "Approved") return "ok";
  return "danger";
}

export default function PprAdminCoaQueue() {
  const [decisions, setDecisions] = useState<Record<string, CoaStatus>>({});
  const [activeId, setActiveId] = useState<string>(COA_QUEUE[0]?.id ?? "");

  const items: CoaQueueItem[] = useMemo(
    () => COA_QUEUE.map((c) => ({ ...c, status: decisions[c.id] ?? c.status })),
    [decisions],
  );
  const active = items.find((c) => c.id === activeId) ?? items[0];
  const pendingCount = items.filter((c) => c.status === "Pending").length;

  function decide(id: string, status: CoaStatus) {
    setDecisions((prev) => ({ ...prev, [id]: status }));
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      {/* Queue list */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Approval queue
          </h2>
          <span className="text-[12px]" style={{ color: "var(--silver-2)" }}>{pendingCount} pending</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {items.map((c) => {
            const isActive = c.id === active?.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--ink-3)" : "var(--ink-2)",
                    border: `1px solid ${isActive ? "var(--accent)" : "var(--steel)"}`,
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm" style={{ color: "var(--platinum)" }}>{c.product}</span>
                    <span className="block text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                      {c.lot} · {c.submitted}
                    </span>
                  </span>
                  <StatusBadge label={c.status} tone={statusTone(c.status)} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Preview pane */}
      {active && (
        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{active.product}</h3>
              <p className="mt-0.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>{active.id}</p>
            </div>
            <StatusBadge label={active.status} tone={statusTone(active.status)} />
          </div>

          {/* Mock CoA document preview */}
          <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: "var(--ink)", border: "1px dashed var(--steel)" }}>
            <p className="mb-3 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
              Certificate of Analysis · preview
            </p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                ["Lot", active.lot],
                ["Purity (HPLC)", active.purity],
                ["Method", active.method],
                ["Analyst", active.analyst],
                ["Submitted", active.submitted],
                ["Identity", "Confirmed"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px]" style={{ color: "var(--silver-3)" }}>{k}</dt>
                  <dd style={{ color: "var(--silver-1)" }}>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[10px]" style={{ color: "var(--silver-3)" }}>
              For Research Use Only. Not for human or animal consumption. Figures are synthetic demo data.
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => decide(active.id, "Approved")}
              disabled={active.status === "Approved"}
              className="flex-1 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => decide(active.id, "Rejected")}
              disabled={active.status === "Rejected"}
              className="flex-1 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", border: "1px solid var(--danger)", color: "var(--danger)" }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
