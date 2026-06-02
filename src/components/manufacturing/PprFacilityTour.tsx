"use client";

import { motion } from "framer-motion";
import { Beaker, Filter, Snowflake, Droplets, Warehouse, LucideIcon } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface Stop {
  n: string;
  title: string;
  icon: LucideIcon;
  desc: string;
}

const STOPS: Stop[] = [
  {
    n: "01",
    title: "Synthesis bay",
    icon: Beaker,
    desc: "Solid-phase peptide synthesis (Fmoc/Boc) on automated platforms. Coupling efficiency and deprotection tracked at every residue.",
  },
  {
    n: "02",
    title: "HPLC purification",
    icon: Filter,
    desc: "Preparative reversed-phase HPLC isolates the target sequence from truncation and deletion byproducts to reference-grade purity.",
  },
  {
    n: "03",
    title: "Lyophilization",
    icon: Snowflake,
    desc: "Freeze-drying under vacuum yields a stable, amorphous powder. Residual moisture verified by Karl Fischer titration.",
  },
  {
    n: "04",
    title: "Filling & sealing",
    icon: Droplets,
    desc: "Aseptic filling into depyrogenated vials, nitrogen overlay, and crimp-sealing under ISO-classified airflow.",
  },
  {
    n: "05",
    title: "Cold storage",
    icon: Warehouse,
    desc: "Finished lots held at -20°C in monitored freezers pending release. Temperature logged continuously with alarm thresholds.",
  },
];

export default function PprFacilityTour() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
      <div className="mb-8 flex flex-col gap-2">
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
        >
          Facility tour
        </span>
        <h2
          className="text-[28px] font-semibold lg:text-[36px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Five stops, one continuous chain of custody
        </h2>
      </div>

      <div
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0"
        role="list"
      >
        {STOPS.map((stop, i) => {
          const Icon = stop.icon;
          return (
            <motion.div
              key={stop.n}
              role="listitem"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05 }}
              className="flex w-[280px] shrink-0 snap-start flex-col rounded-xl lg:w-auto lg:flex-1"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <div
                className="relative flex aspect-[4/3] items-center justify-center rounded-t-xl"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent)",
                  borderBottom: "1px solid var(--steel)",
                }}
              >
                <Icon size={34} aria-hidden="true" style={{ color: "var(--accent)" }} />
                <span
                  className="absolute left-3 top-3 text-[12px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
                >
                  {stop.n}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <h3 className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                  {stop.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                  {stop.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
