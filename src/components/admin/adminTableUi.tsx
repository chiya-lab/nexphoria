"use client";

import type { ReactNode } from "react";

/** Shared presentational helpers for the admin tables. Not a Ppr component —
 * internal building blocks used by PprAdmin*Table. */

export function StatusBadge({ label, tone }: { label: string; tone: "ok" | "warn" | "danger" | "info" | "neutral" | "accent" }) {
  const map: Record<string, { fg: string; border: string }> = {
    ok: { fg: "var(--ok)", border: "var(--ok)" },
    warn: { fg: "var(--warn)", border: "var(--warn)" },
    danger: { fg: "var(--danger)", border: "var(--danger)" },
    info: { fg: "var(--silver-1)", border: "var(--steel)" },
    neutral: { fg: "var(--silver-2)", border: "var(--steel)" },
    accent: { fg: "var(--accent)", border: "var(--steel)" },
  };
  const c = map[tone] ?? map.neutral;
  return (
    <span
      className="inline-block whitespace-nowrap rounded px-2 py-0.5 text-[11px]"
      style={{ fontFamily: "var(--font-mono)", color: c.fg, border: `1px solid ${c.border}` }}
    >
      {label}
    </span>
  );
}

export function TableScroll({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--steel)" }}>
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 720 }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, sticky, className }: { children: ReactNode; sticky?: boolean; className?: string }) {
  return (
    <th
      className={`whitespace-nowrap px-3 py-2.5 text-[11px] uppercase ${sticky ? "sticky left-0 z-10" : ""} ${className ?? ""}`}
      style={{
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.06em",
        color: "var(--silver-2)",
        backgroundColor: "var(--ink-2)",
        borderBottom: "1px solid var(--steel)",
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children, sticky, rowBg, className }: { children: ReactNode; sticky?: boolean; rowBg: string; className?: string }) {
  return (
    <td
      className={`whitespace-nowrap px-3 py-2.5 ${sticky ? "sticky left-0 z-10" : ""} ${className ?? ""}`}
      style={{
        color: "var(--silver-1)",
        borderTop: "1px solid var(--steel)",
        backgroundColor: sticky ? rowBg : undefined,
      }}
    >
      {children}
    </td>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md px-3 py-2 text-sm outline-none focus-visible:ring-1 sm:w-64"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", color: "var(--platinum)" }}
    />
  );
}

export function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1 text-[12px] transition-colors"
      style={{
        border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
        color: active ? "var(--accent)" : "var(--silver-2)",
        backgroundColor: active ? "var(--ink-3)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}

export function Pager({ page, pageCount, onPage }: { page: number; pageCount: number; onPage: (p: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-3 flex items-center justify-between text-[12px]" style={{ color: "var(--silver-2)" }}>
      <span style={{ fontFamily: "var(--font-mono)" }}>
        Page {page + 1} / {pageCount}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="rounded-md px-3 py-1.5 disabled:opacity-30"
          style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPage(Math.min(pageCount - 1, page + 1))}
          disabled={page >= pageCount - 1}
          className="rounded-md px-3 py-1.5 disabled:opacity-30"
          style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
