"use client";

import { useEffect, useState } from "react";
import type { LegalSection } from "./legalContent";

interface PprLegalTocProps {
  sections: Pick<LegalSection, "id" | "heading">[];
}

export default function PprLegalToc({ sections }: PprLegalTocProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  return (
    <>
      {/* Mobile: dropdown */}
      <div className="lg:hidden">
        <label htmlFor="legal-toc-select" className="sr-only">
          Jump to section
        </label>
        <select
          id="legal-toc-select"
          value={activeId}
          onChange={(e) => jumpTo(e.target.value)}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
          style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }}
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.heading}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: sticky nav */}
      <nav aria-label="On this page" className="hidden lg:block">
        <p
          className="mb-3 text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--silver-3)" }}
        >
          On this page
        </p>
        <ul className="space-y-1">
          {sections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="block w-full border-l-2 py-1.5 pl-3 text-left text-[13px] leading-snug transition-colors focus:outline-none focus-visible:underline"
                  style={{
                    borderLeftColor: isActive ? "var(--accent)" : "var(--steel)",
                    color: isActive ? "var(--platinum)" : "var(--silver-2)",
                  }}
                >
                  {s.heading}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
