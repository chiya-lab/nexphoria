"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Compare" },
];

export default function PprCompareHero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-8 lg:pt-20">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
      >
        {CRUMBS.map((c, i) => {
          const isLast = i === CRUMBS.length - 1;
          return (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" style={{ color: "var(--silver-3)" }}>
                  /
                </span>
              )}
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="transition-colors focus:outline-none focus-visible:underline"
                  style={{ color: "var(--silver-2)" }}
                >
                  {c.label}
                </Link>
              ) : (
                <span style={{ color: "var(--silver-1)" }}>{c.label}</span>
              )}
            </span>
          );
        })}
      </nav>

      <motion.div variants={staggerContainer(0.08, 0.05)} initial="hidden" animate="show">
        <motion.p
          variants={staggerItem()}
          className="mb-3 text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
        >
          Specification matrix · RUO
        </motion.p>
        <motion.h1
          variants={staggerItem()}
          className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Compare research compounds side-by-side
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--silver-2)" }}
        >
          Place up to four compounds in the matrix to weigh purity, pack pricing,
          half-life, solubility, reconstitution, and stability against one another.
          Specifications are sourced from lot documentation and indexed literature.
          For research use only.
        </motion.p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="mt-6 h-px w-full"
        style={{ backgroundColor: "var(--steel)" }}
      />
    </section>
  );
}
