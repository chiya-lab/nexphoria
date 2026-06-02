"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MOCK_SUBSCRIPTIONS,
  MOCK_ADDRESSES,
  subscriptionTotal,
  type Subscription,
} from "@/lib/mock-account";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function cadenceDays(c: Subscription["cadence"]): number {
  return Number.parseInt(c, 10);
}

export default function PprSubscriptionsList() {
  const [subs, setSubs] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);

  function update(id: string, patch: Partial<Subscription>) {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function skip(s: Subscription) {
    update(s.id, { nextShip: addDays(s.nextShip, cadenceDays(s.cadence)) });
  }

  function togglePause(s: Subscription) {
    update(s.id, { status: s.status === "active" ? "paused" : "active" });
  }

  function cancel(id: string) {
    setSubs((prev) => prev.filter((s) => s.id !== id));
  }

  if (subs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-16 text-center" style={{ borderColor: "var(--steel)" }}>
        <p className="text-sm" style={{ color: "var(--silver-2)" }}>
          No active subscriptions.{" "}
          <Link href="/products" className="underline" style={{ color: "var(--accent)" }}>Browse compounds</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subs.map((s) => (
        <div key={s.id} className="rounded-xl border p-5" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${s.productSlug}`}
                  className="text-base font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                >
                  {s.name}
                </Link>
                <span
                  className="rounded px-2 py-0.5 text-[10px] uppercase"
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.08em",
                    color: s.status === "active" ? "var(--ok)" : "var(--warn)",
                    border: "1px solid var(--steel)",
                  }}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-1 text-[13px]" style={{ color: "var(--silver-2)" }}>
                {s.packQty} vial · every {s.cadence} · ${subscriptionTotal(s)}/shipment
              </p>
              <p className="mt-1 text-[13px]" style={{ color: "var(--silver-2)" }}>
                Next shipment: <span style={{ color: "var(--silver-1)" }}>{s.status === "active" ? fmtDate(s.nextShip) : "Paused"}</span>
              </p>
            </div>
          </div>

          {/* Address swap */}
          <div className="mt-4">
            <label className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
              Ship to
            </label>
            <select
              value={s.shipToId}
              onChange={(e) => update(s.id, { shipToId: e.target.value })}
              className="w-full max-w-xs rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
              style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }}
            >
              {MOCK_ADDRESSES.map((a) => (
                <option key={a.id} value={a.id}>{a.label} — {a.city}, {a.state}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => skip(s)}
              disabled={s.status !== "active"}
              className="rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-1 disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
            >
              Skip next
            </button>
            <button
              type="button"
              onClick={() => togglePause(s)}
              className="rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-1"
              style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
            >
              {s.status === "active" ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => cancel(s.id)}
              className="rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-1"
              style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--danger)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
