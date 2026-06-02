"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { accountStats } from "@/lib/mock-account";

export default function PprAccountStats() {
  const s = accountStats();
  const cards = [
    { label: "Lifetime orders", value: String(s.lifetimeOrders) },
    { label: "Total spend", value: `$${s.totalSpend.toLocaleString()}` },
    { label: "Active subscriptions", value: String(s.activeSubscriptions) },
    { label: "CoA downloads", value: String(s.coaDownloads) },
  ];

  return (
    <motion.div
      variants={staggerContainer(0.06, 0)}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {cards.map((c) => (
        <motion.div
          key={c.label}
          variants={staggerItem()}
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
        >
          <p
            className="text-[11px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-2)" }}
          >
            {c.label}
          </p>
          <p
            className="mt-2 text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            {c.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
