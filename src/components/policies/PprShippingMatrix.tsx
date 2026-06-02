"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface Method {
  method: string;
  cost: string;
  transit: string;
  coldChain: string;
  tracking: boolean;
  badge?: string;
}

const METHODS: Method[] = [
  {
    method: "Standard (Ground)",
    cost: "Flat $12 · free over $299",
    transit: "3–5 business days",
    coldChain: "Gel pack, 48 h rated",
    tracking: true,
  },
  {
    method: "Expedited (2-Day)",
    cost: "$24",
    transit: "2 business days",
    coldChain: "High-density gel pack, 60 h rated",
    tracking: true,
  },
  {
    method: "Overnight (Priority)",
    cost: "$39",
    transit: "Next business day",
    coldChain: "Dry ice, 72 h rated",
    tracking: true,
    badge: "Recommended",
  },
];

const COLUMNS = ["Method", "Cost", "Transit", "Cold chain", "Tracking"] as const;

export default function PprShippingMatrix() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-6 flex flex-col gap-2">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Methods
        </span>
        <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Shipping methods at a glance
        </h2>
      </motion.div>

      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--steel)" }}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ backgroundColor: "var(--ink-2)" }}>
              {COLUMNS.map((h) => (
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
            {METHODS.map((m) => (
              <tr key={m.method} style={{ backgroundColor: "var(--ink)" }}>
                <td className="px-4 py-4 align-top" style={{ borderBottom: "1px solid var(--steel)" }}>
                  <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                    {m.method}
                  </span>
                  {m.badge && (
                    <span
                      className="ml-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase"
                      style={{ backgroundColor: "color-mix(in srgb, var(--accent) 16%, transparent)", color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}
                    >
                      {m.badge}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 align-top text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", borderBottom: "1px solid var(--steel)" }}>
                  {m.cost}
                </td>
                <td className="px-4 py-4 align-top text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", borderBottom: "1px solid var(--steel)" }}>
                  {m.transit}
                </td>
                <td className="px-4 py-4 align-top text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", borderBottom: "1px solid var(--steel)" }}>
                  {m.coldChain}
                </td>
                <td className="px-4 py-4 align-top" style={{ borderBottom: "1px solid var(--steel)" }}>
                  {m.tracking ? (
                    <Check size={16} aria-label="Included" style={{ color: "var(--ok)" }} />
                  ) : (
                    <Minus size={16} aria-label="Not included" style={{ color: "var(--silver-3)" }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Rates and cold-chain media are finalized at checkout based on destination and ambient conditions at origin.
      </p>
    </section>
  );
}
