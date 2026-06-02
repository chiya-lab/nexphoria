"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface Callout {
  n: number;
  label: string;
  note: string;
}

const CALLOUTS: Callout[] = [
  { n: 1, label: "Lot number", note: "Traces the vial to its synthesis run, analyst, and raw-material source." },
  { n: 2, label: "Purity (HPLC)", note: "Main-peak area percent at 214 nm. We release Reference grade at 99%+." },
  { n: 3, label: "Observed mass", note: "ESI-MS monoisotopic mass matched to the theoretical value within tolerance." },
  { n: 4, label: "Analyst signature", note: "Named analyst and accredited laboratory attesting to the result." },
];

const ROWS: { k: string; v: string; tag?: number; accent?: boolean }[] = [
  { k: "Compound", v: "BPC-157" },
  { k: "CAS", v: "137525-51-0" },
  { k: "Molecular formula", v: "C62H98N16O22" },
  { k: "Lot #", v: "NXP-BPC-240601", tag: 1 },
  { k: "Purity (HPLC)", v: "99.47%", tag: 2, accent: true },
  { k: "Observed mass", v: "1419.74 Da", tag: 3 },
  { k: "Theoretical mass", v: "1419.53 Da" },
  { k: "Endotoxin (LAL)", v: "<0.5 EU/mg" },
  { k: "Residual solvents", v: "Pass (ICH Q3C)" },
  { k: "Analyst", v: "J. Novak — Janoshik", tag: 4 },
];

export default function PprCoaWalkthrough() {
  return (
    <section className="px-5 py-16 md:px-10 lg:py-24" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
          <p
            className="mb-3 text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            COA walkthrough
          </p>
          <h2
            className="mb-3 text-[28px] font-semibold md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            How to read your Certificate of Analysis
          </h2>
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Every order ships with a lot-specific COA. The four numbered fields below are the ones
            worth verifying first.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Mock COA document */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="rounded-lg p-6"
            style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
          >
            <div className="mb-4 flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--steel)" }}>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  Certificate of Analysis
                </span>
                <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}>
                  Independent analytical report
                </span>
              </div>
              <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                RUO
              </span>
            </div>
            <dl className="flex flex-col">
              {ROWS.map((r) => (
                <div
                  key={r.k}
                  className="flex items-center justify-between gap-3 py-2"
                  style={{ borderBottom: "1px solid color-mix(in srgb, var(--steel) 60%, transparent)" }}
                >
                  <dt className="flex items-center gap-2 text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                    {r.tag && (
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold"
                        style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-mono)" }}
                        aria-hidden="true"
                      >
                        {r.tag}
                      </span>
                    )}
                    {r.k}
                  </dt>
                  <dd
                    className="text-[13px]"
                    style={{ fontFamily: "var(--font-mono)", color: r.accent ? "var(--accent)" : "var(--platinum)" }}
                  >
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Callouts */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col gap-3"
          >
            {CALLOUTS.map((c) => (
              <li
                key={c.n}
                className="flex items-start gap-3 rounded-lg p-4"
                style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-mono)" }}
                  aria-hidden="true"
                >
                  {c.n}
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                    {c.label}
                  </span>
                  <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                    {c.note}
                  </span>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
