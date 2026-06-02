"use client";

import { FlaskConical, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: FlaskConical, label: "HPLC verified", sub: "Third-party assay per lot" },
  { icon: ShieldCheck, label: "99%+ purity", sub: "COA included with every order" },
  { icon: Truck, label: "Discreet shipping", sub: "Cold-chain, unmarked packaging" },
];

export default function PprTrustBar() {
  return (
    <ul
      className="grid grid-cols-1 gap-px overflow-hidden rounded-lg sm:grid-cols-3"
      style={{ border: "1px solid var(--steel)", backgroundColor: "var(--steel)" }}
    >
      {ITEMS.map((it) => {
        const Icon = it.icon;
        return (
          <li
            key={it.label}
            className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: "var(--ink-2)" }}
          >
            <Icon size={18} aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0 }} />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                {it.label}
              </span>
              <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                {it.sub}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
