"use client";

import { useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import { APPLICANTS, ACTIVE_AFFILIATES, PAYOUTS, FRAUD_SIGNALS, type Applicant } from "@/lib/mock-affiliate";
import { StatusBadge } from "./adminTableUi";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Status = Applicant["status"];

const statusTone: Record<Status, "warn" | "ok" | "danger" | "neutral"> = {
  pending: "warn",
  approved: "ok",
  rejected: "danger",
  suspended: "neutral",
};

const FILTERS: { id: Status | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "suspended", label: "Suspended" },
];

const th = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.06em",
  color: "var(--silver-2)",
  borderBottom: "1px solid var(--steel)",
} as const;

export default function PprAdminAffiliates() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    () => Object.fromEntries(APPLICANTS.map((a) => [a.id, a.status])),
  );
  const [filter, setFilter] = useState<Status | "all">("all");

  const setStatus = (id: string, status: Status) => setStatuses((prev) => ({ ...prev, [id]: status }));

  const rows = APPLICANTS.filter((a) => filter === "all" || statuses[a.id] === filter);
  const pendingPayouts = PAYOUTS.filter((p) => p.status !== "paid");

  return (
    <div className="flex flex-col gap-6">
      {/* Applicants */}
      <section className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
        <div className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderBottom: "1px solid var(--steel)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Applicants
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className="rounded px-2.5 py-1 text-[12px] focus:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: filter === f.id ? "var(--ink)" : "var(--silver-1)",
                  backgroundColor: filter === f.id ? "var(--accent)" : "transparent",
                  border: `1px solid ${filter === f.id ? "var(--accent)" : "var(--steel)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                {["Applicant", "Platform", "Audience", "Focus", "Submitted", "Status", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[11px] uppercase" style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const s = statuses[a.id];
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid var(--steel)" }}>
                    <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{a.name}</td>
                    <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{a.platform}</td>
                    <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{a.audience}</td>
                    <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>{a.focus}</td>
                    <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>{a.submitted}</td>
                    <td className="px-4 py-2.5"><StatusBadge label={s} tone={statusTone[s]} /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStatus(a.id, "approved")}
                          aria-label={`Approve ${a.name}`}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] focus:outline-none focus-visible:ring-2"
                          style={{ border: "1px solid var(--steel)", color: "var(--ok)", fontFamily: "var(--font-body)" }}
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(a.id, "rejected")}
                          aria-label={`Reject ${a.name}`}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] focus:outline-none focus-visible:ring-2"
                          style={{ border: "1px solid var(--steel)", color: "var(--danger)", fontFamily: "var(--font-body)" }}
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-3)" }}>
                    No applicants in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active affiliates */}
      <section className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Active affiliates
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 620 }}>
            <thead>
              <tr>
                {["Affiliate", "Tier", "Custom code", "MTD", "Lifetime"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[11px] uppercase" style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVE_AFFILIATES.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid var(--steel)" }}>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{a.alias}</td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{a.tier}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{a.customCode}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{money2(a.mtd)}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{money(a.lifetime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Payouts queue */}
        <section className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              Payouts queue
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 360 }}>
              <thead>
                <tr>
                  {["Period", "Amount", "Method", "Status"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[11px] uppercase" style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--steel)" }}>
                    <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{p.period}</td>
                    <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{money2(p.amount)}</td>
                    <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{p.method}</td>
                    <td className="px-4 py-2.5"><StatusBadge label={p.status} tone={p.status === "scheduled" ? "accent" : "warn"} /></td>
                  </tr>
                ))}
                {pendingPayouts.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-[13px]" style={{ color: "var(--silver-3)" }}>Queue is clear.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Fraud signals */}
        <section className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
            <AlertTriangle size={15} aria-hidden="true" style={{ color: "var(--warn)" }} />
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              Fraud signals
            </h2>
          </div>
          <ul className="flex flex-col">
            {FRAUD_SIGNALS.map((f) => {
              const tone = f.severity === "high" ? "var(--danger)" : f.severity === "medium" ? "var(--warn)" : "var(--silver-2)";
              return (
                <li key={f.id} className="flex items-start justify-between gap-3 px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
                  <div className="min-w-0">
                    <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{f.affiliate}</p>
                    <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>{f.signal}</p>
                    <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>{f.detected}</p>
                  </div>
                  <span className="shrink-0 rounded px-2 py-0.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: tone, border: `1px solid ${tone}` }}>
                    {f.severity}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Demo console — all data is synthetic. Approve/reject actions are local-only and reset on reload. For research use only.
      </p>
    </div>
  );
}
