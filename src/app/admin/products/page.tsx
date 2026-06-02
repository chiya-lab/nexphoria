"use client";

import PprAdminShell from "@/components/admin/PprAdminShell";
import PprAdminProductsTable from "@/components/admin/PprAdminProductsTable";

export default function AdminProductsPage() {
  return (
    <PprAdminShell title="Products" subtitle="Catalog performance, inventory, and month-over-month movement">
      <PprAdminProductsTable />
    </PprAdminShell>
  );
}
