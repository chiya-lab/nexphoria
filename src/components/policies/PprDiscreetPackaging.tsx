"use client";

import { motion } from "framer-motion";
import { Package, EyeOff, FileText, ShieldCheck } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

interface Item {
  icon: typeof Package;
  title: string;
  detail: string;
}

const ITEMS: Item[] = [
  {
    icon: EyeOff,
    title: "No branding outside",
    detail: "The outer mailer carries no product name, compound description, or logo — only the carrier label and return address.",
  },
  {
    icon: Package,
    title: "What arrives",
    detail: "An insulated box, conditioned cold-chain media, foam-nested vials, and a packing slip — sealed with tamper-evident tape.",
  },
  {
    icon: FileText,
    title: "What's on the label",
    detail: "Internal labeling references the catalog item, lot number, and a Research Use Only notice for your records.",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-evident seal",
    detail: "A broken outer seal on arrival is a signal to document the condition and contact support before opening.",
  },
];

export default function PprDiscreetPackaging() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8 flex flex-col gap-2">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Packaging
        </span>
        <h2 className="text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Discreet by default
        </h2>
      </motion.div>

      <motion.div variants={staggerContainer(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              variants={staggerItem()}
              className="flex flex-col gap-3 rounded-xl p-5"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
                <Icon size={18} aria-hidden="true" style={{ color: "var(--accent)" }} />
              </span>
              <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {item.title}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                {item.detail}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
