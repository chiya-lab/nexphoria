"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminInventory from "@/components/admin/PprAdminInventory";

export default function AdminInventoryPage() {
  return (
    <PprAdminShell title="Inventory" subtitle="Stock levels, reorder thresholds, days of cover, and expiry warnings">
      <PprAdminInventory />
    </PprAdminShell>
  );
}
