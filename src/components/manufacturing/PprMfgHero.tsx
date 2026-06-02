"use client";

import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export default function PprMfgHero() {
  return (
    <section className="relative overflow-hidden" style={{ borderBottom: "1px solid var(--steel)" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          <motion.span
            variants={staggerItem()}
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1"
            style={{ border: "1px solid var(--steel)", backgroundColor: "var(--ink-2)" }}
          >
            <FlaskConical size={13} aria-hidden="true" style={{ color: "var(--accent)" }} />
            <span
              className="text-[11px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-1)" }}
            >
              Manufacturing
            </span>
          </motion.span>

          <motion.h1
            variants={staggerItem()}
            className="text-[34px] font-semibold leading-[1.05] lg:text-[52px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            From synthesis to vial — fully traceable
          </motion.h1>

          <motion.p
            variants={staggerItem()}
            className="max-w-md text-[16px] leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
          >
            Every lot is synthesized, purified, and verified under documented controls. Each step
            is recorded, each vial carries a lot number that ties back to its raw material identity,
            HPLC purity, and mass-spec confirmation.
          </motion.p>

          <motion.dl variants={staggerItem()} className="flex flex-wrap gap-x-10 gap-y-4 pt-2">
            {[
              { v: "99%+", k: "Reference-grade purity" },
              { v: "5", k: "QC gates per lot" },
              { v: "2–8°C", k: "Monitored cold-chain" },
            ].map((s) => (
              <div key={s.k} className="flex flex-col">
                <dt className="text-[28px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                  {s.v}
                </dt>
                <dd className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  {s.k}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Facility photo placeholder */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="relative aspect-[4/3] overflow-hidden rounded-xl"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 60%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <FlaskConical size={40} aria-hidden="true" style={{ color: "var(--silver-3)" }} />
            <span
              className="text-[11px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-3)" }}
            >
              Synthesis facility — controlled environment
            </span>
          </div>
          {/* grid overlay for a clean-room feel */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ opacity: 0.18 }}>
            <defs>
              <pattern id="mfg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="var(--steel)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mfg-grid)" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
