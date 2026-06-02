"use client";

import { LEADERBOARD } from "@/lib/mock-affiliate";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function PprAffiliateLeaderboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Top partners · this month
          </h2>
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            Anonymized · top 20
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 560 }}>
            <thead>
              <tr>
                {["Rank", "Partner", "Tier", "Sales (MTD)", "Earnings (MTD)"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)", borderBottom: "1px solid var(--steel)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((row) => (
                <tr
                  key={row.rank}
                  style={{
                    borderBottom: "1px solid var(--steel)",
                    backgroundColor: row.isCurrentUser ? "color-mix(in srgb, var(--accent) 8%, var(--ink-2))" : "transparent",
                  }}
                >
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: row.rank <= 3 ? "var(--accent)" : "var(--silver-2)" }}>
                    #{row.rank}
                  </td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: row.isCurrentUser ? "var(--accent)" : "var(--platinum)", fontWeight: row.isCurrentUser ? 600 : 400 }}>
                    {row.alias}
                  </td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{row.tier}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{row.mtdSales}</td>
                  <td className="px-4 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>{money(row.mtdEarnings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Aliases are anonymized. Standings are illustrative synthetic data and reset monthly. For research use only.
      </p>
    </div>
  );
}
