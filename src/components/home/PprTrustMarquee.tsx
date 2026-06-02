"use client";

import { motion } from "framer-motion";

const CHIPS = [
  "Cayman Chemical reagents",
  "USP <797> compliant facility",
  "ISO 8 clean room",
  "GMP-aligned QC",
  "Cited in 12+ peer-reviewed papers",
  "247 verified researcher reviews",
];

function ChipTrack() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {CHIPS.map((chip) => (
        <span key={chip} className="flex items-center">
          <span
            className="whitespace-nowrap px-8"
            style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--silver-2)" }}
          >
            {chip}
          </span>
          <span style={{ color: "var(--steel)" }}>·</span>
        </span>
      ))}
    </div>
  );
}

export default function PprTrustMarquee() {
  return (
    <section
      className="w-full overflow-hidden"
      style={{
        height: 60,
        backgroundColor: "var(--ink)",
        borderTop: "1px solid var(--steel)",
        borderBottom: "1px solid var(--steel)",
      }}
      aria-label="Trust signals"
    >
      <div className="flex h-full items-center">
        {/* Two identical tracks animated as a seamless -50% loop. */}
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        >
          <ChipTrack />
          <ChipTrack />
        </motion.div>
      </div>
    </section>
  );
}
