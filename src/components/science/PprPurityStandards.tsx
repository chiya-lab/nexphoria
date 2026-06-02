"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

type Cell = boolean;

interface Row {
  attribute: string;
  industry: Cell;
  standard: Cell;
  research: Cell;
  reference: Cell;
}

const ROWS: Row[] = [
  { attribute: "HPLC purity report", industry: false, standard: true, research: true, reference: true },
  { attribute: "Mass spec identity", industry: false, standard: false, research: true, reference: true },
  { attribute: "Endotoxin (LAL) screen", industry: false, standard: false, research: true, reference: true },
  { attribute: "Residual solvent panel", industry: false, standard: false, research: false, reference: true },
  { attribute: "Lot-specific COA", industry: false, standard: true, research: true, reference: true },
  { attribute: "Independent lab", industry: false, standard: false, research: true, reference: true },
];

const TIERS = [
  { key: "industry" as const, label: "Industry typical", purity: "—", muted: true },
  { key: "standard" as const, label: "Standard", purity: "95%" },
  { key: "research" as const, label: "Research", purity: "98%" },
  { key: "reference" as const, label: "Reference", purity: "99%+", highlight: true },
];

export default function PprPurityStandards() {
  return (
    <section className="px-5 py-16 md:px-10 lg:py-24" style={{ backgroundColor: "var(--ink-2)" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="mx-auto max-w-5xl"
      >
        <p
          className="mb-3 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          Purity standards
        </p>
        <h2
          className="mb-3 text-[28px] font-semibold md:text-[36px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          What each grade actually guarantees
        </h2>
        <p className="mb-10 max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          Purity percentage alone is not a specification. These tiers define which analytical
          evidence accompanies every lot.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left" style={{ borderBottom: "1px solid var(--steel)" }}>
                  <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}>
                    Analytical evidence
                  </span>
                </th>
                {TIERS.map((t) => (
                  <th
                    key={t.key}
                    className="px-4 py-3 text-center"
                    style={{
                      borderBottom: `2px solid ${t.highlight ? "var(--accent)" : "var(--steel)"}`,
                      backgroundColor: t.highlight ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent",
                    }}
                  >
                    <span
                      className="block text-[14px] font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: t.muted ? "var(--silver-2)" : "var(--platinum)" }}
                    >
                      {t.label}
                    </span>
                    <span
                      className="block text-[12px]"
                      style={{ fontFamily: "var(--font-mono)", color: t.highlight ? "var(--accent)" : "var(--silver-2)" }}
                    >
                      {t.purity}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.attribute}>
                  <td className="px-4 py-3" style={{ borderBottom: "1px solid var(--steel)" }}>
                    <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                      {row.attribute}
                    </span>
                  </td>
                  {TIERS.map((t) => {
                    const on = row[t.key];
                    return (
                      <td
                        key={t.key}
                        className="px-4 py-3 text-center"
                        style={{
                          borderBottom: "1px solid var(--steel)",
                          backgroundColor: t.highlight ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent",
                        }}
                      >
                        <span className="inline-flex" aria-label={on ? "Included" : "Not included"}>
                          {on ? (
                            <Check size={17} style={{ color: t.highlight ? "var(--accent)" : "var(--ok)" }} aria-hidden="true" />
                          ) : (
                            <Minus size={17} style={{ color: "var(--silver-3, #5A5F66)" }} aria-hidden="true" />
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
