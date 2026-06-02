"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import type { AccountUser } from "@/lib/mock-account";

const TIER_LABEL: Record<AccountUser["tier"], string> = {
  researcher: "Researcher",
  wholesale: "Wholesale",
};

interface PprAccountHeroProps {
  user: AccountUser;
  title?: string;
  subtitle?: string;
}

export default function PprAccountHero({ user, title, subtitle }: PprAccountHeroProps) {
  const firstName = user.name.replace(/^Dr\.\s+/, "").split(" ")[0];
  return (
    <motion.header variants={fadeInUp} initial="hidden" animate="show" className="mb-8">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="rounded px-2 py-0.5 text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)", border: "1px solid var(--steel)" }}
        >
          RUO
        </span>
        <span
          className="rounded px-2 py-0.5 text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-1)", border: "1px solid var(--steel)", backgroundColor: "var(--ink-2)" }}
        >
          {TIER_LABEL[user.tier]}
        </span>
        {user.verification === "verified" && (
          <span
            className="rounded px-2 py-0.5 text-[11px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--ok)", border: "1px solid var(--steel)" }}
          >
            Verified
          </span>
        )}
      </div>
      <h1
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        {title ?? `Welcome back, ${firstName}`}
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--silver-2)" }}>
        {subtitle ?? `${user.organization} · Member since ${new Date(user.memberSince).getFullYear()}`}
      </p>
    </motion.header>
  );
}
