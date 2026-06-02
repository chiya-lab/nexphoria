"use client";

import { useMemo, useState } from "react";
import { CUSTOMERS, type AdminCustomer, type CustomerTier, type RuoStatus } from "@/lib/mock-admin";
import { StatusBadge, TableScroll, Th, Td, SearchInput, FilterChip, Pager } from "./adminTableUi";

const PAGE_SIZE = 12;
const TIER_FILTERS: (CustomerTier | "All")[] = ["All", "Standard", "Pro", "Lab", "Wholesale"];

function tierTone(t: CustomerTier): "info" | "accent" | "ok" {
  if (t === "Wholesale") return "accent";
  if (t === "Lab") return "ok";
  return "info";
}

function ruoTone(r: RuoStatus): "ok" | "warn" | "danger" {
  if (r === "Verified") return "ok";
  if (r === "Pending") return "warn";
  return "danger";
}

export default function PprAdminCustomersTable() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<CustomerTier | "All">("All");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      if (tier !== "All" && c.tier !== tier) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });
  }, [query, tier]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function rowBg(i: number) {
    return i % 2 === 0 ? "var(--ink)" : "var(--ink-2)";
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(0); }} placeholder="Search customer, email, id" />
        <div className="flex flex-wrap gap-1.5">
          {TIER_FILTERS.map((t) => (
            <FilterChip key={t} active={tier === t} label={t} onClick={() => { setTier(t); setPage(0); }} />
          ))}
        </div>
      </div>

      <TableScroll>
        <thead>
          <tr>
            <Th sticky>Customer</Th>
            <Th>Orders</Th>
            <Th>LTV</Th>
            <Th>Tier</Th>
            <Th>RUO</Th>
            <Th>Tags</Th>
            <Th>Joined</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c: AdminCustomer, i) => (
            <tr key={c.id}>
              <Td sticky rowBg={rowBg(i)}>
                <span style={{ color: "var(--platinum)" }}>{c.name}</span>
                <div className="text-[11px]" style={{ color: "var(--silver-3)" }}>{c.email}</div>
              </Td>
              <Td rowBg={rowBg(i)}>{c.orders}</Td>
              <Td rowBg={rowBg(i)}><span style={{ color: "var(--platinum)" }}>${c.ltv.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></Td>
              <Td rowBg={rowBg(i)}><StatusBadge label={c.tier} tone={tierTone(c.tier)} /></Td>
              <Td rowBg={rowBg(i)}><StatusBadge label={c.ruo} tone={ruoTone(c.ruo)} /></Td>
              <Td rowBg={rowBg(i)}>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded px-1.5 py-0.5 text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)", border: "1px solid var(--steel)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </Td>
              <Td rowBg={rowBg(i)}><span style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>{c.joined}</span></Td>
            </tr>
          ))}
        </tbody>
      </TableScroll>
      <Pager page={safePage} pageCount={pageCount} onPage={setPage} />
    </div>
  );
}
