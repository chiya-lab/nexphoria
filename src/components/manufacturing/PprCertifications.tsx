"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Droplet, FileCheck, LucideIcon } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface Cert {
  id: string;
  icon: LucideIcon;
  label: string;
  detail: string;
}

const CERTS: Cert[] = [
  {
    id: "cgmp",
    icon: ShieldCheck,
    label: "cGMP-aligned",
    detail: "Synthesis and fill operations follow current Good Manufacturing Practice principles for documentation, change control, and batch records.",
  },
  {
    id: "iso",
    icon: Award,
    label: "ISO 9001 (illustrative)",
    detail: "Quality-management framework covering process control, corrective action, and continuous improvement across the facility.",
  },
  {
    id: "usp",
    icon: Droplet,
    label: "USP-grade water",
    detail: "Reconstitution and process water meets USP purified-water specifications for conductivity and total organic carbon.",
  },
  {
    id: "coa",
    icon: FileCheck,
    label: "Per-lot CoA",
    detail: "A certificate of analysis with HPLC purity and mass-spec identity accompanies every released lot.",
  },
];

export default function PprCertifications() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section style={{ backgroundColor: "var(--ink-2)", borderBlock: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
          >
            Standards
          </span>
          <h2
            className="text-[28px] font-semibold lg:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Standards we hold our process to
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {CERTS.map((cert, i) => {
            const Icon = cert.icon;
            const isOpen = open === cert.id;
            return (
              <motion.button
                key={cert.id}
                type="button"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setOpen(cert.id)}
                onMouseLeave={() => setOpen(null)}
                onFocus={() => setOpen(cert.id)}
                onBlur={() => setOpen(null)}
                onClick={() => setOpen(isOpen ? null : cert.id)}
                className="flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-colors focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: `1px solid ${isOpen ? "var(--accent)" : "var(--steel)"}`,
                }}
                aria-expanded={isOpen}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                >
                  <Icon size={22} aria-hidden="true" style={{ color: "var(--accent)" }} />
                </span>
                <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  {cert.label}
                </span>
                <span
                  className="text-[12px] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--silver-2)",
                    maxHeight: isOpen ? 120 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.32s ease, opacity 0.32s ease",
                  }}
                >
                  {cert.detail}
                </span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
          Marks shown are illustrative of the standards our processes are aligned to. For research use only.
        </p>
      </div>
    </section>
  );
}
