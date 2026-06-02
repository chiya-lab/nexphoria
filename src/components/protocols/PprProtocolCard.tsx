"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Protocol } from "@/lib/mock-protocols";
import { staggerItem } from "@/lib/motion";

interface PprProtocolCardProps {
  protocol: Protocol;
}

export default function PprProtocolCard({ protocol }: PprProtocolCardProps) {
  return (
    <motion.div variants={staggerItem()} className="group relative h-full">
      {/* Gradient border on hover */}
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, var(--accent), transparent 60%)",
        }}
      />
      <Link
        href={`/protocols/${protocol.slug}`}
        className="relative flex h-full flex-col rounded-sm p-6 transition-colors"
        style={{
          backgroundColor: "var(--ink-2)",
          border: "1px solid var(--steel)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[0.625rem] uppercase tracking-widest px-2 py-1 rounded-sm"
            style={{
              color: "var(--accent)",
              backgroundColor: "rgba(184,224,79,0.08)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {protocol.category}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--silver-3)", fontFamily: "var(--font-mono)" }}
          >
            {protocol.durationWeeks}w
          </span>
        </div>

        <h3
          className="text-xl mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--platinum)",
            letterSpacing: "-0.01em",
          }}
        >
          {protocol.name}
        </h3>
        <p
          className="text-sm mb-5 flex-1"
          style={{ color: "var(--silver-2)", lineHeight: 1.55 }}
        >
          {protocol.tagline}
        </p>

        <div
          className="grid grid-cols-3 gap-2 mb-5 py-3"
          style={{
            borderTop: "1px solid var(--steel)",
            borderBottom: "1px solid var(--steel)",
          }}
        >
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider mb-1" style={{ color: "var(--silver-3)" }}>
              Peptides
            </p>
            <p className="text-sm" style={{ color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}>
              {protocol.peptides.length}
            </p>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider mb-1" style={{ color: "var(--silver-3)" }}>
              Intensity
            </p>
            <p className="text-sm" style={{ color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}>
              {protocol.intensity}/5
            </p>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider mb-1" style={{ color: "var(--silver-3)" }}>
              Est. cost
            </p>
            <p className="text-sm" style={{ color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}>
              ${protocol.estCost}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {protocol.pairingTags.map((tag) => (
            <span
              key={tag}
              className="text-[0.625rem] px-2 py-1 rounded-sm"
              style={{
                color: "var(--silver-2)",
                border: "1px solid var(--steel)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <span
          className="text-sm transition-colors group-hover:text-[var(--accent-glow)]"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          View protocol &rarr;
        </span>
      </Link>
    </motion.div>
  );
}
