"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export interface Crumb {
  label: string;
  href?: string;
}

interface PprPolicyHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  crumbs: Crumb[];
}

export default function PprPolicyHero({ eyebrow, title, subtitle, lastUpdated, crumbs }: PprPolicyHeroProps) {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-14 pb-10 lg:pt-20">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" style={{ color: "var(--silver-3)" }}>
                  /
                </span>
              )}
              {c.href && !isLast ? (
                <Link href={c.href} className="transition-colors focus:outline-none focus-visible:ring-2" style={{ color: "var(--silver-2)" }}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} style={{ color: isLast ? "var(--accent)" : "var(--silver-2)" }}>
                  {c.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="visible" className="flex flex-col gap-4">
        <motion.span
          variants={staggerItem()}
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--accent)" }}
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          variants={staggerItem()}
          className="text-[34px] font-semibold leading-[1.05] lg:text-[52px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          {title}
        </motion.h1>
        <motion.p
          variants={staggerItem()}
          className="max-w-2xl text-[16px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          {subtitle}
        </motion.p>
        <motion.span
          variants={fadeInUp}
          className="text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}
        >
          Last updated {lastUpdated} · Research use only · United States only
        </motion.span>
      </motion.div>
    </section>
  );
}
