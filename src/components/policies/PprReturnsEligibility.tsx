"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface Row {
  scenario: string;
  detail: string;
  eligible: boolean;
}

const ROWS: Row[] = [
  { scenario: "Unopened vials, within 14 days", detail: "Factory seal intact, lot number legible, stored per label. Subject to seal and lot verification on receipt.", eligible: true },
  { scenario: "Verified transit damage", detail: "Photographed on arrival and reported within 48 hours — replaced at no charge.", eligible: true },
  { scenario: "Cold-chain compromise", detail: "Logger or thawed media shows an out-of-range excursion — replaced after assessment.", eligible: true },
  { scenario: "Fulfillment error (wrong item)", detail: "Wrong compound or lot shipped — corrected on priority once the lot is confirmed.", eligible: true },
  { scenario: "Opened or reconstituted vials", detail: "Cannot be returned for sterility and chain-of-custody reasons.", eligible: false },
  { scenario: "Broken or missing factory seal", detail: "Seal integrity cannot be verified, so the lot is not eligible.", eligible: false },
  { scenario: "Past the 14-day window", detail: "Returns initiated after 14 days from delivery are not accepted.", eligible: false },
];

export default function PprReturnsEligibility() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-6 flex flex-col gap-2">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Eligibility
        </span>
        <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          What is and isn&rsquo;t returnable
        </h2>
        <p className="max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          Research compounds are returnable only when unopened with an intact factory seal, within 14 days of
          delivery, and after lot and seal verification.
        </p>
      </motion.div>

      <ul className="flex flex-col gap-2">
        {ROWS.map((row) => (
          <li
            key={row.scenario}
            className="flex gap-4 rounded-xl p-4"
            style={{
              backgroundColor: "var(--ink-2)",
              border: `1px solid ${row.eligible ? "color-mix(in srgb, var(--ok) 40%, var(--steel))" : "var(--steel)"}`,
            }}
          >
            <span
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: row.eligible ? "color-mix(in srgb, var(--ok) 16%, transparent)" : "color-mix(in srgb, var(--danger) 16%, transparent)" }}
            >
              {row.eligible ? (
                <Check size={16} aria-label="Eligible" style={{ color: "var(--ok)" }} />
              ) : (
                <X size={16} aria-label="Not eligible" style={{ color: "var(--danger)" }} />
              )}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {row.scenario}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                {row.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
