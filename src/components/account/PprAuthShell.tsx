"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface PprAuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function PprAuthShell({ eyebrow, title, subtitle, children, footer }: PprAuthShellProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
        >
          ← Nexphoria
        </Link>
        <p
          className="mt-6 text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
        >
          {eyebrow}
        </p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          {title}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--silver-2)" }}>{subtitle}</p>

        <div className="mt-8">{children}</div>

        <div className="mt-6 text-center text-sm" style={{ color: "var(--silver-2)" }}>
          {footer}
        </div>

        <p className="mt-8 text-center text-[11px]" style={{ color: "var(--silver-3)" }}>
          Research use only · 21+ · US only. By continuing you affirm research-use intent.
        </p>
      </motion.div>
    </div>
  );
}
