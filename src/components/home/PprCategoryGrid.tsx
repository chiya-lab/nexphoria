"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface CategoryDef {
  eyebrow: string;
  name: string;
  desc: string;
  skus: string[];
  href: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    eyebrow: "REC",
    name: "Recovery",
    desc: "Tissue-repair and regenerative research compounds.",
    skus: ["BPC-157", "TB-500", "KPV"],
    href: "/products?category=Recovery%20%26%20Healing",
  },
  {
    eyebrow: "MET",
    name: "Metabolic",
    desc: "GLP-1 and metabolic-pathway research peptides.",
    skus: ["Semaglutide", "Tirzepatide", "Retatrutide"],
    href: "/products?category=Weight%20Management",
  },
  {
    eyebrow: "LON",
    name: "Longevity",
    desc: "Senescence and mitochondrial research compounds.",
    skus: ["Epitalon", "Thymosin Alpha-1", "MOTS-c"],
    href: "/products?category=Anti-Aging",
  },
  {
    eyebrow: "COG",
    name: "Cognitive",
    desc: "Neuropeptides for cognition-pathway research.",
    skus: ["Selank", "Semax", "Cerebrolysin"],
    href: "/products?category=Cognitive",
  },
  {
    eyebrow: "STK",
    name: "Signature Stacks",
    desc: "Pre-composed multi-compound research protocols.",
    skus: ["Wolverine", "Glow", "KLW"],
    href: "/products?category=Recovery%20%26%20Healing",
  },
];

export default function PprCategoryGrid() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--ink)" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10">
          <p
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Research categories
          </p>
          <h2
            className="mt-3"
            style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            Find your pathway.
          </h2>
        </div>

        <motion.div
          className="flex flex-wrap gap-5"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.name} variants={staggerItem(10)}>
              <Link
                href={cat.href}
                className="ppr-cat-card ppr-grid-hex group flex h-[360px] w-[280px] flex-col rounded-lg p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
              >
                <p
                  className="text-[11px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
                >
                  {cat.eyebrow}
                </p>
                <h3
                  className="mt-3 transition-colors group-hover:text-[color:var(--accent)]"
                  style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
                >
                  {cat.name}
                </h3>
                <p
                  className="mt-2 text-[14px]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.5 }}
                >
                  {cat.desc}
                </p>

                <div className="mt-5 flex flex-col gap-1.5">
                  {cat.skus.map((sku) => (
                    <span
                      key={sku}
                      className="text-[12px]"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}
                    >
                      {sku}
                    </span>
                  ))}
                </div>

                <span
                  className="mt-auto inline-flex items-center gap-1 pt-5 text-[13px] transition-colors group-hover:text-[color:var(--accent)]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                >
                  Explore <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
