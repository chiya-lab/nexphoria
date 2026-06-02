"use client";

import { ExternalLink } from "lucide-react";
import { BPC157_CITATIONS } from "@/lib/mock-citations";

export default function PprCitations() {
  const citations = BPC157_CITATIONS;
  const mono = { fontFamily: "var(--font-mono)" } as const;
  const body = { fontFamily: "var(--font-body)" } as const;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px] uppercase" style={{ ...mono, letterSpacing: "0.08em", color: "var(--silver-2)" }}>
        Selected peer-reviewed literature
      </p>

      <ol className="flex flex-col gap-px overflow-hidden rounded-lg" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
        {citations.map((c, i) => (
          <li key={c.doi} className="flex gap-4 px-5 py-4" style={{ borderBottom: i < citations.length - 1 ? "1px solid var(--steel)" : "none" }}>
            <span
              className="shrink-0 text-[12px]"
              style={{ ...mono, color: "var(--accent)", lineHeight: "1.4" }}
              aria-hidden="true"
            >
              <sup>{i + 1}</sup>
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[12px]" style={{ ...mono, color: "var(--silver-2)" }}>
                {c.authors}
              </span>
              <span className="text-[15px] leading-snug" style={{ ...body, color: "var(--platinum)" }}>
                {c.title}
              </span>
              <span className="text-[13px]" style={{ ...body, color: "var(--silver-1)" }}>
                <em style={{ fontStyle: "italic" }}>{c.journal}</em>. {c.year};{c.detail}.
              </span>
              <a
                href={`https://doi.org/${c.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-[12px] transition-colors hover:text-[var(--accent-glow)] focus:outline-none focus-visible:ring-2"
                style={{ ...mono, color: "var(--accent)" }}
              >
                doi:{c.doi}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-[11px]" style={{ ...mono, color: "var(--silver-2)" }}>
        References provided for research context. Nexphoria compounds are sold for laboratory research use only (RUO).
      </p>
    </div>
  );
}
