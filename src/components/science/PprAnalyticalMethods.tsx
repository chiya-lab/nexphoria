"use client";

import { motion } from "framer-motion";
import { Activity, Atom, ShieldCheck, FlaskConical, type LucideIcon } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Method {
  icon: LucideIcon;
  name: string;
  abbr: string;
  description: string;
  limit: string;
  limitLabel: string;
}

const METHODS: Method[] = [
  {
    icon: Activity,
    name: "High-Performance Liquid Chromatography",
    abbr: "HPLC",
    description:
      "Reverse-phase C18 separation quantifies the main peak against related impurities by UV area at 214 nm.",
    limit: "0.1%",
    limitLabel: "Impurity LOQ",
  },
  {
    icon: Atom,
    name: "Mass Spectrometry",
    abbr: "ESI-MS",
    description:
      "Electrospray ionization confirms molecular identity by matching the observed monoisotopic mass to theory.",
    limit: "±0.5 Da",
    limitLabel: "Mass accuracy",
  },
  {
    icon: ShieldCheck,
    name: "Endotoxin (LAL)",
    abbr: "LAL",
    description:
      "Kinetic chromogenic Limulus amebocyte lysate assay screens bacterial endotoxin in injectable-route compounds.",
    limit: "<0.5 EU/mg",
    limitLabel: "Detection limit",
  },
  {
    icon: FlaskConical,
    name: "Residual Solvents",
    abbr: "GC-HS",
    description:
      "Headspace gas chromatography quantifies residual synthesis solvents against ICH Q3C class limits.",
    limit: "<50 ppm",
    limitLabel: "Quant. limit",
  },
];

export default function PprAnalyticalMethods() {
  return (
    <section className="px-5 py-16 md:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
          <p
            className="mb-3 text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Analytical methods
          </p>
          <h2
            className="mb-3 text-[28px] font-semibold md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Four orthogonal techniques per lot
          </h2>
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Each measures a different property, so no single failure mode escapes characterization.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.08)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {METHODS.map((m) => {
            const Icon = m.icon;
            return (
              <motion.article
                key={m.abbr}
                variants={fadeInUp}
                className="flex flex-col rounded-lg p-5"
                style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
              >
                <span
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                >
                  <Icon size={20} style={{ color: "var(--accent)" }} aria-hidden="true" />
                </span>
                <span
                  className="text-[12px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--accent)" }}
                >
                  {m.abbr}
                </span>
                <h3
                  className="mb-2 mt-1 text-[15px] font-semibold leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                >
                  {m.name}
                </h3>
                <p className="mb-4 flex-1 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                  {m.description}
                </p>
                <div className="flex items-baseline justify-between border-t pt-3" style={{ borderColor: "var(--steel)" }}>
                  <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}>
                    {m.limitLabel}
                  </span>
                  <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}>
                    {m.limit}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
