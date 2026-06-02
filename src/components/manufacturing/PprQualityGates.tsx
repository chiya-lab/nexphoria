"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface Gate {
  stage: string;
  title: string;
  criteria: string;
}

const GATES: Gate[] = [
  {
    stage: "Gate 1",
    title: "Raw material identity",
    criteria: "Pass: CoA match + FTIR identity on every incoming amino acid and reagent lot. Reject on identity mismatch or out-of-spec endotoxin.",
  },
  {
    stage: "Gate 2",
    title: "In-process HPLC",
    criteria: "Pass: target peak ≥ defined purity threshold during purification. Fractions below threshold are diverted, not pooled.",
  },
  {
    stage: "Gate 3",
    title: "Final mass spectrometry",
    criteria: "Pass: observed monoisotopic mass within ±0.1% of theoretical. Confirms sequence identity before release.",
  },
  {
    stage: "Gate 4",
    title: "Endotoxin (LAL)",
    criteria: "Pass: < 0.5 EU/mg by kinetic chromogenic LAL. Any lot exceeding the limit is quarantined.",
  },
  {
    stage: "Gate 5",
    title: "Visual inspection",
    criteria: "Pass: clear, particulate-free cake; intact seal; correct fill. 100% of vials inspected against documented defect criteria.",
  },
];

export default function PprQualityGates() {
  return (
    <section style={{ backgroundColor: "var(--ink-2)", borderBlock: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
        <div className="mb-10 flex flex-col gap-2">
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
          >
            Quality gates
          </span>
          <h2
            className="text-[28px] font-semibold lg:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            A lot does not ship until it clears every gate
          </h2>
        </div>

        <ol className="relative flex flex-col gap-8 pl-8">
          {/* vertical rail */}
          <span
            className="absolute left-[7px] top-2 bottom-2 w-px"
            aria-hidden="true"
            style={{ backgroundColor: "var(--steel)" }}
          />
          {GATES.map((gate, i) => (
            <motion.li
              key={gate.stage}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.04 }}
              className="relative"
            >
              <span
                className="absolute -left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full"
                aria-hidden="true"
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 0 4px var(--ink-2)" }}
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span
                    className="text-[12px] uppercase"
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}
                  >
                    {gate.stage}
                  </span>
                  <h3 className="text-[17px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                    {gate.title}
                  </h3>
                </div>
                <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  {gate.criteria}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
