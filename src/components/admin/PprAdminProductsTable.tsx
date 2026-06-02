"use client";

import { useMemo, useState } from "react";
import { PRODUCT_ROWS, type ProductRow } from "@/lib/mock-admin";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { StatusBadge, TableScroll, Th, Td, SearchInput, FilterChip } from "./adminTableUi";

export default function PprAdminProductsTable() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [toast, setToast] = useState<string | null>(null);

  const cats = useMemo(() => ["All", ...Array.from(new Set(PRODUCT_ROWS.map((p) => p.category)))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCT_ROWS.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    });
  }, [query, cat]);

  function edit(name: string) {
    setToast(`Edit panel for "${name}" — demo only, no changes persisted.`);
    setTimeout(() => setToast(null), 2400);
  }

  function rowBg(i: number) {
    return i % 2 === 0 ? "var(--ink)" : "var(--ink-2)";
  }

  function stockTone(stock: number): "ok" | "warn" | "danger" {
    if (stock <= 0) return "danger";
    if (stock < 20) return "warn";
    return "ok";
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search product or slug" />
        <div className="flex flex-wrap gap-1.5">
          {cats.map((c) => (
            <FilterChip key={c} active={cat === c} label={c} onClick={() => setCat(c)} />
          ))}
        </div>
      </div>

      {toast && (
        <div className="mb-3 rounded-lg px-3 py-2 text-[12px]" style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--accent)", color: "var(--silver-1)" }} role="status">
          {toast}
        </div>
      )}

      <TableScroll>
        <thead>
          <tr>
            <Th sticky>Product</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Units · mo</Th>
            <Th>MoM</Th>
            <Th>Rating</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p: ProductRow, i) => {
            const up = p.momPct >= 0;
            return (
              <tr key={p.slug}>
                <Td sticky rowBg={rowBg(i)}>
                  <span style={{ color: "var(--platinum)" }}>{p.name}</span>
                  <div className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>{p.slug}</div>
                </Td>
                <Td rowBg={rowBg(i)}><span style={{ color: "var(--silver-2)" }}>{p.category}</span></Td>
                <Td rowBg={rowBg(i)}><span style={{ color: "var(--platinum)" }}>${p.price}</span></Td>
                <Td rowBg={rowBg(i)}><StatusBadge label={String(p.stock)} tone={stockTone(p.stock)} /></Td>
                <Td rowBg={rowBg(i)}>{p.unitsMonth}</Td>
                <Td rowBg={rowBg(i)}>
                  <span className="flex items-center gap-0.5 text-[12px]" style={{ color: up ? "var(--ok)" : "var(--danger)" }}>
                    {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(p.momPct).toFixed(1)}%
                  </span>
                </Td>
                <Td rowBg={rowBg(i)}><span style={{ color: "var(--silver-1)" }}>{p.rating.toFixed(1)}</span></Td>
                <Td rowBg={rowBg(i)}>
                  <button type="button" onClick={() => edit(p.name)} className="rounded-md px-2.5 py-1 text-[12px]" style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}>
                    Edit
                  </button>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableScroll>
    </div>
  );
}
