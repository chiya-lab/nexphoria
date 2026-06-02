"use client";

import { useMemo, useState } from "react";
import { MOCK_COAS } from "@/lib/mock-account";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function downloadCoa(fileLabel: string) {
  const blob = new Blob([`Nexphoria Certificate of Analysis\n${fileLabel}\nFor research use only.`], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileLabel;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PprCoaVault() {
  const [filter, setFilter] = useState<string>("All");

  const peptides = useMemo(() => ["All", ...Array.from(new Set(MOCK_COAS.map((c) => c.peptide)))], []);
  const visible = useMemo(
    () => (filter === "All" ? MOCK_COAS : MOCK_COAS.filter((c) => c.peptide === filter)),
    [filter],
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {peptides.map((p) => {
          const active = p === filter;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setFilter(p)}
              className="rounded-full border px-3 py-1 text-[12px] uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-1"
              style={{
                fontFamily: "var(--font-mono)",
                borderColor: active ? "var(--accent)" : "var(--steel)",
                color: active ? "var(--accent)" : "var(--silver-2)",
                backgroundColor: active ? "var(--ink-3)" : "transparent",
              }}
            >
              {p}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {c.peptide} <span style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)", fontWeight: 400 }}>· Lot {c.lot}</span>
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--silver-2)" }}>
                {c.method} · {c.purity} · Issued {fmtDate(c.issuedDate)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadCoa(c.fileLabel)}
              className="shrink-0 rounded-md border px-3 py-1.5 text-[12px] uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-1"
              style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--accent)" }}
            >
              Download
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-sm" style={{ color: "var(--silver-2)" }}>No certificates for this filter.</p>
        )}
      </div>
    </div>
  );
}
