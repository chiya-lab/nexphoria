"use client";

import { useMemo, useState } from "react";
import { ORDERS, type AdminOrder, type OrderStatus } from "@/lib/mock-admin";
import { StatusBadge, TableScroll, Th, Td, SearchInput, FilterChip, Pager } from "./adminTableUi";

const PAGE_SIZE = 12;
const STATUS_FILTERS: (OrderStatus | "All")[] = ["All", "Paid", "Processing", "Shipped", "Delivered", "Refunded", "Cancelled"];

function statusTone(s: OrderStatus): "ok" | "warn" | "danger" | "info" | "accent" {
  switch (s) {
    case "Delivered":
      return "ok";
    case "Shipped":
      return "accent";
    case "Processing":
    case "Paid":
      return "info";
    case "Refunded":
      return "warn";
    case "Cancelled":
      return "danger";
  }
}

export default function PprAdminOrdersTable() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORDERS.filter((o) => {
      if (filter !== "All" && o.status !== filter) return false;
      if (!q) return true;
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
    });
  }, [query, filter]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulk(action: string) {
    if (selected.size === 0) return;
    setToast(`${action} queued for ${selected.size} order(s) — demo only, no changes persisted.`);
    setSelected(new Set());
    setTimeout(() => setToast(null), 2600);
  }

  function rowBg(i: number) {
    return i % 2 === 0 ? "var(--ink)" : "var(--ink-2)";
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(0); }} placeholder="Search order, customer, email" />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <FilterChip key={s} active={filter === s} label={s} onClick={() => { setFilter(s); setPage(0); }} />
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--steel)" }}>
          <span className="text-[12px]" style={{ color: "var(--silver-1)" }}>{selected.size} selected</span>
          <button type="button" onClick={() => bulk("Ship")} className="rounded-md px-2.5 py-1 text-[12px]" style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}>Mark shipped</button>
          <button type="button" onClick={() => bulk("Refund")} className="rounded-md px-2.5 py-1 text-[12px]" style={{ border: "1px solid var(--steel)", color: "var(--warn)" }}>Refund</button>
          <button type="button" onClick={() => bulk("Cancel")} className="rounded-md px-2.5 py-1 text-[12px]" style={{ border: "1px solid var(--steel)", color: "var(--danger)" }}>Cancel</button>
        </div>
      )}

      {toast && (
        <div className="mb-3 rounded-lg px-3 py-2 text-[12px]" style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--accent)", color: "var(--silver-1)" }} role="status">
          {toast}
        </div>
      )}

      <TableScroll>
        <thead>
          <tr>
            <Th sticky>Order</Th>
            <Th>Date</Th>
            <Th>Customer</Th>
            <Th>Items</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Channel</Th>
            <Th>Sub</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o: AdminOrder, i) => (
            <tr key={o.id}>
              <Td sticky rowBg={rowBg(i)}>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggle(o.id)} aria-label={`Select ${o.id}`} />
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--platinum)" }}>{o.id}</span>
                </label>
              </Td>
              <Td rowBg={rowBg(i)}><span style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>{o.date}</span></Td>
              <Td rowBg={rowBg(i)}>
                <div>{o.customer}</div>
                <div className="text-[11px]" style={{ color: "var(--silver-3)" }}>{o.email}</div>
              </Td>
              <Td rowBg={rowBg(i)}>{o.items}</Td>
              <Td rowBg={rowBg(i)}><span style={{ color: "var(--platinum)" }}>${o.total.toFixed(2)}</span></Td>
              <Td rowBg={rowBg(i)}><StatusBadge label={o.status} tone={statusTone(o.status)} /></Td>
              <Td rowBg={rowBg(i)}><span style={{ color: "var(--silver-2)" }}>{o.channel}</span></Td>
              <Td rowBg={rowBg(i)}>{o.subscription ? <StatusBadge label="Sub" tone="accent" /> : <span style={{ color: "var(--silver-3)" }}>—</span>}</Td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <Td rowBg="var(--ink)" className="text-center" >No orders match the filter.</Td>
            </tr>
          )}
        </tbody>
      </TableScroll>
      <Pager page={safePage} pageCount={pageCount} onPage={setPage} />
    </div>
  );
}
