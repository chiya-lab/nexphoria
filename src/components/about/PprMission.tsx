"use client";

import { motion } from "framer-motion";
import { Droplet, FileSearch, Crosshair } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const VALUES = [
  {
    icon: Droplet,
    title: "Purity",
    body: "Every batch is held to a documented purity threshold and re-verified by reversed-phase HPLC at 220 nm. Figures on the certificate are measured, not asserted.",
  },
  {
    icon: FileSearch,
    title: "Provenance",
    body: "Each vial traces back to a single synthesis lot. The certificate of analysis references the analytical method and the column used, so your records reconcile cleanly.",
  },
  {
    icon: Crosshair,
    title: "Precision",
    body: "Mass-spectrometry identity confirmation accompanies every compound. Reconstitution and storage guidance is specific to the molecule, never boilerplate.",
  },
];

export default function PprMission() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--ink)" }}
      aria-labelledby="about-mission-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <h2
          id="about-mission-heading"
          className="mb-3 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          What we stand for
        </h2>
        <p
          className="mb-12 max-w-[40ch] text-[32px] font-semibold leading-tight md:text-[40px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}
        >
          Three principles, enforced on every lot.
        </p>

        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                variants={staggerItem(12)}
                className="flex flex-col gap-4 rounded-lg p-7"
                style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-md"
                  style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3
                  className="text-[22px] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                >
                  {v.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
