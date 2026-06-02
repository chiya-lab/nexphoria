"use client";

import { INVENTORY, type InventoryRow } from "@/lib/mock-admin";
import { AlertTriangle } from "lucide-react";
import { StatusBadge, TableScroll, Th, Td } from "./adminTableUi";

function coverTone(days: number): "ok" | "warn" | "danger" {
  if (days < 14) return "danger";
  if (days < 30) return "warn";
  return "ok";
}

export default function PprAdminInventory() {
  const lowStock = INVENTORY.filter((r) => r.stock <= r.reorderThreshold).length;
  const expiringSoon = INVENTORY.filter((r) => r.expiryWarn).length;

  function rowBg(i: number) {
    return i % 2 === 0 ? "var(--ink)" : "var(--ink-2)";
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <p className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>SKUs tracked</p>
          <p className="mt-1 text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{INVENTORY.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${lowStock ? "var(--warn)" : "var(--steel)"}` }}>
          <p className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>At / below reorder</p>
          <p className="mt-1 text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: lowStock ? "var(--warn)" : "var(--platinum)" }}>{lowStock}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--ink-2)", border: `1px solid ${expiringSoon ? "var(--danger)" : "var(--steel)"}` }}>
          <p className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>Expiring &lt; 120 days</p>
          <p className="mt-1 text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: expiringSoon ? "var(--danger)" : "var(--platinum)" }}>{expiringSoon}</p>
        </div>
      </div>

      <TableScroll>
        <thead>
          <tr>
            <Th sticky>SKU</Th>
            <Th>Category</Th>
            <Th>Stock</Th>
            <Th>Reorder at</Th>
            <Th>Units · mo</Th>
            <Th>Days cover</Th>
            <Th>Nearest expiry</Th>
          </tr>
        </thead>
        <tbody>
          {INVENTORY.map((r: InventoryRow, i) => {
            const needReorder = r.stock <= r.reorderThreshold;
            return (
              <tr key={r.slug}>
                <Td sticky rowBg={rowBg(i)}>
                  <span style={{ color: "var(--platinum)" }}>{r.name}</span>
                  <div className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>{r.slug}</div>
                </Td>
                <Td rowBg={rowBg(i)}><span style={{ color: "var(--silver-2)" }}>{r.category}</span></Td>
                <Td rowBg={rowBg(i)}>
                  <span style={{ color: needReorder ? "var(--warn)" : "var(--platinum)" }}>{r.stock}</span>
                  {needReorder && <span className="ml-1.5 align-middle"><StatusBadge label="reorder" tone="warn" /></span>}
                </Td>
                <Td rowBg={rowBg(i)}><span style={{ color: "var(--silver-2)" }}>{r.reorderThreshold}</span></Td>
                <Td rowBg={rowBg(i)}>{r.unitsMonth}</Td>
                <Td rowBg={rowBg(i)}><StatusBadge label={`${r.daysOfCover}d`} tone={coverTone(r.daysOfCover)} /></Td>
                <Td rowBg={rowBg(i)}>
                  <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-mono)", color: r.expiryWarn ? "var(--danger)" : "var(--silver-2)" }}>
                    {r.expiryWarn && <AlertTriangle size={12} />}
                    {r.expiry}
                  </span>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableScroll>
    </div>
  );
}
