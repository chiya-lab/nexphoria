"use client";

import { useState } from "react";
import { PAYOUTS, AFFILIATE_USER } from "@/lib/mock-affiliate";

const METHODS = ["ACH", "PayPal", "Wire", "USDC"] as const;

const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = { paid: "var(--ok)", scheduled: "var(--accent)", processing: "var(--warn)" };
  return (
    <span className="inline-block rounded px-2 py-0.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: map[status] ?? "var(--silver-2)", border: `1px solid ${map[status] ?? "var(--steel)"}` }}>
      {status}
    </span>
  );
}

export default function PprAffiliatePayouts() {
  const [method, setMethod] = useState<(typeof METHODS)[number]>(AFFILIATE_USER.payoutMethod);

  const taxTone =
    AFFILIATE_USER.taxDocStatus === "verified" ? "var(--ok)" : AFFILIATE_USER.taxDocStatus === "pending" ? "var(--warn)" : "var(--danger)";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Payout method
          </h2>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                aria-pressed={method === m}
                className="rounded-md px-3.5 py-1.5 text-[13px] focus:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: method === m ? "var(--ink)" : "var(--silver-1)",
                  backgroundColor: method === m ? "var(--accent)" : "transparent",
                  border: `1px solid ${method === m ? "var(--accent)" : "var(--steel)"}`,
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            Selected: {method}. Minimum payout {AFFILIATE_USER.tier.minPayout === 0 ? "none" : money2(AFFILIATE_USER.tier.minPayout)} ({AFFILIATE_USER.tier.name} tier).
          </p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Tax documentation
          </h2>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded px-2 py-0.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: taxTone, border: `1px solid ${taxTone}` }}>
              {AFFILIATE_USER.taxDocStatus}
            </span>
            <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              W-9 on file
            </span>
          </div>
          <p className="mt-3 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            Payouts are held until tax documentation is verified. Demo only — no documents collected.
          </p>
        </div>
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Payout history
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 560 }}>
            <thead>
              <tr>
                {["Period", "Amount", "Method", "Status", "Date"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)", borderBottom: "1px solid var(--steel)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--steel)" }}>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>{p.period}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{money2(p.amount)}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{p.method}</td>
                  <td className="px-4 py-2.5"><StatusChip status={p.status} /></td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        All amounts are illustrative synthetic data. For research use only.
      </p>
    </div>
  );
}
