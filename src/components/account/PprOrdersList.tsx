"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { MOCK_ORDERS, orderTotal, orderItemCount, type Order } from "@/lib/mock-account";
import { ORDER_STATUS_COLOR } from "./statusBadge";

function StatusPill({ status }: { status: Order["status"] }) {
  const color = ORDER_STATUS_COLOR[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--silver-1)" }}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function PprOrdersList() {
  const orders = [...MOCK_ORDERS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="show">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border md:block" style={{ borderColor: "var(--steel)" }}>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--ink-2)" }}>
              {["Order", "Date", "Items", "Total", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[11px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)", borderBottom: "1px solid var(--steel)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid var(--steel)" }}>
                <td className="px-4 py-3 font-mono" style={{ color: "var(--platinum)" }}>{o.id}</td>
                <td className="px-4 py-3" style={{ color: "var(--silver-1)" }}>{fmtDate(o.date)}</td>
                <td className="px-4 py-3" style={{ color: "var(--silver-1)" }}>{orderItemCount(o)}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--platinum)" }}>${orderTotal(o)}</td>
                <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="text-[12px] font-semibold uppercase tracking-wide transition-colors"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/account/orders/${o.id}`}
            className="block rounded-xl border p-4"
            style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm" style={{ color: "var(--platinum)" }}>{o.id}</span>
              <StatusPill status={o.status} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[13px]" style={{ color: "var(--silver-2)" }}>
              <span>{fmtDate(o.date)} · {orderItemCount(o)} items</span>
              <span className="font-semibold" style={{ color: "var(--platinum)" }}>${orderTotal(o)}</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
