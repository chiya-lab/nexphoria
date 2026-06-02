"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { REPORTS, rowsToCsv, type ReportDef } from "@/lib/mock-admin";

export default function PprAdminReports() {
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);

  function download(report: ReportDef) {
    const csv = rowsToCsv(report.rows());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexphoria-${report.id}-2026-06-02.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLastDownloaded(report.name);
  }

  return (
    <div>
      {lastDownloaded && (
        <div className="mb-3 rounded-lg px-3 py-2 text-[12px]" style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--accent)", color: "var(--silver-1)" }} role="status">
          Generated &ldquo;{lastDownloaded}&rdquo; CSV.
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {REPORTS.map((report) => (
          <div key={report.id} className="flex flex-col rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
            <div className="mb-2 flex items-center gap-2">
              <FileText size={16} style={{ color: "var(--accent)" }} />
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{report.name}</h3>
            </div>
            <p className="mb-4 flex-1 text-[12px]" style={{ color: "var(--silver-2)" }}>{report.description}</p>
            <button
              type="button"
              onClick={() => download(report)}
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
