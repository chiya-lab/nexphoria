"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { TocEntry } from "@/lib/journal-meta";

export default function PprArticleToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "");

  useEffect(() => {
    if (entries.length === 0) return;
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((o) => o.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <p
        className="mb-4 text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-3)" }}
      >
        Contents
      </p>
      <ul className="space-y-1">
        {entries.map((e) => {
          const active = e.id === activeId;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                onClick={() => setActiveId(e.id)}
                className="block rounded px-3 py-1.5 text-[13px] transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.4,
                  paddingLeft: e.level === 3 ? 20 : 12,
                  backgroundColor: active ? "var(--accent)" : "transparent",
                  color: active ? "var(--ink)" : "var(--silver-2)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {e.text}
              </a>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-6 inline-flex items-center gap-1.5 px-3 text-[12px] transition-colors hover:text-[color:var(--accent)]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
      >
        <ArrowUp size={13} aria-hidden="true" /> Back to top
      </button>
    </nav>
  );
}
