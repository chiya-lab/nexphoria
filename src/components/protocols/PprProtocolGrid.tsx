"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Protocol, ProtocolCategory } from "@/lib/mock-protocols";
import { staggerContainer } from "@/lib/motion";
import PprProtocolCard from "./PprProtocolCard";
import PprProtocolsFilters, { type ProtocolFilter } from "./PprProtocolsFilters";

interface PprProtocolGridProps {
  protocols: Protocol[];
  categories: ProtocolCategory[];
}

export default function PprProtocolGrid({ protocols, categories }: PprProtocolGridProps) {
  const [filter, setFilter] = useState<ProtocolFilter>("All");

  const visible = useMemo(
    () => (filter === "All" ? protocols : protocols.filter((p) => p.category === filter)),
    [protocols, filter],
  );

  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <PprProtocolsFilters categories={categories} active={filter} onChange={setFilter} />
        </div>

        <motion.div
          key={filter}
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((protocol) => (
            <PprProtocolCard key={protocol.slug} protocol={protocol} />
          ))}
        </motion.div>

        {visible.length === 0 && (
          <p className="text-sm" style={{ color: "var(--silver-3)" }}>
            No protocols in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
