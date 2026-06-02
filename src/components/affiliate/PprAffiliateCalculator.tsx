"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

function commissionForSales(sales: number): number {
  if (sales >= 50) return 30;
  if (sales >= 20) return 25;
  if (sales >= 5) return 20;
  return 15;
}

function tierNameForSales(sales: number): string {
  if (sales >= 50) return "Elite";
  if (sales >= 20) return "Pro";
  if (sales >= 5) return "Creator";
  return "Researcher";
}

export default function PprAffiliateCalculator() {
  const [sales, setSales] = useState(12);
  const [aov, setAov] = useState(215);

  const { rate, tier, monthly, annual } = useMemo(() => {
    const rate = commissionForSales(sales);
    const monthly = sales * aov * (rate / 100);
    return {
      rate,
      tier: tierNameForSales(sales),
      monthly,
      annual: monthly * 12,
    };
  }, [sales, aov]);

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Estimate
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Model your monthly commission
        </h2>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-6 rounded-2xl p-6 lg:grid-cols-[1fr_1fr] lg:p-8"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <div className="flex flex-col gap-7">
          <label className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              Referred sales / month
              <span className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{sales}</span>
            </span>
            <input
              type="range"
              min={1}
              max={120}
              value={sales}
              onChange={(e) => setSales(Number(e.target.value))}
              aria-label="Referred sales per month"
              style={{ accentColor: "var(--accent)" }}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              Average order value
              <span className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{money(aov)}</span>
            </span>
            <input
              type="range"
              min={90}
              max={500}
              step={5}
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              aria-label="Average order value"
              style={{ accentColor: "var(--accent)" }}
            />
          </label>
          <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            <span>Projected tier</span>
            <span className="rounded px-2 py-0.5" style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}>
              {tier} · {rate}%
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 rounded-xl p-6" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}>
          <div>
            <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
              Estimated monthly
            </span>
            <p className="text-[44px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              {money(monthly)}
            </p>
          </div>
          <div>
            <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
              Estimated annual
            </span>
            <p className="text-[28px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
              {money(annual)}
            </p>
          </div>
        </div>
      </motion.div>
      <p className="mt-4 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        Illustrative only. Actual commission depends on approved tier, attributed conversions, and order value. For research use only.
      </p>
    </section>
  );
}
